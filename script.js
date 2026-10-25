/**
 * AFTER HOUR PARTY • SPOOKY POSTER REVEAL EXPERIENCE
 * Developed for MIT Mahaguru Institute of Technology & D CARTEL
 * Features: Zero-dependency Web Audio synthesizer, Flashlight canvas,
 * Dynamic Potion artifact, Cinema reveal, and VIP Ticket generator.
 */

// Application State
const state = {
  juniorName: '',
  rollNumber: '',
  soundEnabled: true,
  audioContext: null,
  droneGain: null,
  flashlightActive: true,
  cursor: { x: 0, y: 0, isInside: false },
  presentsTimer: null,
  isZoomed: false
};

// ==========================================================================
// 1. PROCEDURAL WEB AUDIO SYNTHESIZER (ZERO EXTERNAL ASSETS NEEDED)
// ==========================================================================

function getAudioContext() {
  if (!state.audioContext) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    state.audioContext = new AudioCtx();
  }
  if (state.audioContext.state === 'suspended') {
    state.audioContext.resume();
  }
  return state.audioContext;
}

// Background Horror Ambience Drone
function startHorrorDrone() {
  if (!state.soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (state.droneGain) return; // Already playing

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.08, ctx.currentTime);
    masterGain.connect(ctx.destination);
    state.droneGain = masterGain;

    // Sub oscillator 1 (43 Hz)
    const osc1 = ctx.createOscillator();
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(43, ctx.currentTime);

    // Sub oscillator 2 detuned (45.5 Hz)
    const osc2 = ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(45.5, ctx.currentTime);

    // Resonant Lowpass Filter
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(160, ctx.currentTime);
    filter.Q.setValueAtTime(4, ctx.currentTime);

    // Filter LFO for breathing movement
    const lfo = ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.15, ctx.currentTime);
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(60, ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(masterGain);

    osc1.start();
    osc2.start();
    lfo.start();
  } catch (e) {
    console.warn('Audio autoplay prevented or unavailable', e);
  }
}

// Heartbeat thump
function playHeartbeat() {
  if (!state.soundEnabled) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const playThump = (time, freq, vol) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.setValueAtTime(freq, time);
      osc.frequency.exponentialRampToValueAtTime(25, time + 0.16);

      gain.gain.setValueAtTime(vol, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + 0.24);
    };

    // First thump (lub)
    playThump(now, 75, 0.4);
    // Second thump (dub)
    playThump(now + 0.18, 65, 0.25);
  } catch (e) {}
}

// Metallic Blade Slash Sound
function playBladeSlash() {
  if (!state.soundEnabled) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // FM metallic scrape
    const carrier = ctx.createOscillator();
    const modulator = ctx.createOscillator();
    const modGain = ctx.createGain();
    const mainGain = ctx.createGain();

    carrier.type = 'sawtooth';
    carrier.frequency.setValueAtTime(1400, now);
    carrier.frequency.exponentialRampToValueAtTime(220, now + 0.28);

    modulator.type = 'square';
    modulator.frequency.setValueAtTime(380, now);
    modGain.gain.setValueAtTime(800, now);

    modulator.connect(modGain);
    modGain.connect(carrier.frequency);

    mainGain.gain.setValueAtTime(0.3, now);
    mainGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    carrier.connect(mainGain);
    mainGain.connect(ctx.destination);

    modulator.start(now);
    carrier.start(now);
    modulator.stop(now + 0.38);
    carrier.stop(now + 0.38);
  } catch (e) {}
}

// Thunderclap and Lightning Hit
function playThunder() {
  if (!state.soundEnabled) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Synthesize white noise buffer
    const bufferSize = ctx.sampleRate * 2.2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, now);
    filter.frequency.exponentialRampToValueAtTime(40, now + 2.0);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.7, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 2.2);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + 2.2);
  } catch (e) {}
}

// Cinema Bass Impact / Sub-boom
function playCinemaImpact() {
  if (!state.soundEnabled) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(130, now);
    osc.frequency.exponentialRampToValueAtTime(28, now + 1.2);

    gain.gain.setValueAtTime(0.85, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.6);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 1.7);
  } catch (e) {}
}

// Distant Toll of Gothic Cathedral Bell
function playChurchBell() {
  if (!state.soundEnabled) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    [220, 440, 554, 659].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.18 / (idx + 1), now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 2.6);
    });
  } catch (e) {}
}

// Visceral Procedural Jumpscare Shriek, Sub-boom & Tear
function playJumpscareAudio() {
  if (!state.soundEnabled) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // 1. Terrifying high-pitched screech (FM modulated saws)
    const saw1 = ctx.createOscillator();
    const saw2 = ctx.createOscillator();
    const screechGain = ctx.createGain();

    saw1.type = 'sawtooth';
    saw1.frequency.setValueAtTime(2200, now);
    saw1.frequency.exponentialRampToValueAtTime(700, now + 0.65);

    saw2.type = 'sawtooth';
    saw2.frequency.setValueAtTime(2450, now);
    saw2.frequency.exponentialRampToValueAtTime(780, now + 0.7);

    // Rapid vibrato LFO
    const vibrato = ctx.createOscillator();
    vibrato.frequency.setValueAtTime(50, now);
    const vibGain = ctx.createGain();
    vibGain.gain.setValueAtTime(320, now);
    vibrato.connect(vibGain);
    vibGain.connect(saw1.frequency);
    vibGain.connect(saw2.frequency);

    screechGain.gain.setValueAtTime(0.85, now);
    screechGain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

    saw1.connect(screechGain);
    saw2.connect(screechGain);
    screechGain.connect(ctx.destination);

    vibrato.start(now);
    saw1.start(now);
    saw2.start(now);
    vibrato.stop(now + 0.9);
    saw1.stop(now + 0.9);
    saw2.stop(now + 0.9);

    // 2. Heavy guttural sub-bass shockwave
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(120, now);
    subOsc.frequency.exponentialRampToValueAtTime(24, now + 1.2);

    subGain.gain.setValueAtTime(0.95, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.3);

    subOsc.connect(subGain);
    subGain.connect(ctx.destination);
    subOsc.start(now);
    subOsc.stop(now + 1.35);

    // 3. Rasping white noise screamer roar
    const bufferSize = Math.floor(ctx.sampleRate * 0.9);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.25));
    }
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(1400, now);
    noiseFilter.Q.setValueAtTime(2.2, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.8, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    noiseSource.start(now);
    noiseSource.stop(now + 0.9);
  } catch (e) {
    console.warn('Jumpscare audio could not play', e);
  }
}

// Sound Toggle Control
function toggleSound() {
  state.soundEnabled = !state.soundEnabled;
  const btn = document.getElementById('soundToggleBtn');
  const icon = btn.querySelector('.btn-icon');
  const label = btn.querySelector('.btn-label');

  if (state.soundEnabled) {
    icon.textContent = '🔊';
    label.textContent = 'SOUND: ON';
    startHorrorDrone();
    playBladeSlash();
  } else {
    icon.textContent = '🔇';
    label.textContent = 'SOUND: OFF';
    if (state.droneGain && state.audioContext) {
      state.droneGain.gain.setValueAtTime(0, state.audioContext.currentTime);
      state.droneGain = null;
    }
  }
}

// ==========================================================================
// 2. ATMOSPHERIC EMBER & DUST CANVAS PARTICLE SYSTEM
// ==========================================================================

const particleCanvas = document.getElementById('particleCanvas');
const pCtx = particleCanvas.getContext('2d');
let particles = [];

function resizeParticleCanvas() {
  particleCanvas.width = window.innerWidth;
  particleCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeParticleCanvas);
resizeParticleCanvas();

class EmberParticle {
  constructor() {
    this.reset(true);
  }
  reset(randomY = false) {
    this.x = Math.random() * particleCanvas.width;
    this.y = randomY ? Math.random() * particleCanvas.height : particleCanvas.height + 10;
    this.size = Math.random() * 2.4 + 0.6;
    this.speedY = Math.random() * 0.9 + 0.3;
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.opacity = Math.random() * 0.7 + 0.2;
    this.color = Math.random() > 0.4 ? 'rgba(230, 35, 45,' : 'rgba(255, 140, 20,';
    this.fadeSpeed = Math.random() * 0.004 + 0.002;
  }
  update() {
    this.y -= this.speedY;
    this.x += this.speedX;
    this.opacity -= this.fadeSpeed;
    if (this.y < -10 || this.opacity <= 0) {
      this.reset();
    }
  }
  draw() {
    pCtx.save();
    pCtx.beginPath();
    pCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    pCtx.fillStyle = `${this.color} ${this.opacity})`;
    pCtx.shadowBlur = 6;
    pCtx.shadowColor = 'rgba(220, 20, 20, 0.7)';
    pCtx.fill();
    pCtx.restore();
  }
}

for (let i = 0; i < 60; i++) {
  particles.push(new EmberParticle());
}

function animateParticles() {
  pCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ==========================================================================
// 3. STAGE TRANSITIONS & USER INTERROGATION LOGIC
// ==========================================================================

// Stage 1 -> Stage 2: Junior enters Name
function proceedToIdStage() {
  const nameInput = document.getElementById('juniorName');
  const name = nameInput.value.trim();

  if (!name) {
    nameInput.focus();
    return;
  }

  state.juniorName = name;
  startHorrorDrone();
  playBladeSlash();

  // Update dynamic placeholders across the app
  document.getElementById('displayNamePlaceholder').textContent = name;
  document.getElementById('labelJuniorName').textContent = name.toUpperCase();
  document.getElementById('ticketAttendee').textContent = name.toUpperCase();
  document.getElementById('admitGuestName').textContent = name.toUpperCase();

  // Switch Stages with visual transition
  document.getElementById('stage-name').classList.remove('active');
  const idStage = document.getElementById('stage-id');
  idStage.classList.add('active');

  const rollInput = document.getElementById('rollNumber');
  rollInput.focus();

  // Play subtle heartbeat
  setTimeout(playHeartbeat, 400);
}

// Stage 2 Back to Stage 1
function backToNameStage() {
  playBladeSlash();
  document.getElementById('stage-id').classList.remove('active');
  document.getElementById('stage-name').classList.add('active');
  document.getElementById('juniorName').focus();
}

// Live update potion bottle label as user types Roll Number (Format: vpeXXcs/ds/me/XXX)
const rollInput = document.getElementById('rollNumber');
rollInput.addEventListener('input', (e) => {
  let val = e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  e.target.value = val;
  const labelRoll = document.getElementById('labelRollNumber');
  labelRoll.textContent = val ? `ROLL NO: ${val}` : 'ROLL NO: ---';
});

// Stage 2 -> Stage 3: Junior enters Roll Number -> DCARTEL PRESENTS
function proceedToPresentsStage() {
  const rollVal = rollInput.value.trim();
  if (!rollVal) {
    rollInput.focus();
    return;
  }

  state.rollNumber = rollVal.toUpperCase();
  document.getElementById('ticketRoll').textContent = state.rollNumber;
  document.getElementById('admitGuestId').textContent = state.rollNumber;
  document.getElementById('ticketBarcodeNum').textContent = `MIT-DCARTEL-${state.rollNumber}`;

  // Trigger Lightning and Thunder
  triggerLightning();
  playThunder();
  playCinemaImpact();

  // Hide Stage 2, show Cinema Stage 3
  document.getElementById('stage-id').classList.remove('active');
  const cinemaStage = document.getElementById('stage-presents');
  cinemaStage.classList.add('active');

  // Trigger heartbeat loop during Cartel presentation
  playHeartbeat();
  setTimeout(playHeartbeat, 1000);
  setTimeout(playHeartbeat, 2000);

  // Auto proceed to Jump Scare after presentation timer (3.6s)
  if (state.presentsTimer) clearTimeout(state.presentsTimer);
  state.presentsTimer = setTimeout(() => {
    triggerJumpScare();
  }, 3600);
}

// Stage 3 -> Jump Scare Overlay Screamer
function triggerJumpScare() {
  if (state.presentsTimer) {
    clearTimeout(state.presentsTimer);
    state.presentsTimer = null;
  }

  const overlay = document.getElementById('jumpscareOverlay');
  if (!overlay) {
    dismissJumpscareAndRevealPoster();
    return;
  }

  overlay.classList.remove('dismissing');
  overlay.classList.add('active');
  overlay.setAttribute('aria-hidden', 'false');

  // Visceral screech and tactile vibration
  playJumpscareAudio();
  if (navigator.vibrate) {
    try { navigator.vibrate([100, 50, 200, 50, 300]); } catch (e) {}
  }
}

// Touching / Clicking Jump Scare moves the ghost away & reveals Poster in Fullscreen
let isDismissingJumpscare = false;
function dismissJumpscareAndRevealPoster() {
  if (isDismissingJumpscare) return;
  isDismissingJumpscare = true;

  const overlay = document.getElementById('jumpscareOverlay');
  if (overlay) {
    overlay.classList.add('dismissing');
  }

  // Ghost whoosh & blade slice
  playBladeSlash();

  setTimeout(() => {
    if (overlay) {
      overlay.classList.remove('active', 'dismissing');
      overlay.setAttribute('aria-hidden', 'true');
    }

    // Transition to Poster Stage
    const presentsStage = document.getElementById('stage-presents');
    if (presentsStage) presentsStage.classList.remove('active');

    const posterStage = document.getElementById('stage-poster');
    if (posterStage) posterStage.classList.add('active');

    document.body.classList.add('poster-view-active');

    // Smooth scroll to top of fullscreen poster hero
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Initialize Flashlight Spotlight
    initFlashlightCanvas();

    // Subtle atmospheric rumble
    setTimeout(playThunder, 350);

    isDismissingJumpscare = false;
  }, 350);
}

// Scroll down smoothly to VIP pass & event details
function scrollToDetails() {
  playBladeSlash();
  const target = document.getElementById('scrollDetailsSection');
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' });
  }
}

// Replay Ritual from Start
function restartExperience() {
  playBladeSlash();
  document.body.classList.remove('poster-view-active');
  const overlay = document.getElementById('jumpscareOverlay');
  if (overlay) overlay.classList.remove('active', 'dismissing');
  document.querySelectorAll('.ritual-stage').forEach(s => s.classList.remove('active'));
  document.getElementById('stage-name').classList.add('active');
  document.getElementById('juniorName').value = '';
  document.getElementById('rollNumber').value = '';
  document.getElementById('labelJuniorName').textContent = 'JUNIOR';
  document.getElementById('labelRollNumber').textContent = 'ROLL NO: ---';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Lightning Flash Utility
function triggerLightning() {
  const flash = document.getElementById('lightningFlash');
  flash.classList.add('strike');
  setTimeout(() => {
    flash.classList.remove('strike');
  }, 90);
  setTimeout(() => {
    flash.classList.add('strike');
    setTimeout(() => flash.classList.remove('strike'), 120);
  }, 160);
}

// ==========================================================================
// 4. INTERACTIVE FLASHLIGHT SPOTLIGHT CANVAS ON POSTER
// ==========================================================================

const posterFrame = document.getElementById('posterFrame');
const fCanvas = document.getElementById('flashlightCanvas');
let fCtx = null;

function initFlashlightCanvas() {
  if (!fCanvas) return;
  fCtx = fCanvas.getContext('2d');
  resizeFlashlightCanvas();
  renderFlashlight();
}

function resizeFlashlightCanvas() {
  if (!posterFrame || !fCanvas) return;
  const rect = posterFrame.getBoundingClientRect();
  fCanvas.width = rect.width;
  fCanvas.height = rect.height;
}

window.addEventListener('resize', () => {
  if (document.getElementById('stage-poster').classList.contains('active')) {
    resizeFlashlightCanvas();
  }
});

function renderFlashlight() {
  if (!fCtx || !fCanvas) return;

  fCtx.clearRect(0, 0, fCanvas.width, fCanvas.height);

  if (!state.flashlightActive) {
    // If flashlight is toggled off, no dark mask
    return;
  }

  const w = fCanvas.width;
  const h = fCanvas.height;

  // Default coordinates if cursor not moved yet (center of poster)
  const cx = state.cursor.isInside ? state.cursor.x : w * 0.5;
  const cy = state.cursor.isInside ? state.cursor.y : h * 0.35;

  // Spotlight radii (responsive to canvas size)
  const innerRadius = Math.max(35, w * 0.12);
  const outerRadius = Math.max(140, w * 0.42);

  // Fill entire poster with atmospheric darkness
  fCtx.fillStyle = 'rgba(4, 2, 3, 0.92)';
  fCtx.fillRect(0, 0, w, h);

  // Cut out flashlight beam using destination-out composite mode
  fCtx.save();
  fCtx.globalCompositeOperation = 'destination-out';

  const gradient = fCtx.createRadialGradient(cx, cy, innerRadius * 0.2, cx, cy, outerRadius);
  gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
  gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.85)');
  gradient.addColorStop(0.85, 'rgba(0, 0, 0, 0.35)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

  fCtx.fillStyle = gradient;
  fCtx.beginPath();
  fCtx.arc(cx, cy, outerRadius, 0, Math.PI * 2);
  fCtx.fill();
  fCtx.restore();

  // Subtle warm amber/crimson torch beam reflection
  fCtx.save();
  const rimGrad = fCtx.createRadialGradient(cx, cy, 0, cx, cy, outerRadius);
  rimGrad.addColorStop(0, 'rgba(255, 180, 80, 0.12)');
  rimGrad.addColorStop(0.5, 'rgba(220, 40, 40, 0.06)');
  rimGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  fCtx.fillStyle = rimGrad;
  fCtx.beginPath();
  fCtx.arc(cx, cy, outerRadius, 0, Math.PI * 2);
  fCtx.fill();
  fCtx.restore();
}

// Mouse movement over poster frame
posterFrame.addEventListener('mousemove', (e) => {
  const rect = posterFrame.getBoundingClientRect();
  state.cursor.x = e.clientX - rect.left;
  state.cursor.y = e.clientY - rect.top;
  state.cursor.isInside = true;
  renderFlashlight();
});

posterFrame.addEventListener('mouseleave', () => {
  state.cursor.isInside = false;
  renderFlashlight();
});

// Touch movement over poster frame (mobile)
posterFrame.addEventListener('touchmove', (e) => {
  if (!e.touches.length) return;
  const rect = posterFrame.getBoundingClientRect();
  state.cursor.x = e.touches[0].clientX - rect.left;
  state.cursor.y = e.touches[0].clientY - rect.top;
  state.cursor.isInside = true;
  renderFlashlight();
}, { passive: true });

posterFrame.addEventListener('touchstart', (e) => {
  const rect = posterFrame.getBoundingClientRect();
  state.cursor.x = e.touches[0].clientX - rect.left;
  state.cursor.y = e.touches[0].clientY - rect.top;
  state.cursor.isInside = true;
  renderFlashlight();
}, { passive: true });

function toggleFlashlightMode() {
  state.flashlightActive = !state.flashlightActive;
  const btn = document.getElementById('flashlightIconBtn');

  if (state.flashlightActive) {
    if (btn) btn.classList.add('active');
    playBladeSlash();
  } else {
    if (btn) btn.classList.remove('active');
  }
  renderFlashlight();
}

// Bind flashlight icon toggle
const flashlightIconBtn = document.getElementById('flashlightIconBtn');
if (flashlightIconBtn) {
  flashlightIconBtn.addEventListener('click', toggleFlashlightMode);
}

// ==========================================================================
// 5. SLASHER QUOTES & AUDIO EASTER EGGS
// ==========================================================================

const slasherData = {
  freddy: {
    name: 'Freddy Krueger',
    quote: "One, two, Freddy's coming for you... Welcome to the Seminar Hall, junior!",
    sound: () => { playBladeSlash(); setTimeout(playBladeSlash, 140); }
  },
  jason: {
    name: 'Jason Voorhees',
    quote: "Ki ki ki... ma ma ma... Camp Blood never closes its doors.",
    sound: () => { playHeartbeat(); setTimeout(playHeartbeat, 300); }
  },
  michael: {
    name: 'Michael Myers',
    quote: "*Heavy rhythmic breathing*... It's Halloween night. He has arrived.",
    sound: () => { playChurchBell(); }
  },
  ghostface: {
    name: 'Ghostface',
    quote: "Hello junior... What's your favorite scary movie? Don't hang up.",
    sound: () => { playBladeSlash(); playThunder(); }
  },
  chucky: {
    name: 'Chucky',
    quote: "Hi, I'm Chucky, your friend till the end! Hidey-ho, ha-ha-ha!",
    sound: () => { playBladeSlash(); }
  }
};

let quoteTimeout = null;

function triggerSlasherQuote(characterKey) {
  const item = slasherData[characterKey];
  if (!item) return;

  item.sound();

  const toast = document.getElementById('slasherQuoteBox');
  const text = document.getElementById('slasherQuoteText');
  text.innerHTML = `<strong>${item.name}:</strong> "${item.quote}"`;

  toast.classList.add('active');

  if (quoteTimeout) clearTimeout(quoteTimeout);
  quoteTimeout = setTimeout(() => {
    toast.classList.remove('active');
  }, 4500);
}

// ==========================================================================
// 6. VIP ADMIT PASS GENERATOR (HTML5 CANVAS EXPORT)
// ==========================================================================

// Preload D Cartel Logo for Pass Generation
const cartelTicketLogo = new Image();
cartelTicketLogo.src = 'assets/cartel_logo.png';

function generateAndDownloadPass() {
  playBladeSlash();
  const canvas = document.getElementById('ticketExportCanvas');
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  // Background Ticket Texture
  ctx.fillStyle = '#0f0a0d';
  ctx.fillRect(0, 0, w, h);

  // Double Border
  ctx.strokeStyle = '#c4151c';
  ctx.lineWidth = 4;
  ctx.strokeRect(16, 16, w - 32, h - 32);

  ctx.strokeStyle = '#e5a024';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(26, 26, w - 52, h - 52);

  // Watermark Crest
  ctx.fillStyle = 'rgba(196, 21, 28, 0.08)';
  ctx.beginPath();
  ctx.arc(w / 2, h / 2, 160, 0, Math.PI * 2);
  ctx.fill();

  // Draw D Cartel Dragon Sword Logo if loaded
  if (cartelTicketLogo.complete && cartelTicketLogo.naturalWidth > 0) {
    ctx.drawImage(cartelTicketLogo, 46, 36, 52, 62);
    ctx.drawImage(cartelTicketLogo, w - 98, 36, 52, 62);
  }

  // Header Title
  ctx.fillStyle = '#cfbeaa';
  ctx.font = 'bold 20px serif';
  ctx.textAlign = 'center';
  ctx.fillText('MAHAGURU INSTITUTE OF TECHNOLOGY', w / 2, 58);

  ctx.fillStyle = '#e6222a';
  ctx.font = 'bold 15px serif';
  ctx.fillText('⚔ HOSTED BY D CARTEL ⚔', w / 2, 82);

  ctx.fillStyle = '#f5e8d7';
  ctx.font = '900 36px serif';
  ctx.fillText('AFTER HOUR PARTY', w / 2, 122);

  ctx.fillStyle = '#b89f82';
  ctx.font = '15px monospace';
  ctx.fillText('OFFICIAL VIP SURVIVOR ADMIT PASS', w / 2, 148);

  // Divider Line
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.beginPath();
  ctx.moveTo(60, 168);
  ctx.lineTo(w - 60, 168);
  ctx.stroke();

  // Attendee Info (Left Column)
  ctx.textAlign = 'left';
  const attendee = state.juniorName ? state.juniorName.toUpperCase() : 'JUNIOR GUEST';
  const roll = state.rollNumber ? state.rollNumber.toUpperCase() : 'MIT-ROLL-666';

  ctx.fillStyle = '#8f7d6a';
  ctx.font = '14px monospace';
  ctx.fillText('HONORED GUEST:', 70, 210);
  ctx.fillStyle = '#e6222a';
  ctx.font = 'bold 26px serif';
  ctx.fillText(attendee, 70, 244);

  ctx.fillStyle = '#8f7d6a';
  ctx.font = '14px monospace';
  ctx.fillText('COLLEGE ID / ROLL NUMBER:', 70, 290);
  ctx.fillStyle = '#f0e3d2';
  ctx.font = 'bold 22px monospace';
  ctx.fillText(roll, 70, 318);

  // Event Details (Right Column)
  ctx.fillStyle = '#8f7d6a';
  ctx.font = '14px monospace';
  ctx.fillText('RITUAL DATE:', 540, 210);
  ctx.fillStyle = '#f0e3d2';
  ctx.font = 'bold 22px serif';
  ctx.fillText('28 . 10 . 2026', 540, 238);

  ctx.fillStyle = '#8f7d6a';
  ctx.font = '14px monospace';
  ctx.fillText('RITUAL VENUE:', 540, 280);
  ctx.fillStyle = '#f0e3d2';
  ctx.font = 'bold 22px serif';
  ctx.fillText('SEMINAR HALL', 540, 308);

  ctx.fillStyle = '#8f7d6a';
  ctx.font = '14px monospace';
  ctx.fillText('DOORS OPEN:', 540, 348);
  ctx.fillStyle = '#e6222a';
  ctx.font = 'bold 18px serif';
  ctx.fillText('AFTER HOURS', 540, 372);

  // Barcode representation
  ctx.fillStyle = '#cfbeaa';
  for (let x = 70; x < 450; x += 5) {
    const barWidth = (x % 3 === 0) ? 3 : 1.5;
    ctx.fillRect(x, 370, barWidth, 38);
  }
  ctx.fillStyle = '#7a6755';
  ctx.font = '12px monospace';
  ctx.fillText(`* MIT-DCARTEL-${roll}-2026 *`, 70, 428);

  // Blood Seal Stamp
  ctx.save();
  ctx.translate(w - 140, h - 85);
  ctx.rotate(-0.15);
  ctx.strokeStyle = '#c4151c';
  ctx.lineWidth = 3;
  ctx.strokeRect(-65, -25, 130, 50);
  ctx.fillStyle = '#c4151c';
  ctx.font = 'bold 13px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('HOSTED BY D CARTEL', 0, -2);
  ctx.fillText('CONFIRMED', 0, 16);
  ctx.restore();

  // Trigger File Download
  // Trigger File Download
  const link = document.createElement('a');
  link.download = `AfterHour_Pass_${attendee.replace(/\s+/g, '_')}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

// ==========================================================================
// 7. FULLSCREEN TOGGLE & INITIALIZATION
// ==========================================================================

function toggleFullscreen() {
  playBladeSlash();
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(err => {
      console.warn('Fullscreen request rejected', err);
    });
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}

document.getElementById('soundToggleBtn').addEventListener('click', toggleSound);
document.getElementById('fullscreenToggleBtn').addEventListener('click', toggleFullscreen);

// Start audio context upon first page interaction anywhere
document.addEventListener('click', () => {
  if (state.soundEnabled && !state.droneGain) {
    startHorrorDrone();
  }
}, { once: true });

document.addEventListener('keydown', () => {
  if (state.soundEnabled && !state.droneGain) {
    startHorrorDrone();
  }
}, { once: true });
