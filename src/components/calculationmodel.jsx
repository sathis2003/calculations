import { getSalesStatus, getStatusFinance, formatSalesLabel, formatFinanceLabel } from '../utils/calculations';

export default function CalculationModal({ metric, results, type, onClose }) {
  const isFinance = type === 'finance';
  const formatLabel = isFinance ? formatFinanceLabel : formatSalesLabel;
  const getStatus = isFinance ? getStatusFinance : getSalesStatus;
  
  if (!metric || !results.calculationSteps[metric]) return null;

  const details = results.calculationSteps[metric];
  const [status, color] = getStatus(metric, results.metrics[metric]);
  const value = results.metrics[metric];

  const isPercentage = metric.includes('Percent') || metric.includes('Rate') || metric === 'roi' || metric === 'changePercent' || metric === 'forecastAccuracy';
  const isTime = metric.includes('Time');
  const isCurrency = metric === 'revenue' || metric === 'cac' || (!isPercentage && !isTime && isFinance);
  
  let displayValue;
  if (isPercentage) {
    displayValue = `${value.toFixed(2)}%`;
  } else if (isTime) {
    displayValue = `${value.toFixed(1)} days`;
  } else if (isCurrency || (!isFinance && (metric === 'revenue' || metric === 'cac'))) {
    displayValue = `₹${value.toFixed(2)}`;
  } else {
    displayValue = value.toFixed(1);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h3 className="text-white text-2xl font-bold flex items-center">
              <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Calculation Steps
            </h3>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors duration-200"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="p-8">
          <div className="space-y-6">
            {/* Metric Header */}
            <div className="text-center">
              <h4 className="text-3xl font-bold text-gray-800 mb-2">
                {formatLabel(metric)}
              </h4>
              <div className={`inline-flex items-center px-6 py-3 rounded-full text-lg font-bold ${
                color === 'green' ? 'bg-green-100 text-green-800' : 
                color === 'red' ? 'bg-red-100 text-red-800' :
                color === 'orange' ? 'bg-orange-100 text-orange-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {status}
              </div>
            </div>

            {/* Result Value */}
            <div className="text-center">
              <div className="text-5xl font-bold text-gray-900 mb-4">
                {displayValue}
              </div>
            </div>

            {/* Step-by-step Calculation */}
            <div className="space-y-4">
              {/* Formula */}
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                <h5 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
                  <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">1</span>
                  Formula
                </h5>
                <div className="bg-white rounded-lg p-4 border border-blue-100">
                  <code className="text-blue-900 font-mono text-lg">
                    {details.formula}
                  </code>
                </div>
              </div>

              {/* Calculation */}
              <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                <h5 className="text-lg font-semibold text-green-800 mb-3 flex items-center">
                  <span className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">2</span>
                  Substitution & Calculation
                </h5>
                <div className="bg-white rounded-lg p-4 border border-green-100">
                  <code className="text-green-900 font-mono text-lg">
                    {details.calculation}
                  </code>
                </div>
              </div>

              {/* Explanation */}
              <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                <h5 className="text-lg font-semibold text-purple-800 mb-3 flex items-center">
                  <span className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">3</span>
                  What This Means
                </h5>
                <p className="text-purple-900 leading-relaxed text-lg">
                  {details.explanation}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="px-8 pb-8">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}