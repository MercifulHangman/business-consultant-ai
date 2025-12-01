import Groq from "groq-sdk";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { input } = req.body;

    const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const completion = await client.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [
        {
          role: "system",
          content:
            "You are a professional business plan generator. Produce a JSON object with fields: companyName, executiveSummary, missionStatement, objectives (array), marketAnalysis (object with targetAudience, marketSize, competitors array), swot (object of arrays), marketingStrategy, operationalPlan, financialForecast (array of {category, year1, year2, year3}), investmentRequirements (array), roiAnalysis, riskAssessment (array of {risk, mitigation, impact}). Provide values in Uzbek where possible."
        },
        {
          role: "user",
          content: JSON.stringify(input)
        }
      ],
      temperature: 0.25
    });

    // completion.choices[0].message.content typically contains the text output
    return res.status(200).json({
      plan: completion.choices[0].message.content || "{}" ?? ""
    });
  } catch (error) {
    console.error("Groq error:", error);
    return res.status(500).json({ error: "AI generation failed" });
  }
}
