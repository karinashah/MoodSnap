// 🌿 MoodSnap Navigation & Theme

let pages = [
  { url: "", title: "Journal" },
  { url: "dashboard.html", title: "Dashboard" },
];

// 🧭 Create and insert nav bar
let nav = document.createElement('nav');
nav.classList.add('main-nav');
document.body.prepend(nav);

// 🌍 Set BASE_PATH depending on local or GitHub Pages
const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
  ? "/"
  : "/moodsnap/";  // Update if your repo name is different

// 📄 Loop through each page and create links
for (let p of pages) {
  let url = p.url;
  let title = p.title;

  url = !url.startsWith('http') ? BASE_PATH + url : url;

  let a = document.createElement('a');
  a.href = url;
  a.textContent = title;
  nav.append(a);

  // Highlight current page
  const isCurrent =
    a.host === location.host &&
    decodeURIComponent(a.pathname.replace(/\/$/, '')) ===
    decodeURIComponent(location.pathname.replace(/\/$/, ''));

  a.classList.toggle('current', isCurrent);

  // Open external links in new tab
  if (a.host !== location.host) {
    a.target = "_blank";
  }
}

// 🌗 Insert theme toggle dropdown
document.body.insertAdjacentHTML(
  'afterbegin',
  `
  <label class="color-scheme">
    Theme:
    <select>
      <option value="light dark">Automatic</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  </label>`
);

let select = document.querySelector('.color-scheme select');

function setColorScheme(colorScheme) {
  document.documentElement.classList.remove('light', 'dark', 'auto');

  if (colorScheme === 'light dark') {
    document.documentElement.classList.add('auto');
  } else {
    document.documentElement.classList.add(colorScheme);
  }

  select.value = colorScheme;
}

if ('colorScheme' in localStorage) {
  setColorScheme(localStorage.colorScheme);
} else {
  setColorScheme('light dark');
}

select.addEventListener('input', function (event) {
  localStorage.colorScheme = event.target.value;
  setColorScheme(event.target.value);
});
