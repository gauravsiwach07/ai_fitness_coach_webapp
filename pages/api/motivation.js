
export default async function handler(req, res) {
  const { stats } = req.body;

  const prompt = `User stats: ${JSON.stringify(stats)}. Give a motivational message.`;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "mistralai/mistral-7b-instruct",
      messages: [{ role: "user", content: prompt }]
    })
  });

  const data = await response.json();
  res.json(data.choices[0].message);
}
