export async function handler(event) {
  // Set CORS headers (allow your frontend domain or "*" for all)
  const headers = {
    "Access-Control-Allow-Origin": "https://gilded-gecko-01c126.netlify.app",  // ✅ your frontend
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
  };

  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "OK"
    };
  }

  try {
    const { text } = JSON.parse(event.body);
    if (!text || typeof text !== "string") {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Missing or invalid input" })
      };
    }

    const hf_token = process.env.HF_TOKEN;
    const response = await fetch("https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${hf_token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: text })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "Hugging Face API error", detail: errorText })
      };
    }

    const data = await response.json();
    const label = data[0]?.label?.toLowerCase() || "neutral";

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ sentiment: label })
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Internal Server Error", message: err.message })
    };
  }
}
