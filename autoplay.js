// 自动播放背景音乐
// 策略：静音状态直接 autoplay（浏览器允许）→ 用户首次交互时取消静音
(function () {
  var audio = document.getElementById('bg-audio');
  if (!audio) return;

  audio.preload = 'auto';
  audio.muted = true; // 先静音，确保 autoplay 成功

  function updateUI(playing) {
    var btn = document.getElementById('music-btn');
    var lbl = document.getElementById('music-label');
    if (btn) {
      if (playing) btn.classList.add('playing');
      else btn.classList.remove('playing');
    }
    if (lbl) lbl.textContent = playing ? 'Pause' : 'Music';
    window.isPlaying = playing;
    window._bgPlaying = playing;
  }

  // 用户首次交互时取消静音
  function setupUnmute() {
    var events = ['click', 'touchstart', 'keydown', 'scroll'];
    function onFirstInteract() {
      events.forEach(function (ev) {
        document.removeEventListener(ev, onFirstInteract);
      });
      audio.muted = false; // 取消静音，音乐开始播放出声
    }
    events.forEach(function (ev) {
      document.addEventListener(ev, onFirstInteract, { once: true, passive: true });
    });
  }

  function start() {
    audio.play().then(function () {
      updateUI(true);
      setupUnmute(); // 播放成功（静音），等待用户交互后取消静音
    }).catch(function (e) {
      // 极少数情况下静音 autoplay 也被拦截（如 iframe 沙箱）
      console.warn('muted autoplay blocked:', e);
      // 降级：等待任意交互再播放
      var events = ['click', 'touchstart', 'keydown', 'scroll'];
      function onInteract() {
        events.forEach(function (ev) { document.removeEventListener(ev, onInteract); });
        audio.muted = false;
        audio.play().then(function () { updateUI(true); }).catch(function (e2) {
          console.warn('autoplay failed:', e2);
        });
      }
      events.forEach(function (ev) {
        document.addEventListener(ev, onInteract, { once: true, passive: true });
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
