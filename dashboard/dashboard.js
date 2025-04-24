document.addEventListener("DOMContentLoaded", function () {
// Load entries from localStorage
const logs = JSON.parse(localStorage.getItem("moodsnap-entries")) || [];

let positiveCount = 0;
let compassionCount = 0;
let gratitudeWords = {};
let brightestDay = { date: "", score: 0 };

logs.forEach(entry => {
  // Count positive fields
  let dayScore = 0;

  if (entry.gratitude.sentiment === "positive") {
    positiveCount++;
    dayScore++;
    const words = entry.gratitude.text.toLowerCase().split(" ");
    words.forEach(w => {
      if (!gratitudeWords[w]) gratitudeWords[w] = 0;
      gratitudeWords[w]++;
    });
  }

  if (entry.compassion.sentiment === "positive") {
    positiveCount++;
    compassionCount++;
    dayScore++;
  }

  if (entry.hurt_help.sentiment === "positive") {
    positiveCount++;
    dayScore++;
  }

  if (dayScore > brightestDay.score) {
    brightestDay = {
      date: new Date(entry.date).toLocaleDateString(),
      score: dayScore
    };
  }
});

// Update UI
document.getElementById("total-positive").textContent = `${positiveCount} positive reflections`;
document.getElementById("brightest-day").textContent = brightestDay.date || "No entries yet";
document.getElementById("compassion-count").textContent = `${compassionCount} compassionate actions`;

// Show top gratitude words
const sortedWords = Object.entries(gratitudeWords)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 5); // top 5 words

const wordList = document.getElementById("gratitude-words");
sortedWords.forEach(([word, count]) => {
  const li = document.createElement("li");
  li.textContent = `${word} (${count})`;
  wordList.appendChild(li);
});
});
