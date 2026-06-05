import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const datesParam = searchParams.get('dates');

  if (!datesParam) {
    return new NextResponse('Dates parameter is required', { status: 400 });
  }

  const dates = datesParam.split(',').map(d => d.trim()).filter(Boolean);
  if (dates.length === 0) {
    return new NextResponse('At least one valid date is required', { status: 400 });
  }

  try {
    const supabase = await createClient();

    // Fetch counts from database for the specified dates
    const { data, error } = await supabase
      .from('attendance_summary')
      .select('category_id, volunteer_count')
      .in('record_date', dates);

    if (error) {
      console.error('Database error fetching attendance:', error);
      return new NextResponse('Database error fetching attendance summary', { status: 500 });
    }

    // Aggregate counts by category_id across the requested dates
    const counts: Record<string, number> = {};
    if (data) {
      data.forEach((row: any) => {
        counts[row.category_id] = (counts[row.category_id] || 0) + (row.volunteer_count || 0);
      });
    }

    // Read the template file from the Forms folder
    const filePath = path.join(process.cwd(), 'Forms', 'BE Form 1 Report (District).xls');
    if (!fs.existsSync(filePath)) {
      return new NextResponse('Template file "BE Form 1 Report (District).xls" not found inside Forms folder', { status: 500 });
    }

    const fileBuffer = fs.readFileSync(filePath);
    const logPath = path.join(process.cwd(), 'debug_export.log');
    fs.writeFileSync(logPath, `[DEBUG EXPORT] File path: ${filePath}\n`);
    fs.appendFileSync(logPath, `[DEBUG EXPORT] File size (bytes): ${fileBuffer.length}\n`);
    fs.appendFileSync(logPath, `[DEBUG EXPORT] XLSX version: ${XLSX.version}\n`);

    let workbook;
    try {
      // 1. Read the workbook normally (you can remove bookProps: false as it isn't a valid option)
      workbook = XLSX.read(fileBuffer, {
        type: 'buffer',
        cellDates: true,
        cellStyles: true,
        cellNF: true,
        cellFormula: true
      });

      // 2. CRITICAL FIX: Wipe out workbook properties so XLSX.write won't crash on type 19
      workbook.Props = {};
      workbook.Custprops = {};

      fs.appendFileSync(logPath, `[DEBUG EXPORT] XLSX.read succeeded and metadata properties stripped.\n`);
    } catch (readErr: any) {
      fs.appendFileSync(logPath, `[DEBUG EXPORT] XLSX.read failed: ${readErr.message}\nStack: ${readErr.stack}\n`);
      console.error('[DEBUG EXPORT] XLSX.read failed:', readErr);
      throw readErr;
    }

    const sheetName = workbook.SheetNames[0];
    const ws = workbook.Sheets[sheetName];

    if (!ws) {
      return new NextResponse('Sheet not found in the workbook', { status: 500 });
    }

    // Mapping of category ID to its corresponding Column in Row 24
    const colMap: Record<string, string> = {
      ngo: 'D',
      corporation: 'E',
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

    // Write counts to Row 24
    Object.entries(colMap).forEach(([cat, col]) => {
      const val = counts[cat] || 0;
      const cellRef = `${col}24`;

      if (ws[cellRef]) {
        ws[cellRef].v = val;
        ws[cellRef].t = 'n';
        delete ws[cellRef].f; // Ensure any old formulas are deleted
      } else {
        ws[cellRef] = { v: val, t: 'n' };
      }
    });

    // Write the SUM formula for total volunteers under Column U, Row 24
    const totalRef = 'U24';
    if (ws[totalRef]) {
      ws[totalRef].f = 'SUM(D24:T24)';
      delete ws[totalRef].v;
    } else {
      ws[totalRef] = { f: 'SUM(D24:T24)', t: 'n' };
    }

    // Write the workbook back into a buffer
    const outBuffer = XLSX.write(workbook, { bookType: 'biff8', type: 'buffer' });

    // Return the buffer as download attachment
    const headers = new Headers();
    headers.set('Content-Type', 'application/vnd.ms-excel');
    headers.set('Content-Disposition', `attachment; filename="BE Form 1 Report (District) - QNHS.xls"`);

    return new NextResponse(outBuffer, {
      status: 200,
      headers
    });
  } catch (err: any) {
    console.error('Export error:', err);
    return new NextResponse(`Export failed: ${err.message}`, { status: 500 });
  }
}
