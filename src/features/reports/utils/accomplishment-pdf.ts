import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Accomplishment } from '../types';

export async function generateAccomplishmentPDF(reports: Accomplishment[]) {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const logoUrl = '/assets/logo.png';
  
  const addHeader = (pdfDoc: jsPDF) => {
    // 1. Logo
    try {
      pdfDoc.addImage(logoUrl, 'PNG', (pageWidth / 2) - 10, 10, 20, 20);
    } catch (e) {
      console.warn("Logo failed to load");
    }

    // 2. School Header
    pdfDoc.setFontSize(10);
    pdfDoc.setFont('helvetica', 'normal');
    const headerText = [
      'Republic of the Philippines',
      'Department of Education',
      'Region IV-A CALABARZON',
      'SCHOOLS DIVISION OF QUEZON',
      'QUEZON NATIONAL HIGH SCHOOL',
      'ML Tagarao St. Ibabang Iyam, Lucena City',
      'School Year 2025-2026'
    ];

    let currentY = 35;
    headerText.forEach(line => {
      pdfDoc.text(line, pageWidth / 2, currentY, { align: 'center' });
      currentY += 4.5;
    });

    // 3. Border Line
    pdfDoc.setLineWidth(0.5);
    pdfDoc.line(15, currentY + 2, pageWidth - 15, currentY + 2);

    // 4. Report Title
    pdfDoc.setFontSize(12);
    pdfDoc.setFont('helvetica', 'bold');
    pdfDoc.text('BRIGADA ESKWELA', pageWidth / 2, currentY + 12, { align: 'center' });
    pdfDoc.text('DAILY ACCOMPLISHMENT REPORT', pageWidth / 2, currentY + 18, { align: 'center' });

    // 5. Date & Instructions
    pdfDoc.setFontSize(10);
    pdfDoc.setFont('helvetica', 'normal');
    const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    pdfDoc.text(`Date: ${today}`, 15, currentY + 28);

    const instruction = "Instruction: List down all the activities that needs to be undertaken for each day of the Brigada Eskwela week. At the end of each day, please mark the appropriate column that corresponds to the status of each activity. Cite reasons for non-completion.";
    const splitInstruction = pdfDoc.splitTextToSize(instruction, pageWidth - 30);
    pdfDoc.text(splitInstruction, 15, currentY + 35);

    return currentY + 45; // Return starting Y for table
  };

  const tableRows = reports.map((r) => [
    r.activity,
    r.status === 'completed' ? '/' : '',
    r.status === 'started but not yet completed' ? '/' : '',
    r.status === 'not done' ? '/' : '',
    r.remarks || ''
  ]);

  const startY = addHeader(doc);

  autoTable(doc, {
    startY: startY,
    head: [
      [
        { content: 'ACTIVITIES', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
        { content: 'STATUS', colSpan: 3, styles: { halign: 'center' } },
        { content: 'REMARKS / RECOMMENDATIONS', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } }
      ],
      ['Completed', 'Started but not yet completed', 'Not Done']
    ],
    body: tableRows,
    theme: 'grid',
    headStyles: { 
      fillColor: [255, 255, 255], 
      textColor: [0, 0, 0],
      fontSize: 8,
      fontStyle: 'bold',
      lineWidth: 0.1,
      lineColor: [0, 0, 0]
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [0, 0, 0],
      lineWidth: 0.1,
      lineColor: [0, 0, 0],
      minCellHeight: 8
    },
    columnStyles: {
      1: { halign: 'center', cellWidth: 20 },
      2: { halign: 'center', cellWidth: 35 },
      3: { halign: 'center', cellWidth: 20 },
    },
    margin: { left: 15, right: 15 },
    didDrawPage: (data) => {
      // Add signatures on the last page or every page if preferred
      // For now, let's add to the bottom of the last page or each page if there's space
    }
  });

  // Footer / Signatures
  const finalY = (doc as any).lastAutoTable.finalY + 15;
  
  if (finalY + 40 > pageHeight) {
    doc.addPage();
    addHeader(doc);
    // adjust Y if on new page
  }

  const footerY = Math.max(finalY, 160); // Ensure it's not too high up

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  doc.text('Prepared by:', 15, footerY);
  doc.line(15, footerY + 8, 80, footerY + 8); // Name line
  doc.text('Program Implementation Committee Chair/Member', 15, footerY + 13);
  doc.text(`Date Prepared: ________________`, 15, footerY + 18);

  doc.text('Noted by:', 180, footerY);
  doc.line(180, footerY + 8, 260, footerY + 8); // Name line
  doc.text('School Head', 220, footerY + 13, { align: 'center' });

  doc.save(`Brigada_Accomplishment_Report_${new Date().getFullYear()}.pdf`);
}
