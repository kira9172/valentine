// ===========================
// CHOICES STORAGE
// ===========================
const choices = {};

// ===========================
// SCREEN TRANSITIONS
// ===========================
function nextScreen(num) {
  const current = document.querySelector('.screen.active');
  if (!current) return;

  // Fade out current
  current.classList.remove('visible');

  setTimeout(() => {
    // Hide current
    current.classList.remove('active');

    // Show and fade in next
    const next = document.getElementById('screen' + num);
    next.classList.add('active');

    // Small delay to trigger CSS transition
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        next.classList.add('visible');
      });
    });
  }, 800);
}

// ===========================
// START EXPERIENCE
// ===========================
function startExperience() {
  // Try to play background music
  const music = document.getElementById('bgMusic');
  if (music) {
    music.volume = 0.3;
    music.play().catch(() => {
      // Autoplay blocked — that's fine
    });
  }
  nextScreen(2);
}

// ===========================
// PICK CHOICE
// ===========================
function pickChoice(key, value, nextNum) {
  choices[key] = value;
  nextScreen(nextNum);
}

// ===========================
// SAY YES — HEART EXPLOSION + FINAL SCREEN
// ===========================
function sayYes() {
  heartExplosion();

  // Slight delay so explosion is visible before transition
  setTimeout(() => {
    buildFinalScreen();
    nextScreen(5);
  }, 800);
}

function buildFinalScreen() {
  const dateVibe = choices.dateVibe || 'a perfect date';
  const treat = choices.treat || 'a sweet surprise';

  const finalMsg = document.getElementById('finalMsg');
  finalMsg.innerHTML = `
    <h1>🌹 Yay!! It's a plan! 🌹</h1>
    <div class="final-plan">
      A <strong>${dateVibe}</strong> with <strong>${treat}</strong>
    </div>
    <h2>I can't wait to see you ❤️</h2>
    <p class="love-note">— Made with love, just for you</p>
  `;
}

// ===========================
// HEART EXPLOSION
// ===========================
function heartExplosion() {
  const emojis = ['❤️', '💕', '💗', '💖', '🌹', '💘', '💝'];

  for (let i = 0; i < 70; i++) {
    const heart = document.createElement('div');
    heart.classList.add('exploding-heart');
    heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];

    const xDist = (Math.random() - 0.5) * 900;
    const yDist = (Math.random() - 0.5) * 900;
    const duration = Math.random() * 1.5 + 0.8;
    const size = Math.random() * 25 + 15;

    heart.style.cssText = `
      left: 50%;
      top: 50%;
      font-size: ${size}px;
      --x: ${xDist}px;
      --y: ${yDist}px;
      animation: explode ${duration}s ease-out forwards;
    `;

    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 3000);
  }
}

// ===========================
// FLOATING HEARTS BACKGROUND
// ===========================
function createFloatingHeart() {
  const emojis = ['❤️', '💕', '💗', '🌹', '✨'];
  const heart = document.createElement('div');
  heart.classList.add('heart');
  heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];

  const size = Math.random() * 18 + 12;
  const left = Math.random() * 100;
  const duration = Math.random() * 5 + 5;

  heart.style.cssText = `
    left: ${left}vw;
    font-size: ${size}px;
    animation-duration: ${duration}s;
  `;

  document.body.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, duration * 1000 + 500);
}

// Start floating hearts
setInterval(createFloatingHeart, 500);

// ===========================
// MOVING "NO" BUTTON + GROWING "YES" BUTTON
// ===========================
const noBtn = document.getElementById('noBtn');
const yesBtn = document.getElementById('yesBtn');

let yesSize = 18;
let noShrink = 18;

function moveNoButton() {
  // Move NO button to random position
  const padding = 80;
  const x = Math.random() * (window.innerWidth - padding * 2) + padding;
  const y = Math.random() * (window.innerHeight - padding * 2) + padding;
  noBtn.style.left = x + 'px';
  noBtn.style.top = y + 'px';

  // Grow YES button
  yesSize += 3;
  yesBtn.style.fontSize = yesSize + 'px';
  yesBtn.style.padding = `${yesSize * 0.75}px ${yesSize * 1.6}px`;

  // Shrink NO button
  if (noShrink > 10) {
    noShrink -= 1;
    noBtn.style.fontSize = noShrink + 'px';
    noBtn.style.padding = `${noShrink * 0.5}px ${noShrink * 1}px`;
  }
}

noBtn.addEventListener('mouseover', moveNoButton);
noBtn.addEventListener('touchstart', moveNoButton);
noBtn.addEventListener('click', moveNoButton);

// ===========================
// INITIAL SCREEN FADE-IN
// ===========================
window.addEventListener('DOMContentLoaded', () => {
  const firstScreen = document.getElementById('screen1');
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      firstScreen.classList.add('visible');
    });
  });
});