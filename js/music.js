// Danganronpa v1 – music.js
(function () {
  const tracks = [
    "music/36. チャプターリザルト.mp3",
    "music/35. フェイズリザルト.mp3",
    "music/34. ラジオ体操暗殺拳.mp3",
    "music/33. あの人は見た！.mp3",
    "music/32. 起動・電子生徒手帳.mp3",
    "music/31. モノモノマシーン！.mp3",
    "music/30. レアプレゼントゲット.mp3",
    "music/29. プレゼントゲット.mp3",
    "music/28. コトダマゲット.mp3",
    "music/27. クライマックス推理.mp3",
    "music/27. あなたと私の通信簿.mp3",
    "music/26. チャプター６.mp3",
    "music/26. Beautiful Morning.mp3",
    "music/25. 補習 for 不運.mp3",
    "music/25. チャプター５.mp3",
    "music/24. チャプター４.mp3",
    "music/24. ショベルの達人.mp3",
    "music/23. チャプター３.mp3",
    "music/23. ようこそ絶望学園.mp3",
    "music/22. チャプター２.mp3",
    "music/22. SUPER M.T.B..mp3",
    "music/21. 週刊少年ゼツボウマガジン.mp3",
    "music/21. チャプター１.mp3",
    "music/20. ベルサイユ産火あぶり魔女狩り仕立て.mp3",
    "music/20. プロローグ・クレジット.mp3",
    "music/19. 絶望症候群.mp3",
    "music/19. 再生 -rebuild-.mp3",
    "music/18. 絶望汚染ノイズミュージック.mp3",
    "music/18. さよなら絶望学園.mp3",
    "music/17. 議論 -BREAK-.mp3",
    "music/17. ニュー・ワールド・オーダー.mp3",
    "music/16. クライマックス再現.mp3",
    "music/16. M.T.B..mp3",
    "music/15. 開廷アンダーグラウンド.mp3",
    "music/15. 超高校級の絶望的おしおき.mp3",
    "music/14. 猛太亜最苦婁弟酢華恵慈.mp3",
    "music/14. オール・オール・アポロジーズ.mp3",
    "music/13. 補習 for ミステリアス.mp3",
    "music/13. イキキル.mp3",
    "music/12. 議論 -HOPE VS DESPAIR-.mp3",
    "music/12. 処刑に願いを….mp3",
    "music/11. 閃きアナグラム.mp3",
    "music/11. 千本ノック.mp3",
    "music/10. 議論 -HEAT UP-.mp3",
    "music/10. DISTRUST.mp3",
    "music/09. 疾走する青春のジャンクフード.mp3",
    "music/09. 学級裁判太陽編.mp3",
    "music/08. 学級裁判乱世編.mp3",
    "music/08. BOX 15.mp3",
    "music/07. 議論 -MIX-(EDGE Version).mp3",
    "music/07. モノクマ先生の課外授業.mp3",
    "music/06. 学級裁判黎明編.mp3",
    "music/06. BOX 16.mp3",
    "music/05. SUPER FINAL M.T.B..mp3",
    "music/05. Beautiful Dead.mp3",
    "music/04. ゼツボウシンドローム.mp3",
    "music/04. Beautiful Days.mp3",
    "music/03. モノクマ先生の授業.mp3",
    "music/03. おしおきロケット.mp3",
    "music/02. モモモモノクマ！.mp3",
    "music/02. だんがんろんぱ！.mp3",
    "music/01. DANGANRONPA.mp3",
    "music/01. DANGANRONPA(DR Version).mp3"
  ];

  const audio = document.getElementById('bgAudio');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const trackSelect = document.getElementById('trackSelect');
  const trackTitle = document.getElementById('trackTitle');

  if (!audio || !playPauseBtn || !prevBtn || !nextBtn || !trackSelect || !trackTitle) return;

  let current = 0;

  function isUserPaused() {
    return localStorage.getItem('musicPaused') === 'true';
  }

  function setUserPaused(paused) {
    localStorage.setItem('musicPaused', paused ? 'true' : 'false');
  }

  function prettyName(path) {
    const name = path.split('/').pop();
    return name.replace(/^\d+\.\s*/, '');
  }

  function populate() {
    trackSelect.innerHTML = '';
    tracks.forEach((t, i) => {
      const opt = document.createElement('option');
      opt.value = i;
      opt.textContent = prettyName(t);
      trackSelect.appendChild(opt);
    });
    trackTitle.textContent = prettyName(tracks[current]);
  }

  function loadTrack(index, play = false) {
    if (index < 0) index = tracks.length - 1;
    if (index >= tracks.length) index = 0;
    current = index;
    audio.src = encodeURI(tracks[current]);
    try { audio.load(); } catch (e) {}
    trackSelect.value = current;
    trackTitle.textContent = prettyName(tracks[current]);
    if (play) {
      audio.play().then(() => setUserPaused(false)).catch(() => {
        trackTitle.textContent = 'Playback blocked — click Play';
      });
    }
    updatePlayBtn();
  }

  function updatePlayBtn() {
    playPauseBtn.textContent = audio.paused ? 'Play' : 'Pause';
  }

  playPauseBtn.addEventListener('click', () => {
    if (audio.src === '') loadTrack(current);
    if (audio.paused) {
      audio.play().then(() => {
        setUserPaused(false);
        updatePlayBtn();
      }).catch(() => {
        trackTitle.textContent = 'Playback blocked — allow audio';
      });
    } else {
      audio.pause();
      setUserPaused(true);
      updatePlayBtn();
    }
  });

  prevBtn.addEventListener('click', () => loadTrack(current - 1, true));
  nextBtn.addEventListener('click', () => loadTrack(current + 1, true));
  
  trackSelect.addEventListener('change', (e) => {
    const idx = parseInt(e.target.value, 10);
    if (!Number.isNaN(idx)) loadTrack(idx, true);
  });

  audio.addEventListener('play', updatePlayBtn);
  audio.addEventListener('pause', updatePlayBtn);
  audio.addEventListener('error', () => trackTitle.textContent = 'Error loading track');
  audio.addEventListener('ended', () => loadTrack(current + 1, true));

  // Initialize
  populate();
  
  const danganronpaIndex = tracks.findIndex(t => t.includes('01. DANGANRONPA.mp3') && !t.includes('DR Version'));
  const defaultIndex = danganronpaIndex !== -1 ? danganronpaIndex : tracks.length - 2;

  let startIndex = defaultIndex;
  let startTime = 0;
  let wasPlaying = false;
  
  try {
    const savedIndex = parseInt(localStorage.getItem('bgplayer_index'), 10);
    const savedTime = parseInt(localStorage.getItem('bgplayer_time'), 10);
    const savedPlaying = localStorage.getItem('musicWasPlaying') === 'true';
    if (!Number.isNaN(savedIndex) && savedIndex >= 0 && savedIndex < tracks.length) {
      startIndex = savedIndex;
    }
    if (!Number.isNaN(savedTime) && savedTime > 0) {
      startTime = savedTime;
    }
    wasPlaying = savedPlaying;
  } catch (e) {}

  loadTrack(startIndex, false);
  
  // Restore time and playback state after audio is ready
  function restorePlayback() {
    if (startTime > 0) audio.currentTime = startTime;
    if (wasPlaying && !isUserPaused()) {
      audio.play().then(updatePlayBtn).catch(() => {
        trackTitle.textContent = 'Click Play to start music';
      });
    }
  }

  if (audio.readyState >= 1) {
    restorePlayback();
  } else {
    audio.addEventListener('loadedmetadata', restorePlayback, { once: true });
  }

  window.addEventListener('beforeunload', () => {
    try {
      localStorage.setItem('bgplayer_index', current);
      localStorage.setItem('bgplayer_time', Math.floor(audio.currentTime));
      localStorage.setItem('musicWasPlaying', !audio.paused ? 'true' : 'false');
    } catch (e) {}
  });
})();
