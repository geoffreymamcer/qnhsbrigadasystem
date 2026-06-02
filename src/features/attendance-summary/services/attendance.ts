'use server';

import { getApiClient, handleApiCall } from '@/lib/api/client';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

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

  // Clear cache for the dashboard path
  revalidatePath('/attendance-summary');
  return { success: true };
}
