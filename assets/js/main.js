// Maxwell Fleming | Link Hub — main.js
// MOODS, PHONE, and EMAIL are injected by the 11ty template from content/home.json

const moodBox    = document.getElementById('moodBox');
const toast      = document.getElementById('toast');
const modeToggle = document.getElementById('modeToggle');
const musicToggle = document.getElementById('musicToggle');

// Fallbacks if template variables aren't present (e.g. dev preview)
const _moods = typeof MOODS !== 'undefined' ? MOODS : ['Doing great things.'];
const _phone = typeof PHONE !== 'undefined' ? PHONE : '';
const _email = typeof EMAIL !== 'undefined' ? EMAIL : '';

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove('show'), 2100);
}

document.getElementById('moodBtn').addEventListener('click', () => {
  moodBox.textContent = _moods[Math.floor(Math.random() * _moods.length)];
});

async function copyText(text, label) {
  try {
    await navigator.clipboard.writeText(text);
    showToast(label + ' copied 👍');
  } catch (e) {
    const input = document.createElement('input');
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    input.remove();
    showToast(label + ' copied 👍');
  }
}

document.getElementById('copyPhone').addEventListener('click', () => copyText(_phone, 'Phone number'));
document.getElementById('copyEmail').addEventListener('click', () => copyText(_email, 'Email'));

const modal     = document.getElementById('gracieModal');
const gracieBtn = document.getElementById('gracieBtn');
const closeModalBtn = document.getElementById('closeModal');
const boopBtn   = document.getElementById('boopBtn');

function openGracieModal()  { modal.classList.add('show'); modal.setAttribute('aria-hidden', 'false'); }
function closeGracieModal() { modal.classList.remove('show'); modal.setAttribute('aria-hidden', 'true'); }

gracieBtn.addEventListener('click', openGracieModal);
closeModalBtn.addEventListener('click', closeGracieModal);
boopBtn.addEventListener('click', () => { showToast('Gracie accepts your tribute'); closeGracieModal(); });
modal.addEventListener('click', (e) => { if (e.target === modal) closeGracieModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeGracieModal(); });

modeToggle.addEventListener('click', () => {
  const active = document.body.classList.toggle('professional');
  modeToggle.textContent = active ? '✨ Playful mode' : '💼 Professional mode';
  showToast(active ? 'Professional mode on' : 'Playful mode restored');
});

// ── Music player ─────────────────────────────────────────────────────────────
let audioCtx  = null;
let musicTimer = null;
let musicOn   = false;

function playTone(freq, start, duration, type = 'sine', gainValue = 0.03) {
  const osc  = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(gainValue, start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain).connect(audioCtx.destination);
  osc.start(start);
  osc.stop(start + duration + 0.03);
}

function scheduleLoop() {
  if (!musicOn) return;
  const now   = audioCtx.currentTime + 0.05;
  const notes = [392, 523.25, 587.33, 523.25, 392, 349.23, 392, 523.25];
  notes.forEach((n, i) => playTone(n, now + i * 0.26, 0.18, i % 2 ? 'triangle' : 'sine', 0.025));
  playTone(196, now, 2.0, 'sine', 0.012);
  musicTimer = setTimeout(scheduleLoop, 2100);
}

async function toggleMusic() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') await audioCtx.resume();
  musicOn = !musicOn;
  musicToggle.textContent = musicOn ? '🎵 Music on' : '🎵 Music off';
  musicToggle.setAttribute('aria-pressed', String(musicOn));
  showToast(musicOn ? 'Tiny chaos soundtrack enabled' : 'Music paused');
  if (musicOn) scheduleLoop();
  else clearTimeout(musicTimer);
}

musicToggle.addEventListener('click', toggleMusic);
