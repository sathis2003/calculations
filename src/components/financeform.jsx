import { useState } from "react";

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

const formatLabel = (key) => {
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

export default function FinanceCalculator() {
  const [f, setF] = useState({
    sellingPrice: "", cogs: "", rawMaterials: "", labour: "", otherDirectCost: "",
    totalRevenue: "", totalExpenses: "", preQuarterValue: "", currentValue: "",
    cashInflow: "", cashOutflow: "", cashInHand: "", fixedCost: "", variableCost: "",
    operatingExpenses: "", openingInventory: "", closingInventory: "", averageInventory: "",
    forecast: ""
  });

  const [results, setResults] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handle = (e) => setF({ ...f, [e.target.name]: e.target.value });

  const calc = () => {
    setIsCalculating(true);
    setTimeout(() => {
      const num = (key) => parseFloat(f[key]) || 0;
      
      // 1. Gross Profit = Selling Price - COGS
      const grossProfit = num("sellingPrice") - num("cogs");
      
      // 2. Net Profit = Total Revenue - Total Expenses  
      const netProfit = num("totalRevenue") - num("totalExpenses");
      
      // 3. Gross Margin % = (Gross Profit / Selling Price) × 100
      const grossMarginPercent = num("sellingPrice") !== 0 ? (grossProfit / num("sellingPrice")) * 100 : 0;
      
      // 4. Net Profit Margin % = (Net Profit / Total Revenue) × 100
      const netProfitMarginPercent = num("totalRevenue") !== 0 ? (netProfit / num("totalRevenue")) * 100 : 0;
      
      // 5. Total Direct Cost = Raw Materials + Labour + Other Direct Cost
      const totalDirectCost = num("rawMaterials") + num("labour") + num("otherDirectCost");
      
      // 6. Contribution Margin = Selling Price - Variable Cost
      const contributionMargin = num("sellingPrice") - num("variableCost");
      
      // 7. Operating Profit (EBIT) = Total Revenue - Operating Expenses
      const operatingProfit = num("totalRevenue") - num("operatingExpenses");
      
      // 8. Net Cash Flow = Cash Inflow - Cash Outflow
      const netCashFlow = num("cashInflow") - num("cashOutflow");
      
      // 9. Cash Balance = Cash in Hand + Net Cash Flow
      const cashBalance = num("cashInHand") + netCashFlow;
      
      // 10. COGS (Adjusted) = Opening Inventory + Total Direct Cost - Closing Inventory
      const adjustedCogs = num("openingInventory") + totalDirectCost - num("closingInventory");
      
      // 11. Inventory Turnover Ratio = COGS / Average Inventory
      const inventoryTurnover = num("averageInventory") !== 0 ? adjustedCogs / num("averageInventory") : 0;
      
      // 12. Change % Between Quarters = ((Current - Previous) / Previous) × 100
      const changePercent = num("preQuarterValue") !== 0 ? ((num("currentValue") - num("preQuarterValue")) / num("preQuarterValue")) * 100 : 0;
      
      // 13. Break-even Point (Revenue) = Fixed Cost / (Contribution Margin / Selling Price)
      const contributionMarginRatio = num("sellingPrice") !== 0 ? contributionMargin / num("sellingPrice") : 0;
      const breakEvenRevenue = contributionMarginRatio !== 0 ? num("fixedCost") / contributionMarginRatio : 0;
      
      // 14. Forecast Accuracy = |Forecast - Actual| / Actual × 100
      const forecastAccuracy = num("currentValue") !== 0 ? (Math.abs(num("forecast") - num("currentValue")) / num("currentValue")) * 100 : 0;
      
      // 15. Variable Cost % of Sales = (Variable Cost / Selling Price) × 100
      const variableCostPercent = num("sellingPrice") !== 0 ? (num("variableCost") / num("sellingPrice")) * 100 : 0;
      
      // 16. Operating Expense Ratio = (Operating Expenses / Total Revenue) × 100
      const operatingExpenseRatio = num("totalRevenue") !== 0 ? (num("operatingExpenses") / num("totalRevenue")) * 100 : 0;
      
      // 17. Inventory Value Change = Closing Inventory - Opening Inventory
      const inventoryChange = num("closingInventory") - num("openingInventory");
      
      // 18. Net Working Capital = (Cash Balance + Closing Inventory) - Current Liabilities
      const netWorkingCapital = (cashBalance + num("closingInventory")) - num("fixedCost");
      
      // 19. Total Expense = Fixed + Variable + Operating + Other Direct Costs
      const totalExpense = num("fixedCost") + num("variableCost") + num("operatingExpenses") + num("otherDirectCost");

      const calculatedResults = {
        grossProfit, netProfit, grossMarginPercent, netProfitMarginPercent,
        totalDirectCost, contributionMargin, operatingProfit, netCashFlow,
        cashBalance, adjustedCogs, inventoryTurnover, changePercent, 
        breakEvenRevenue, forecastAccuracy, variableCostPercent, 
        operatingExpenseRatio, inventoryChange, netWorkingCapital, totalExpense
      };

      setResults(calculatedResults);
      setIsCalculating(false);
    }, 500);
  };

  const clearAll = () => {
    setF({
      sellingPrice: "", cogs: "", rawMaterials: "", labour: "", otherDirectCost: "",
      totalRevenue: "", totalExpenses: "", preQuarterValue: "", currentValue: "",
      cashInflow: "", cashOutflow: "", cashInHand: "", fixedCost: "", variableCost: "",
      operatingExpenses: "", openingInventory: "", closingInventory: "", averageInventory: "",
      forecast: ""
    });
    setResults(null);
  };

  const inputSections = [
    {
      title: "💰 Revenue & Pricing",
      icon: "💰",
      fields: [
        { key: "sellingPrice", label: "Selling Price", placeholder: "100.00" },
        { key: "totalRevenue", label: "Total Revenue", placeholder: "10000.00" },
        { key: "cogs", label: "COGS (Cost of Goods Sold)", placeholder: "60.00" }
      ]
    },
    {
      title: "🏭 Production Costs",
      icon: "🏭",
      fields: [
        { key: "rawMaterials", label: "Raw Materials", placeholder: "30.00" },
        { key: "labour", label: "Labour Cost", placeholder: "20.00" },
        { key: "otherDirectCost", label: "Other Direct Cost", placeholder: "5.00" }
      ]
    },
    {
      title: "📊 Operating Expenses",
      icon: "📊",
      fields: [
        { key: "fixedCost", label: "Fixed Cost", placeholder: "1000.00" },
        { key: "variableCost", label: "Variable Cost", placeholder: "40.00" },
        { key: "operatingExpenses", label: "Operating Expenses", placeholder: "2000.00" },
        { key: "totalExpenses", label: "Total Expenses", placeholder: "8000.00" }
      ]
    },
    {
      title: "💵 Cash Flow",
      icon: "💵",
      fields: [
        { key: "cashInflow", label: "Cash Inflow", placeholder: "5000.00" },
        { key: "cashOutflow", label: "Cash Outflow", placeholder: "4500.00" },
        { key: "cashInHand", label: "Cash in Hand", placeholder: "2000.00" }
      ]
    },
    {
      title: "📦 Inventory",
      icon: "📦",
      fields: [
        { key: "openingInventory", label: "Opening Inventory", placeholder: "1500.00" },
        { key: "closingInventory", label: "Closing Inventory", placeholder: "1800.00" },
        { key: "averageInventory", label: "Average Inventory", placeholder: "1650.00" }
      ]
    },
    {
      title: "📈 Performance Tracking",
      icon: "📈",
      fields: [
        { key: "preQuarterValue", label: "Previous Quarter Value", placeholder: "9000.00" },
        { key: "currentValue", label: "Current Value", placeholder: "10000.00" },
        { key: "forecast", label: "Forecast Value", placeholder: "10500.00" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full mr-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-800">Financial Analysis Calculator</h1>
              <p className="text-gray-600 mt-2">Comprehensive financial metrics analysis for business performance</p>
            </div>
          </div>
        </div>

        {/* Input Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {inputSections.map((section) => (
            <div key={section.title} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
                <h3 className="text-white font-semibold text-lg flex items-center">
                  <span className="text-2xl mr-2">{section.icon}</span>
                  {section.title}
                </h3>
              </div>
              <div className="p-6 space-y-4">
                {section.fields.map(({ key, label, placeholder }) => (
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
                        value={f[key]}
                        onChange={handle}
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder={placeholder}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <button 
            onClick={calc}
            disabled={isCalculating}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:transform-none"
          >
            {isCalculating ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Calculating...
              </div>
            ) : (
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Calculate Metrics
              </div>
            )}
          </button>
          <button 
            onClick={clearAll}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear All
            </div>
          </button>
        </div>

        {/* Results Section */}
        {results && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-blue-600 px-8 py-6">
              <h3 className="text-white text-2xl font-bold flex items-center">
                <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Financial Analysis Results
              </h3>
              <p className="text-blue-100 mt-2">Complete breakdown of your financial metrics with performance indicators</p>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(results).map(([k, v], i) => {
                  const [txt, color] = getStatusFinance(k, v);
                  const isPercentage = k.includes('Percent') || k.includes('Ratio') || k === 'changePercent' || k === 'forecastAccuracy';
                  const displayValue = isPercentage ? `${v.toFixed(2)}%` : `₹${v.toFixed(2)}`;
                  
                  return (
                    <div key={k} className={`relative bg-gradient-to-br ${
                      color === 'green' ? 'from-green-50 to-emerald-100 border-green-200' : 
                      color === 'red' ? 'from-red-50 to-rose-100 border-red-200' : 
                      'from-gray-50 to-slate-100 border-gray-200'
                    } border-2 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:scale-105`}>
                      <div className="flex justify-between items-start mb-3">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                          color === 'green' ? 'bg-green-600 text-white' : 
                          color === 'red' ? 'bg-red-600 text-white' : 
                          'bg-gray-600 text-white'
                        }`}>
                          {i + 1}
                        </span>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                          color === 'green' ? 'bg-green-600 text-white' : 
                          color === 'red' ? 'bg-red-600 text-white' : 
                          'bg-gray-600 text-white'
                        }`}>
                          {txt}
                        </div>
                      </div>
                      <h4 className="font-semibold text-gray-800 mb-2 text-sm leading-tight">
                        {formatLabel(k)}
                      </h4>
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        {displayValue}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}