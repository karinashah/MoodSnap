let selectedMood = null;

// Handle emoji selection
document.querySelectorAll('.emoji-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    selectedMood = btn.textContent;
    document.querySelectorAll('.emoji-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
  });
});

// Function to call your Netlify sentiment function
async function analyzeSentiment(text) {
  if (!text.trim()) return "neutral";

  try {
    const response = await fetch("/.netlify/functions/sentiment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: text })
    });

    const result = await response.json();
    return result.sentiment || "neutral";
  } catch (error) {
    console.error("Sentiment analysis error:", error);
    return "neutral";
  }
}

// Handle journal submission
document.getElementById("submit-entry").addEventListener("click", async () => {
  const gratitude = document.getElementById("gratitude").value;
  const compassion = document.getElementById("compassion").value;
  const actions = document.getElementById("actions").value;
  const intention = document.getElementById("intention").value;

  if (!selectedMood) {
    alert("Please select a mood emoji before logging.");
    return;
  }

  // Analyze sentiment for each section
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

  // Show confirmation and reset UI
  const confirmation = document.getElementById("confirmation");
  confirmation.style.display = "block";
  confirmation.textContent = "🌸 Your reflection has been saved with love.";

  setTimeout(() => {
    confirmation.style.display = "none";
    document.querySelectorAll("textarea").forEach(t => t.value = "");
    selectedMood = null;
    document.querySelectorAll(".emoji-btn").forEach(btn => btn.classList.remove("selected"));
  }, 3000);
});
