let selectedMood = null;
const apiToken = "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";

// Handle emoji selection
document.querySelectorAll('.emoji-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    selectedMood = btn.textContent;
    document.querySelectorAll('.emoji-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
  });
});

// Fetch sentiment from Hugging Face API
async function analyzeSentiment(text) {
  if (!text.trim()) return "neutral";

  const response = await fetch("https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english", {
    method: "POST",
    headers: {
      "Authorization": apiToken,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ inputs: text })
  });

  const result = await response.json();
  return result[0]?.label.toLowerCase(); // 'positive' or 'negative'
}

// Handle form submission
document.getElementById("submit-entry").addEventListener("click", async () => {
  const gratitude = document.getElementById("gratitude").value;
  const compassion = document.getElementById("compassion").value;
  const actions = document.getElementById("actions").value;
  const intention = document.getElementById("intention").value;

  if (!selectedMood) {
    alert("Please select a mood emoji.");
    return;
  }

  // Analyze sentiment for each field
  const [gratSent, compSent, actSent, intentSent] = await Promise.all([
    analyzeSentiment(gratitude),
    analyzeSentiment(compassion),
    analyzeSentiment(actions),
    analyzeSentiment(intention),
  ]);

  const entry = {
    date: new Date().toISOString(),
    mood: selectedMood,
    gratitude: { text: gratitude, sentiment: gratSent },
    compassion: { text: compassion, sentiment: compSent },
    hurt_help: { text: actions, sentiment: actSent },
    intention: { text: intention, sentiment: intentSent }
  };

  // Save to localStorage
  const logs = JSON.parse(localStorage.getItem("moodsnap-entries")) || [];
  logs.push(entry);
  localStorage.setItem("moodsnap-entries", JSON.stringify(logs));

  // Show confirmation
  const confirmation = document.getElementById("confirmation");
  confirmation.style.display = "block";
  confirmation.textContent = "🌸 Your reflection has been saved with love.";
  setTimeout(() => {
    confirmation.style.display = "none";
    // Clear form
    document.querySelectorAll("textarea").forEach(t => t.value = "");
    selectedMood = null;
    document.querySelectorAll(".emoji-btn").forEach(btn => btn.classList.remove("selected"));
  }, 3000);
});
