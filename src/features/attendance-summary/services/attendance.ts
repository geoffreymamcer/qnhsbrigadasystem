'use server';

import { getApiClient, handleApiCall } from '@/lib/api/client';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import fs from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';

/**
 * Fetch all records from the attendance_summary table.
 * Converts the list of rows into a date-grouped map structure.
 */
export async function getAttendanceSummary(): Promise<Record<string, Record<string, number>>> {
  const supabase = await getApiClient();
  
  const data = await handleApiCall(
    supabase
      .from('attendance_summary')
      .select('record_date, category_id, volunteer_count')
      .order('record_date', { ascending: true })
  );

  // Transform database rows to frontend Record<string, Record<string, number>>
  const result: Record<string, Record<string, number>> = {};
  if (data && Array.isArray(data)) {
    data.forEach((row: any) => {
      const dateStr = row.record_date;
      if (!result[dateStr]) {
        result[dateStr] = {};
      }
      result[dateStr][row.category_id] = row.volunteer_count;
    });
  }
  return result;
}

export async function getAttendanceDates(): Promise<string[]> {
  const supabase = await getApiClient();
  const data = await handleApiCall(
    supabase
      .from('attendance_summary')
      .select('record_date')
      .order('record_date', { ascending: true })
  );

  if (!data || !Array.isArray(data)) {
    return [];
  }

  const uniqueDates = Array.from(new Set(data.map((row: any) => row.record_date))).sort();
  return uniqueDates;
}

/**
 * Upsert daily volunteer count records for all categories on a given date.
 */
export async function saveAttendanceSummary(date: string, counts: Record<string, number>) {
  const supabase = await createClient();
  
  // Verify auth session
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  // Map each category to an insert/upsert object
  const upsertData = Object.entries(counts).map(([categoryId, count]) => ({
    record_date: date,
    category_id: categoryId,
    volunteer_count: count,
    created_by: user.id,
    updated_at: new Date().toISOString()
  }));

  const { error } = await supabase
    .from('attendance_summary')
    .upsert(upsertData, { onConflict: 'record_date,category_id' });

  if (error) {
    console.error("Upsert Error:", error);
    throw new Error(error.message);
  }

  // Try to write the counts into the Excel form (row 24, specific columns)
  try {
    const filePath = path.join(process.cwd(), 'Forms', 'BE Form 1 Report (District).xls');
    if (fs.existsSync(filePath)) {
      const workbook = XLSX.readFile(filePath, { cellDates: true });
      const sheetName = workbook.SheetNames[0];
      const ws = workbook.Sheets[sheetName] || {};

      const colMap: Record<string, string> = {
        ngo: 'D',
        parents: 'F',
        alumni: 'G',
        individual: 'H',
        religious: 'I',
        congressional: 'J',
        provincial_off: 'L',
        city_off: 'M',
        barangay_off: 'N',
        sk_off: 'O',
        gov_emp: 'P',
        uniformed: 'Q',
        afp: 'R',
        barangay_work: 'S',
        other_vol: 'T'
      };

      // Write each category into row 24 under the mapped column
      Object.entries(colMap).forEach(([cat, col]) => {
        const val = counts[cat] || 0;
        const cellRef = `${col}24`;
        ws[cellRef] = { v: val, t: 'n' };
      });

      // Total volunteers in U24
      const total = Object.values(counts).reduce((a, b) => a + (b || 0), 0);
      ws['U24'] = { v: total, t: 'n' };

      workbook.Sheets[sheetName] = ws;
      // Write back as BIFF8 (xls) where possible
      XLSX.writeFile(workbook, filePath, { bookType: 'biff8' });
    } else {
      console.warn('Attendance export file not found at', filePath);
    }
  } catch (err) {
    console.error('Error writing Excel export:', err);
  }

  // Clear cache for the dashboard path
  revalidatePath('/attendance-summary');
  return { success: true };
}
