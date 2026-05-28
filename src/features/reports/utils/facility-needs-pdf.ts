import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FacilityNeed } from '../types';

export async function generateFacilityNeedsPDF(needs: FacilityNeed[]) {
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
    pdfDoc.setFontSize(9);
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

    let currentY = 32;
    headerText.forEach(line => {
      pdfDoc.text(line, pageWidth / 2, currentY, { align: 'center' });
      currentY += 4;
    });

    // 3. Border Line
    pdfDoc.setLineWidth(0.5);
    pdfDoc.line(15, currentY + 1, pageWidth - 15, currentY + 1);

    // 4. Report Title
    pdfDoc.setFontSize(11);
    pdfDoc.setFont('helvetica', 'bold');
    pdfDoc.text('BRIGADA ESKWELA 2026-2027', pageWidth / 2, currentY + 8, { align: 'center' });
    pdfDoc.text('PHYSICAL FACILITIES & MAINTENANCE NEEDS ASSESSMENT FORM (BE FORM 01)', pageWidth / 2, currentY + 13, { align: 'center' });

    // 5. Date & Information
    pdfDoc.setFontSize(9);
    pdfDoc.setFont('helvetica', 'normal');
    const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    pdfDoc.text(`Date of Assessment: ${today}`, 15, currentY + 22);

    const instruction = "Instruction: This form should be completed by the School Physical Facilities Coordinator and School Head before the Brigada Eskwela week to determine maintenance and resource requirements.";
    pdfDoc.text(instruction, 15, currentY + 27);

    return currentY + 32; // Return starting Y for table
  };

  const tableRows = needs.map((n) => [
    n.facility_name,
    n.condition === 'satisfactory' ? '/' : '',
    n.condition === 'unsatisfactory' ? '/' : '',
    n.remarks || '—',
    n.improvement_needed || '—',
    n.materials_needed || '—',
    n.manpower_needed || '—'
  ]);

  const startY = addHeader(doc);

  autoTable(doc, {
    startY: startY,
    head: [
      [
        { content: 'PHYSICAL FACILITIES', rowSpan: 2, styles: { halign: 'center', valign: 'middle', fontStyle: 'bold' } },
        { content: 'CONDITION', colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } },
        { content: 'REMARKS', rowSpan: 2, styles: { halign: 'center', valign: 'middle', fontStyle: 'bold' } },
        { content: 'NATURE OF IMPROVEMENT NEEDED', rowSpan: 2, styles: { halign: 'center', valign: 'middle', fontStyle: 'bold' } },
        { content: 'MATERIAL RESOURCES NEEDED', rowSpan: 2, styles: { halign: 'center', valign: 'middle', fontStyle: 'bold' } },
        { content: 'MANPOWER NEEDED', rowSpan: 2, styles: { halign: 'center', valign: 'middle', fontStyle: 'bold' } }
      ],
      [
        { content: 'Satisfactory', styles: { halign: 'center', fontStyle: 'bold' } },
        { content: 'Unsatisfactory', styles: { halign: 'center', fontStyle: 'bold' } }
      ]
    ],
    body: tableRows,
    theme: 'grid',
    headStyles: { 
      fillColor: [255, 255, 255], 
      textColor: [0, 0, 0],
      fontSize: 8,
      lineWidth: 0.1,
      lineColor: [0, 0, 0]
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [0, 0, 0],
      lineWidth: 0.1,
      lineColor: [0, 0, 0],
      minCellHeight: 7
    },
    columnStyles: {
      0: { cellWidth: 45 },
      1: { halign: 'center', cellWidth: 20 },
      2: { halign: 'center', cellWidth: 22 },
      3: { cellWidth: 45 },
      4: { cellWidth: 45 },
      5: { cellWidth: 45 },
      6: { cellWidth: 45 },
    },
    margin: { left: 15, right: 15 }
  });

  const finalY = (doc as any).lastAutoTable.finalY + 15;
  
  if (finalY + 35 > pageHeight) {
    doc.addPage();
    addHeader(doc);
  }

  const footerY = Math.max(finalY, 165);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  
  doc.text('Prepared by:', 15, footerY);
  doc.line(15, footerY + 8, 80, footerY + 8);
  doc.text('School Physical Facilities Coordinator', 15, footerY + 12);
  doc.text(`Date Prepared: ________________`, 15, footerY + 17);

  doc.text('Noted by:', 180, footerY);
  doc.line(180, footerY + 8, 260, footerY + 8);
  doc.text('School Head / Principal', 180, footerY + 12);

  doc.save(`BE_Form_01_Needs_Assessment_${new Date().getFullYear()}.pdf`);
}
