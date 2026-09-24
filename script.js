// INSTRUMENT DEFINITIONS & METADATA
const instrumentsData = {
  'Crash': {
    category: 'Plato de ataque',
    image: 'assets/instrument-crash.svg',
    name: 'Crash (Plato de ataque)',
    desc: 'Plato explosivo, brillante y de ataque rápido. Se utiliza principalmente para acentuar inicios de compás, transiciones de estrofa a coro y remates intensos.',
    position: 'Espacio superior (con línea adicional)',
    limb: 'Mano derecha / baqueta',
    headType: 'Cabeza en X',
    stemDir: 'Hacia arriba',
    noteConfig: { y: 20, type: 'x', stem: 'up', ledger: 20 }
  },
  'Ride': {
    category: 'Plato de conducción',
    image: 'assets/instrument-ride.svg',
    name: 'Ride (Plato de conducción)',
    desc: 'Plato pesado y definido. Conduce el pulso continuo con un toque claro ("ping") en su cuerpo o en la campana. Muy usado en jazz, rock y baladas.',
    position: 'Quinta línea (o espacio superior)',
    limb: 'Mano derecha / baqueta',
    headType: 'Cabeza en X',
    stemDir: 'Hacia arriba',
    noteConfig: { y: 35, type: 'x', stem: 'up', ledger: null }
  },
  'Hi-hat': {
    category: 'Platos dobles de pulso',
    image: 'assets/instrument-hihat.svg',
    name: 'Hi-hat (Charles / Contratiempo)',
    desc: 'La columna vertebral del ritmo. Marca las subdivisiones del tiempo (negras, corcheas). Puede tocarse cerrado con sonido seco o abierto con sonido largo.',
    position: '5ª línea · Fa agudo en clave de Sol',
    limb: 'Mano derecha (cruzada) / baqueta',
    headType: 'Cabeza en X',
    stemDir: 'Hacia arriba',
    noteConfig: { y: 50, type: 'x', stem: 'up', ledger: null }
  },
  'Tom agudo': {
    category: 'Tambor aéreo agudo',
    image: 'assets/instrument-tom1.svg',
    name: 'Tom agudo (Tom 1)',
    desc: 'Tambor aéreo de menor diámetro y registro alto. Suele abrir los redobles melódicos y rellenos descendentes sobre la batería.',
    position: '4º espacio · Mi en clave de Sol',
    limb: 'Mano derecha o izquierda',
    headType: 'Normal (redonda)',
    stemDir: 'Hacia arriba',
    noteConfig: { y: 65, type: 'oval', stem: 'up', ledger: null }
  },
  'Tom medio': {
    category: 'Tambor aéreo medio',
    image: 'assets/instrument-tom2.svg',
    name: 'Tom medio (Tom 2)',
    desc: 'Tambor aéreo intermedio montado sobre el bombo. Proporciona el puente tímbrico entre el tom agudo y el tom de piso.',
    position: '4ª línea · Re en clave de Sol',
    limb: 'Mano derecha o izquierda',
    headType: 'Normal (redonda)',
    stemDir: 'Hacia arriba',
    noteConfig: { y: 80, type: 'oval', stem: 'up', ledger: null }
  },
  'Redoblante': {
    category: 'Tambor principal de caja',
    image: 'assets/instrument-snare.svg',
    name: 'Redoblante (Caja / Snare)',
    desc: 'El corazón del ritmo. Produce un chasquido cortante gracias a sus bordones metálicos. Marca con firmeza los tiempos 2 y 4 en compases 4/4.',
    position: '3er espacio · Do en clave de Sol',
    limb: 'Mano izquierda / baqueta',
    headType: 'Normal (redonda)',
    stemDir: 'Hacia arriba',
    noteConfig: { y: 95, type: 'oval', stem: 'up', ledger: null }
  },
  'Tom de piso': {
    category: 'Tambor grave sobre patas',
    image: 'assets/instrument-floor.svg',
    name: 'Tom de piso (Floor tom / Goliat)',
    desc: 'Tambor profundo apoyado en tres patas al piso. Proporciona peso y contundencia al final de redobles, grooves tribales y acentos graves.',
    position: '2º espacio · La en clave de Sol',
    limb: 'Mano derecha / baqueta',
    headType: 'Normal (redonda)',
    stemDir: 'Hacia arriba',
    noteConfig: { y: 125, type: 'oval', stem: 'up', ledger: null }
  },
  'Bombo': {
    category: 'Tambor grave con pedal',
    image: 'assets/instrument-kick.svg',
    name: 'Bombo (Bass drum / Kick)',
    desc: 'La base más profunda del instrumento. Sostiene la pulsación pesada del compás (tiempos 1 y 3) y dialoga directamente con la línea de bajo.',
    position: '1er espacio · Fa grave en clave de Sol',
    limb: 'Pie derecho / maza con pedal',
    headType: 'Normal (redonda)',
    stemDir: 'Hacia abajo (pies)',
    noteConfig: { y: 155, type: 'oval', stem: 'down', ledger: null }
  },
  'Hi-hat con pedal': {
    category: 'Control de pie izquierdo',
    image: 'assets/instrument-pedal.svg',
    name: 'Hi-hat con pedal (Chick)',
    desc: 'Cierre de los platos mediante la presión del pie izquierdo en el pedal. Produce un sonido seco "chick" y mantiene el pulso mientras las manos tocan el ride o redobles.',
    position: 'Debajo del pentagrama (línea adicional inferior)',
    limb: 'Pie izquierdo / pedal de hi-hat',
    headType: 'Cabeza en X',
    stemDir: 'Hacia abajo (pies)',
    noteConfig: { y: 185, type: 'x', stem: 'down', ledger: 185 }
  }
};

// WEB AUDIO SYNTHESIZER
let audioCtx = null;
let soundEnabled = true;

function initAudio() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) audioCtx = new AudioContextClass();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playDrumSound(instrumentName) {
  if (!soundEnabled) return;
  try {
    initAudio();
    if (!audioCtx) return;
    const t = audioCtx.currentTime;

    if (instrumentName === 'Bombo') {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(145, t);
      osc.frequency.exponentialRampToValueAtTime(32, t + 0.14);
      gain.gain.setValueAtTime(1.0, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(t);
      osc.stop(t + 0.35);
    } else if (instrumentName === 'Redoblante') {
      // Snare punch
      const osc = audioCtx.createOscillator();
      const oscGain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(185, t);
      osc.frequency.exponentialRampToValueAtTime(80, t + 0.08);
      oscGain.gain.setValueAtTime(0.7, t);
      oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
      osc.connect(oscGain);
      oscGain.connect(audioCtx.destination);
      osc.start(t);
      osc.stop(t + 0.15);

      // Snare noise
      const bufferSize = Math.floor(audioCtx.sampleRate * 0.22);
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, t);
      filter.Q.setValueAtTime(1.4, t);
      const noiseGain = audioCtx.createGain();
      noiseGain.gain.setValueAtTime(0.85, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(audioCtx.destination);
      noise.start(t);
      noise.stop(t + 0.22);
    } else if (instrumentName === 'Hi-hat') {
      const bufferSize = Math.floor(audioCtx.sampleRate * 0.07);
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(7500, t);
      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.65, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      noise.start(t);
      noise.stop(t + 0.07);
    } else if (instrumentName === 'Crash') {
      const bufferSize = Math.floor(audioCtx.sampleRate * 1.3);
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(5000, t);
      filter.Q.setValueAtTime(0.9, t);
      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.75, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 1.3);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      noise.start(t);
      noise.stop(t + 1.3);
    } else if (instrumentName === 'Ride') {
      // Bell ping
      const osc = audioCtx.createOscillator();
      const oscGain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(750, t);
      oscGain.gain.setValueAtTime(0.45, t);
      oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
      osc.connect(oscGain);
      oscGain.connect(audioCtx.destination);
      osc.start(t);
      osc.stop(t + 0.45);

      // Shimmer
      const bufferSize = Math.floor(audioCtx.sampleRate * 0.4);
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(6500, t);
      const noiseGain = audioCtx.createGain();
      noiseGain.gain.setValueAtTime(0.35, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(audioCtx.destination);
      noise.start(t);
      noise.stop(t + 0.4);
    } else if (instrumentName.includes('Tom')) {
      const freq = instrumentName === 'Tom agudo' ? 165 : (instrumentName === 'Tom medio' ? 125 : 85);
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.65, t + 0.22);
      gain.gain.setValueAtTime(0.85, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(t);
      osc.stop(t + 0.35);
    } else if (instrumentName === 'Hi-hat con pedal' || instrumentName === 'hh-closed') {
      const bufferSize = Math.floor(audioCtx.sampleRate * 0.08);
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(4500, t);
      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.55, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      noise.start(t);
      noise.stop(t + 0.08);
    } else if (instrumentName === 'accent') {
      // Very loud snappy snare
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, t);
      osc.frequency.exponentialRampToValueAtTime(90, t + 0.08);
      gain.gain.setValueAtTime(1.0, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(t);
      osc.stop(t + 0.18);

      const bufferSize = Math.floor(audioCtx.sampleRate * 0.25);
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1600, t);
      const noiseGain = audioCtx.createGain();
      noiseGain.gain.setValueAtTime(1.0, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(audioCtx.destination);
      noise.start(t);
      noise.stop(t + 0.25);
    } else if (instrumentName === 'ghost') {
      // Quiet snare tap
      const bufferSize = Math.floor(audioCtx.sampleRate * 0.08);
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1100, t);
      const noiseGain = audioCtx.createGain();
      noiseGain.gain.setValueAtTime(0.18, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(audioCtx.destination);
      noise.start(t);
      noise.stop(t + 0.08);
    } else if (instrumentName === 'hh-open') {
      // Sizzling open hi-hat
      const bufferSize = Math.floor(audioCtx.sampleRate * 0.45);
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(6000, t);
      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.65, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      noise.start(t);
      noise.stop(t + 0.45);
    }
  } catch (err) {
    console.warn('Audio playback error:', err);
  }
}

// SOUND TOGGLE CONTROL
const soundToggle = document.getElementById('soundToggle');
const soundIcon = document.getElementById('soundIcon');
const soundLabel = document.getElementById('soundLabel');

soundToggle.addEventListener('click', () => {
  soundEnabled = !soundEnabled;
  if (soundEnabled) {
    soundIcon.textContent = '🔊';
    soundLabel.textContent = 'Audio activado';
    initAudio();
  } else {
    soundIcon.textContent = '🔇';
    soundLabel.textContent = 'Audio silenciado';
  }
});

// NAVIGATION TABS & PROGRESS
const tabs = document.querySelectorAll('.tab');
const sections = document.querySelectorAll('.section');
const progressText = document.getElementById('progressText');
const progressBar = document.getElementById('progressBar');

let visitedSections = new Set(['mapa']);
let totalExercisesAnswered = 0;
let correctStreak = 0;

function updateProgress() {
  const base = visitedSections.size * 20;
  const quizBonus = Math.min(completedExercises.size * 5, 40);
  const totalVal = Math.min(base + quizBonus, 100);
  progressText.textContent = totalVal + '%';
  progressBar.style.width = totalVal + '%';
}

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    sections.forEach(s => s.classList.remove('active'));

    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    const targetSection = document.getElementById(tab.dataset.section);
    if (targetSection) targetSection.classList.add('active');

    visitedSections.add(tab.dataset.section);
    updateProgress();
  });
});

// EXPLORER SELECTION & STAFF INTERACTION
let currentInstrument = 'Redoblante';

function selectInstrument(name, playSound = true) {
  const data = instrumentsData[name];
  if (!data) return;
  currentInstrument = name;

  // Update staff SVG selected note
  document.querySelectorAll('.svg-note-group').forEach(group => {
    if (group.dataset.name === name) {
      group.classList.add('selected');
    } else {
      group.classList.remove('selected');
    }
  });

  // Update quick chips
  document.querySelectorAll('.quick-chip').forEach(chip => {
    if (chip.dataset.name === name) {
      chip.classList.add('selected');
    } else {
      chip.classList.remove('selected');
    }
  });

  // Update Info Panel
  document.getElementById('infoCategory').textContent = data.category;
  document.getElementById('infoName').textContent = data.name;
  document.getElementById('infoDesc').textContent = data.desc;
  document.getElementById('infoPosition').textContent = data.position;
  document.getElementById('infoLimb').textContent = data.limb;
  document.getElementById('infoHeadType').textContent = data.headType;
  document.getElementById('infoStemDir').textContent = data.stemDir;

  const infoImg = document.getElementById('infoImage');
  infoImg.src = data.image;
  infoImg.alt = data.name;

  // Highlight piece in Drum Kit SVG
  highlightDrumKitPiece(name);

  // Play audio
  if (playSound) {
    playDrumSound(name);
  }
}

// Click events on Staff Notes
document.querySelectorAll('.svg-note-group').forEach(group => {
  group.addEventListener('click', () => {
    selectInstrument(group.dataset.name);
  });
  group.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      selectInstrument(group.dataset.name);
    }
  });
});

// Quick chips click
document.querySelectorAll('.quick-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    selectInstrument(chip.dataset.name);
  });
});

// Info Play Button
document.getElementById('infoPlayBtn').addEventListener('click', () => {
  playDrumSound(currentInstrument);
});

// Toggle Note Names in Staff
const toggleNoteNames = document.getElementById('toggleNoteNames');
toggleNoteNames.addEventListener('change', (e) => {
  const show = e.target.checked;
  document.querySelectorAll('.note-pill-tag').forEach(tag => {
    if (show) {
      tag.classList.remove('hidden');
    } else {
      tag.classList.add('hidden');
    }
  });
});

// DRUM KIT SVG INTERACTIVE HOOK
function setupDrumKitInteraction() {
  const drumKitObj = document.getElementById('drumKitObject');
  if (!drumKitObj) return;

  function attachListeners() {
    try {
      const svgDoc = drumKitObj.contentDocument;
      if (!svgDoc) return;

      const interactiveParts = svgDoc.querySelectorAll('.drum-part-hover');
      interactiveParts.forEach(part => {
        part.addEventListener('click', () => {
          const inst = part.dataset.instrument;
          if (inst) {
            selectInstrument(inst);
          }
        });
      });
    } catch (e) {
      console.warn("Could not attach listeners inside Drum Kit SVG:", e);
    }
  }

  drumKitObj.addEventListener('load', attachListeners);
  if (drumKitObj.contentDocument) attachListeners();
}

function highlightDrumKitPiece(name) {
  try {
    const drumKitObj = document.getElementById('drumKitObject');
    if (!drumKitObj || !drumKitObj.contentDocument) return;
    const svgDoc = drumKitObj.contentDocument;

    svgDoc.querySelectorAll('.drum-part-hover').forEach(p => {
      if (p.dataset.instrument === name) {
        p.classList.add('selected');
      } else {
        p.classList.remove('selected');
      }
    });
  } catch (e) {
    // Cross-origin or not loaded yet
  }
}

// SECTION 2: SÍMBOLOS SOUND PREVIEW BUTTONS
document.querySelectorAll('.btn-sound-preview').forEach(btn => {
  btn.addEventListener('click', () => {
    const sound = btn.dataset.sound;
    playDrumSound(sound);
  });
});

// SECTION 3: PRACTICE / ROADMAP & EXERCISES
const principalNotes = ['Bombo', 'Redoblante', 'Hi-hat'];
const levelDefinitions = [
  {
    name: 'Fundamentos',
    subtitle: 'Bombo · Redoblante · Hi-hat',
    unlock: 0,
    instruments: ['Bombo', 'Redoblante', 'Hi-hat']
  },
  {
    name: 'Platos principales',
    subtitle: 'Añade Crash y Ride',
    unlock: 3,
    instruments: ['Bombo', 'Redoblante', 'Hi-hat', 'Crash', 'Ride']
  },
  {
    name: 'Toms melódicos',
    subtitle: 'Añade Tom 1, Tom 2 y Tom de piso',
    unlock: 7,
    instruments: ['Bombo', 'Redoblante', 'Hi-hat', 'Tom agudo', 'Tom medio', 'Tom de piso']
  },
  {
    name: 'Set Completo Maestro',
    subtitle: 'Las 9 notas maestras del pentagrama',
    unlock: 12,
    instruments: Object.keys(instrumentsData)
  }
];

let activeLevel = 0;
let activeExercise = 0;
let completedExercises = new Set(JSON.parse(localStorage.getItem('musicala-bateria-v2-practicados') || '[]'));
let correctAnswersCount = 0;
let totalAnswersCount = 0;
let currentExerciseInstrument = null;
let exerciseAnswered = false;

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function getUnlockedCount() {
  return completedExercises.size;
}

function renderRoadmap() {
  const road = document.getElementById('levelRoadmap');
  if (!road) return;
  road.innerHTML = '';

  levelDefinitions.forEach((level, index) => {
    const open = getUnlockedCount() >= level.unlock;
    const button = document.createElement('button');
    button.className = 'level-button' + (index === activeLevel ? ' active' : '');
    button.disabled = !open;
    button.innerHTML = `
      <small>NIVEL ${index + 1}${open ? '' : ' · BLOQUEADO 🔒'}</small>
      <strong>${level.name}</strong>
      <span>${level.subtitle}</span>
    `;
    button.addEventListener('click', () => {
      activeLevel = index;
      activeExercise = 0;
      renderPractice();
    });
    road.appendChild(button);
  });
}

function renderExerciseNoteSvg(instName) {
  const mount = document.getElementById('exerciseNoteMount');
  mount.innerHTML = '';

  const data = instrumentsData[instName];
  if (!data) return;
  const cfg = data.noteConfig;
  const x = 300;
  const y = cfg.y;

  let g = document.createElementNS('http://www.w3.org/2000/svg', 'g');

  // Ledger line if applicable
  if (cfg.ledger !== null) {
    let ledger = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    ledger.setAttribute('x1', (x - 22).toString());
    ledger.setAttribute('y1', cfg.ledger.toString());
    ledger.setAttribute('x2', (x + 22).toString());
    ledger.setAttribute('y2', cfg.ledger.toString());
    ledger.setAttribute('stroke', '#220A63');
    ledger.setAttribute('stroke-width', '2.5');
    g.appendChild(ledger);
  }

  // Stem
  let stem = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  stem.setAttribute('stroke', '#220A63');
  stem.setAttribute('stroke-width', '3.5');
  stem.setAttribute('stroke-linecap', 'round');

  if (cfg.stem === 'up') {
    stem.setAttribute('x1', (x + 10).toString());
    stem.setAttribute('y1', y.toString());
    stem.setAttribute('x2', (x + 10).toString());
    stem.setAttribute('y2', (y - 45).toString());
  } else {
    // Stem down
    stem.setAttribute('x1', (x - 10).toString());
    stem.setAttribute('y1', y.toString());
    stem.setAttribute('x2', (x - 10).toString());
    stem.setAttribute('y2', (y + 45).toString());
  }
  g.appendChild(stem);

  // Notehead
  if (cfg.type === 'x') {
    let l1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    l1.setAttribute('x1', (x - 10).toString());
    l1.setAttribute('y1', (y - 10).toString());
    l1.setAttribute('x2', (x + 10).toString());
    l1.setAttribute('y2', (y + 10).toString());
    l1.setAttribute('stroke', '#CE0071');
    l1.setAttribute('stroke-width', '4.5');
    l1.setAttribute('stroke-linecap', 'round');
    g.appendChild(l1);

    let l2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    l2.setAttribute('x1', (x - 10).toString());
    l2.setAttribute('y1', (y + 10).toString());
    l2.setAttribute('x2', (x + 10).toString());
    l2.setAttribute('y2', (y - 10).toString());
    l2.setAttribute('stroke', '#CE0071');
    l2.setAttribute('stroke-width', '4.5');
    l2.setAttribute('stroke-linecap', 'round');
    g.appendChild(l2);
  } else {
    let oval = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
    oval.setAttribute('cx', x.toString());
    oval.setAttribute('cy', y.toString());
    oval.setAttribute('rx', '14');
    oval.setAttribute('ry', '10');
    oval.setAttribute('transform', `rotate(-20 ${x} ${y})`);
    oval.setAttribute('fill', '#220A63');
    g.appendChild(oval);
  }

  mount.appendChild(g);
}

function renderPractice() {
  const level = levelDefinitions[activeLevel];
  const totalNotes = level.instruments.length;
  currentExerciseInstrument = level.instruments[activeExercise];

  document.getElementById('levelKicker').textContent = `Nivel ${activeLevel + 1} · ${level.name}`;
  document.getElementById('exerciseCounter').textContent = `Nota ${activeExercise + 1} de ${totalNotes}`;
  document.getElementById('streakBadge').textContent = `🔥 Racha: ${correctStreak}`;

  renderExerciseNoteSvg(currentExerciseInstrument);
  renderRoadmap();
  renderQuizOptions();

  // Reset feedback
  const feedbackBox = document.getElementById('quizFeedbackBox');
  feedbackBox.className = 'feedback-box';
  document.getElementById('nextExercise').disabled = true;
}

function renderQuizOptions() {
  exerciseAnswered = false;
  const level = levelDefinitions[activeLevel];
  const allInLevel = level.instruments;
  const current = currentExerciseInstrument;

  // Pick 3 random distractors
  const distractors = shuffle(allInLevel.filter(inst => inst !== current)).slice(0, 3);
  const options = shuffle([current, ...distractors]);

  const wrap = document.getElementById('quizOptions');
  wrap.innerHTML = '';

  options.forEach(optName => {
    const data = instrumentsData[optName];
    const btn = document.createElement('button');
    btn.className = 'quiz-opt-btn';
    btn.innerHTML = `
      <span>${data.headType.includes('X') ? '✕' : '●'} ${optName}</span>
      <small style="opacity:.65;font-size:12px;font-weight:600;">${data.category.split(' ')[0]}</small>
    `;
    btn.addEventListener('click', () => handleQuizAnswer(btn, optName));
    wrap.appendChild(btn);
  });
}

function handleQuizAnswer(btn, selectedName) {
  if (exerciseAnswered) return;

  const data = instrumentsData[currentExerciseInstrument];
  const feedbackBox = document.getElementById('quizFeedbackBox');
  const feedbackImg = document.getElementById('feedbackImg');
  const feedbackTitle = document.getElementById('feedbackTitle');
  const feedbackDesc = document.getElementById('feedbackDesc');

  if (selectedName !== currentExerciseInstrument) {
    btn.classList.add('wrong');
    correctStreak = 0;
    document.getElementById('streakBadge').textContent = `🔥 Racha: 0`;

    feedbackBox.className = 'feedback-box active error';
    feedbackImg.src = instrumentsData[selectedName].image;
    feedbackTitle.textContent = 'Aún no es ese instrumento';
    feedbackDesc.textContent = `Observa la altura de la nota: ${data.headType.includes('X') ? 'tiene cabeza en X (plato)' : 'tiene cabeza redonda (tambor)'} y está ubicada en ${data.position.split('·')[0]}.`;
    return;
  }

  // Correct answer
  exerciseAnswered = true;
  correctAnswersCount++;
  totalAnswersCount++;
  correctStreak++;
  document.getElementById('streakBadge').textContent = `🔥 Racha: ${correctStreak}`;

  btn.classList.add('correct');
  document.querySelectorAll('.quiz-opt-btn').forEach(b => b.disabled = true);

  playDrumSound(currentExerciseInstrument);

  // Success Feedback
  feedbackBox.className = 'feedback-box active success';
  feedbackImg.src = data.image;
  feedbackTitle.textContent = `¡Correcto! Es el ${data.name.split('(')[0]}`;
  feedbackDesc.textContent = `${data.position}. ${data.desc}`;

  // Record completed
  completedExercises.add(`${activeLevel}-${activeExercise}`);
  localStorage.setItem('musicala-bateria-v2-practicados', JSON.stringify([...completedExercises]));

  document.getElementById('quizScore').textContent = `Aciertos: ${correctAnswersCount} / ${totalAnswersCount}`;
  document.getElementById('nextExercise').disabled = false;

  renderRoadmap();
  updateProgress();
}

function nextExercise() {
  const totalNotes = levelDefinitions[activeLevel].instruments.length;
  activeExercise = (activeExercise + 1) % totalNotes;
  renderPractice();
}

document.getElementById('nextExercise').addEventListener('click', nextExercise);

// INITIALIZATION
window.addEventListener('DOMContentLoaded', () => {
  setupDrumKitInteraction();
  selectInstrument('Redoblante', false);
  renderPractice();
  updateProgress();
});
