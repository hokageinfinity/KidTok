/* ---------- PIN SETUP ---------- */
let storedPIN = localStorage.getItem("parentPIN");
let disabledVideos = JSON.parse(localStorage.getItem("disabledVideos")) || [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let parentMode = false;

if (!storedPIN) {
  let newPIN = null;

  while (!newPIN) {
    newPIN = prompt("Create a Parent PIN (numbers only):");

    if (!newPIN || newPIN.trim().length < 4) {
      alert("PIN must be at least 4 digits.");
      newPIN = null;
    }
  }

  localStorage.setItem("parentPIN", newPIN.trim());
  storedPIN = newPIN.trim();
}

/* ---------- DATA ---------- */
let approvedVideos = [
  { id: "msrachel1", title: "Ms Rachel", url: "https://www.youtube.com/embed/qXKsou9UmfY?controls=0&rel=0" },
  { id: "stevemaggie1", title: "Steve and Maggie", url: "https://www.youtube.com/embed/1Up84ZoHQQQ?rel=0" },
  { id: "asmr1", title: "Coffee Jazz", url: "https://www.youtube.com/embed/e5f-EJ3rlVQ?rel=0" },
  { id: "hogi1", title: "Hogi Songs", url: "https://www.youtube.com/embed/nbsPlPQJefo?rel=0" },
  { id: "labrador1", title: "Sheriff Labrador", url: "https://www.youtube.com/embed/TPvTK-S_VR4?rel=0" },
  { id: "disneyjr1", title: "Disney Jr Farm", url: "https://www.youtube.com/embed/XOnHtStmbCI?rel=0" },
  { id: "superwhy1", title: "Super Why", url: "https://www.youtube.com/embed/vVgv_79abcE?rel=0" },
  { id: "blippi1", title: "Blippi", url: "https://www.youtube.com/embed/xhqaoYr19ZQ?rel=0" },
];

// randomize order ONLY
approvedVideos = approvedVideos.sort(() => Math.random() - 0.5);

/* ---------- ELEMENTS ---------- */
const feed = document.getElementById("feed");
const favoritesFeed = document.getElementById("favoritesFeed");

/* ---------- AUTO PAUSE OBSERVER ---------- */
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    const iframe = entry.target.querySelector("iframe");
    const overlay = entry.target.querySelector(".tap-overlay");

    if (!iframe || !overlay) return;

    if (!entry.isIntersecting) {
      iframe.src = iframe.dataset.url + "&playsinline=1";
      overlay.style.display = "flex";
    }
  });
}, { threshold: 0.6 });

/* ---------- VIDEO CARD ---------- */
function createVideo(video, allowFavorite = true) {
  const div = document.createElement("div");
  div.className = "video";

  div.innerHTML = `
    <div class="tap-overlay">▶ Tap to Play</div>
    <iframe data-url="${video.url}" src="${video.url}&playsinline=1" playsinline allow="autoplay"></iframe>
    ${allowFavorite ? `<button class="fav-btn ${favorites.includes(video.id) ? "active" : ""}">⭐</button>` : ""}
    ${parentMode ? `<button class="disable-btn">✕</button>` : ""}
  `;

  const overlay = div.querySelector(".tap-overlay");
  const iframe = div.querySelector("iframe");

  overlay.onclick = () => {
    overlay.style.display = "none";
    iframe.src = video.url + "&autoplay=1&playsinline=1";
  };

  if (allowFavorite) {
    div.querySelector(".fav-btn").onclick = () => toggleFavorite(video.id);
  }

  if (parentMode) {
    div.querySelector(".disable-btn").onclick = () => {
      if (!disabledVideos.includes(video.id)) {
        disabledVideos.push(video.id);
        localStorage.setItem("disabledVideos", JSON.stringify(disabledVideos));
        renderFeed();
      }
    };
  }

  observer.observe(div);
  return div;
}

/* ---------- FEED ---------- */
function renderFeed() {
  feed.innerHTML = "";

  approvedVideos.forEach(video => {
    if (disabledVideos.includes(video.id) && !parentMode) return;
    feed.appendChild(createVideo(video));
  });
}

/* ---------- FAVORITES ---------- */
function toggleFavorite(id) {
  favorites = favorites.includes(id)
    ? favorites.filter(v => v !== id)
    : [...favorites, id];

  localStorage.setItem("favorites", JSON.stringify(favorites));
  renderFeed();
}

/* ---------- NAV ---------- */
function unlockParent() {
  const input = document.getElementById("pinInput").value.trim();
  if (input === storedPIN) {
    parentMode = true;
    document.body.classList.add("parent-mode");
    renderFeed();
  } else {
    alert("Wrong PIN");
  }
}

function logoutParent() {
  parentMode = false;
  document.body.classList.remove("parent-mode");
  renderFeed();
}

/* ---------- SAFETY ---------- */
document.addEventListener("contextmenu", e => e.preventDefault());

/* ---------- INIT ---------- */
renderFeed();
