import { getSalesStatus, getStatusFinance, formatSalesLabel, formatFinanceLabel } from '../utils/calculations';

export default function ResultsPage({ results, type, onBack, onCardClick }) {
  const isFinance = type === 'finance';
  const getStatus = isFinance ? getStatusFinance : getSalesStatus;
  const formatLabel = isFinance ? formatFinanceLabel : formatSalesLabel;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 flex items-center">
              <span className="text-4xl mr-3">{isFinance ? '💰' : '📈'}</span>
              {isFinance ? 'Finance' : 'Sales'} Analysis Results
            </h1>
            <p className="text-gray-600 mt-2">Click on any metric card to see detailed calculation steps</p>
          </div>
          <button
            onClick={onBack}
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </button>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(results.metrics).map(([k, v], i) => {
            const [txt, color] = getStatus(k, v);
            const isPercentage = k.includes('Percent') || k.includes('Rate') || k === 'roi' || k === 'changePercent' || k === 'forecastAccuracy';
            const isTime = k.includes('Time');
            const isCurrency = k === 'revenue' || k === 'cac' || (!isPercentage && !isTime && isFinance);
            
            let displayValue;
            if (isPercentage) {
              displayValue = `${v.toFixed(2)}%`;
            } else if (isTime) {
              displayValue = `${v.toFixed(1)} days`;
            } else if (isCurrency || (!isFinance && (k === 'revenue' || k === 'cac'))) {
              displayValue = `₹${v.toFixed(2)}`;
            } else {
              displayValue = v.toFixed(1);
            }
            
            return (
              <div 
                key={k} 
                onClick={() => onCardClick(k)}
                className={`relative bg-gradient-to-br cursor-pointer ${
                  color === 'green' ? 'from-green-50 to-emerald-100 border-green-200' : 
                  color === 'red' ? 'from-red-50 to-rose-100 border-red-200' :
                  color === 'orange' ? 'from-orange-50 to-amber-100 border-orange-200' :
                  'from-gray-50 to-slate-100 border-gray-200'
                } border-2 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:scale-105`}
              >
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
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-gray-500">Click for calculation steps</span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
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
          {isFinance ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-yellow-700">
              <div className="space-y-2">
                <p className="flex items-center">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                  Gross Margin: <strong>{results.metrics.grossMarginPercent.toFixed(2)}%</strong>
                </p>
                <p className="flex items-center">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                  Net Profit Margin: <strong>{results.metrics.netProfitMarginPercent.toFixed(2)}%</strong>
                </p>
              </div>
              <div className="space-y-2">
                <p className="flex items-center">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                  Cash Flow: <strong className={results.metrics.netCashFlow > 0 ? 'text-green-600' : 'text-red-600'}>₹{results.metrics.netCashFlow.toFixed(2)}</strong>
                </p>
                <p className="flex items-center">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                  Operating Profit: <strong>₹{results.metrics.operatingProfit.toFixed(2)}</strong>
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-yellow-700">
              <div className="space-y-2">
                <p className="flex items-center">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                  Overall conversion efficiency: <strong>{results.metrics.leadToSales.toFixed(2)}%</strong>
                </p>
                <p className="flex items-center">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                  Average sales cycle: <strong>{results.metrics.salesCycleTime.toFixed(1)} days</strong>
                </p>
              </div>
              <div className="space-y-2">
                <p className="flex items-center">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                  Marketing ROI: <strong className={results.metrics.roi > 0 ? 'text-green-600' : 'text-red-600'}>{results.metrics.roi.toFixed(2)}%</strong>
                </p>
                <p className="flex items-center">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                  Cost per customer: <strong>₹{results.metrics.cac.toFixed(2)}</strong>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}