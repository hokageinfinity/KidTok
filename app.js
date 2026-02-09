const parentPIN = "1234"; // change later

const approvedVideos = [
  "https://www.youtube.com/embed/qXKsou9UmfY?controls=0&rel=0&modestbranding=1",
  "https://www.youtube.com/embed/5p8lP5x7Zq8?controls=0&rel=0&modestbranding=1",
  "https://www.youtube.com/embed/7l3vS8T5YIQ?controls=0&rel=0&modestbranding=1"
];

const feed = document.getElementById("feed");
const favoritesFeed = document.getElementById("favoritesFeed");

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

/* Create Video Card */
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
  `;

  const overlay = div.querySelector(".tap-overlay");
  const iframe = div.querySelector("iframe");

  overlay.onclick = () => {
    overlay.style.display = "none";
    iframe.src = iframe.dataset.url + "&playsinline=1&autoplay=1";
  };

  if (allowFavorite) {
    const favBtn = div.querySelector(".fav-btn");
    favBtn.onclick = () => toggleFavorite(url, favBtn);
  }

  return div;
}

/* Load Feed */
approvedVideos.forEach(url => {
  feed.appendChild(createVideo(url));
});

/* FAVORITES LOGIC */
function toggleFavorite(url, btn) {
  if (favorites.includes(url)) {
    favorites = favorites.filter(v => v !== url);
    btn.classList.remove("active");
  } else {
    favorites.push(url);
    btn.classList.add("active");
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
}

/* Load Favorites Screen */
function loadFavorites() {
  favoritesFeed.innerHTML = "";
  favorites.forEach(url => {
    favoritesFeed.appendChild(createVideo(url, false));
  });
}

/* NAVIGATION */
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

/* PARENT PIN */
function unlockParent() {
  const input = document.getElementById("pinInput").value;
  const status = document.getElementById("pinStatus");

  status.textContent = input === parentPIN ? "Unlocked ✔" : "Wrong PIN ❌";
}

/* AUTO-PAUSE ON SCROLL (KEY FEATURE) */
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      const iframe = entry.target.querySelector("iframe");
      if (!iframe) return;

      if (!entry.isIntersecting) {
        // Pause by resetting src (YouTube-safe way)
        iframe.src = iframe.dataset.url + "&playsinline=1";
        entry.target.querySelector(".tap-overlay").style.display = "flex";
      }
    });
  },
  { threshold: 0.6 }
);

/* Observe all videos */
document.querySelectorAll(".video").forEach(video => {
  observer.observe(video);
});

/* Disable long press (kid safety) */
document.addEventListener("contextmenu", e => e.preventDefault());
