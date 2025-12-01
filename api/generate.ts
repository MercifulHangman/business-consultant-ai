import Groq from "groq-sdk";

export default async function handler(req, res) {
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
          content: `
You are a professional business analyst.  
ALWAYS respond STRICTLY in valid JSON.  
NO explanation, NO text outside JSON, NO comments, NO markdown.  
Just return a JSON object with the business plan.
          `
        },
        { role: "user", content: JSON.stringify(input) }
      ],
      temperature: 0.3
    });

    let raw = completion.choices[0].message.content;

    // Make sure it's valid JSON
    raw = raw.trim();
    if (!raw.startsWith("{")) {
      raw = raw.substring(raw.indexOf("{"));
    }
    if (!raw.endsWith("}")) {
      raw = raw.substring(0, raw.lastIndexOf("}") + 1);
    }

    return res.status(200).json({ plan: raw });

  } catch (error) {
    console.error("Groq error:", error);
    return res.status(500).json({ error: "AI generation failed" });
  }
}
