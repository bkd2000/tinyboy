/**
 * PDF Generation using jsPDF and jsPDF-AutoTable
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { PDFData } from '../types';
import { getBMICategoryLabel } from './bmi';
// Fonts temporarily disabled - causing PDF generation errors
// import { RobotoRegularBase64 } from '../fonts/Roboto-Regular';
// import { RobotoBoldBase64 } from '../fonts/Roboto-Bold';

export async function generatePDF(data: PDFData): Promise<void> {
  try {
    console.log('[PDF] Creating jsPDF instance...');
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    console.log('[PDF] Using standard fonts (helvetica)...');
    // Temporarily using standard fonts instead of custom Roboto
    // Custom fonts were causing memory/generation errors
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
  addText('DANE WEJŚCIOWE', 14, 12, 'bold');
  yPos += 3;

  const inputData = [
    ['Waga', `${data.formData.weight} kg`],
    ['Wzrost', `${data.formData.height} cm`],
    ['Wiek', `${data.formData.age} lat`],
    ['Płeć', data.formData.gender === 'male' ? 'Mężczyzna' : 'Kobieta'],
  ];

  if (data.bodyFatPercentage !== undefined) {
    const methodLabel =
      data.bodyFatMethod === 'manual' ? 'Ręczne' :
      data.bodyFatMethod === 'navy' ? 'US Navy' :
      data.bodyFatMethod === 'bai' ? 'BAI' :
      'Deurenberg (BMI)';
    inputData.push(['% tkanki tłuszczowej', `${data.bodyFatPercentage.toFixed(1)}% (${methodLabel})`]);
  }

  autoTable(doc, {
    startY: yPos,
    head: [],
    body: inputData,
    theme: 'plain',
    styles: {
      fontSize: 10,
      cellPadding: 2,
      font: 'helvetica',
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
      ? `${Math.round(result.value)} kcal/dzień`
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
    head: [['Model BMR', 'Wartość', 'Odchylenie od średniej']],
    body: bmrTableData,
    theme: 'striped',
    headStyles: {
      fillColor: [30, 64, 175],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 10,
      font: 'helvetica',
    },
    styles: {
      fontSize: 9,
      cellPadding: 3,
      font: 'helvetica',
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
  doc.text('Średni BMR:', 14, yPos + 7);
  doc.setFontSize(14);
  doc.setTextColor(30, 64, 175);
  doc.text(`${Math.round(data.bmrResults.average)} kcal/dzień`, pageWidth - 14, yPos + 7, { align: 'right' });
  doc.setTextColor(0, 0, 0);

  yPos += 15;

  // Section: TDEE
  doc.setFillColor(240, 249, 255);
  doc.rect(10, yPos, pageWidth - 20, 8, 'F');
  addText('TDEE - CAŁKOWITE DZIENNE ZAPOTRZEBOWANIE ENERGETYCZNE', 14, 12, 'bold');
  yPos += 3;

  const tdeeData = [
    ['Poziom aktywności', data.activityLevel.label],
    ['Współczynnik', `×${data.activityLevel.value}`],
    ['TDEE', `${data.tdee} kcal/dzień`],
  ];

  autoTable(doc, {
    startY: yPos,
    head: [],
    body: tdeeData,
    theme: 'plain',
    styles: {
      fontSize: 10,
      cellPadding: 2,
      font: 'helvetica',
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
      font: 'helvetica',
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
  addText('BMI - WSKAŹNIK MASY CIAŁA', 14, 12, 'bold');
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
      font: 'helvetica',
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 60 },
      1: { cellWidth: 'auto' },
    },
    margin: { left: 14, right: 14 },
  });

  yPos = (doc as any).lastAutoTable.finalY + 10;

  // Section: WHR (Waist-to-Hip Ratio)
  if (data.whr) {
    if (yPos > 240) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFillColor(240, 249, 255);
    doc.rect(10, yPos, pageWidth - 20, 8, 'F');
    addText('WHR - STOSUNEK TALII DO BIODER', 14, 12, 'bold');
    yPos += 3;

    const whrRiskLabel =
      data.whr.risk === 'low' ? 'Niskie ryzyko' :
      data.whr.risk === 'moderate' ? 'Umiarkowane ryzyko' :
      'Wysokie ryzyko';

    const whrData = [
      ['Wartość WHR', `${data.whr.value.toFixed(2)}`],
      ['Ryzyko zdrowotne', whrRiskLabel],
    ];

    autoTable(doc, {
      startY: yPos,
      head: [],
      body: whrData,
      theme: 'plain',
      styles: {
        fontSize: 10,
        cellPadding: 2,
        font: 'helvetica',
      },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 60 },
        1: { cellWidth: 'auto' },
      },
      margin: { left: 14, right: 14 },
    });

    yPos = (doc as any).lastAutoTable.finalY + 10;
  }

  // Section: WHtR (Waist-to-Height Ratio)
  if (data.whtr) {
    if (yPos > 240) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFillColor(240, 249, 255);
    doc.rect(10, yPos, pageWidth - 20, 8, 'F');
    addText('WHtR - STOSUNEK TALII DO WZROSTU', 14, 12, 'bold');
    yPos += 3;

    const whtrCategoryLabel =
      data.whtr.category === 'very-lean' ? 'Bardzo szczupła' :
      data.whtr.category === 'healthy' ? 'Zdrowa' :
      data.whtr.category === 'increased-risk' ? 'Zwiększone ryzyko' :
      'Wysokie ryzyko';

    const whtrData = [
      ['Wartość WHtR', `${data.whtr.value.toFixed(2)}`],
      ['Kategoria', whtrCategoryLabel],
    ];

    autoTable(doc, {
      startY: yPos,
      head: [],
      body: whtrData,
      theme: 'plain',
      styles: {
        fontSize: 10,
        cellPadding: 2,
        font: 'helvetica',
      },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 60 },
        1: { cellWidth: 'auto' },
      },
      margin: { left: 14, right: 14 },
    });

    yPos = (doc as any).lastAutoTable.finalY + 10;
  }

  // Section: Body Composition (LBM & FFM)
  if (data.bodyComposition) {
    if (yPos > 220) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFillColor(240, 249, 255);
    doc.rect(10, yPos, pageWidth - 20, 8, 'F');
    addText('SKŁAD CIAŁA - LBM & FFM', 14, 12, 'bold');
    yPos += 3;

    const bodyCompData = [
      ['Beztłuszczowa masa ciała (LBM)', `${data.bodyComposition.lbm.average.toFixed(1)} kg (${data.bodyComposition.lbm.averagePercentage.toFixed(1)}%)`],
    ];

    // Add individual LBM formulas
    data.bodyComposition.lbm.results.forEach(result => {
      bodyCompData.push([`  ${result.formula}`, `${result.value.toFixed(1)} kg (${result.percentage.toFixed(1)}%)`]);
    });

    // Add FFM if available
    if (data.bodyComposition.ffm) {
      bodyCompData.push(['', '']);
      bodyCompData.push(['Fat-Free Mass (FFM)', `${data.bodyComposition.ffm.ffm.toFixed(1)} kg (${data.bodyComposition.ffm.percentage.toFixed(1)}%)`]);
    }

    autoTable(doc, {
      startY: yPos,
      head: [],
      body: bodyCompData,
      theme: 'plain',
      styles: {
        fontSize: 10,
        cellPadding: 2,
        font: 'helvetica',
      },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 80 },
        1: { cellWidth: 'auto' },
      },
      margin: { left: 14, right: 14 },
    });

    yPos = (doc as any).lastAutoTable.finalY + 10;
  }

  // Section: FFMI
  if (data.ffmi) {
    if (yPos > 240) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFillColor(240, 249, 255);
    doc.rect(10, yPos, pageWidth - 20, 8, 'F');
    addText('FFMI - WSKAŹNIK BEZTŁUSZCZOWEJ MASY CIAŁA', 14, 12, 'bold');
    yPos += 3;

    const ffmiCategoryLabel =
      data.ffmi.category === 'below-average' ? 'Poniżej przeciętnej' :
      data.ffmi.category === 'average' ? 'Przeciętna' :
      data.ffmi.category === 'above-average' ? 'Powyżej przeciętnej' :
      'Doskonała';

    const ffmiData = [
      ['FFMI', `${data.ffmi.ffmi.toFixed(1)}`],
      ['FFMI znormalizowany', `${data.ffmi.normalizedFFMI.toFixed(1)}`],
      ['Kategoria', ffmiCategoryLabel],
    ];

    autoTable(doc, {
      startY: yPos,
      head: [],
      body: ffmiData,
      theme: 'plain',
      styles: {
        fontSize: 10,
        cellPadding: 2,
        font: 'helvetica',
      },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 60 },
        1: { cellWidth: 'auto' },
      },
      margin: { left: 14, right: 14 },
    });

    yPos = (doc as any).lastAutoTable.finalY + 10;
  }

  // Section: Advanced Body Metrics
  if (data.advancedMetrics) {
    if (yPos > 200) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFillColor(240, 249, 255);
    doc.rect(10, yPos, pageWidth - 20, 8, 'F');
    addText('ZAAWANSOWANE WSKAŹNIKI SKŁADU CIAŁA', 14, 12, 'bold');
    yPos += 3;

    const advancedData = [];

    // SMM (Skeletal Muscle Mass)
    if (data.advancedMetrics.smm) {
      advancedData.push(['Masa mięśni szkieletowych (SMM)', `${data.advancedMetrics.smm.smm.toFixed(1)} kg (${data.advancedMetrics.smm.percentage.toFixed(1)}%)`]);
    }

    // TBW (Total Body Water)
    if (data.advancedMetrics.tbw) {
      advancedData.push(['Całkowita woda w organizmie (TBW)', `${data.advancedMetrics.tbw.tbw.toFixed(1)} L (${data.advancedMetrics.tbw.percentage.toFixed(1)}%)`]);
    }

    // Metabolic Age
    if (data.advancedMetrics.metabolicAge) {
      const metAgeLabel =
        data.advancedMetrics.metabolicAge.category === 'younger' ? 'Młodszy niż wiek kalendarzowy' :
        data.advancedMetrics.metabolicAge.category === 'match' ? 'Odpowiada wiekowi kalendarzowemu' :
        'Starszy niż wiek kalendarzowy';

      advancedData.push(['Wiek metaboliczny', `${data.advancedMetrics.metabolicAge.metabolicAge} lat`]);
      advancedData.push(['Ocena', metAgeLabel]);
    }

    // Visceral Fat
    if (data.advancedMetrics.visceralFat) {
      const visceralLabel =
        data.advancedMetrics.visceralFat.category === 'healthy' ? 'Zdrowy poziom' :
        data.advancedMetrics.visceralFat.category === 'elevated' ? 'Podwyższony' :
        'Wysokie ryzyko';

      advancedData.push(['Tłuszcz trzewny', `${data.advancedMetrics.visceralFat.level}`]);
      advancedData.push(['Kategoria', visceralLabel]);
    }

    if (advancedData.length > 0) {
      autoTable(doc, {
        startY: yPos,
        head: [],
        body: advancedData,
        theme: 'plain',
        styles: {
          fontSize: 10,
          cellPadding: 2,
          font: 'helvetica',
        },
        columnStyles: {
          0: { fontStyle: 'bold', cellWidth: 80 },
          1: { cellWidth: 'auto' },
        },
        margin: { left: 14, right: 14 },
      });

      yPos = (doc as any).lastAutoTable.finalY + 10;
    }
  }

  // Footer / Disclaimer
  const pageHeight = doc.internal.pageSize.getHeight();
  yPos = pageHeight - 30;

  doc.setFillColor(245, 245, 245);
  doc.rect(0, yPos - 5, pageWidth, 35, 'F');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(100, 100, 100);

  const disclaimer = 'Wyniki służą wyłącznie celom informacyjnym i edukacyjnym. Nie stanowią porady medycznej. W przypadku wątpliwości dotyczących zdrowia, diety lub aktywności fizycznej należy skonsultować się z lekarzem lub dietetykiem.';

  const disclaimerLines = doc.splitTextToSize(disclaimer, pageWidth - 28);
  doc.text(disclaimerLines, 14, yPos);

  doc.setFont('helvetica', 'normal');
  doc.text('Dokument wygenerowany przez Kalkulator BMR', pageWidth / 2, pageHeight - 10, { align: 'center' });

    // Save PDF
    console.log('[PDF] Saving PDF file...');
    const filename = data.clientName
      ? `BMR_Raport_${data.clientName.replace(/\s+/g, '_')}_${data.generatedAt.toISOString().split('T')[0]}.pdf`
      : `BMR_Raport_${data.generatedAt.toISOString().split('T')[0]}.pdf`;

    doc.save(filename);
    console.log('[PDF] PDF saved successfully:', filename);
  } catch (error) {
    console.error('[PDF] Error during PDF generation:', error);
    throw error;
  }
}
