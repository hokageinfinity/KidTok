const approvedVideos = [
  // Ms Rachel (official)
  "https://www.youtube.com/embed/qXKsou9UmfY?controls=0&rel=0&modestbranding=1",

// Steve And Maggie (official)
"https://www.youtube.com/embed/1Up84ZoHQQQ?rel=0",
  
  // Danny Go (official
  "https://www.youtube.com/embed/mKgl1CiA9Qk?rel=0",
  
  // Blippi (official)
  "https://www.youtube.com/embed/5p8lP5x7Zq8?controls=0&rel=0&modestbranding=1",

  // Bluey (official clips)
  "https://www.youtube.com/embed/7l3vS8T5YIQ?controls=0&rel=0&modestbranding=1",

  // Super Why
  "https://www.youtube.com/embed/K4K9cF8mT8M?controls=0&rel=0&modestbranding=1"
];

const feed = document.getElementById("feed");

approvedVideos.forEach(url => {
  const div = document.createElement("div");
  div.className = "video";

  div.innerHTML = `
    <div class="tap-overlay">▶ Tap to Play</div>
    <iframe
      src="${url}&playsinline=1"
      allow="autoplay; encrypted-media"
      playsinline
    ></iframe>
  `;

  const overlay = div.querySelector(".tap-overlay");
  const iframe = div.querySelector("iframe");

  overlay.addEventListener("click", () => {
    overlay.style.display = "none";
    iframe.src += "&autoplay=1";
  });

  feed.appendChild(div);
});

// Disable long-press menus (kid safety)
document.addEventListener("contextmenu", e => e.preventDefault());
