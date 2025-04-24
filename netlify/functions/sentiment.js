export async function handler(event) {
  const { text } = JSON.parse(event.body);
  const hf_token = process.env.HF_TOKEN;

  const response = await fetch("https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${hf_token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ inputs: text })
  });

  const data = await response.json();
  const label = data[0]?.label?.toLowerCase() || "neutral";

  return {
    statusCode: 200,
    body: JSON.stringify({ sentiment: label })
  };
}
