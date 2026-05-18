const input = document.getElementById("input");
const btn = document.getElementById("sendBtn");
const layer = document.getElementById("floatingLayer");
const chime = document.getElementById("chime");
const modal = document.getElementById("introModal");
const closeModal = document.getElementById("closeModal");

window.addEventListener("load", () => {
  modal.style.display = "flex";
});

closeModal.addEventListener("click", () => {
  modal.style.opacity = "0";

  setTimeout(() => {
    modal.style.display = "none";
  }, 300);
});

function playChime() {
  if (!chime) return;

  chime.currentTime = 0;
  chime.volume = 0.5;

  const playPromise = chime.play();

  if (playPromise !== undefined) {
    playPromise.catch(() => {
      // silently fail (browser autoplay restriction)
      console.log("Audio blocked until user interaction");
    });
  }
}

function createFloatingWord(text, index = 0) {
  const el = document.createElement("div");
  el.className = "word";
  el.innerText = text;
  el.style.bottom = "12%";
  el.style.opacity = "0.95";

  const left = 10 + Math.random() * 70;
  el.style.left = left + "%";
  el.style.bottom = "10%";

  const scale = 0.9 + Math.random() * 0.4;
  el.style.transform = `scale(${scale})`;

  layer.appendChild(el);

  setTimeout(() => el.remove(), 6500);
}

btn.addEventListener("click", () => {
  const text = input.value.trim();
  if (!text) return;

  playChime();

  const chunks = text.split(/\.|,|\n/).filter(Boolean);

  chunks.forEach((chunk, i) => {
    setTimeout(() => {
      createFloatingWord(chunk.trim());
    }, i * 350);
  });

  // 🧠 store current height (Safari fix trick)
  const currentHeight = input.offsetHeight;

  // clear input
  input.value = "";

  // force Safari repaint cycle
  input.style.height = "0px";

  requestAnimationFrame(() => {
    input.style.height = currentHeight + "px";
  });

  // release focus (prevents render corruption)
  input.blur();
});

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    btn.click();
  }
});