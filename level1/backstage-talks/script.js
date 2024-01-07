const backgroundColors = {
  "#issue7": "#ff608c",
  "#issue6": "#ffffff",
  "#issue5": "#02c1b5",
  "#issue4": "#ff6519",
  "#issue3": "#ffbe00",
  "#issue2": "#1e3fbb",
  "#issue1": "#e30611",
};

const keys = Object.keys(backgroundColors);
const issueLinks = document.querySelectorAll("#issues a");

function setBackgroundColor(pageId) {
  document.body.style.backgroundColor = backgroundColors[pageId];
  if (backgroundColors[pageId] === "#ffffff") {
    document.body.classList.add("white-bg");
  } else {
    document.body.classList.remove("white-bg");
  }
}

function resetStyles() {
  issueLinks[0].style.fontWeight = "bold";
  setBackgroundColor(keys[0]);
}

function scrollToPage(pageId) {
  document
    .querySelector(pageId + "-page")
    .scrollIntoView({ behavior: "smooth" });
  setBackgroundColor(pageId);
}

// Scrolling is done based on change in url hash, so hash is sent whenever we
// want to move to a page. Also id for page is not set directly to hash value,
// as in that case direct jump happens.
window.addEventListener("hashchange", () => {
  const hash = window.location.hash;
  if (hash !== "") {
    scrollToPage(hash);
    const index = keys.indexOf(hash);

    for (let issueLink of issueLinks) {
      issueLink.style.fontWeight = "normal";
    }
    issueLinks[index].style.fontWeight = "bold";
  } else {
    resetStyles();
  }
});

// Scrolling is based on time of mouse wheel action, so that it can be easily
// controlled by user.
let lastScrolledAt = Date.now();
document.body.addEventListener("wheel", (e) => {
  if (window.innerWidth <= 990) {
    return;
  }

  if (Date.now() - lastScrolledAt < 800) {
    return;
  }
  lastScrolledAt = Date.now();

  let index = 0;
  if (keys.includes(window.location.hash)) {
    index = keys.indexOf(window.location.hash);
  }

  if (e.deltaY > 0) {
    if (index + 1 < keys.length) {
      window.location.hash = keys[index + 1];
    }
  } else {
    if (index - 1 >= 0) {
      window.location.hash = keys[index - 1];
    }
  }
});

// For smaller screens, instead of mouse wheel, scrolling is manual, so need to
// handle transitions properly.
const pages = document.querySelectorAll(".page");
window.addEventListener("scroll", () => {
  if (window.innerWidth > 990) {
    return;
  }

  for (let page of pages) {
    const imgRect = page.querySelector("img").getBoundingClientRect();
    const lastPRect = page
      .querySelector("p:last-child")
      .getBoundingClientRect();

    const mid = (imgRect.top + lastPRect.bottom) / 2;
    if (mid >= 0 && mid < window.innerHeight) {
      window.location.hash = "#" + page.id.split("-")[0];
      return;
    }
  }
});

function init() {
  const originalHash = window.location.hash;
  window.location.hash = "";
  resetStyles();

  document.addEventListener("DOMContentLoaded", () => {
    window.location.hash = originalHash;
  });
}

init();
