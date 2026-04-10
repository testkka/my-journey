// 自动播放背景音乐 — 进入即播放，仅 Music 按钮可暂停
(function () {
  var audio = document.getElementById("bg-audio");
  if (!audio) return;

  audio.preload = "auto";

  function updateUI(playing) {
    var btn = document.getElementById("music-btn");
    var lbl = document.getElementById("music-label");
    if (btn) playing ? btn.classList.add("playing") : btn.classList.remove("playing");
    if (lbl) lbl.textContent = playing ? "Pause" : "Music";
    window.isPlaying = playing;
    window._bgPlaying = playing;
  }

  function tryPlay() {
    // 先静音播放（浏览器允许）→ 立即取消静音
    audio.muted = true;
    audio.play().then(function () {
      audio.muted = false; // 立刻取消静音，无需等待任何交互
      updateUI(true);
    }).catch(function (e) {
      // 极少数严格环境（如 iframe 沙箱）降级处理：等待首次点击
      console.warn("autoplay blocked, waiting for click:", e);
      document.addEventListener("click", function once() {
        document.removeEventListener("click", once);
        audio.muted = false;
        audio.play().then(function () { updateUI(true); }).catch(function () {});
      }, { once: true });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", tryPlay);
  } else {
    tryPlay();
  }
})();
