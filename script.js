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
  presentsTimer: null
};

// Audio Tracks requested by user
const jumpscareAudio = new Audio('assets/insidious_title.mp3');
jumpscareAudio.preload = 'auto';

const posterSongAudio = new Audio('assets/soulfuljamtracks-spooky-halloween-586106.mp3');
posterSongAudio.preload = 'auto';
posterSongAudio.loop = true;

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
    const posterStage = document.getElementById('stage-poster');
    if (posterStage && posterStage.classList.contains('active')) {
      posterSongAudio.play().catch(e => console.warn(e));
    } else {
      startHorrorDrone();
      playBladeSlash();
    }
  } else {
    icon.textContent = '🔇';
    label.textContent = 'SOUND: OFF';
    posterSongAudio.pause();
    jumpscareAudio.pause();
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

  // Preload audio files on user gesture
  try {
    jumpscareAudio.load();
    posterSongAudio.load();
  } catch (e) {}

  // Update dynamic placeholders across the app
  const dispName = document.getElementById('displayNamePlaceholder');
  if (dispName) dispName.textContent = name;
  const lblName = document.getElementById('labelJuniorName');
  if (lblName) lblName.textContent = name.toUpperCase();

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
  if (labelRoll) {
    labelRoll.textContent = val ? `ROLL NO: ${val}` : 'ROLL NO: ---';
  }
});

// Stage 2 -> Stage 3: Junior enters Roll Number -> DCARTEL PRESENTS
function proceedToPresentsStage() {
  const rollVal = rollInput.value.trim();
  if (!rollVal) {
    rollInput.focus();
    return;
  }

  state.rollNumber = rollVal.toUpperCase();

  // Preload audio files on user gesture
  try {
    jumpscareAudio.load();
    posterSongAudio.load();
  } catch (e) {}

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

  // Stop background drone
  if (state.droneGain && state.audioContext) {
    state.droneGain.gain.setValueAtTime(0, state.audioContext.currentTime);
    state.droneGain = null;
  }

  const overlay = document.getElementById('jumpscareOverlay');
  if (!overlay) {
    dismissJumpscareAndRevealPoster();
    return;
  }

  overlay.classList.remove('dismissing');
  overlay.classList.add('active');
  overlay.setAttribute('aria-hidden', 'false');

  // Play Insidious Title Sound requested by user
  if (state.soundEnabled) {
    try {
      jumpscareAudio.currentTime = 0;
      jumpscareAudio.volume = 1.0;
      jumpscareAudio.play().catch(e => console.warn('Jumpscare audio failed:', e));
    } catch (e) {
      console.warn(e);
    }
  }

  // Tactile vibration on mobile
  if (navigator.vibrate) {
    try { navigator.vibrate([120, 60, 240, 60, 350]); } catch (e) {}
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

  // Fade out / pause jumpscare audio swiftly
  try {
    const fadeOut = setInterval(() => {
      if (jumpscareAudio.volume > 0.15) {
        jumpscareAudio.volume -= 0.15;
      } else {
        clearInterval(fadeOut);
        jumpscareAudio.pause();
        jumpscareAudio.currentTime = 0;
      }
    }, 30);
  } catch (e) {
    jumpscareAudio.pause();
  }

  playBladeSlash();

  setTimeout(() => {
    if (overlay) {
      overlay.classList.remove('active', 'dismissing');
      overlay.setAttribute('aria-hidden', 'true');
    }

    // Transition to Fullscreen Poster Stage
    const presentsStage = document.getElementById('stage-presents');
    if (presentsStage) presentsStage.classList.remove('active');

    const posterStage = document.getElementById('stage-poster');
    if (posterStage) posterStage.classList.add('active');

    document.body.classList.add('poster-view-active');

    // Smooth scroll to top of viewport
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Play Poster Reveal Song requested by user: soulfuljamtracks-spooky-halloween-586106.mp3
    if (state.soundEnabled) {
      try {
        posterSongAudio.currentTime = 0;
        posterSongAudio.volume = 0.9;
        posterSongAudio.play().catch(e => console.warn('Poster song play failed:', e));
      } catch (e) {
        console.warn(e);
      }
    }

    isDismissingJumpscare = false;
  }, 320);
}

// Replay Ritual from Start
function restartExperience() {
  playBladeSlash();
  posterSongAudio.pause();
  posterSongAudio.currentTime = 0;
  jumpscareAudio.pause();
  jumpscareAudio.currentTime = 0;

  document.body.classList.remove('poster-view-active');
  const overlay = document.getElementById('jumpscareOverlay');
  if (overlay) overlay.classList.remove('active', 'dismissing');

  document.querySelectorAll('.ritual-stage').forEach(s => s.classList.remove('active'));
  document.getElementById('stage-name').classList.add('active');
  document.getElementById('juniorName').value = '';
  document.getElementById('rollNumber').value = '';
  const lblName = document.getElementById('labelJuniorName');
  if (lblName) lblName.textContent = 'JUNIOR';
  const lblRoll = document.getElementById('labelRollNumber');
  if (lblRoll) lblRoll.textContent = 'ROLL NO: ---';

  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (state.soundEnabled) {
    startHorrorDrone();
  }
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
// 4. FULLSCREEN TOGGLE & INITIALIZATION
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
  try {
    jumpscareAudio.load();
    posterSongAudio.load();
  } catch (e) {}
}, { once: true });

document.addEventListener('keydown', () => {
  if (state.soundEnabled && !state.droneGain) {
    startHorrorDrone();
  }
  try {
    jumpscareAudio.load();
    posterSongAudio.load();
  } catch (e) {}
}, { once: true });
