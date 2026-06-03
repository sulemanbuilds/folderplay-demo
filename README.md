![GitHub stars](https://img.shields.io/github/stars/sulemanbuilds/folderplay-demo?style=flat-square)
![GitHub forks](https://img.shields.io/github/forks/sulemanbuilds/folderplay-demo?style=flat-square)
![License](https://img.shields.io/github/license/sulemanbuilds/folderplay-demo?style=flat-square)
![HTML](https://img.shields.io/badge/HTML-5-orange?style=flat-square)
![CSS](https://img.shields.io/badge/CSS-3-blue?style=flat-square)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?style=flat-square)

# 🎵 FolderPlay — Local Folder Music Player

FolderPlay is a clean, privacy-first music player that runs entirely in your browser.  
Select a local folder, and your music plays instantly — no uploads, no accounts, no internet required.

> *Your music. No cloud required.*

🌐 **[Try it live → sulemanbuilds.github.io/folderplay-demo](https://sulemanbuilds.github.io/folderplay-demo/)**

---

## ✨ Features

| Feature | Details |
|---|---|
| 📂 Folder loading | Load entire local folders instantly via the File System Access API |
| ▶️ Playback controls | Play, pause, next, previous with smooth transitions |
| 🔀 Shuffle | Randomised playback across the loaded playlist |
| 🔁 Repeat | Loop the current track |
| 🎚 Seekable progress bar | Click or drag to seek; drag thumb for precision |
| 🔊 Volume control | Click or drag volume bar; mute/unmute toggle; adaptive icon |
| ⌨️ Keyboard shortcuts | Space, arrows, N/P keys for hands-free control |
| 💡 Active track highlight | Playlist highlights the currently playing track |
| 🔄 Auto-advance | Automatically plays the next track when one ends |
| 📱 Mobile responsive | Fully adapts to phones and tablets |
| 🖤 Dark UI | Dark-themed design with a cyan accent colour |

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|---|---|
| `Space` | Play / Pause |
| `→` | Seek forward 5 seconds |
| `←` | Seek back 5 seconds |
| `↑` | Volume up |
| `↓` | Volume down |
| `N` | Next track |
| `P` | Previous track |

---

## 🛠️ Tech Stack

- **HTML5** — Semantic markup and File API
- **CSS3** — Custom properties, Grid, Flexbox, animations
- **Vanilla JavaScript (ES6+)** — No dependencies, no frameworks
- **Font Awesome 6** — Icons
- **Google Fonts** — Space Mono + DM Sans

---

## 📁 Project Structure

```
folderplay/
├── index.html              # Main player page
├── about.html              # About page
├── assets/
│   ├── css/
│   │   └── style.css       # All styles
│   └── js/
│       └── script.js       # All logic
└── README.md
```

---

## ▶️ How to Run

1. Clone or download the repository:
   ```
   git clone https://github.com/sulemanbuilds/folderplay-demo.git
   ```
2. Open `index.html` in your browser (no build step needed).
3. Click **Open Folder** and pick a directory with audio files.

> ⚠️ Folder selection (`webkitdirectory`) works best in **Chrome** or **Edge**. Firefox has limited support.

---

## 🌱 Planned Improvements

- Song metadata (ID3 tag parsing for title, artist, album art)
- Album artwork display from embedded tags
- Search / filter within the playlist
- Persist last-used folder across sessions (via localStorage)
- Light theme toggle

---

## 🤝 Contributing

Pull requests are welcome. Fork the repo, make your changes, and open a PR.

---

## 📜 License

MIT License — free to use and modify.

---

## 👨‍💻 Author

**Muhammad Suleman Memon**  
GitHub: [github.com/sulemanbuilds](https://github.com/sulemanbuilds)