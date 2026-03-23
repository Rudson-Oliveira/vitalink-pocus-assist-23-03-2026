import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function analisarFrame(
  imageBase64: string,
  prompt: string
): Promise<string> {
  const response = await groq.chat.completions.create({
    model: process.env.GROQ_VISION_MODEL || "llama-3.2-90b-vision-preview",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          {
            type: "image_url",
            image_url: { url: `data:image/jpeg;base64,${imageBase64}` },
          },
        ],
      },
    ],
    temperature: 0.3,
    max_tokens: 2000,
  });
  return response.choices[0]?.message?.content || "{}";
}
