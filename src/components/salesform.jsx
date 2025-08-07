import { useState } from "react";

export default function SalesForm({ onResult, onSubmit }) {
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
          explanation: "This shows what percentage of leads convert to enquiries."
        },
        enquiryToSales: {
          formula: "Enquiry to Sales Rate = (Total Sales / Total Enquiries) × 100",
          calculation: `(${sales} / ${enquiries}) × 100 = ${enquiryToSales.toFixed(2)}%`,
          explanation: "This shows what percentage of enquiries convert to actual sales."
        },
        leadToSales: {
          formula: "Lead to Sales Rate = (Total Sales / Total Leads) × 100",
          calculation: `(${sales} / ${leads}) × 100 = ${leadToSales.toFixed(2)}%`,
          explanation: "This shows the overall conversion rate from leads to sales."
        },
        revenue: {
          formula: "Total Revenue = Total Sales × Average Bill Value",
          calculation: `${sales} × ${avgBill} = ₹${revenue.toFixed(2)}`,
          explanation: "This is the total revenue generated from all sales."
        },
        roi: {
          formula: "ROI = ((Revenue - Marketing Spend) / Marketing Spend) × 100",
          calculation: `((${revenue.toFixed(2)} - ${marketSpend}) / ${marketSpend}) × 100 = ${roi.toFixed(2)}%`,
          explanation: "This shows the return on investment for marketing spend."
        },
        cac: {
          formula: "Customer Acquisition Cost = Marketing Spend / Total Customers",
          calculation: `${marketSpend} / ${customers} = ₹${cac.toFixed(2)}`,
          explanation: "This is the cost to acquire each customer."
        },
        leadResponseTime: {
          formula: "Lead Response Time = Enquiry Date - Lead Entry Date",
          calculation: `${leadResponseTime.toFixed(1)} days`,
          explanation: "Time taken to respond to leads after they are generated."
        },
        salesCycleTime: {
          formula: "Sales Cycle Time = Conversion Date - Lead Entry Date",
          calculation: `${salesCycleTime.toFixed(1)} days`,
          explanation: "Total time from lead generation to final sale."
        },
        enquiryToConversionTime: {
          formula: "Enquiry to Conversion Time = Conversion Date - Enquiry Date",
          calculation: `${enquiryToConversionTime.toFixed(1)} days`,
          explanation: "Time taken to convert enquiries to sales."
        },
        leadsPerTimePeriod: {
          formula: "Leads per Month = Total Leads / (Period Days / 30)",
          calculation: `${leads} / (${getTimePeriodDays(timePeriod)} / 30) = ${leadsPerTimePeriod.toFixed(1)}`,
          explanation: "Average number of leads generated per month."
        },
        salesPerTimePeriod: {
          formula: "Sales per Month = Total Sales / (Period Days / 30)",
          calculation: `${sales} / (${getTimePeriodDays(timePeriod)} / 30) = ${salesPerTimePeriod.toFixed(1)}`,
          explanation: "Average number of sales completed per month."
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
                  ) : (
                    <input
                      type="number"
                      step="0.01"
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