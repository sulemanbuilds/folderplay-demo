// Folder
const selectFolderBtn = document.getElementById("selectFolderBtn");
const folderInput = document.getElementById("folderInput");

// Playlist
const songMenu = document.querySelector(".song-menu");

// Player buttons
const playBtn = document.querySelector(".icon-container .fa-play");
const prevBtn = document.querySelector(".fa-backward-step");
const nextBtn = document.querySelector(".fa-forward-step");

// Progress bar
const progressBar = document.querySelector(".timer .bar2");
const progressDot = document.querySelector(".timer .dot");
const currentTimeEl = document.querySelector(".timer span:first-child");
const durationEl = document.querySelector(".timer span:last-child");

// Volume bar
const volumeBar = document.querySelector(".sound-bar .bar2");
const volumeDot = document.querySelector(".sound-bar .dot");
const volumeIcon = document.querySelector(".sound-control i");

// Audio
const audio = new Audio();

// Data
let songs = [];
let currentIndex = 0;



// Open Folder Picker:
selectFolderBtn.addEventListener("click", () => {
    folderInput.click();
});


// Automatic Song Loader:
folderInput.addEventListener("change", function () {
    songs = Array.from(this.files).filter(file =>
        file.type.startsWith("audio")
    );

    songMenu.innerHTML = "";

    songs.forEach((song, index) => {
        const li = document.createElement("li");
        li.className = "song-item";

        li.innerHTML = `
            <span>${index + 1}</span>
            <img src="./cover/1.jpg">
            <h3>
                ${song.name}
                <div class="subtitle">Local File</div>
            </h3>
            <i class="fa-solid fa-play"></i>
        `;

        li.addEventListener("click", () => playSong(index));
        songMenu.appendChild(li);
    });
});


// Play Selected Song:
function playSong(index) {
    currentIndex = index;
    audio.src = URL.createObjectURL(songs[index]);
    audio.play();

    playBtn.classList.replace("fa-play", "fa-pause");
    updateActiveSongUI();
}


// Play / Pause Button:
playBtn.addEventListener("click", () => {
    if (!audio.src) return;

    if (audio.paused) {
        audio.play();
        playBtn.classList.replace("fa-play", "fa-pause");
    } else {
        audio.pause();
        playBtn.classList.replace("fa-pause", "fa-play");
    }

    updateActiveSongUI();
});


// Next / Previous Button:
nextBtn.addEventListener("click", () => {
    if (!songs.length) return;
    currentIndex = (currentIndex + 1) % songs.length;
    playSong(currentIndex);
    updateActiveSongUI();
});

prevBtn.addEventListener("click", () => {
    if (!songs.length) return;
    currentIndex = (currentIndex - 1 + songs.length) % songs.length;
    playSong(currentIndex);
    updateActiveSongUI();
});


// Progress Bar Animation:
audio.addEventListener("timeupdate", () => {
    if (!audio.duration) return;

    const percent = (audio.currentTime / audio.duration) * 100;

    progressBar.style.width = percent + "%";
    progressDot.style.left = percent + "%";

    currentTimeEl.textContent = formatTime(audio.currentTime);
    durationEl.textContent = formatTime(audio.duration);
});

function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
}


// Click to Seek Music:
document.querySelector(".timer .bar").addEventListener("click", (e) => {
    const barWidth = e.currentTarget.clientWidth;
    const clickX = e.offsetX;
    const percent = clickX / barWidth;

    audio.currentTime = percent * audio.duration;
});


// Volume Control Bar:
audio.volume = 0.4;
updateVolumeUI(40);

document.querySelector(".sound-bar").addEventListener("click", (e) => {
    const barWidth = e.currentTarget.clientWidth;
    const clickX = e.offsetX;
    const percent = Math.round((clickX / barWidth) * 100);

    audio.volume = percent / 100;
    updateVolumeUI(percent);
});

function updateVolumeUI(percent) {
    volumeBar.style.width = percent + "%";
    volumeDot.style.left = percent + "%";

    if (percent === 0) {
        volumeIcon.className = "fa-solid fa-volume-xmark";
    } else {
        volumeIcon.className = "fa-solid fa-volume-high";
    }
}

// Update Active Song UI in SongMenu:
function updateActiveSongUI() {
    const allSongs = document.querySelectorAll(".song-item");

    allSongs.forEach((item, index) => {
        const icon = item.querySelector("i");

        if (index === currentIndex && !audio.paused) {
            item.classList.add("active");
            icon.className = "fa-solid fa-pause";
        } else {
            item.classList.remove("active");
            icon.className = "fa-solid fa-play";
        }
    });
}

// Autoplay Next Song when current
audio.addEventListener("ended", () => {
    if (!songs.length) return;

    currentIndex = (currentIndex + 1) % songs.length;
    playSong(currentIndex);
    updateActiveSongUI();
});