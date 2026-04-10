// 自动播放背景音乐 — 进入页面即播放，浏览器拦截时等待首次交互
(function(){
  var audio = document.getElementById('bg-audio');
  if (!audio) return;
  function start() {
    if (window._bgPlaying) return;
    audio.play().then(function(){
      window._bgPlaying = true;
      var btn = document.getElementById('music-btn');
      var lbl = document.getElementById('music-label');
      if (btn) btn.classList.add('playing');
      if (lbl) lbl.textContent = 'Pause';
    }).catch(function(){
      // blocked by browser, wait for first user interaction
      ['click','touchstart','keydown'].forEach(function(ev){
        document.addEventListener(ev, function h(){
          start();
          document.removeEventListener(ev, h);
        }, {once:true});
      });
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
