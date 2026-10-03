const sceneButtons = [...document.querySelectorAll("[data-scene]")];
const screens = [...document.querySelectorAll("[data-screen]")];
const notes = [...document.querySelectorAll("[data-note]")];
const sceneLinks = [...document.querySelectorAll(".scene-link")];
const mobileNav = document.querySelector(".mobile-nav");
const miniPlayer = document.querySelector(".mini-player");

function showScene(scene) {
  sceneButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.scene === scene);
  });

  screens.forEach((screen) => {
    screen.classList.toggle("is-visible", screen.dataset.screen === scene);
  });

  notes.forEach((note) => {
    note.classList.toggle("is-visible", note.dataset.note === scene);
  });

  const showShell = scene === "discover";
  mobileNav.hidden = !showShell;
  miniPlayer.hidden = !showShell;
}

sceneButtons.forEach((button) => {
  button.addEventListener("click", () => showScene(button.dataset.scene));
});

sceneLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    if (link.tagName === "A") event.preventDefault();
    showScene(link.dataset.target);
  });
});

document.querySelector(".follow-button")?.addEventListener("click", (event) => {
  const button = event.currentTarget;
  const following = button.classList.toggle("is-following");
  button.lastChild.textContent = following ? " Following" : " Follow";
});

document.querySelector(".save-button")?.addEventListener("click", (event) => {
  const button = event.currentTarget;
  const saved = button.textContent.trim() === "♥";
  button.textContent = saved ? "♡" : "♥";
  button.setAttribute("aria-label", saved ? "Save Night Transit" : "Remove Night Transit");
});

showScene("welcome");