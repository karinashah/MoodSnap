// 🌿 MoodSnap Navigation & Theme

let pages = [
  { url: "", title: "Home" },
  { url: "dashboard/dashboard.html", title: "Dashboard" },
];

let nav = document.createElement('nav');
nav.className = "main-nav";

document.body.prepend(nav);

const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
  ? "/"
  : "/MoodSnap/";

for (let p of pages) {
  let url = p.url;
  let title = p.title;

  url = !url.startsWith('http') ? BASE_PATH + url : url;

  let a = document.createElement('a');
  a.href = url;
  a.textContent = title;
  nav.append(a);

  a.classList.toggle(
    'current',
    a.host === location.host && a.pathname === location.pathname
  );

  if (a.host !== location.host) {
    a.target = "_blank";
  }
}
