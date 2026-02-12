/* ===========================
   STATE
   =========================== */
const choices = {};
let quizIndex = 0;
let quizLocked = false;
let musicStarted = false;

/* ===========================
   MUSIC
   =========================== */
const bgMusic = document.getElementById('bgMusic');

function forcePlayMusic() {
  if (!bgMusic) return;
  bgMusic.volume = 0.3;
  const p = bgMusic.play();
  if (p !== undefined) {
    p.then(() => { musicStarted = true; }).catch(() => {});
  }
}

forcePlayMusic();

const musicEvents = ['click', 'touchstart', 'keydown', 'scroll', 'mousemove'];

function onFirstInteraction() {
  if (!musicStarted) forcePlayMusic();
  if (musicStarted) {
    musicEvents.forEach(evt => document.removeEventListener(evt, onFirstInteraction));
  }
}

musicEvents.forEach(evt =>
  document.addEventListener(evt, onFirstInteraction, { passive: true })
);

document.addEventListener('visibilitychange', () => {
  if (!document.hidden && !musicStarted) forcePlayMusic();
});

/* ===========================
   QUIZ DATA
   =========================== */
const quizData = [
  {
    label: 'Question 1 of 5',
    question: 'When did we meet?',
    options: ['September 7', 'September 9', 'September 12'],
    correct: 1,
    correctReveal: "You remember… that's one of the reasons I love you.",
    wrongReveal: "Close 😭 But it's September 9. And I'll never forget it.",
    allCorrect: false,
    special: false,
    bonus: false
  },
  {
    label: 'Question 2 of 5',
    question: "Who's the most beautiful girl in the world?",
    options: ['Ruhama Tekle', 'My babyyyyy', 'You'],
    correct: 2,
    correctReveal: 'Correct. That question was too easy 😌❤️',
    wrongReveal: 'Correct. That question was too easy 😌❤️',
    allCorrect: true,
    special: false,
    bonus: false
  },
  {
    label: 'Question 3 of 5',
    question: 'How many girlfriends has your boyfriend ever had?',
    options: ['2', '1', '3'],
    correct: 1,
    correctReveal: "You're my first ever girlfriend… and you'll be my last.",
    wrongReveal: "The answer is 1… You're my first ever girlfriend… and you'll be my last.",
    allCorrect: false,
    special: true,
    bonus: false
  },
  {
    label: 'Question 4 of 5',
    question: "What's my favorite desert?",
    options: ['Tiramisu', 'Cinnamon Roll', 'YOU'],
    correct: 2,
    correctReveal: "Ofc it's you baby, I already know it!!!",
    wrongReveal: "It's YOU baby!! Always has been, always will be 😌❤️",
    allCorrect: false,
    special: false,
    bonus: false
  },
  {
    label: 'Question 5 of 5',
    question: 'What kind of game night are we having?',
    options: ['Co-op (same team 🤝)', 'Competition (loser gets dared)', 'Both'],
    correct: 2,
    correctReveal: 'You + me = best team… but you better not lose',
    wrongReveal: "It's Both!! We do it all 😈 but you better not lose",
    allCorrect: false,
    special: false,
    bonus: false
  },
  {
    label: 'Bonus Round 😌',
    question: 'What do I miss the most about you?',
    options: ['Your smile', 'Your voice', 'Your laugh', 'All of the above'],
    correct: 3,
    correctReveal: 'Everything about you… I miss it all 💕',
    wrongReveal: "It's ALL of the above… I miss every single thing about you 💕",
    allCorrect: false,
    special: false,
    bonus: true
  },
  {
    label: 'Bonus Round 😌',
    question: 'Finish the line: "Cool cool cool…"',
    options: ['cool', 'cool cool', 'cool cool cool cool cool'],
    correct: 2,
    correctReveal: 'Noice 😌🔥',
    wrongReveal: "Noice 😌🔥 — it's \"cool cool cool cool cool\" btw 😏",
    allCorrect: false,
    special: false,
    bonus: true
  }
];

/* ===========================
   SCREEN TRANSITIONS
   =========================== */
function nextScreen(id, callback) {
  const current = document.querySelector('.screen.active');
  if (!current) return;

  current.classList.remove('visible');

  setTimeout(() => {
    current.classList.remove('active');
    const next = document.getElementById(id);
    next.classList.add('active');

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        next.classList.add('visible');
        if (callback) callback();
      });
    });
  }, 800);
}

/* ===========================
   SCREEN 0 — TAP TO ENTER
   =========================== */
function tapToEnter() {
  forcePlayMusic();
  nextScreen('screen1');
}

window.addEventListener('DOMContentLoaded', () => {
  const screen0 = document.getElementById('screen0');
  screen0.addEventListener('click', tapToEnter, { once: true });
  screen0.addEventListener('touchstart', tapToEnter, { once: true });

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      screen0.classList.add('visible');
    });
  });
});

/* ===========================
   VIBE PICK
   =========================== */
function pickVibe(vibe) {
  choices.dateVibe = vibe;
  nextScreen('screen3', () => setupLoveScreen('screen3', 'screen4'));
}

/* ===========================
   LOVE MESSAGE SCREENS
   =========================== */
function setupLoveScreen(currentId, nextId) {
  let advanced = false;
  const el = document.getElementById(currentId);

  function advance() {
    if (advanced) return;
    advanced = true;

    if (nextId === 'startQuiz') {
      startQuiz();
    } else {
      nextScreen(nextId, () => {
        if (nextId === 'screen4') {
          setupLoveScreen('screen4', 'startQuiz');
        }
      });
    }
  }

  el.addEventListener('click', advance, { once: true });
  setTimeout(advance, 2000);
}

/* ===========================
   QUIZ ENGINE
   =========================== */
function startQuiz() {
  quizIndex = 0;
  showQuizQuestion();
  nextScreen('screenQuiz');
}

function showQuizQuestion() {
  const q = quizData[quizIndex];
  quizLocked = false;
  const container = document.getElementById('quizContent');

  if (q.bonus && (quizIndex === 0 || !quizData[quizIndex - 1].bonus)) {
    container.innerHTML = '<h1 class="bonus-title">Bonus Round 😌</h1>';
    setTimeout(() => renderQuestion(q, container), 1500);
    return;
  }

  renderQuestion(q, container);
}

function renderQuestion(q, container) {
  const optionsHTML = q.options
    .map(
      (opt, i) =>
        `<button class="btn quiz-option" data-index="${i}" onclick="selectAnswer(${i})">${opt}</button>`
    )
    .join('');

  container.innerHTML = `
    <p class="quiz-label">${q.label}</p>
    <h2 class="quiz-question">${q.question}</h2>
    <div class="quiz-options">${optionsHTML}</div>
    <div class="quiz-reveal" id="quizReveal"></div>
  `;
}

function selectAnswer(index) {
  if (quizLocked) return;
  quizLocked = true;

  const q = quizData[quizIndex];
  const isCorrect = q.allCorrect || index === q.correct;
  const revealText = isCorrect ? q.correctReveal : q.wrongReveal;

  const buttons = document.querySelectorAll('.quiz-option');
  buttons.forEach((btn, i) => {
    if (i === index) {
      btn.classList.add(isCorrect || q.allCorrect ? 'correct' : 'wrong');
    }
    if (i === q.correct && !q.allCorrect) {
      btn.classList.add('correct');
    }
    if (i !== index && i !== q.correct) {
      btn.classList.add('disabled');
    }
  });

  if (q.special) {
    setTimeout(() => showSpecialOverlay(revealText), 600);
    return;
  }

  const reveal = document.getElementById('quizReveal');
  reveal.innerHTML = `${revealText}<span class="quiz-reveal-hint">tap to continue</span>`;
  setTimeout(() => reveal.classList.add('show'), 300);

  reveal.addEventListener('click', advanceQuiz, { once: true });
  setTimeout(() => { if (quizLocked) advanceQuiz(); }, 4000);
}

function showSpecialOverlay(text) {
  const overlay = document.getElementById('specialOverlay');
  const textEl = document.getElementById('specialOverlayText');
  textEl.textContent = text;

  overlay.classList.add('active');
  requestAnimationFrame(() => {
    requestAnimationFrame(() => { overlay.classList.add('visible'); });
  });

  let dismissed = false;
  function dismiss() {
    if (dismissed) return;
    dismissed = true;
    overlay.classList.remove('visible');
    setTimeout(() => {
      overlay.classList.remove('active');
      advanceQuiz();
    }, 800);
  }

  overlay.addEventListener('click', dismiss, { once: true });
  setTimeout(dismiss, 4000);
}

function advanceQuiz() {
  if (!quizLocked) return;
  quizIndex++;

  if (quizIndex >= quizData.length) {
    showUnlockScreen();
  } else {
    quizLocked = false;
    showQuizQuestion();
  }
}

/* ===========================
   UNLOCK SCREEN (emoji bouquet after quiz)
   =========================== */
function showUnlockScreen() {
  nextScreen('screenUnlock', () => {
    setTimeout(bloomBouquet, 1200);
  });
}

function bloomBouquet() {
  const bouquet = document.getElementById('bouquet');
  bouquet.classList.add('bloom');

  const positions = [
    { x: 50, y: 5 },  { x: 30, y: 18 }, { x: 70, y: 18 },
    { x: 15, y: 35 }, { x: 50, y: 28 }, { x: 85, y: 35 },
    { x: 25, y: 52 }, { x: 50, y: 50 }, { x: 75, y: 52 },
    { x: 35, y: 68 }, { x: 65, y: 68 }, { x: 50, y: 82 }
  ];

  positions.forEach((pos, i) => {
    const rose = document.createElement('div');
    rose.className = 'rose';
    rose.textContent = '🌹';
    rose.style.left = pos.x + '%';
    rose.style.top = pos.y + '%';
    rose.style.transform = 'translate(-50%, -50%) scale(0) rotate(-30deg)';
    bouquet.appendChild(rose);
    setTimeout(() => rose.classList.add('bloomed'), i * 150);
  });

  const totalBloomTime = positions.length * 150 + 600;
  setTimeout(() => {
    document.getElementById('bouquetCaption').classList.add('show');
  }, totalBloomTime);

  let advanced = false;
  function goToValentine() {
    if (advanced) return;
    advanced = true;
    nextScreen('screenValentine');
  }

  document.getElementById('screenUnlock').addEventListener('click', () => {
    if (document.getElementById('bouquetCaption').classList.contains('show')) {
      goToValentine();
    }
  });

  setTimeout(goToValentine, totalBloomTime + 2500);
}

/* ===========================
   VALENTINE YES / NO
   =========================== */
function sayYes() {
  heartExplosion();
  setTimeout(() => {
    buildFinalScreen();
    nextScreen('screenFinale');
  }, 800);
}

function buildFinalScreen() {
  const dateVibe = choices.dateVibe || 'the best day ever';
  document.getElementById('finalMsg').innerHTML = `
    <h1>🌹 Yay!! It's a plan! 🌹</h1>
    <div class="final-plan">
      Our vibe: <strong>${dateVibe}</strong>
    </div>
    <h2>I can't wait, Ru ❤️</h2>
    <p class="love-note">— Made with love, just for you</p>
    <button class="btn primary" style="margin-top:25px;" onclick="showBouquetGift()">I got you something… 🌹</button>
  `;
}

/* ===========================
   BOUQUET GIFT SCREEN
   =========================== */
function showBouquetGift() {
  nextScreen('screenBouquet');
}

function openEnvelope() {
  const envelope = document.getElementById('envelope');
  if (envelope.classList.contains('opening')) return;

  envelope.classList.add('opening');

  setTimeout(() => {
    nextScreen('screenLetter');
  }, 1000);
}

/* ===========================
   HEART EXPLOSION
   =========================== */
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
      left:50%; top:50%;
      font-size:${size}px;
      --x:${xDist}px; --y:${yDist}px;
      animation: explode ${duration}s ease-out forwards;
    `;
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 3000);
  }
}

/* ===========================
   FLOATING HEARTS
   =========================== */
function createFloatingHeart() {
  const emojis = ['❤️', '💕', '💗', '🌹', '✨'];
  const heart = document.createElement('div');
  heart.classList.add('heart');
  heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
  const size = Math.random() * 18 + 12;
  const left = Math.random() * 100;
  const duration = Math.random() * 5 + 5;
  heart.style.cssText = `
    left:${left}vw;
    font-size:${size}px;
    animation-duration:${duration}s;
  `;
  document.body.appendChild(heart);
  setTimeout(() => heart.remove(), duration * 1000 + 500);
}

setInterval(createFloatingHeart, 500);

/* ===========================
   NO BUTTON + YES GROWS
   =========================== */
const noBtn = document.getElementById('noBtn');
const yesBtn = document.getElementById('yesBtn');
let yesSize = 18;
let noShrink = 18;

function moveNoButton() {
  const pad = 60;
  const maxW = window.innerWidth - pad * 2;
  const maxH = window.innerHeight - pad * 2;
  const x = Math.random() * maxW + pad;
  const y = Math.random() * maxH + pad;
  noBtn.style.left = x + 'px';
  noBtn.style.top = y + 'px';

  yesSize += 3;
  yesBtn.style.fontSize = Math.min(yesSize, 50) + 'px';
  yesBtn.style.padding = `${Math.min(yesSize * 0.75, 38)}px ${Math.min(yesSize * 1.6, 80)}px`;

  if (noShrink > 10) {
    noShrink -= 1;
    noBtn.style.fontSize = noShrink + 'px';
    noBtn.style.padding = `${noShrink * 0.5}px ${noShrink}px`;
  }
}

noBtn.addEventListener('mouseover', moveNoButton);
noBtn.addEventListener('touchstart', moveNoButton, { passive: true });
noBtn.addEventListener('click', moveNoButton);