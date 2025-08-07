import { useState } from "react";

// Status evaluation functions for sales
const getSalesStatus = (k, val) => {
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

// Label formatting for sales
const formatSalesLabel = (key) => {
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

// Sales Form Component
function SalesForm({ onResult, onSubmit }) {
  const [salesData, setSalesData] = useState({
    totalCustomers: '',
    totalLeads: '',
    totalEnquiry: '',
    totalSales: '',
    totalMarketSpend: '',
    averageBillValue: '',
    timePeriod: '',
    timePeriodDays: '',
    leadEntryDate: '',
    conversionDate: '',
    enquiryDate: ''
  });

  const [isCalculating, setIsCalculating] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSalesData((prev) => ({ ...prev, [name]: value }));
  };

  const calculateDateDifference = (date1, date2) => {
    if (!date1 || !date2) return 0;
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return Math.abs(d2 - d1) / (1000 * 60 * 60 * 24);
  };

  const getTimePeriodDays = (period) => {
    switch(period) {
      case 'Monthly': return 30;
      case 'Quarterly': return 90;
      case 'Yearly': return 365;
      default: return parseInt(salesData.timePeriodDays) || 30;
    }
  };

  const calculateMetrics = () => {
    setIsCalculating(true);
    setTimeout(() => {
      const num = (key) => parseFloat(salesData[key]) || 0;
      
      // Calculate all metrics
      const customers = num("totalCustomers");
      const leads = num("totalLeads");
      const enquiries = num("totalEnquiry");
      const sales = num("totalSales");
      const marketSpend = num("totalMarketSpend");
      const avgBill = num("averageBillValue");

      // Conversion rates
      const leadToEnquiry = leads > 0 ? (enquiries / leads) * 100 : 0;
      const enquiryToSales = enquiries > 0 ? (sales / enquiries) * 100 : 0;
      const leadToSales = leads > 0 ? (sales / leads) * 100 : 0;

      // Financial metrics
      const revenue = sales * avgBill;
      const roi = marketSpend > 0 ? ((revenue - marketSpend) / marketSpend) * 100 : 0;
      const cac = customers > 0 ? marketSpend / customers : 0;

      // Time-based metrics
      const leadResponseTime = calculateDateDifference(salesData.leadEntryDate, salesData.enquiryDate);
      const salesCycleTime = calculateDateDifference(salesData.leadEntryDate, salesData.conversionDate);
      const enquiryToConversionTime = calculateDateDifference(salesData.enquiryDate, salesData.conversionDate);

      // Period-based metrics
      const periodDays = getTimePeriodDays(salesData.timePeriod);
      const leadsPerTimePeriod = leads / (periodDays / 30);
      const salesPerTimePeriod = sales / (periodDays / 30);

      const metrics = {
        leadToEnquiry,
        enquiryToSales,
        leadToSales,
        revenue,
        roi,
        cac,
        leadResponseTime,
        salesCycleTime,
        enquiryToConversionTime,
        leadsPerTimePeriod,
        salesPerTimePeriod
      };

      const calculationSteps = {
        leadToEnquiry: {
          formula: "Lead to Enquiry Rate = (Total Enquiries / Total Leads) × 100",
          calculation: `(${enquiries} / ${leads}) × 100 = ${leadToEnquiry.toFixed(2)}%`,
          explanation: "This shows what percentage of leads convert to enquiries, indicating the quality of your lead generation."
        },
        enquiryToSales: {
          formula: "Enquiry to Sales Rate = (Total Sales / Total Enquiries) × 100",
          calculation: `(${sales} / ${enquiries}) × 100 = ${enquiryToSales.toFixed(2)}%`,
          explanation: "This shows what percentage of enquiries convert to actual sales, reflecting your closing effectiveness."
        },
        leadToSales: {
          formula: "Lead to Sales Rate = (Total Sales / Total Leads) × 100",
          calculation: `(${sales} / ${leads}) × 100 = ${leadToSales.toFixed(2)}%`,
          explanation: "This shows the overall conversion rate from leads to sales, your complete funnel efficiency."
        },
        revenue: {
          formula: "Total Revenue = Total Sales × Average Bill Value",
          calculation: `${sales} × ${avgBill} = ₹${revenue.toFixed(2)}`,
          explanation: "This is the total revenue generated from all sales during the period."
        },
        roi: {
          formula: "ROI = ((Revenue - Marketing Spend) / Marketing Spend) × 100",
          calculation: `((${revenue.toFixed(2)} - ${marketSpend}) / ${marketSpend}) × 100 = ${roi.toFixed(2)}%`,
          explanation: "This shows the return on investment for your marketing spend, indicating campaign profitability."
        },
        cac: {
          formula: "Customer Acquisition Cost = Marketing Spend / Total Customers",
          calculation: `${marketSpend} / ${customers} = ₹${cac.toFixed(2)}`,
          explanation: "This is the average cost to acquire each customer through your marketing efforts."
        },
        leadResponseTime: {
          formula: "Lead Response Time = Enquiry Date - Lead Entry Date",
          calculation: `${leadResponseTime.toFixed(1)} days`,
          explanation: "Time taken to respond to leads after they are generated. Faster response improves conversion rates."
        },
        salesCycleTime: {
          formula: "Sales Cycle Time = Conversion Date - Lead Entry Date",
          calculation: `${salesCycleTime.toFixed(1)} days`,
          explanation: "Total time from lead generation to final sale. Shorter cycles indicate efficient sales processes."
        },
        enquiryToConversionTime: {
          formula: "Enquiry to Conversion Time = Conversion Date - Enquiry Date",
          calculation: `${enquiryToConversionTime.toFixed(1)} days`,
          explanation: "Time taken to convert enquiries to sales. This measures your sales team's closing speed."
        },
        leadsPerTimePeriod: {
          formula: "Leads per Month = Total Leads / (Period Days / 30)",
          calculation: `${leads} / (${getTimePeriodDays(salesData.timePeriod)} / 30) = ${leadsPerTimePeriod.toFixed(1)}`,
          explanation: "Average number of leads generated per month, showing your lead generation capacity."
        },
        salesPerTimePeriod: {
          formula: "Sales per Month = Total Sales / (Period Days / 30)",
          calculation: `${sales} / (${getTimePeriodDays(salesData.timePeriod)} / 30) = ${salesPerTimePeriod.toFixed(1)}`,
          explanation: "Average number of sales completed per month, indicating your sales team's productivity."
        }
      };

      onResult({ metrics, calculationSteps, inputData: salesData });
      setIsCalculating(false);
      onSubmit();
    }, 500);
  };

  const inputSections = [
    {
      title: "📊 Core Sales Data",
      fields: [
        { key: "totalCustomers", label: "Total Customers", placeholder: "150", type: "number" },
        { key: "totalLeads", label: "Total Leads", placeholder: "500", type: "number" },
        { key: "totalEnquiry", label: "Total Enquiries", placeholder: "100", type: "number" },
        { key: "totalSales", label: "Total Sales", placeholder: "25", type: "number" }
      ]
    },
    {
      title: "💰 Financial Metrics",
      fields: [
        { key: "totalMarketSpend", label: "Total Marketing Spend", placeholder: "50000.00", type: "number" },
        { key: "averageBillValue", label: "Average Bill Value", placeholder: "2000.00", type: "number" }
      ]
    },
    {
      title: "📅 Time Period Settings",
      fields: [
        { key: "timePeriod", label: "Time Period", type: "select", options: [
          { value: "", label: "Select Time Period" },
          { value: "Monthly", label: "Monthly" },
          { value: "Quarterly", label: "Quarterly" },
          { value: "Yearly", label: "Yearly" }
        ]},
        { key: "timePeriodDays", label: "Custom Period (Days)", placeholder: "30", type: "number" }
      ]
    },
    {
      title: "📆 Important Dates",
      fields: [
        { key: "leadEntryDate", label: "Lead Entry Date", type: "date" },
        { key: "enquiryDate", label: "Enquiry Date", type: "date" },
        { key: "conversionDate", label: "Conversion Date", type: "date" }
      ]
    }
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold text-purple-700 mb-6">Sales Metrics Calculator</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {inputSections.map((section) => (
          <div key={section.title} className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-4">{section.title}</h3>
            <div className="space-y-4">
              {section.fields.map(({ key, label, placeholder, type, options }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                  </label>
                  {type === "select" ? (
                    <select
                      name={key}
                      value={salesData[key]}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      {options.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  ) : type === "date" ? (
                    <input
                      type="date"
                      name={key}
                      value={salesData[key]}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  ) : type === "number" ? (
                    <div className="relative">
                      {(key === "totalMarketSpend" || key === "averageBillValue") && (
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                      )}
                      <input
                        type="number"
                        step="0.01"
                        name={key}
                        value={salesData[key]}
                        onChange={handleChange}
                        className={`w-full ${(key === "totalMarketSpend" || key === "averageBillValue") ? 'pl-8' : 'pl-3'} pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
                        placeholder={placeholder}
                      />
                    </div>
                  ) : (
                    <input
                      type={type}
                      name={key}
                      value={salesData[key]}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder={placeholder}
                    />
                  )}
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
        {isCalculating ? 'Calculating...' : 'Calculate Sales Metrics'}
      </button>
    </div>
  );
}

// Results Display Component
function ResultsDisplay({ results }) {
  const [selectedMetric, setSelectedMetric] = useState(null);
  
  const { metrics, calculationSteps, inputData } = results;

  return (
    <div className="mt-8">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4">
          <h3 className="text-white text-xl font-bold flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Sales Analysis Results
          </h3>
          <p className="text-purple-100 mt-1">Complete breakdown of your sales metrics with performance indicators</p>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Object.entries(metrics).map(([key, value]) => {
              const [statusText, statusColor] = getSalesStatus(key, value);
              const isPercentage = key.includes('Rate') || key === 'roi';
              const isTime = key.includes('Time');
              const isCurrency = key === 'revenue' || key === 'cac';
              
              let displayValue;
              if (isPercentage) {
                displayValue = `${value.toFixed(2)}%`;
              } else if (isTime) {
                displayValue = `${value.toFixed(1)} days`;
              } else if (isCurrency) {
                displayValue = `₹${value.toFixed(2)}`;
              } else {
                displayValue = value.toFixed(1);
              }
              
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
                    {formatSalesLabel(key)}
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
                  {formatSalesLabel(selectedMetric)}
                </h4>
                <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold ${
                  getSalesStatus(selectedMetric, metrics[selectedMetric])[1] === 'green' 
                    ? 'bg-green-100 text-green-800' 
                    : getSalesStatus(selectedMetric, metrics[selectedMetric])[1] === 'red' 
                    ? 'bg-red-100 text-red-800' 
                    : getSalesStatus(selectedMetric, metrics[selectedMetric])[1] === 'orange'
                    ? 'bg-orange-100 text-orange-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {getSalesStatus(selectedMetric, metrics[selectedMetric])[0]}
                </div>
              </div>

              {/* Result Value */}
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-4">
                  {(() => {
                    const value = metrics[selectedMetric];
                    const isPercentage = selectedMetric.includes('Rate') || selectedMetric === 'roi';
                    const isTime = selectedMetric.includes('Time');
                    const isCurrency = selectedMetric === 'revenue' || selectedMetric === 'cac';
                    
                    if (isPercentage) {
                      return `${value.toFixed(2)}%`;
                    } else if (isTime) {
                      return `${value.toFixed(1)} days`;
                    } else if (isCurrency) {
                      return `₹${value.toFixed(2)}`;
                    } else {
                      return value.toFixed(1);
                    }
                  })()}
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
export default function UnifiedSalesCalculator() {
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-800">Sales Metrics Calculator</h1>
              <p className="text-gray-600 mt-2">Comprehensive analysis of your sales team performance and conversion rates</p>
            </div>
          </div>
        </div>

        {!showResults ? (
          <>
            <SalesForm onResult={handleResult} onSubmit={handleSubmit} />
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
              </div>
            </div>

            {/* Results Display */}
            {results && <ResultsDisplay results={results} />}

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
                    {/* Conversion Summary */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-4 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        Conversion Health
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-green-700">Lead to Enquiry:</span>
                          <span className="font-medium text-green-800">{results.metrics.leadToEnquiry.toFixed(2)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-green-700">Enquiry to Sales:</span>
                          <span className="font-medium text-green-800">{results.metrics.enquiryToSales.toFixed(2)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-green-700">Overall Conversion:</span>
                          <span className="font-medium text-green-800">{results.metrics.leadToSales.toFixed(2)}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Revenue Summary */}
                    <div className="bg-gradient-to-br from-blue-50 to-sky-100 p-4 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                        Revenue Health
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-blue-700">Total Revenue:</span>
                          <span className="font-medium text-blue-800">₹{results.metrics.revenue.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-blue-700">Marketing ROI:</span>
                          <span className="font-medium text-blue-800">{results.metrics.roi.toFixed(2)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-blue-700">Acquisition Cost:</span>
                          <span className="font-medium text-blue-800">₹{results.metrics.cac.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Efficiency Summary */}
                    <div className="bg-gradient-to-br from-purple-50 to-violet-100 p-4 rounded-lg border border-purple-200">
                      <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Time Efficiency
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-purple-700">Lead Response:</span>
                          <span className="font-medium text-purple-800">{results.metrics.leadResponseTime.toFixed(1)} days</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-purple-700">Sales Cycle:</span>
                          <span className="font-medium text-purple-800">{results.metrics.salesCycleTime.toFixed(1)} days</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-purple-700">Leads per Month:</span>
                          <span className="font-medium text-purple-800">{results.metrics.leadsPerTimePeriod.toFixed(1)}</span>
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
                    Key Sales Insights
                  </h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3">Strengths</h4>
                      <ul className="space-y-2 text-sm">
                        {results.metrics.leadToSales >= 5 && (
                          <li className="flex items-center text-green-700">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Excellent overall conversion rate from leads to sales
                          </li>
                        )}
                        {results.metrics.roi > 100 && (
                          <li className="flex items-center text-green-700">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Strong marketing ROI indicates profitable campaigns
                          </li>
                        )}
                        {results.metrics.leadResponseTime <= 3 && (
                          <li className="flex items-center text-green-700">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Quick lead response time improves conversion chances
                          </li>
                        )}
                        {results.metrics.salesCycleTime <= 30 && (
                          <li className="flex items-center text-green-700">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Efficient sales cycle enables faster revenue generation
                          </li>
                        )}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3">Areas for Improvement</h4>
                      <ul className="space-y-2 text-sm">
                        {results.metrics.leadToEnquiry < 20 && (
                          <li className="flex items-center text-orange-700">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            Low lead to enquiry rate suggests poor lead quality or targeting
                          </li>
                        )}
                        {results.metrics.enquiryToSales < 25 && (
                          <li className="flex items-center text-red-700">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            Poor enquiry to sales conversion needs sales training focus
                          </li>
                        )}
                        {results.metrics.salesCycleTime > 60 && (
                          <li className="flex items-center text-orange-700">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            Long sales cycle may indicate complex process or objection handling issues
                          </li>
                        )}
                        {results.metrics.cac > 5000 && (
                          <li className="flex items-center text-red-700">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            High customer acquisition cost requires marketing optimization
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
