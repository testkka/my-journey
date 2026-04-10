// 自动播放背景音乐 — 进入页面即播放，浏览器拦截时等待首次交互
(function(){
  var audio = document.getElementById('bg-audio');
  if (!audio) return;

  // 预加载音频，提高自动播放成功率
  audio.preload = 'auto';

  function updateUI() {
    var btn = document.getElementById('music-btn');
    var lbl = document.getElementById('music-label');
    if (btn) btn.classList.add('playing');
    if (lbl) lbl.textContent = 'Pause';
    // 同步主脚本中的 isPlaying 变量
    window.isPlaying = true;
    window._bgPlaying = true;
  }

  function start() {
    if (window._bgPlaying) return;
    audio.play().then(function(){
      updateUI();
    }).catch(function(){
      // 浏览器拦截，等待首次用户交互
      var events = ['click', 'touchstart', 'keydown', 'scroll'];
      function onInteract() {
        events.forEach(function(ev){ document.removeEventListener(ev, onInteract); });
        audio.play().then(updateUI).catch(function(e){ console.warn('autoplay failed:', e); });
      }
      events.forEach(function(ev){
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
