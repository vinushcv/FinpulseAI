
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateStrategyPDF = (companyName, projection, aiAnalysis, modifiers) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    // -- Header --
    doc.setFontSize(22);
    doc.setTextColor(41, 128, 185); // Blue
    doc.text("Strategic Financial Plan", 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated for: ${companyName}`, 14, 28);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 33);

    // -- Divider --
    doc.setLineWidth(0.5);
    doc.setDrawColor(200);
    doc.line(14, 38, pageWidth - 14, 38);

    // -- Scenario Overview --
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("1. Proposed Strategy", 14, 50);

    const revenueGrowth = (modifiers.revenue_growth * 100).toFixed(0);
    const expenseChange = (modifiers.expense_change * 100).toFixed(0);

    const strategyData = [
        ['Revenue Target', `${revenueGrowth}% Growth`, 'Aggressive expansion / Marketing push'],
        ['OpEx Adjustment', `${expenseChange}% Change`, expenseChange > 0 ? 'Increase investment' : 'Cost cutting / Efficiency'],
    ];

    autoTable(doc, {
        startY: 55,
        head: [['Metric', 'Adjustment', 'Implication']],
        body: strategyData,
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185] },
        styles: { fontSize: 10 }
    });

    // -- Financial Projections --
    const finalY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.text("2. Financial Projection", 14, finalY);

    const fmt = (num) => `$${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const financialData = [
        ['Metric', 'Current (Actual)', 'Projected (Future)'],
        ['Revenue', fmt(projection.original.revenue), fmt(projection.projected.revenue)],
        ['Expenses', fmt(projection.original.expenses), fmt(projection.projected.expenses)],
        ['Net Profit', fmt(projection.original.net_profit), fmt(projection.projected.net_profit)],
    ];

    autoTable(doc, {
        startY: finalY + 5,
        head: [['Category', 'Baseline', 'Scenario']],
        body: financialData,
        theme: 'striped',
        headStyles: { fillColor: [52, 73, 94] },
        styles: { fontSize: 11, fontStyle: 'bold' } // Emphasize numbers
    });

    // -- CFO Analysis --
    const analysisY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.setTextColor(192, 57, 43); // Red/Orange for caution
    doc.text("3. CFO Risk Assessment", 14, analysisY);

    doc.setFontSize(11);
    doc.setTextColor(50);
    doc.setFont("helvetica", "italic");

    const splitText = doc.splitTextToSize(aiAnalysis, pageWidth - 28);
    doc.text(splitText, 14, analysisY + 8);

    // -- Footer --
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("Powered by FinPulse AI Advisor", 14, doc.internal.pageSize.height - 10);

    doc.save(`${companyName.replace(/\s+/g, '_')}_Strategy_Plan.pdf`);
};
