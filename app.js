const approvedVideos = [
  // Ms Rachel (official)
  https://www.youtube.com/embed/qXKsou9UmfY?rel=0

  // Blippi (official)
  "https://www.youtube.com/embed/5p8lP5x7Zq8?controls=0",

  // Bluey clips (official channel only)
  "https://www.youtube.com/embed/7l3vS8T5YIQ?controls=0",

  // Super Why
  "https://www.youtube.com/embed/K4K9cF8mT8M?controls=0"
];

const feed = document.getElementById("feed");

approvedVideos.forEach(url => {
  const div = document.createElement("div");
  div.className = "video";
  div.innerHTML = `<iframe src="${url}" allowfullscreen></iframe>`;
  feed.appendChild(div);
});
document.addEventListener("contextmenu", e => e.preventDefault());
