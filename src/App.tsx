import React, { useState } from "react";

type InputData = {
  industry: string;
  productService: string;
  companySize: string;
  targetMarket: string;
  mainGoals: string;
  financialInfo: string;
};

export default function App() {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<any>(null);
  const [input, setInput] = useState<InputData>({
    industry: "",
    productService: "",
    companySize: "Startup",
    targetMarket: "",
    mainGoals: "",
    financialInfo: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInput(prev => ({ ...prev, [name]: value }));
  };

  const generatePlan = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Server error");
      }

      const data = await res.json();
      // Groq returns plan as a string; if it is a JSON string, parse, otherwise keep
      try {
  const parsed = JSON.parse(data.plan);
  setPlan(parsed);
} catch (err) {
  console.error("JSON parse error:", err, data.plan);
  setPlan(data.plan);
} catch (e) {
    console.error("JSON parse error:", e, data.plan);
    alert("AI returned invalid JSON: check console");
} catch {
        setPlan(data.plan);
      }
    } catch (err) {
      console.error(err);
      alert("Server error. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Biznes Konsultant AI (Groq)</h1>

        <label className="block text-sm font-medium">Soha</label>
        <input name="industry" value={input.industry} onChange={handleChange} className="w-full mb-3 p-2 border rounded" />

        <label className="block text-sm font-medium">Mahsulot / Xizmat</label>
        <input name="productService" value={input.productService} onChange={handleChange} className="w-full mb-3 p-2 border rounded" />

        <label className="block text-sm font-medium">Kompaniya hajmi</label>
        <select name="companySize" value={input.companySize} onChange={handleChange} className="w-full mb-3 p-2 border rounded">
          <option>Startup</option>
          <option>Small</option>
          <option>Medium</option>
          <option>Large</option>
        </select>

        <label className="block text-sm font-medium">Maqsadli bozor</label>
        <input name="targetMarket" value={input.targetMarket} onChange={handleChange} className="w-full mb-3 p-2 border rounded" />

        <label className="block text-sm font-medium">Asosiy maqsadlar</label>
        <textarea name="mainGoals" value={input.mainGoals} onChange={handleChange} rows={2} className="w-full mb-3 p-2 border rounded" />

        <label className="block text-sm font-medium">Moliyaviy holat</label>
        <textarea name="financialInfo" value={input.financialInfo} onChange={handleChange} rows={2} className="w-full mb-4 p-2 border rounded" />

        <button onClick={generatePlan} disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">
          {loading ? "Generatsiya..." : "Biznes reja yaratish"}
        </button>

        {plan && (
          <div className="mt-6">
            <h2 className="font-semibold mb-2">Natija</h2>
            <pre className="bg-slate-100 p-3 rounded overflow-auto">{typeof plan === "string" ? plan : JSON.stringify(plan, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
