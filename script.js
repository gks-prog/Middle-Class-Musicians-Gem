document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  // 1. GSAP Layout Animations
  const tl = gsap.timeline();
  
  tl.to('.gsap-reveal', {
    y: 0,
    opacity: 1,
    duration: 1,
    stagger: 0.15,
    ease: "power4.out",
    delay: 0.2
  })
  .to('.gsap-fade', {
    opacity: 1,
    duration: 1,
    stagger: 0.1,
    ease: "power2.out"
  }, "-=0.5");

  // Scroll animations for stats
  gsap.fromTo('.stat-item', 
    { opacity: 0, y: 30 },
    {
      opacity: 1, 
      y: 0, 
      duration: 0.8, 
      stagger: 0.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".stats-bar",
        start: "top 80%"
      }
    }
  );

  // 2. Audio & Haptic Engine
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  let audioCtx;

  const initAudio = () => {
    if (!audioCtx) audioCtx = new AudioContext();
    if (audioCtx.state === 'suspended') audioCtx.resume();
  };

  const playSFX = (type) => {
    if (!audioCtx || audioCtx.state === 'suspended') return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    if (type === 'hover') {
      osc.type = 'sine'; 
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      gain.gain.setValueAtTime(0, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.05, audioCtx.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
    } else if (type === 'click') {
      osc.type = 'triangle'; 
      osc.frequency.setValueAtTime(440, audioCtx.currentTime);
      gain.gain.setValueAtTime(0, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
      if (navigator.vibrate) navigator.vibrate(15);
    }
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.15);
  };

  // Initialize engine on first interaction
  ['pointerdown', 'keydown'].forEach(evt => {
    document.addEventListener(evt, initAudio, { once: true });
  });

  // Attach sound listeners natively
  document.addEventListener('pointerover', (e) => {
    if (e.target.closest('[data-sound="hover"]')) playSFX('hover');
  });
  
  document.addEventListener('pointerdown', (e) => {
    if (e.target.closest('[data-sound="click"]')) playSFX('click');
  });
});
