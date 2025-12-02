import Groq from "groq-sdk";

export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  try {
    const body = await req.json();
    const input = body.input;

    const client = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });

    const completion = await client.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [
        {
          role: "system",
          content: "You generate business plans. Return ONLY JSON."
        },
        {
          role: "user",
          content: JSON.stringify(input)
        }
      ]
    });

    return new Response(
      JSON.stringify({
        plan: completion.choices[0].message.content
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (err) {
    console.error("API error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500
    });
  }
}
