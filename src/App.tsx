import React, { useState } from "react";

function App() {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const generatePlan = async () => {
    setLoading(true);

    const inputData = {
      industry: "IT",
      productService: "Web App",
      companySize: "Small",
      targetMarket: "Uzbekistan",
      mainGoals: "Profit & growth",
      financialInfo: "Startup budget 10k USD"
    };

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: inputData }),
      });

      if (!res.ok) {
        throw new Error("Server error");
      }

      const data = await res.json();

      try {
        const parsed = JSON.parse(data.plan);
        setPlan(parsed);
      } catch (err) {
        console.error("JSON parse error:", err, data.plan);
        setPlan(data.plan);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to generate plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Business Plan Generator</h1>

      <button onClick={generatePlan} disabled={loading}>
        {loading ? "Generating..." : "Generate Plan"}
      </button>

      {plan && (
        <pre style={{ marginTop: 20, background: "#f0f0f0", padding: 10 }}>
          {typeof plan === "string" ? plan : JSON.stringify(plan, null, 2)}
        </pre>
      )}
    </div>
  );
}

export default App;
