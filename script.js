let selectedMood = null;

document.querySelectorAll('#emoji-buttons button').forEach(btn => {
  btn.addEventListener('click', () => {
    selectedMood = btn.textContent;
    btn.classList.add('selected');
    document.querySelectorAll('#emoji-buttons button').forEach(b => {
      if (b !== btn) b.classList.remove('selected');
    });
  });
});

document.getElementById('log-mood').addEventListener('click', () => {
  const note = document.getElementById('mood-note').value;
  const entry = {
    mood: selectedMood,
    note: note,
    date: new Date().toISOString()
  };

  const stored = JSON.parse(localStorage.getItem("moodsnap-logs")) || [];
  stored.push(entry);
  localStorage.setItem("moodsnap-logs", JSON.stringify(stored));

  document.getElementById('log-confirmation').style.display = "block";
  setTimeout(() => {
    document.getElementById('log-confirmation').style.display = "none";
    document.getElementById('mood-note').value = "";
  }, 2000);
});
