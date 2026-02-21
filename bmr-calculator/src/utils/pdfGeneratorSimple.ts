/**
 * PDF Generation using jsPDF and jsPDF-AutoTable (WITHOUT custom fonts - for testing)
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { PDFData } from '../types';
import { getBMICategoryLabel } from './bmi';

export async function generatePDFSimple(data: PDFData): Promise<void> {
  try {
    console.log('[PDF-SIMPLE] Creating jsPDF instance...');
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    console.log('[PDF-SIMPLE] Using default fonts (helvetica)');
    doc.setFont('helvetica', 'normal');

    const pageWidth = doc.internal.pageSize.getWidth();
    let yPos = 20;

    // Helper function to add text with word wrap
    const addText = (text: string, x: number, size: number = 10, style: 'normal' | 'bold' = 'normal') => {
      doc.setFontSize(size);
      doc.setFont('helvetica', style);
      doc.text(text, x, yPos);
      yPos += size * 0.5;
    };

    // Header
    doc.setFillColor(30, 64, 175); // Primary color
    doc.rect(0, 0, pageWidth, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Raport Kalkulacji BMR', pageWidth / 2, 20, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Profesjonalny kalkulator podstawowej przemiany materii', pageWidth / 2, 30, { align: 'center' });

    yPos = 50;
    doc.setTextColor(0, 0, 0);

    // Date and Client Name
    const dateStr = data.generatedAt.toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    addText(`Data wygenerowania: ${dateStr}`, 14, 10, 'normal');

    if (data.clientName) {
      addText(`Klient: ${data.clientName}`, 14, 12, 'bold');
    }

    yPos += 5;

    // Section: Input Data
    doc.setFillColor(240, 249, 255);
    doc.rect(10, yPos, pageWidth - 20, 8, 'F');
    addText('DANE WEJSCIOWE', 14, 12, 'bold');
    yPos += 3;

    const inputData = [
      ['Waga', `${data.formData.weight} kg`],
      ['Wzrost', `${data.formData.height} cm`],
      ['Wiek', `${data.formData.age} lat`],
      ['Plec', data.formData.gender === 'male' ? 'Mezczyzna' : 'Kobieta'],
    ];

    if (data.bodyFatPercentage !== undefined) {
      const methodLabel =
        data.bodyFatMethod === 'manual' ? 'Reczne' :
        data.bodyFatMethod === 'navy' ? 'US Navy' :
        'Deurenberg (BMI)';
      inputData.push(['% tkanki tluszczowej', `${data.bodyFatPercentage.toFixed(1)}% (${methodLabel})`]);
    }

    autoTable(doc, {
      startY: yPos,
      head: [],
      body: inputData,
      theme: 'plain',
      styles: {
        fontSize: 10,
        cellPadding: 2,
      },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 60 },
        1: { cellWidth: 'auto' },
      },
      margin: { left: 14, right: 14 },
    });

    yPos = (doc as any).lastAutoTable.finalY + 10;

    // Section: BMR Results
    doc.setFillColor(240, 249, 255);
    doc.rect(10, yPos, pageWidth - 20, 8, 'F');
    addText('WYNIKI BMR - PODSTAWOWA PRZEMIANA MATERII', 14, 12, 'bold');
    yPos += 3;

    // BMR Table
    const bmrTableData = data.bmrResults.results.map(result => {
      const value = result.value !== null
        ? `${Math.round(result.value)} kcal/dzien`
        : 'Brak danych';

      const deviation = result.value !== null && data.bmrResults.average > 0
        ? Math.round(result.value - data.bmrResults.average)
        : null;

      const deviationStr = deviation !== null
        ? `${deviation > 0 ? '+' : ''}${deviation} kcal`
        : '—';

      return [
        `${result.model} (${result.year})`,
        value,
        deviationStr,
      ];
    });

    autoTable(doc, {
      startY: yPos,
      head: [['Model BMR', 'Wartosc', 'Odchylenie od sredniej']],
      body: bmrTableData,
      theme: 'striped',
      headStyles: {
        fillColor: [30, 64, 175],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 10,
      },
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      columnStyles: {
        0: { cellWidth: 90 },
        1: { cellWidth: 50, halign: 'right' },
        2: { cellWidth: 50, halign: 'right' },
      },
      margin: { left: 14, right: 14 },
    });

    yPos = (doc as any).lastAutoTable.finalY + 5;

    // Average BMR highlight
    doc.setFillColor(219, 234, 254);
    doc.rect(10, yPos, pageWidth - 20, 10, 'F');
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Sredni BMR:', 14, yPos + 7);
    doc.setFontSize(14);
    doc.setTextColor(30, 64, 175);
    doc.text(`${Math.round(data.bmrResults.average)} kcal/dzien`, pageWidth - 14, yPos + 7, { align: 'right' });
    doc.setTextColor(0, 0, 0);

    yPos += 15;

    // Section: TDEE
    doc.setFillColor(240, 249, 255);
    doc.rect(10, yPos, pageWidth - 20, 8, 'F');
    addText('TDEE - CALKOWITE DZIENNE ZAPOTRZEBOWANIE ENERGETYCZNE', 14, 12, 'bold');
    yPos += 3;

    const tdeeData = [
      ['Poziom aktywnosci', data.activityLevel.label],
      ['Wspolczynnik', `×${data.activityLevel.value}`],
      ['TDEE', `${data.tdee} kcal/dzien`],
    ];

    autoTable(doc, {
      startY: yPos,
      head: [],
      body: tdeeData,
      theme: 'plain',
      styles: {
        fontSize: 10,
        cellPadding: 2,
      },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 60 },
        1: { cellWidth: 'auto' },
      },
      margin: { left: 14, right: 14 },
    });

    yPos = (doc as any).lastAutoTable.finalY + 5;

    // Caloric goals
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Cele kaloryczne:', 14, yPos);
    yPos += 5;

    const goalsData = [
      ['Utrzymanie wagi', `${data.tdee} kcal`],
      ['Redukcja (-500 kcal)', `${data.tdee - 500} kcal`],
      ['Masa (+300 kcal)', `${data.tdee + 300} kcal`],
      ['Szybka redukcja (-750 kcal)', `${data.tdee - 750} kcal`],
    ];

    autoTable(doc, {
      startY: yPos,
      head: [],
      body: goalsData,
      theme: 'plain',
      styles: {
        fontSize: 9,
        cellPadding: 2,
      },
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: 'auto', halign: 'right', fontStyle: 'bold' },
      },
      margin: { left: 14, right: 14 },
    });

    yPos = (doc as any).lastAutoTable.finalY + 10;

    // Check if we need a new page
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }

    // Section: BMI
    doc.setFillColor(240, 249, 255);
    doc.rect(10, yPos, pageWidth - 20, 8, 'F');
    addText('BMI - WSKAZNIK MASY CIALA', 14, 12, 'bold');
    yPos += 3;

    const categoryLabel = getBMICategoryLabel(data.bmi.category);

    const bmiData = [
      ['BMI', `${data.bmi.value}`],
      ['Kategoria', categoryLabel],
      ['Zdrowy zakres wagi', `${data.bmi.healthyWeightRange.min} - ${data.bmi.healthyWeightRange.max} kg`],
    ];

    autoTable(doc, {
      startY: yPos,
      head: [],
      body: bmiData,
      theme: 'plain',
      styles: {
        fontSize: 10,
        cellPadding: 2,
      },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 60 },
        1: { cellWidth: 'auto' },
      },
      margin: { left: 14, right: 14 },
    });

    yPos = (doc as any).lastAutoTable.finalY + 10;

    // Footer / Disclaimer
    const pageHeight = doc.internal.pageSize.getHeight();
    yPos = pageHeight - 30;

    doc.setFillColor(245, 245, 245);
    doc.rect(0, yPos - 5, pageWidth, 35, 'F');

    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 100, 100);

    const disclaimer = 'Wyniki sluza wylacznie celom informacyjnym i edukacyjnym. Nie stanowia porady medycznej.';

    const disclaimerLines = doc.splitTextToSize(disclaimer, pageWidth - 28);
    doc.text(disclaimerLines, 14, yPos);

    doc.setFont('helvetica', 'normal');
    doc.text('Dokument wygenerowany przez Kalkulator BMR', pageWidth / 2, pageHeight - 10, { align: 'center' });

    // Save PDF
    console.log('[PDF-SIMPLE] Saving PDF file...');
    const filename = data.clientName
      ? `BMR_Raport_TEST_${data.clientName.replace(/\s+/g, '_')}_${data.generatedAt.toISOString().split('T')[0]}.pdf`
      : `BMR_Raport_TEST_${data.generatedAt.toISOString().split('T')[0]}.pdf`;

    doc.save(filename);
    console.log('[PDF-SIMPLE] PDF saved successfully:', filename);
  } catch (error) {
    console.error('[PDF-SIMPLE] Error during PDF generation:', error);
    throw error;
  }
}
