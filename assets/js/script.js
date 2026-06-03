// ============================
// FolderPlay — script.js
// ============================

// --- State ---
let songs = [];
let currentIndex = -1;
let isDraggingProgress = false;
let isDraggingVolume = false;
let isShuffle = false;
let isRepeat = false;
let lastVolume = 40;

// --- Audio ---
const audio = new Audio();
audio.volume = 0.4;

// --- DOM ---
const selectFolderBtn = document.getElementById('selectFolderBtn');
const folderInput     = document.getElementById('folderInput');
const songMenu        = document.getElementById('songMenu');
const songCountText   = document.getElementById('songCountText');

const playBtn      = document.getElementById('playBtn');
const playIcon     = document.getElementById('playIcon');
const prevBtn      = document.getElementById('prevBtn');
const nextBtn      = document.getElementById('nextBtn');
const shuffleBtn   = document.getElementById('shuffleBtn');
const repeatBtn    = document.getElementById('repeatBtn');

const currentTimeEl = document.getElementById('currentTime');
const durationEl    = document.getElementById('duration');
const progressTrack = document.getElementById('progressTrack');
const progressFill  = document.getElementById('progressFill');
const progressThumb = document.getElementById('progressThumb');

const volumeTrack = document.getElementById('volumeTrack');
const volumeFill  = document.getElementById('volumeFill');
const volumeThumb = document.getElementById('volumeThumb');
const volIcon     = document.getElementById('volIcon');
const volPct      = document.getElementById('volPct');
const muteBtn     = document.getElementById('muteBtn');

const artworkRing  = document.getElementById('artworkRing');
const artworkLabel = document.getElementById('artworkLabel');
const trackTitle   = document.getElementById('trackTitle');
const trackSub     = document.getElementById('trackSub');

// --- Folder Picker ---
selectFolderBtn?.addEventListener('click', () => folderInput?.click());

folderInput?.addEventListener('change', function () {
  songs = Array.from(this.files).filter(f => f.type.startsWith('audio'));

  if (!songs.length) {
    songMenu.innerHTML = `<div class="empty-state">
      <i class="fa-solid fa-triangle-exclamation empty-icon"></i>
      <p>No audio files found</p>
      <span>Try a different folder</span>
    </div>`;
    songCountText.textContent = 'No songs loaded';
    return;
  }

  songCountText.textContent = `${songs.length} track${songs.length !== 1 ? 's' : ''}`;
  renderPlaylist();
});

function renderPlaylist() {
  songMenu.innerHTML = '';
  const ul = document.createElement('ul');
  ul.style.cssText = 'list-style:none;display:flex;flex-direction:column;gap:4px;';

  songs.forEach((song, i) => {
    const name = song.name.replace(/\.[^/.]+$/, ''); // strip extension
    const ext  = (song.name.split('.').pop() || '').toUpperCase();

    const li = document.createElement('li');
    li.className = 'song-item';
    li.dataset.index = i;
    li.innerHTML = `
      <span class="song-num">${String(i + 1).padStart(2, '0')}</span>
      <div class="song-thumb"><i class="fa-solid fa-music"></i></div>
      <div class="song-info">
        <div class="song-name" title="${name}">${name}</div>
        <div class="song-sub">${ext} · Local file</div>
      </div>
      <div class="song-play-icon"><i class="fa-solid fa-play"></i></div>
    `;

    li.addEventListener('click', () => playSong(i));
    ul.appendChild(li);
  });

  songMenu.appendChild(ul);
}

// --- Playback ---
function playSong(index) {
  if (index < 0 || index >= songs.length) return;
  currentIndex = index;

  // Revoke previous object URL to free memory
  if (audio.src) URL.revokeObjectURL(audio.src);

  audio.src = URL.createObjectURL(songs[index]);
  audio.play().catch(() => {});

  const name = songs[index].name.replace(/\.[^/.]+$/, '');
  trackTitle.textContent = name;
  trackSub.textContent   = 'Local folder';
  artworkLabel.textContent = 'playing';

  updatePlayUI(true);
  updateActiveSongUI();
  artworkRing.classList.add('playing');
}

function updatePlayUI(playing) {
  playIcon.className = playing ? 'fa-solid fa-pause' : 'fa-solid fa-play';
}

// --- Controls ---
playBtn?.addEventListener('click', () => {
  if (!audio.src || !songs.length) return;
  if (audio.paused) {
    audio.play();
    updatePlayUI(true);
    artworkRing.classList.add('playing');
  } else {
    audio.pause();
    updatePlayUI(false);
    artworkRing.classList.remove('playing');
  }
  updateActiveSongUI();
});

nextBtn?.addEventListener('click', () => {
  if (!songs.length) return;
  const next = isShuffle
    ? Math.floor(Math.random() * songs.length)
    : (currentIndex + 1) % songs.length;
  playSong(next);
});

prevBtn?.addEventListener('click', () => {
  if (!songs.length) return;
  // If >3s in, restart; otherwise go previous
  if (audio.currentTime > 3) {
    audio.currentTime = 0;
    return;
  }
  const prev = isShuffle
    ? Math.floor(Math.random() * songs.length)
    : (currentIndex - 1 + songs.length) % songs.length;
  playSong(prev);
});

shuffleBtn?.addEventListener('click', () => {
  isShuffle = !isShuffle;
  shuffleBtn.classList.toggle('on', isShuffle);
});

repeatBtn?.addEventListener('click', () => {
  isRepeat = !isRepeat;
  repeatBtn.classList.toggle('on', isRepeat);
  audio.loop = isRepeat;
});

// Autoplay next
audio.addEventListener('ended', () => {
  if (isRepeat || !songs.length) return;
  const next = isShuffle
    ? Math.floor(Math.random() * songs.length)
    : (currentIndex + 1) % songs.length;
  playSong(next);
});

// --- Time update ---
audio.addEventListener('timeupdate', () => {
  if (!audio.duration) return;
  const pct = (audio.currentTime / audio.duration) * 100;

  if (!isDraggingProgress) {
    progressFill.style.width  = pct + '%';
    progressThumb.style.left  = pct + '%';
  }

  currentTimeEl.textContent = formatTime(audio.currentTime);
  durationEl.textContent    = formatTime(audio.duration);
});

function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec < 10 ? '0' : ''}${sec}`;
}

// --- Progress bar ---
progressTrack?.addEventListener('click', (e) => {
  if (isDraggingProgress) return;
  const pct = e.offsetX / progressTrack.clientWidth;
  audio.currentTime = pct * audio.duration;
  progressFill.style.width  = (pct * 100) + '%';
  progressThumb.style.left  = (pct * 100) + '%';
});

progressThumb?.addEventListener('mousedown', () => { isDraggingProgress = true; });
progressThumb?.addEventListener('touchstart', () => { isDraggingProgress = true; }, { passive: true });

document.addEventListener('mouseup',  () => { isDraggingProgress = false; isDraggingVolume = false; });
document.addEventListener('touchend', () => { isDraggingProgress = false; isDraggingVolume = false; });

document.addEventListener('mousemove', handleProgressMove);
document.addEventListener('touchmove', (e) => {
  if (isDraggingProgress || isDraggingVolume) handleProgressMove(e.touches[0]);
}, { passive: true });

function handleProgressMove(e) {
  if (!isDraggingProgress || !audio.duration) return;
  const rect = progressTrack.getBoundingClientRect();
  const x    = Math.max(0, Math.min((e.clientX - rect.left), rect.width));
  const pct  = (x / rect.width) * 100;
  progressFill.style.width = pct + '%';
  progressThumb.style.left = pct + '%';
  audio.currentTime = (pct / 100) * audio.duration;
}

// --- Volume ---
updateVolumeUI(40);

volumeTrack?.addEventListener('click', (e) => {
  if (isDraggingVolume) return;
  const pct = Math.round((e.offsetX / volumeTrack.clientWidth) * 100);
  audio.volume = pct / 100;
  updateVolumeUI(pct);
});

volumeThumb?.addEventListener('mousedown', () => { isDraggingVolume = true; });
volumeThumb?.addEventListener('touchstart', () => { isDraggingVolume = true; }, { passive: true });

document.addEventListener('mousemove', (e) => {
  if (!isDraggingVolume) return;
  const rect = volumeTrack.getBoundingClientRect();
  const x    = Math.max(0, Math.min((e.clientX - rect.left), rect.width));
  const pct  = Math.round((x / rect.width) * 100);
  audio.volume = pct / 100;
  updateVolumeUI(pct);
});

function updateVolumeUI(pct) {
  volumeFill.style.width  = pct + '%';
  volumeThumb.style.left  = pct + '%';
  volPct.textContent = pct + '%';

  if (pct === 0) {
    volIcon.className = 'fa-solid fa-volume-xmark';
  } else if (pct < 50) {
    volIcon.className = 'fa-solid fa-volume-low';
    lastVolume = pct;
  } else {
    volIcon.className = 'fa-solid fa-volume-high';
    lastVolume = pct;
  }
}

muteBtn?.addEventListener('click', () => {
  if (audio.volume > 0) {
    lastVolume = Math.round(audio.volume * 100);
    audio.volume = 0;
    updateVolumeUI(0);
  } else {
    audio.volume = lastVolume / 100;
    updateVolumeUI(lastVolume);
  }
});

// --- Active song highlight ---
function updateActiveSongUI() {
  document.querySelectorAll('.song-item').forEach((item, i) => {
    const icon = item.querySelector('.song-play-icon i');
    if (i === currentIndex) {
      item.classList.add('active');
      if (icon) icon.className = audio.paused ? 'fa-solid fa-play' : 'fa-solid fa-pause';
    } else {
      item.classList.remove('active');
      if (icon) icon.className = 'fa-solid fa-play';
    }
  });
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Don't trigger when typing
  if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

  switch (e.code) {
    case 'Space':
      e.preventDefault();
      playBtn?.click();
      break;
    case 'ArrowRight':
      e.preventDefault();
      if (audio.duration) audio.currentTime = Math.min(audio.currentTime + 5, audio.duration);
      break;
    case 'ArrowLeft':
      e.preventDefault();
      audio.currentTime = Math.max(audio.currentTime - 5, 0);
      break;
    case 'ArrowUp':
      e.preventDefault();
      audio.volume = Math.min(audio.volume + 0.1, 1);
      updateVolumeUI(Math.round(audio.volume * 100));
      break;
    case 'ArrowDown':
      e.preventDefault();
      audio.volume = Math.max(audio.volume - 0.1, 0);
      updateVolumeUI(Math.round(audio.volume * 100));
      break;
    case 'KeyN':
      nextBtn?.click();
      break;
    case 'KeyP':
      prevBtn?.click();
      break;
  }
});