export const getSalesStatus = (k, val) => {
  const v = parseFloat(val);
  if (isNaN(v)) return ["--", "gray"];
  
  switch (k) {
    case "leadToEnquiry":
      return v >= 20 ? ["⬆️ Good", "green"] : ["⬇️ Low", "red"];
    case "enquiryToSales":
      return v >= 25 ? ["⬆️ Strong", "green"] : ["⬇️ Weak", "red"];
    case "leadToSales":
      return v >= 5 ? ["⬆️ Excellent", "green"] : ["⬇️ Needs Work", "red"];
    case "revenue":
      return v > 0 ? ["⬆️ Positive", "green"] : ["⬇️ No Revenue", "red"];
    case "roi":
      return v > 100 ? ["⬆️ Excellent", "green"] : v > 0 ? ["⬆️ Positive", "green"] : ["⬇️ Negative", "red"];
    case "cac":
      return v <= 1000 ? ["⬆️ Low Cost", "green"] : v <= 5000 ? ["⬆️ Moderate", "orange"] : ["⬇️ High Cost", "red"];
    case "leadResponseTime":
      return v <= 1 ? ["⬆️ Fast", "green"] : v <= 3 ? ["⬆️ Good", "green"] : ["⬇️ Slow", "red"];
    case "salesCycleTime":
      return v <= 30 ? ["⬆️ Quick", "green"] : v <= 60 ? ["⬆️ Moderate", "orange"] : ["⬇️ Long", "red"];
    case "enquiryToConversionTime":
      return v <= 7 ? ["⬆️ Fast", "green"] : v <= 14 ? ["⬆️ Good", "green"] : ["⬇️ Slow", "red"];
    case "leadsPerTimePeriod":
      return v >= 50 ? ["⬆️ High Volume", "green"] : v >= 20 ? ["⬆️ Good", "green"] : ["⬇️ Low Volume", "red"];
    case "salesPerTimePeriod":
      return v >= 10 ? ["⬆️ High Volume", "green"] : v >= 5 ? ["⬆️ Good", "green"] : ["⬇️ Low Volume", "red"];
    default:
      return ["--", "gray"];
  }
};

// Finance Status Functions
export const getStatusFinance = (k, val) => {
  const v = parseFloat(val);
  if (isNaN(v)) return ["--", "gray"];
  
  switch (k) {
    case "grossProfit":
      return v >= 0 ? ["⬆️ Good", "green"] : ["⬇️ Loss", "red"];
    case "netProfit":
      return v >= 0 ? ["⬆️ Healthy", "green"] : ["⬇️ Loss", "red"];
    case "grossMarginPercent":
      return v >= 15 ? ["⬆️ Strong", "green"] : ["⬇️ Weak", "red"];
    case "netProfitMarginPercent":
      return v >= 5 ? ["⬆️ Good", "green"] : ["⬇️ Low", "red"];
    case "totalDirectCost":
      return v <= 60 ? ["⬆️ Efficient", "green"] : ["⬇️ High", "red"];
    case "contributionMargin":
      return v >= 0 ? ["⬆️ Profitable", "green"] : ["⬇️ Unprofitable", "red"];
    case "operatingProfit":
      return v >= 0 ? ["⬆️ Strong", "green"] : ["⬇️ Weak", "red"];
    case "netCashFlow":
      return v >= 0 ? ["⬆️ Healthy", "green"] : ["⬇️ Negative", "red"];
    case "cashBalance":
      return v >= 0 ? ["⬆️ Safe", "green"] : ["⬇️ Risk", "red"];
    case "adjustedCogs":
      return v <= 70 ? ["⬆️ Controlled", "green"] : ["⬇️ High", "red"];
    case "inventoryTurnover":
      return v >= 4 ? ["⬆️ Efficient", "green"] : ["⬇️ Slow", "red"];
    case "changePercent":
      return v > 0 ? ["⬆️ Growth", "green"] : ["⬇️ Decline", "red"];
    case "breakEvenRevenue":
      return v <= 80 ? ["⬆️ Low", "green"] : ["⬇️ High", "red"];
    case "forecastAccuracy":
      return v <= 10 ? ["⬆️ Accurate", "green"] : ["⬇️ Inaccurate", "red"];
    case "variableCostPercent":
      return v <= 50 ? ["⬆️ Good", "green"] : ["⬇️ High", "red"];
    case "operatingExpenseRatio":
      return v <= 30 ? ["⬆️ Lean", "green"] : ["⬇️ Heavy", "red"];
    case "inventoryChange":
      return Math.abs(v) <= 20 ? ["⬆️ Balanced", "green"] : ["⬇️ Extreme", "red"];
    case "netWorkingCapital":
      return v >= 0 ? ["⬆️ Good", "green"] : ["⬇️ Tight", "red"];
    case "totalExpense":
      return v <= 80 ? ["⬆️ Efficient", "green"] : ["⬇️ High", "red"];
    default:
      return ["--", "gray"];
  }
};

// Label formatters
export const formatSalesLabel = (key) => {
  const labels = {
    leadToEnquiry: "Lead to Enquiry Rate",
    enquiryToSales: "Enquiry to Sales Rate",
    leadToSales: "Overall Lead to Sales Rate",
    revenue: "Total Revenue Generated",
    roi: "Marketing Return on Investment",
    cac: "Customer Acquisition Cost",
    leadResponseTime: "Lead Response Time",
    salesCycleTime: "Complete Sales Cycle Time",
    enquiryToConversionTime: "Enquiry to Conversion Time",
    leadsPerTimePeriod: "Leads per Month",
    salesPerTimePeriod: "Sales per Month"
  };
  return labels[key] || key;
};

export const formatFinanceLabel = (key) => {
  const labels = {
    grossProfit: "Gross Profit",
    netProfit: "Net Profit", 
    grossMarginPercent: "Gross Margin %",
    netProfitMarginPercent: "Net Profit Margin %",
    totalDirectCost: "Total Direct Cost",
    contributionMargin: "Contribution Margin",
    operatingProfit: "Operating Profit (EBIT)",
    netCashFlow: "Net Cash Flow",
    cashBalance: "Cash Balance",
    adjustedCogs: "Cost of Goods Sold (COGS)",
    inventoryTurnover: "Inventory Turnover Ratio",
    changePercent: "Change % Between Quarters",
    breakEvenRevenue: "Break-even Point (Revenue)",
    forecastAccuracy: "Forecast Accuracy %",
    variableCostPercent: "Variable Cost % of Sales",
    operatingExpenseRatio: "Operating Expense Ratio %",
    inventoryChange: "Inventory Value Change",
    netWorkingCapital: "Net Working Capital",
    totalExpense: "Total Expense"
  };
  return labels[key] || key;
};