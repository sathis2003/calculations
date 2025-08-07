import { useState } from "react";

// Status evaluation functions
const getStatusFinance = (k, val) => {
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

// Label formatting
const formatFinanceLabel = (key) => {
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

// Finance Form Component
function FinanceForm({ onResult, onSubmit }) {
  const [financeData, setFinanceData] = useState({
    sellingPrice: '', cogs: '', rawMaterials: '', labour: '', otherDirectCost: '',
    totalRevenue: '', totalExpenses: '', preQuarterValue: '', currentValue: '',
    cashInflow: '', cashOutflow: '', cashInHand: '', fixedCost: '', variableCost: '',
    operatingExpenses: '', openingInventory: '', closingInventory: '', averageInventory: '',
    forecast: ''
  });

  const [isCalculating, setIsCalculating] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFinanceData((prev) => ({ ...prev, [name]: value }));
  };

  const calculateMetrics = () => {
    setIsCalculating(true);
    setTimeout(() => {
      const num = (key) => parseFloat(financeData[key]) || 0;
      
      // Calculate all metrics
      const grossProfit = num("sellingPrice") - num("cogs");
      const netProfit = num("totalRevenue") - num("totalExpenses");
      const grossMarginPercent = num("sellingPrice") !== 0 ? (grossProfit / num("sellingPrice")) * 100 : 0;
      const netProfitMarginPercent = num("totalRevenue") !== 0 ? (netProfit / num("totalRevenue")) * 100 : 0;
      const totalDirectCost = num("rawMaterials") + num("labour") + num("otherDirectCost");
      const contributionMargin = num("sellingPrice") - num("variableCost");
      const operatingProfit = num("totalRevenue") - num("operatingExpenses");
      const netCashFlow = num("cashInflow") - num("cashOutflow");
      const cashBalance = num("cashInHand") + netCashFlow;
      const adjustedCogs = num("openingInventory") + totalDirectCost - num("closingInventory");
      const inventoryTurnover = num("averageInventory") !== 0 ? adjustedCogs / num("averageInventory") : 0;
      const changePercent = num("preQuarterValue") !== 0 ? ((num("currentValue") - num("preQuarterValue")) / num("preQuarterValue")) * 100 : 0;
      const contributionMarginRatio = num("sellingPrice") !== 0 ? contributionMargin / num("sellingPrice") : 0;
      const breakEvenRevenue = contributionMarginRatio !== 0 ? num("fixedCost") / contributionMarginRatio : 0;
      const forecastAccuracy = num("currentValue") !== 0 ? (Math.abs(num("forecast") - num("currentValue")) / num("currentValue")) * 100 : 0;
      const variableCostPercent = num("sellingPrice") !== 0 ? (num("variableCost") / num("sellingPrice")) * 100 : 0;
      const operatingExpenseRatio = num("totalRevenue") !== 0 ? (num("operatingExpenses") / num("totalRevenue")) * 100 : 0;
      const inventoryChange = num("closingInventory") - num("openingInventory");
      const netWorkingCapital = (cashBalance + num("closingInventory")) - num("fixedCost");
      const totalExpense = num("fixedCost") + num("variableCost") + num("operatingExpenses") + num("otherDirectCost");

      const metrics = {
        grossProfit, netProfit, grossMarginPercent, netProfitMarginPercent,
        totalDirectCost, contributionMargin, operatingProfit, netCashFlow,
        cashBalance, adjustedCogs, inventoryTurnover, changePercent, 
        breakEvenRevenue, forecastAccuracy, variableCostPercent, 
        operatingExpenseRatio, inventoryChange, netWorkingCapital, totalExpense
      };

      const calculationSteps = {
        grossProfit: {
          formula: "Gross Profit = Selling Price - COGS",
          calculation: `${num("sellingPrice")} - ${num("cogs")} = ${grossProfit.toFixed(2)}`,
          explanation: "Gross profit measures the profitability of core business operations before considering operating expenses."
        },
        netProfit: {
          formula: "Net Profit = Total Revenue - Total Expenses",
          calculation: `${num("totalRevenue")} - ${num("totalExpenses")} = ${netProfit.toFixed(2)}`,
          explanation: "Net profit is the final profit after all expenses have been deducted from total revenue."
        },
        grossMarginPercent: {
          formula: "Gross Margin % = (Gross Profit / Selling Price) × 100",
          calculation: `(${grossProfit.toFixed(2)} / ${num("sellingPrice")}) × 100 = ${grossMarginPercent.toFixed(2)}%`,
          explanation: "Gross margin percentage shows what portion of each sale remains after paying direct costs."
        },
        netProfitMarginPercent: {
          formula: "Net Profit Margin % = (Net Profit / Total Revenue) × 100",
          calculation: `(${netProfit.toFixed(2)} / ${num("totalRevenue")}) × 100 = ${netProfitMarginPercent.toFixed(2)}%`,
          explanation: "Net profit margin shows what percentage of revenue becomes actual profit."
        },
        totalDirectCost: {
          formula: "Total Direct Cost = Raw Materials + Labour + Other Direct Cost",
          calculation: `${num("rawMaterials")} + ${num("labour")} + ${num("otherDirectCost")} = ${totalDirectCost.toFixed(2)}`,
          explanation: "Total direct costs are expenses directly attributable to producing goods or services."
        },
        contributionMargin: {
          formula: "Contribution Margin = Selling Price - Variable Cost",
          calculation: `${num("sellingPrice")} - ${num("variableCost")} = ${contributionMargin.toFixed(2)}`,
          explanation: "Contribution margin shows how much each unit contributes to covering fixed costs and profit."
        },
        operatingProfit: {
          formula: "Operating Profit (EBIT) = Total Revenue - Operating Expenses",
          calculation: `${num("totalRevenue")} - ${num("operatingExpenses")} = ${operatingProfit.toFixed(2)}`,
          explanation: "Operating profit measures earnings from core business operations before interest and taxes."
        },
        netCashFlow: {
          formula: "Net Cash Flow = Cash Inflow - Cash Outflow",
          calculation: `${num("cashInflow")} - ${num("cashOutflow")} = ${netCashFlow.toFixed(2)}`,
          explanation: "Net cash flow shows the actual cash generated or consumed by the business."
        },
        cashBalance: {
          formula: "Cash Balance = Cash in Hand + Net Cash Flow",
          calculation: `${num("cashInHand")} + ${netCashFlow.toFixed(2)} = ${cashBalance.toFixed(2)}`,
          explanation: "Cash balance represents the total cash available after accounting for cash flows."
        },
        adjustedCogs: {
          formula: "COGS (Adjusted) = Opening Inventory + Total Direct Cost - Closing Inventory",
          calculation: `${num("openingInventory")} + ${totalDirectCost.toFixed(2)} - ${num("closingInventory")} = ${adjustedCogs.toFixed(2)}`,
          explanation: "Adjusted COGS accounts for inventory changes to show actual cost of goods sold during the period."
        },
        inventoryTurnover: {
          formula: "Inventory Turnover Ratio = COGS / Average Inventory",
          calculation: `${adjustedCogs.toFixed(2)} / ${num("averageInventory")} = ${inventoryTurnover.toFixed(2)}`,
          explanation: "Inventory turnover measures how efficiently inventory is being converted into sales."
        },
        changePercent: {
          formula: "Change % = ((Current - Previous) / Previous) × 100",
          calculation: `((${num("currentValue")} - ${num("preQuarterValue")}) / ${num("preQuarterValue")}) × 100 = ${changePercent.toFixed(2)}%`,
          explanation: "Change percentage shows the growth or decline compared to the previous period."
        },
        breakEvenRevenue: {
          formula: "Break-even Revenue = Fixed Cost / (Contribution Margin / Selling Price)",
          calculation: `${num("fixedCost")} / (${contributionMargin.toFixed(2)} / ${num("sellingPrice")}) = ${breakEvenRevenue.toFixed(2)}`,
          explanation: "Break-even revenue is the minimum revenue needed to cover all costs without making a loss."
        },
        forecastAccuracy: {
          formula: "Forecast Accuracy = |Forecast - Actual| / Actual × 100",
          calculation: `|${num("forecast")} - ${num("currentValue")}| / ${num("currentValue")} × 100 = ${forecastAccuracy.toFixed(2)}%`,
          explanation: "Forecast accuracy measures how close predictions were to actual results."
        },
        variableCostPercent: {
          formula: "Variable Cost % = (Variable Cost / Selling Price) × 100",
          calculation: `(${num("variableCost")} / ${num("sellingPrice")}) × 100 = ${variableCostPercent.toFixed(2)}%`,
          explanation: "Variable cost percentage shows what portion of the selling price goes to variable costs."
        },
        operatingExpenseRatio: {
          formula: "Operating Expense Ratio = (Operating Expenses / Total Revenue) × 100",
          calculation: `(${num("operatingExpenses")} / ${num("totalRevenue")}) × 100 = ${operatingExpenseRatio.toFixed(2)}%`,
          explanation: "Operating expense ratio shows what percentage of revenue is consumed by operating expenses."
        },
        inventoryChange: {
          formula: "Inventory Value Change = Closing Inventory - Opening Inventory",
          calculation: `${num("closingInventory")} - ${num("openingInventory")} = ${inventoryChange.toFixed(2)}`,
          explanation: "Inventory change shows whether inventory levels increased or decreased during the period."
        },
        netWorkingCapital: {
          formula: "Net Working Capital = (Cash Balance + Closing Inventory) - Current Liabilities",
          calculation: `(${cashBalance.toFixed(2)} + ${num("closingInventory")}) - ${num("fixedCost")} = ${netWorkingCapital.toFixed(2)}`,
          explanation: "Net working capital measures the company's short-term financial health and liquidity."
        },
        totalExpense: {
          formula: "Total Expense = Fixed + Variable + Operating + Other Direct Costs",
          calculation: `${num("fixedCost")} + ${num("variableCost")} + ${num("operatingExpenses")} + ${num("otherDirectCost")} = ${totalExpense.toFixed(2)}`,
          explanation: "Total expense represents all costs incurred by the business during the period."
        }
      };

      onResult({ metrics, calculationSteps, inputData: financeData });
      setIsCalculating(false);
      onSubmit();
    }, 500);
  };

  const inputSections = [
    {
      title: "💰 Revenue & Pricing",
      fields: [
        { key: "sellingPrice", label: "Selling Price", placeholder: "100.00", type: "number" },
        { key: "totalRevenue", label: "Total Revenue", placeholder: "10000.00", type: "number" },
        { key: "cogs", label: "COGS (Cost of Goods Sold)", placeholder: "60.00", type: "number" }
      ]
    },
    {
      title: "🏭 Production Costs",
      fields: [
        { key: "rawMaterials", label: "Raw Materials", placeholder: "30.00", type: "number" },
        { key: "labour", label: "Labour Cost", placeholder: "20.00", type: "number" },
        { key: "otherDirectCost", label: "Other Direct Cost", placeholder: "5.00", type: "number" }
      ]
    },
    {
      title: "📊 Operating Expenses",
      fields: [
        { key: "fixedCost", label: "Fixed Cost", placeholder: "1000.00", type: "number" },
        { key: "variableCost", label: "Variable Cost", placeholder: "40.00", type: "number" },
        { key: "operatingExpenses", label: "Operating Expenses", placeholder: "2000.00", type: "number" },
        { key: "totalExpenses", label: "Total Expenses", placeholder: "8000.00", type: "number" }
      ]
    },
    {
      title: "💵 Cash Flow",
      fields: [
        { key: "cashInflow", label: "Cash Inflow", placeholder: "5000.00", type: "number" },
        { key: "cashOutflow", label: "Cash Outflow", placeholder: "4500.00", type: "number" },
        { key: "cashInHand", label: "Cash in Hand", placeholder: "2000.00", type: "number" }
      ]
    },
    {
      title: "📦 Inventory",
      fields: [
        { key: "openingInventory", label: "Opening Inventory", placeholder: "1500.00", type: "number" },
        { key: "closingInventory", label: "Closing Inventory", placeholder: "1800.00", type: "number" },
        { key: "averageInventory", label: "Average Inventory", placeholder: "1650.00", type: "number" }
      ]
    },
    {
      title: "📈 Performance Tracking",
      fields: [
        { key: "preQuarterValue", label: "Previous Quarter Value", placeholder: "9000.00", type: "number" },
        { key: "currentValue", label: "Current Value", placeholder: "10000.00", type: "number" },
        { key: "forecast", label: "Forecast Value", placeholder: "10500.00", type: "number" }
      ]
    }
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold text-purple-700 mb-6">Finance Metrics Calculator</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {inputSections.map((section) => (
          <div key={section.title} className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-4">{section.title}</h3>
            <div className="space-y-4">
              {section.fields.map(({ key, label, placeholder, type }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                    <input
                      type="number"
                      step="0.01"
                      name={key}
                      value={financeData[key]}
                      onChange={handleChange}
                      className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder={placeholder}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={calculateMetrics}
        disabled={isCalculating}
        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 disabled:opacity-50"
      >
        {isCalculating ? 'Calculating...' : 'Calculate Finance Metrics'}
      </button>
    </div>
  );
}

// Results Display Component
function ResultsDisplay({ results, type = "finance" }) {
  const [selectedMetric, setSelectedMetric] = useState(null);
  
  const { metrics, calculationSteps, inputData } = results;

  const formatLabel = type === "finance" ? formatFinanceLabel : formatFinanceLabel;
  const getStatus = type === "finance" ? getStatusFinance : getStatusFinance;

  return (
    <div className="mt-8">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4">
          <h3 className="text-white text-xl font-bold flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Finance Analysis Results
          </h3>
          <p className="text-purple-100 mt-1">Complete breakdown of your financial metrics with performance indicators</p>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Object.entries(metrics).map(([key, value]) => {
              const [statusText, statusColor] = getStatus(key, value);
              const isPercentage = key.includes('Percent') || key.includes('Ratio') || key === 'changePercent' || key === 'forecastAccuracy';
              const displayValue = isPercentage ? `${value.toFixed(2)}%` : `₹${value.toFixed(2)}`;
              
              return (
                <div
                  key={key}
                  onClick={() => setSelectedMetric(key)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                    statusColor === 'green' 
                      ? 'bg-green-50 border-green-200 hover:bg-green-100' 
                      : statusColor === 'red' 
                      ? 'bg-red-50 border-red-200 hover:bg-red-100' 
                      : statusColor === 'orange'
                      ? 'bg-orange-50 border-orange-200 hover:bg-orange-100'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      statusColor === 'green' 
                        ? 'bg-green-600 text-white' 
                        : statusColor === 'red' 
                        ? 'bg-red-600 text-white' 
                        : statusColor === 'orange'
                        ? 'bg-orange-600 text-white'
                        : 'bg-gray-600 text-white'
                    }`}>
                      {statusText}
                    </span>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  
                  <h4 className="font-semibold text-gray-800 mb-1 text-sm leading-tight">
                    {formatLabel(key)}
                  </h4>
                  
                  <div className="text-lg font-bold text-gray-900 mb-2">
                    {displayValue}
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    Click for details
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Calculation Details Modal */}
      {selectedMetric && calculationSteps[selectedMetric] && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4 rounded-t-lg">
              <div className="flex justify-between items-center">
                <h3 className="text-white text-xl font-bold">Calculation Details</h3>
                <button
                  onClick={() => setSelectedMetric(null)}
                  className="text-white hover:text-gray-200 transition-colors duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Metric Header */}
              <div className="text-center">
                <h4 className="text-2xl font-bold text-gray-800 mb-2">
                  {formatLabel(selectedMetric)}
                </h4>
                <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold ${
                  getStatus(selectedMetric, metrics[selectedMetric])[1] === 'green' 
                    ? 'bg-green-100 text-green-800' 
                    : getStatus(selectedMetric, metrics[selectedMetric])[1] === 'red' 
                    ? 'bg-red-100 text-red-800' 
                    : getStatus(selectedMetric, metrics[selectedMetric])[1] === 'orange'
                    ? 'bg-orange-100 text-orange-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {getStatus(selectedMetric, metrics[selectedMetric])[0]}
                </div>
              </div>

              {/* Result Value */}
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-4">
                  {(selectedMetric.includes('Percent') || selectedMetric.includes('Ratio') || selectedMetric === 'changePercent' || selectedMetric === 'forecastAccuracy') 
                    ? `${metrics[selectedMetric].toFixed(2)}%` 
                    : `₹${metrics[selectedMetric].toFixed(2)}`}
                </div>
              </div>

              {/* Formula */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h5 className="text-lg font-semibold text-blue-800 mb-2">Formula</h5>
                <div className="bg-white rounded-md p-3 border border-blue-100">
                  <code className="text-blue-900 font-mono">
                    {calculationSteps[selectedMetric].formula}
                  </code>
                </div>
              </div>

              {/* Calculation */}
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h5 className="text-lg font-semibold text-green-800 mb-2">Calculation</h5>
                <div className="bg-white rounded-md p-3 border border-green-100">
                  <code className="text-green-900 font-mono">
                    {calculationSteps[selectedMetric].calculation}
                  </code>
                </div>
              </div>

              {/* Explanation */}
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <h5 className="text-lg font-semibold text-purple-800 mb-2">What This Means</h5>
                <p className="text-purple-900 leading-relaxed">
                  {calculationSteps[selectedMetric].explanation}
                </p>
              </div>
            </div>
            
            <div className="px-6 pb-6">
              <button
                onClick={() => setSelectedMetric(null)}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-300"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Main Component
export default function UnifiedFinanceCalculator() {
  const [results, setResults] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const handleResult = (calculationResults) => {
    setResults(calculationResults);
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const resetCalculator = () => {
    setResults(null);
    setShowResults(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <div className="bg-purple-600 p-3 rounded-full mr-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-800">Financial Metrics Calculator</h1>
              <p className="text-gray-600 mt-2">Comprehensive analysis of your business financial performance</p>
            </div>
          </div>
        </div>

        {!showResults ? (
          <>
            <FinanceForm onResult={handleResult} onSubmit={handleSubmit} />
          </>
        ) : (
          <>
            {/* Navigation */}
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={() => setShowResults(false)}
                className="flex items-center text-purple-600 hover:text-purple-700 font-medium"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Form
              </button>
              
              <div className="flex gap-4">
                <button
                  onClick={resetCalculator}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  New Calculation
                </button>
                <button
                  onClick={() => window.print()}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-lg transition-colors flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print Report
                </button>
              </div>
            </div>

            {/* Results Display */}
            {results && <ResultsDisplay results={results} type="finance" />}

            {/* Summary Statistics */}
            {results && (
              <div className="mt-8 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 to-teal-600 px-6 py-4">
                  <h3 className="text-white text-xl font-bold flex items-center">
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Performance Summary
                  </h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Profitability Summary */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-4 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        Profitability Health
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-green-700">Gross Profit:</span>
                          <span className="font-medium text-green-800">₹{results.metrics.grossProfit.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-green-700">Net Profit:</span>
                          <span className="font-medium text-green-800">₹{results.metrics.netProfit.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-green-700">Gross Margin:</span>
                          <span className="font-medium text-green-800">{results.metrics.grossMarginPercent.toFixed(2)}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Cash Flow Summary */}
                    <div className="bg-gradient-to-br from-blue-50 to-sky-100 p-4 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                        Cash Flow Health
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-blue-700">Net Cash Flow:</span>
                          <span className="font-medium text-blue-800">₹{results.metrics.netCashFlow.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-blue-700">Cash Balance:</span>
                          <span className="font-medium text-blue-800">₹{results.metrics.cashBalance.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-blue-700">Working Capital:</span>
                          <span className="font-medium text-blue-800">₹{results.metrics.netWorkingCapital.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Efficiency Summary */}
                    <div className="bg-gradient-to-br from-purple-50 to-violet-100 p-4 rounded-lg border border-purple-200">
                      <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Efficiency Metrics
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-purple-700">Inventory Turnover:</span>
                          <span className="font-medium text-purple-800">{results.metrics.inventoryTurnover.toFixed(2)}x</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-purple-700">Operating Ratio:</span>
                          <span className="font-medium text-purple-800">{results.metrics.operatingExpenseRatio.toFixed(2)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-purple-700">Growth Rate:</span>
                          <span className="font-medium text-purple-800">{results.metrics.changePercent.toFixed(2)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Key Insights */}
            {results && (
              <div className="mt-8 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
                  <h3 className="text-white text-xl font-bold flex items-center">
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Key Financial Insights
                  </h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3">Strengths</h4>
                      <ul className="space-y-2 text-sm">
                        {results.metrics.grossProfit > 0 && (
                          <li className="flex items-center text-green-700">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Positive gross profit indicates healthy core operations
                          </li>
                        )}
                        {results.metrics.netCashFlow > 0 && (
                          <li className="flex items-center text-green-700">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Positive cash flow supports business sustainability
                          </li>
                        )}
                        {results.metrics.inventoryTurnover >= 4 && (
                          <li className="flex items-center text-green-700">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Efficient inventory management with good turnover ratio
                          </li>
                        )}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3">Areas for Improvement</h4>
                      <ul className="space-y-2 text-sm">
                        {results.metrics.operatingExpenseRatio > 30 && (
                          <li className="flex items-center text-orange-700">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            Operating expenses are high relative to revenue
                          </li>
                        )}
                        {results.metrics.netProfit < 0 && (
                          <li className="flex items-center text-red-700">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            Net loss indicates need for cost reduction or revenue increase
                          </li>
                        )}
                        {results.metrics.inventoryTurnover < 4 && (
                          <li className="flex items-center text-orange-700">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            Slow inventory turnover may indicate excess stock or poor sales
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}