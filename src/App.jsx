import { useState } from "react";
import Card from "./components/card";
import SalesForm from "./components/salesform";
import FinanceForm from "./components/financeform";

export default function App() {
  const [selectedCard, setSelectedCard] = useState("");
  const [salesResult, setSalesResult] = useState(null);
  const [financeResult, setFinanceResult] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-8">Business Dashboard</h1>
      <div className="flex justify-center gap-8 mb-12">
        <Card title="Sales" onClick={() => setSelectedCard("sales")} />
        <Card title="Finance" onClick={() => setSelectedCard("finance")} />
      </div>
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow">
        {selectedCard === "sales" && (
          <SalesForm onResult={(res) => setSalesResult(res)} />
        )}
        {selectedCard === "finance" && (
          <FinanceForm onResult={(res) => setFinanceResult(res)} />
        )}
        {!selectedCard && (
          <p className="text-center text-gray-500">Select a card to begin</p>
        )}
        {salesResult && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-purple-700">
              Sales Metrics & Assessment
            </h2>
            {salesResult}
          </div>
        )}
        {financeResult && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-blue-700">
              Finance Metrics & Assessment
            </h2>
            {financeResult}
          </div>
        )}
      </div>
    </div>
  );
}
