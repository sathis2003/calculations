import { useState } from "react";

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

const formatLabel = (key) => {
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

export default function SalesCalculator() {
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

  const [metrics, setMetrics] = useState(null);
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
      const {
        totalCustomers,
        totalLeads,
        totalEnquiry,
        totalSales,
        totalMarketSpend,
        averageBillValue,
        timePeriod,
        leadEntryDate,
        enquiryDate,
        conversionDate
      } = salesData;

      const customers = parseFloat(totalCustomers) || 0;
      const leads = parseFloat(totalLeads) || 0;
      const enquiries = parseFloat(totalEnquiry) || 0;
      const sales = parseFloat(totalSales) || 0;
      const marketSpend = parseFloat(totalMarketSpend) || 0;
      const avgBill = parseFloat(averageBillValue) || 0;

      // Conversion rates
      const leadToEnquiry = leads > 0 ? (enquiries / leads) * 100 : 0;
      const enquiryToSales = enquiries > 0 ? (sales / enquiries) * 100 : 0;
      const leadToSales = leads > 0 ? (sales / leads) * 100 : 0;

      // Financial metrics
      const revenue = sales * avgBill;
      const roi = marketSpend > 0 ? ((revenue - marketSpend) / marketSpend) * 100 : 0;
      const cac = customers > 0 ? marketSpend / customers : 0;

      // Time-based metrics
      const leadResponseTime = calculateDateDifference(leadEntryDate, enquiryDate);
      const salesCycleTime = calculateDateDifference(leadEntryDate, conversionDate);
      const enquiryToConversionTime = calculateDateDifference(enquiryDate, conversionDate);

      // Period-based metrics
      const periodDays = getTimePeriodDays(timePeriod);
      const leadsPerTimePeriod = leads / (periodDays / 30);
      const salesPerTimePeriod = sales / (periodDays / 30);

      setMetrics({
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
      });
      setIsCalculating(false);
    }, 500);
  };

  const clearAll = () => {
    setSalesData({
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
    setMetrics(null);
  };

  const inputSections = [
    {
      title: "📊 Core Sales Data",
      icon: "📊",
      fields: [
        { key: "totalCustomers", label: "Total Customers", placeholder: "150", type: "number" },
        { key: "totalLeads", label: "Total Leads", placeholder: "500", type: "number" },
        { key: "totalEnquiry", label: "Total Enquiries", placeholder: "100", type: "number" },
        { key: "totalSales", label: "Total Sales", placeholder: "25", type: "number" }
      ]
    },
    {
      title: "💰 Financial Metrics",
      icon: "💰",
      fields: [
        { key: "totalMarketSpend", label: "Total Marketing Spend", placeholder: "50000.00", type: "number" },
        { key: "averageBillValue", label: "Average Bill Value", placeholder: "2000.00", type: "number" }
      ]
    },
    {
      title: "📅 Time Period Settings",
      icon: "📅",
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
      icon: "📆",
      fields: [
        { key: "leadEntryDate", label: "Lead Entry Date", type: "date" },
        { key: "enquiryDate", label: "Enquiry Date", type: "date" },
        { key: "conversionDate", label: "Conversion Date", type: "date" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
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
              <p className="text-gray-600 mt-2">Complete sales performance analysis with conversion rates and ROI tracking</p>
            </div>
          </div>
        </div>

        {/* Input Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {inputSections.map((section) => (
            <div key={section.title} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-blue-600 px-6 py-4">
                <h3 className="text-white font-semibold text-lg flex items-center">
                  <span className="text-2xl mr-2">{section.icon}</span>
                  {section.title}
                </h3>
              </div>
              <div className="p-6 space-y-4">
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
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
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
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      />
                    ) : (
                      <div className="relative">
                        {key.includes('Spend') || key.includes('Value') ? (
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                        ) : null}
                        <input
                          type="number"
                          step="0.01"
                          name={key}
                          value={salesData[key]}
                          onChange={handleChange}
                          className={`w-full ${key.includes('Spend') || key.includes('Value') ? 'pl-8' : 'pl-3'} pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200`}
                          placeholder={placeholder}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <button 
            onClick={calculateMetrics}
            disabled={isCalculating}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:transform-none"
          >
            {isCalculating ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </div>
            ) : (
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Calculate Sales Metrics
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
        {metrics && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-purple-600 px-8 py-6">
              <h3 className="text-white text-2xl font-bold flex items-center">
                <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Sales Performance Analysis
              </h3>
              <p className="text-purple-100 mt-2">Complete breakdown of your sales metrics with performance indicators</p>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(metrics).map(([k, v], i) => {
                  const [txt, color] = getSalesStatus(k, v);
                  const isPercentage = k.includes('Rate') || k === 'roi';
                  const isTime = k.includes('Time');
                  const isCurrency = k === 'revenue' || k === 'cac';
                  
                  let displayValue;
                  if (isPercentage) {
                    displayValue = `${v.toFixed(2)}%`;
                  } else if (isTime) {
                    displayValue = `${v.toFixed(1)} days`;
                  } else if (isCurrency) {
                    displayValue = `₹${v.toFixed(2)}`;
                  } else {
                    displayValue = v.toFixed(1);
                  }
                  
                  return (
                    <div key={k} className={`relative bg-gradient-to-br ${
                      color === 'green' ? 'from-green-50 to-emerald-100 border-green-200' : 
                      color === 'red' ? 'from-red-50 to-rose-100 border-red-200' :
                      color === 'orange' ? 'from-orange-50 to-amber-100 border-orange-200' :
                      'from-gray-50 to-slate-100 border-gray-200'
                    } border-2 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:scale-105`}>
                      <div className="flex justify-between items-start mb-3">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                          color === 'green' ? 'bg-green-600 text-white' : 
                          color === 'red' ? 'bg-red-600 text-white' :
                          color === 'orange' ? 'bg-orange-600 text-white' :
                          'bg-gray-600 text-white'
                        }`}>
                          {i + 1}
                        </span>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                          color === 'green' ? 'bg-green-600 text-white' : 
                          color === 'red' ? 'bg-red-600 text-white' :
                          color === 'orange' ? 'bg-orange-600 text-white' :
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

              {/* Key Insights */}
              <div className="mt-8 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                <h4 className="font-bold text-yellow-800 mb-4 flex items-center text-lg">
                  <span className="text-2xl mr-2">💡</span> Key Performance Insights
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-yellow-700">
                  <div className="space-y-2">
                    <p className="flex items-center">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                      Overall conversion efficiency: <strong>{metrics.leadToSales.toFixed(2)}%</strong>
                    </p>
                    <p className="flex items-center">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                      Average sales cycle: <strong>{metrics.salesCycleTime.toFixed(1)} days</strong>
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="flex items-center">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                      Marketing ROI: <strong className={metrics.roi > 0 ? 'text-green-600' : 'text-red-600'}>{metrics.roi.toFixed(2)}%</strong>
                    </p>
                    <p className="flex items-center">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                      Cost per customer: <strong>₹{metrics.cac.toFixed(2)}</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}