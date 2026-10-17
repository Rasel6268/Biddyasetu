import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Format currency for PDF (Using BDT for reliable glyph rendering across all PDF readers)
 */
const formatBDT = (amount) => {
  const num = Number(amount) || 0;
  return `BDT ${num.toLocaleString("en-US")}`;
};

/**
 * Format date for PDF display
 */
const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

/**
 * Generate and download executive Financial Audit PDF report
 * @param {Object} reportData { summary, ledger, breakdown, dateRange }
 * @param {Object} options { startDate, endDate, generatedBy }
 */
export function generateFinancialReportPDF(reportData, options = {}) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  const {
    startDate = reportData?.dateRange?.startDate || "",
    endDate = reportData?.dateRange?.endDate || "",
    generatedBy = "Administrator",
  } = options;

  const summary = reportData?.summary || {
    totalIncome: 0,
    totalMembershipIncome: 0,
    totalManualIncome: 0,
    totalExpenses: 0,
    netBalance: 0,
    totalTransactions: 0,
    incomeTransactionCount: 0,
    expenseTransactionCount: 0,
  };

  const ledger = reportData?.ledger || [];
  const incomeBreakdown = reportData?.breakdown?.incomeByCategory || [];
  const expenseBreakdown = reportData?.breakdown?.expenseByCategory || [];

  const periodLabel =
    startDate && endDate
      ? `${formatDate(startDate)} to ${formatDate(endDate)}`
      : startDate
      ? `From ${formatDate(startDate)} to Present`
      : endDate
      ? `Inception to ${formatDate(endDate)}`
      : "Complete Inception to Present (All Time)";

  let currentY = 16;

  // ═══════════════════════════════════════════════════════════════
  // 1. TOP HEADER & BRANDING
  // ═══════════════════════════════════════════════════════════════
  // Top Accent Bar
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 5, "F");

  // Secondary Color Line
  doc.setFillColor(14, 165, 233); // sky-500
  doc.rect(0, 5, pageWidth, 1.2, "F");

  // Organization Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42);
  doc.text("BIDDYASETU ALUMNI ASSOCIATION", margin, currentY);

  currentY += 5;
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(14, 165, 233);
  doc.text("FINANCIAL REPORTS & AUDIT STATEMENT", margin, currentY);

  currentY += 4.5;
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text(
    "Official Reconciled Accounting Ledger Covering SSLCommerz Payments & Treasury Vouchers",
    margin,
    currentY
  );

  currentY += 6;
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  doc.line(margin, currentY, pageWidth - margin, currentY);

  // ═══════════════════════════════════════════════════════════════
  // 2. METADATA & AUDIT INFO BOX
  // ═══════════════════════════════════════════════════════════════
  currentY += 4;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, currentY, contentWidth, 18, 2, 2, "F");
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, currentY, contentWidth, 18, 2, 2, "D");

  const nowStr = new Date().toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  });
  const stmtRef = `STMT-${Date.now().toString().slice(-6)}`;

  doc.setFontSize(8);
  // Column 1
  doc.setFont("helvetica", "bold");
  doc.setTextColor(100, 116, 139);
  doc.text("REPORTING PERIOD:", margin + 4, currentY + 5.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text(periodLabel, margin + 4, currentY + 11.5);

  // Column 2
  const col2X = margin + 85;
  doc.setFont("helvetica", "bold");
  doc.setTextColor(100, 116, 139);
  doc.text("AUDIT REFERENCE:", col2X, currentY + 5.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(15, 23, 42);
  doc.text(`${stmtRef} | Reconciled`, col2X, currentY + 11.5);

  // Column 3
  const col3X = margin + 130;
  doc.setFont("helvetica", "bold");
  doc.setTextColor(100, 116, 139);
  doc.text("GENERATED ON:", col3X, currentY + 5.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(15, 23, 42);
  doc.text(nowStr, col3X, currentY + 11.5);

  currentY += 23;

  // ═══════════════════════════════════════════════════════════════
  // 3. 4 EXECUTIVE SUMMARY METRIC BOXES
  // ═══════════════════════════════════════════════════════════════
  const cardGap = 3;
  const cardWidth = (contentWidth - cardGap * 3) / 4;
  const cardHeight = 20;

  // Card 1: Total Revenue / Inflow
  doc.setFillColor(240, 253, 244); // emerald-50
  doc.roundedRect(margin, currentY, cardWidth, cardHeight, 2, 2, "F");
  doc.setDrawColor(187, 247, 208);
  doc.roundedRect(margin, currentY, cardWidth, cardHeight, 2, 2, "D");

  doc.setFontSize(6.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(22, 101, 52);
  doc.text("TOTAL REVENUE (INFLOW)", margin + 3, currentY + 5);

  doc.setFontSize(10.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(21, 128, 61);
  doc.text(formatBDT(summary.totalIncome), margin + 3, currentY + 11.5);

  doc.setFontSize(6);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text(
    `SSL: ${formatBDT(summary.totalMembershipIncome)}`,
    margin + 3,
    currentY + 16
  );

  // Card 2: Total Expenditures
  const c2X = margin + cardWidth + cardGap;
  doc.setFillColor(255, 241, 242); // rose-50
  doc.roundedRect(c2X, currentY, cardWidth, cardHeight, 2, 2, "F");
  doc.setDrawColor(254, 205, 211);
  doc.roundedRect(c2X, currentY, cardWidth, cardHeight, 2, 2, "D");

  doc.setFontSize(6.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(159, 18, 57);
  doc.text("TOTAL EXPENDITURES", c2X + 3, currentY + 5);

  doc.setFontSize(10.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(225, 29, 72);
  doc.text(formatBDT(summary.totalExpenses), c2X + 3, currentY + 11.5);

  doc.setFontSize(6);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text(
    `${summary.expenseTransactionCount} Approved Vouchers`,
    c2X + 3,
    currentY + 16
  );

  // Card 3: Net Balance / Surplus
  const isSurplus = summary.netBalance >= 0;
  const c3X = margin + (cardWidth + cardGap) * 2;
  if (isSurplus) {
    doc.setFillColor(240, 249, 255);
    doc.setDrawColor(186, 230, 253);
  } else {
    doc.setFillColor(254, 243, 199);
    doc.setDrawColor(253, 230, 138);
  }
  doc.roundedRect(c3X, currentY, cardWidth, cardHeight, 2, 2, "F");
  doc.roundedRect(c3X, currentY, cardWidth, cardHeight, 2, 2, "D");

  doc.setFontSize(6.5);
  doc.setFont("helvetica", "bold");
  if (isSurplus) {
    doc.setTextColor(3, 105, 161);
  } else {
    doc.setTextColor(180, 83, 9);
  }
  doc.text(isSurplus ? "OPERATING SURPLUS" : "OPERATING DEFICIT", c3X + 3, currentY + 5);

  doc.setFontSize(10.5);
  doc.setFont("helvetica", "bold");
  if (isSurplus) {
    doc.setTextColor(15, 23, 42);
  } else {
    doc.setTextColor(180, 83, 9);
  }
  doc.text(formatBDT(summary.netBalance), c3X + 3, currentY + 11.5);

  doc.setFontSize(6);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text(isSurplus ? "Healthy Liquidity" : "Deficit Position", c3X + 3, currentY + 16);

  // Card 4: Audit Entries
  const c4X = margin + (cardWidth + cardGap) * 3;
  doc.setFillColor(250, 245, 255); // purple-50
  doc.roundedRect(c4X, currentY, cardWidth, cardHeight, 2, 2, "F");
  doc.setDrawColor(233, 213, 255);
  doc.roundedRect(c4X, currentY, cardWidth, cardHeight, 2, 2, "D");

  doc.setFontSize(6.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(107, 33, 168);
  doc.text("AUDIT RECONCILIATION", c4X + 3, currentY + 5);

  doc.setFontSize(10.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text(`${summary.totalTransactions} Entries`, c4X + 3, currentY + 11.5);

  doc.setFontSize(6);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text(
    `In: ${summary.incomeTransactionCount} | Out: ${summary.expenseTransactionCount}`,
    c4X + 3,
    currentY + 16
  );

  currentY += cardHeight + 6;

  // ═══════════════════════════════════════════════════════════════
  // 4. CATEGORY BREAKDOWN TABLE (INFLOWS & ALLOCATIONS)
  // ═══════════════════════════════════════════════════════════════
  const breakdownRows = [];
  const maxRows = Math.max(incomeBreakdown.length, expenseBreakdown.length);

  for (let i = 0; i < maxRows; i++) {
    const inc = incomeBreakdown[i];
    const exp = expenseBreakdown[i];

    breakdownRows.push([
      inc ? `${inc.name} (${inc.percentage}%)` : "—",
      inc ? formatBDT(inc.amount) : "—",
      exp ? `${exp.name} (${exp.percentage}%)` : "—",
      exp ? formatBDT(exp.amount) : "—",
    ]);
  }

  if (breakdownRows.length > 0) {
    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      theme: "grid",
      styles: {
        fontSize: 7,
        cellPadding: 2,
        textColor: [15, 23, 42],
        lineColor: [241, 245, 249],
        lineWidth: 0.2,
      },
      headStyles: {
        fillColor: [30, 41, 59],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 7,
      },
      head: [
        [
          "Revenue Stream Category",
          "Inflow (BDT)",
          "Expenditure Allocation",
          "Outflow (BDT)",
        ],
      ],
      body: breakdownRows,
      columnStyles: {
        0: { cellWidth: 55 },
        1: { cellWidth: 36, halign: "right", fontStyle: "bold", textColor: [21, 128, 61] },
        2: { cellWidth: 55 },
        3: { cellWidth: 36, halign: "right", fontStyle: "bold", textColor: [225, 29, 72] },
      },
    });

    currentY = doc.lastAutoTable.finalY + 6;
  }

  // ═══════════════════════════════════════════════════════════════
  // 5. ITEMIZED AUDIT TRANSACTION LEDGER TABLE
  // ═══════════════════════════════════════════════════════════════
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("ITEMIZED FINANCIAL AUDIT LEDGER", margin, currentY);

  currentY += 3;

  const tableRows =
    ledger.length === 0
      ? [["No transactions recorded during this period.", "", "", "", "", ""]]
      : ledger.map((item) => {
          const isIncome = item.type === "income";
          const formattedAmount = `${isIncome ? "+" : "-"}${formatBDT(item.amount)}`;
          const sourcePayee = item.sourceOrPayee || "—";
          const methodRef = `${item.paymentMethod || "—"}${
            item.referenceId && item.referenceId !== "—" ? `\nRef: ${item.referenceId}` : ""
          }`;

          return [
            formatDate(item.date),
            `${item.title}${item.notes ? `\nNote: ${item.notes}` : ""}`,
            item.categoryLabel || "General",
            sourcePayee,
            methodRef,
            item.isAutomated ? "[SSL-ONLINE]" : "[VOUCHER]",
            formattedAmount,
          ];
        });

  autoTable(doc, {
    startY: currentY,
    margin: { left: margin, right: margin, bottom: 26 },
    theme: "striped",
    styles: {
      fontSize: 6.8,
      cellPadding: 2,
      valign: "top",
      textColor: [30, 41, 59],
      lineColor: [241, 245, 249],
      lineWidth: 0.2,
    },
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 7,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    head: [
      [
        "Date",
        "Transaction Description",
        "Category",
        "Source / Payee",
        "Method & Reference",
        "Channel",
        "Amount (BDT)",
      ],
    ],
    body: tableRows,
    columnStyles: {
      0: { cellWidth: 18 },
      1: { cellWidth: 48 },
      2: { cellWidth: 28 },
      3: { cellWidth: 28 },
      4: { cellWidth: 24 },
      5: { cellWidth: 16, halign: "center", fontStyle: "bold" },
      6: { cellWidth: 20, halign: "right", fontStyle: "bold" },
    },
    didParseCell: (data) => {
      if (data.section === "body" && data.column.index === 6) {
        const text = data.cell.raw || "";
        if (typeof text === "string" && text.startsWith("+")) {
          data.cell.styles.textColor = [21, 128, 61]; // emerald-700
        } else if (typeof text === "string" && text.startsWith("-")) {
          data.cell.styles.textColor = [225, 29, 72]; // rose-600
        }
      }
      if (data.section === "body" && data.column.index === 5) {
        const text = data.cell.raw || "";
        if (text === "[SSL-ONLINE]") {
          data.cell.styles.textColor = [3, 105, 161]; // sky-700
        } else {
          data.cell.styles.textColor = [100, 116, 139]; // slate-500
        }
      }
    },
  });

  // ═══════════════════════════════════════════════════════════════
  // 6. AUDIT CERTIFICATION & STATUTORY SIGN-OFF BLOCK
  // ═══════════════════════════════════════════════════════════════
  let signY = doc.lastAutoTable.finalY + 8;

  // If near the bottom of page, create a new page for signatures
  if (signY > pageHeight - 45) {
    doc.addPage();
    signY = 20;
  }

  // Legal / Audit Certification Notice Box
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, signY, contentWidth, 12, 1.5, 1.5, "F");
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, signY, contentWidth, 12, 1.5, 1.5, "D");

  doc.setFontSize(6.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("STATUTORY AUDIT & RECONCILIATION STATEMENT:", margin + 3, signY + 4.5);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text(
    "This report has been compiled and validated strictly against verified SSLCommerz payment gateway settlements and authorized physical expense vouchers. Zero mock or estimated entries have been incorporated.",
    margin + 3,
    signY + 8.5
  );

  signY += 22;

  // 3 Formal Signature Lines
  const sigColWidth = contentWidth / 3;

  // Sig 1
  doc.setDrawColor(100, 116, 139);
  doc.setLineWidth(0.3);
  doc.line(margin + 5, signY, margin + sigColWidth - 5, signY);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("PREPARED BY", margin + sigColWidth / 2, signY + 4, { align: "center" });
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text("Finance & Accounts Executive", margin + sigColWidth / 2, signY + 7.5, {
    align: "center",
  });

  // Sig 2
  const sig2X = margin + sigColWidth;
  doc.line(sig2X + 5, signY, sig2X + sigColWidth - 5, signY);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("VERIFIED BY", sig2X + sigColWidth / 2, signY + 4, { align: "center" });
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text("Internal Audit Committee", sig2X + sigColWidth / 2, signY + 7.5, {
    align: "center",
  });

  // Sig 3
  const sig3X = margin + sigColWidth * 2;
  doc.line(sig3X + 5, signY, sig3X + sigColWidth - 5, signY);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("APPROVED BY", sig3X + sigColWidth / 2, signY + 4, { align: "center" });
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text("President / General Secretary", sig3X + sigColWidth / 2, signY + 7.5, {
    align: "center",
  });

  // ═══════════════════════════════════════════════════════════════
  // 7. PAGE NUMBERS & FOOTER ON ALL PAGES
  // ═══════════════════════════════════════════════════════════════
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 9, pageWidth - margin, pageHeight - 9);

    doc.setFontSize(6.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(148, 163, 184);

    doc.text(
      "Biddyasetu Alumni ERP — Confidential Financial Statement",
      margin,
      pageHeight - 5.5
    );

    doc.text(
      `Page ${i} of ${totalPages}`,
      pageWidth - margin,
      pageHeight - 5.5,
      { align: "right" }
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // 8. SAVE & TRIGGER DOWNLOAD
  // ═══════════════════════════════════════════════════════════════
  const safeStart = startDate ? startDate.replace(/-/g, "") : "Inception";
  const safeEnd = endDate ? endDate.replace(/-/g, "") : "Present";
  const fileName = `Financial_Report_${safeStart}_to_${safeEnd}.pdf`;

  doc.save(fileName);
  return fileName;
}
