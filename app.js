const parentPIN = "1234"; // change this later

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

  div.innerHTML = `
    <div class="tap-overlay">▶ Tap to Play</div>
    <iframe src="${url}&playsinline=1" playsinline></iframe>
    ${allowFavorite ? `<button class="fav-btn">⭐</button>` : ""}
  `;

  const overlay = div.querySelector(".tap-overlay");
  const iframe = div.querySelector("iframe");

  overlay.onclick = () => {
    overlay.style.display = "none";
    iframe.src += "&autoplay=1";
  };

  if (allowFavorite) {
    div.querySelector(".fav-btn").onclick = () => addFavorite(url);
  }

  return div;
}

/* Load Main Feed */
approvedVideos.forEach(url => {
  feed.appendChild(createVideo(url));
});

/* Favorites Logic */
function addFavorite(url) {
  if (!favorites.includes(url)) {
    favorites.push(url);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    alert("Added to Favorites ⭐");
  }
}

function loadFavorites() {
  favoritesFeed.innerHTML = "";
  favorites.forEach(url => {
    favoritesFeed.appendChild(createVideo(url, false));
  });
}

/* Navigation */
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

/* Parental PIN */
function unlockParent() {
  const input = document.getElementById("pinInput").value;
  const status = document.getElementById("pinStatus");

  if (input === parentPIN) {
    status.textContent = "Unlocked ✔";
  } else {
    status.textContent = "Wrong PIN ❌";
  }
}

/* Disable long press */
document.addEventListener("contextmenu", e => e.preventDefault());
