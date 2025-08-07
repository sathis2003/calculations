import { useState } from "react";
import Card from "./components/card";
import SalesForm from "./components/salesform";
import FinanceForm from "./components/financeform";
import ResultsPage from "./components/resluts";
import CalculationModal from "./components/calculationmodel";

export default function App() {
  const [selectedCard, setSelectedCard] = useState("");
  const [salesResult, setSalesResult] = useState(null);
  const [financeResult, setFinanceResult] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState(null);

  const handleSalesResult = (result) => {
    setSalesResult(result);
  };

  const handleFinanceResult = (result) => {
    setFinanceResult(result);
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const handleBackToDashboard = () => {
    setShowResults(false);
    setSelectedCard("");
    setSelectedMetric(null);
  };

  const handleCardClick = (metric) => {
    setSelectedMetric(metric);
  };

  const handleCloseModal = () => {
    setSelectedMetric(null);
  };

  const clearAll = () => {
    setSalesResult(null);
    setFinanceResult(null);
    setSelectedCard("");
    setShowResults(false);
    setSelectedMetric(null);
  };

  // Show results page
  if (showResults && (salesResult || financeResult)) {
    const results = salesResult || financeResult;
    const type = salesResult ? 'sales' : 'finance';
    
    return (
      <>
        <ResultsPage 
          results={results} 
          type={type} 
          onBack={handleBackToDashboard}
          onCardClick={handleCardClick}
        />
        {selectedMetric && (
          <CalculationModal
            metric={selectedMetric}
            results={results}
            type={type}
            onClose={handleCloseModal}
          />
        )}
      </>
    );
  }

  // Main dashboard
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Business Analytics Dashboard</h1>
        <p className="text-gray-600 text-lg">Choose a calculator to analyze your business metrics</p>
      </div>
      
      <div className="flex justify-center gap-8 mb-12">
        <Card title="Sales" onClick={() => setSelectedCard("sales")} />
        <Card title="Finance" onClick={() => setSelectedCard("finance")} />
      </div>
      
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow-lg">
        {selectedCard === "sales" && (
          <SalesForm onResult={handleSalesResult} onSubmit={handleSubmit} />
        )}
        {selectedCard === "finance" && (
          <FinanceForm onResult={handleFinanceResult} onSubmit={handleSubmit} />
        )}
        {!selectedCard && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-center text-gray-500 text-xl">Select a calculator to begin your analysis</p>
          </div>
        )}
        
        {selectedCard && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex justify-center gap-4">
              <button 
                onClick={clearAll}
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300"
              >
                Reset Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}