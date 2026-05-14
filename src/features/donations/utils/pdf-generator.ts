import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Donation } from '../types';

export async function generateDonationsPDF(donations: Donation[]) {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const logoUrl = '/assets/logo.png';
  
  const addHeader = (pdfDoc: jsPDF) => {
    try {
      // Use a base64 or local path that works in the browser
      pdfDoc.addImage(logoUrl, 'PNG', (pageWidth / 2) - 10, 10, 20, 20);
    } catch (e) {
      console.warn("Logo failed to load");
    }

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
      const textWidth = pdfDoc.getTextWidth(line);
      pdfDoc.text(line, (pageWidth / 2) - (textWidth / 2), currentY);
      currentY += 4.5;
    });

    pdfDoc.setLineWidth(0.5);
    pdfDoc.line(20, currentY + 2, pageWidth - 20, currentY + 2);

    pdfDoc.setFontSize(14);
    pdfDoc.setFont('helvetica', 'bold');
    const title = 'Brigada Eskwela';
    const subTitle = 'Records of Donations';
    
    pdfDoc.text(title, (pageWidth / 2) - (pdfDoc.getTextWidth(title) / 2), currentY + 12);
    pdfDoc.text(subTitle, (pageWidth / 2) - (pdfDoc.getTextWidth(subTitle) / 2), currentY + 18);
  };

  const tableRows = donations.map((d) => [
    d.item_name,
    `${d.quantity} ${d.unit || ''}`,
    new Date(d.date_received).toLocaleDateString(),
    d.donor_name,
    `P ${Number(d.unit_cost).toLocaleString()}`,
    `P ${Number(d.total_cost).toLocaleString()}`
  ]);

  // Chunking logic to strictly enforce 10 rows per page
  const rowsPerPage = 10;
  for (let i = 0; i < tableRows.length; i += rowsPerPage) {
    if (i > 0) doc.addPage();
    
    addHeader(doc);
    
    const chunk = tableRows.slice(i, i + rowsPerPage);

    autoTable(doc, {
      startY: 85,
      head: [['Item/Material', 'Quantity', 'Date Received', 'Name of Donor', 'Unit Cost', 'Total Cost']],
      body: chunk,
      theme: 'grid',
      headStyles: { 
        fillColor: [255, 255, 255], 
        textColor: [0, 0, 0],
        fontSize: 10,
        halign: 'center',
        fontStyle: 'bold',
        lineWidth: 0.1,
        lineColor: [200, 200, 200]
      },
      bodyStyles: {
        fontSize: 9,
        textColor: [51, 65, 85],
        minCellHeight: 10, // Ensure consistent row height
      },
      columnStyles: {
        4: { halign: 'right' },
        5: { halign: 'right' },
      },
      margin: { left: 20, right: 20 },
    });
  }

  // If no data, still show the header
  if (tableRows.length === 0) {
    addHeader(doc);
    doc.setFontSize(12);
    doc.text('No donation records found.', pageWidth / 2, 100, { align: 'center' });
  }

  doc.save(`Brigada_Donations_${new Date().getFullYear()}.pdf`);
}
