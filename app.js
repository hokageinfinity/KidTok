/* ---------- PIN SETUP ---------- */
let storedPIN = localStorage.getItem("parentPIN");

if (!storedPIN) {
  storedPIN = prompt("Set a parent PIN (remember this):");
  localStorage.setItem("parentPIN", storedPIN);
}

let parentMode = false;

/* ---------- DATA ---------- */
let approvedVideos = [
  "https://www.youtube.com/embed/qXKsou9UmfY?controls=0&rel=0&modestbranding=1",
  "https://www.youtube.com/embed/1Up84ZoHQQQ?rel=0",
  "https://www.youtube.com/embed/e5f-EJ3rlVQ?rel=0",
"https://www.youtube.com/embed/nbsPlPQJefo?rel=0",
"https://www.youtube.com/embed/TPvTK-S_VR4?rel=0",
"https://www.youtube.com/embed/XOnHtStmbCI?rel=0",
"https://www.youtube.com/embed/UWIxzt1uPUc?rel=0",
"https://www.youtube.com/embed/vVgv_79abcE?rel=0",
"https://www.youtube.com/embed/zk5HGN8JXXk?rel=0",
"https://www.youtube.com/embed/sikpxhmgDj8?rel=0",
"https://www.youtube.com/embed/FadkRY895fQ?rel=0",
"https://www.youtube.com/embed/BXzxZUnhQwg?rel=0",
"https://www.youtube.com/embed/pcoNL1dblm0?rel=0",
"https://www.youtube.com/embed/xhqaoYr19ZQ?rel=0",
];

let disabledVideos = JSON.parse(localStorage.getItem("disabledVideos")) || [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

/* ---------- RANDOMIZE FEED ---------- */
approvedVideos = approvedVideos
  .filter(v => !disabledVideos.includes(v))
  .sort(() => Math.random() - 0.5);

/* ---------- ELEMENTS ---------- */
const feed = document.getElementById("feed");
const favoritesFeed = document.getElementById("favoritesFeed");

/* ---------- VIDEO CARD ---------- */
function createVideo(url, allowFavorite = true) {
  const div = document.createElement("div");
  div.className = "video";

  const isFav = favorites.includes(url);

  div.innerHTML = `
    <div class="tap-overlay">▶ Tap to Play</div>

    <iframe
      data-url="${url}"
      src="${url}&playsinline=1"
      playsinline
      allow="autoplay; encrypted-media"
    ></iframe>

    ${allowFavorite ? `<button class="fav-btn ${isFav ? "active" : ""}">⭐</button>` : ""}
    <button class="disable-btn">✕</button>
  `;

  const overlay = div.querySelector(".tap-overlay");
  const iframe = div.querySelector("iframe");
  const disableBtn = div.querySelector(".disable-btn");

  overlay.onclick = () => {
    overlay.style.display = "none";
    iframe.src = iframe.dataset.url + "&playsinline=1&autoplay=1";
  };

  if (allowFavorite) {
    div.querySelector(".fav-btn").onclick = () => toggleFavorite(url);
  }

  disableBtn.onclick = () => {
    if (!parentMode) return;
    disabledVideos.push(url);
    localStorage.setItem("disabledVideos", JSON.stringify(disabledVideos));
    div.remove();
  };

  return div;
}

/* ---------- LOAD FEED ---------- */
approvedVideos.forEach(url => {
  feed.appendChild(createVideo(url));
});

/* ---------- FAVORITES ---------- */
function toggleFavorite(url) {
  favorites = favorites.includes(url)
    ? favorites.filter(v => v !== url)
    : [...favorites, url];

  localStorage.setItem("favorites", JSON.stringify(favorites));
}

function loadFavorites() {
  favoritesFeed.innerHTML = "";
  favorites.forEach(url => {
    favoritesFeed.appendChild(createVideo(url, false));
  });
}

/* ---------- NAV ---------- */
function showFeed() {
  feed.style.display = "block";
  document.getElementById("favorites").classList.add("hidden");
  document.getElementById("parental").classList.add("hidden");
}

function showFavorites() {
  feed.style.display = "none";
  document.getElementById("favorites").classList.remove("hidden");
  document.getElementById("parental").classList.add("hidden");
  loadFavorites();
}

function showParental() {
  feed.style.display = "none";
  document.getElementById("favorites").classList.add("hidden");
  document.getElementById("parental").classList.remove("hidden");
}

/* ---------- PARENT LOGIN ---------- */
function unlockParent() {
  const input = document.getElementById("pinInput").value;
  const status = document.getElementById("pinStatus");

  if (input === storedPIN) {
    parentMode = true;
    document.body.classList.add("parent-mode");
    status.textContent = "Parental Mode Enabled";
  } else {
    status.textContent = "Wrong PIN";
  }
}

function logoutParent() {
  parentMode = false;
  document.body.classList.remove("parent-mode");
  document.getElementById("pinStatus").textContent = "Logged out";
}

/* ---------- AUTO PAUSE ---------- */
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    const iframe = entry.target.querySelector("iframe");
    const overlay = entry.target.querySelector(".tap-overlay");

    if (!entry.isIntersecting && iframe) {
      iframe.src = iframe.dataset.url + "&playsinline=1";
      overlay.style.display = "flex";
    }
  });
}, { threshold: 0.6 });

document.querySelectorAll(".video").forEach(v => observer.observe(v));

/* ---------- SAFETY ---------- */
document.addEventListener("contextmenu", e => e.preventDefault());
