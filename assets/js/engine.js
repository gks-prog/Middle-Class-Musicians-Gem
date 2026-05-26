// /assets/js/engine.js
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioEngine = null;

export const initEngine = () => {
  if (!audioEngine) {
    try { audioEngine = new AudioCtx(); } 
    catch (e) { console.warn("Audio disabled."); }
  }
  if (audioEngine && audioEngine.state === 'suspended') audioEngine.resume();
};

export const playHaptic = () => { if (navigator.vibrate) navigator.vibrate(15); };

export const playSFX = (type) => {
  if (!audioEngine || audioEngine.state === 'suspended') return;
  const osc = audioEngine.createOscillator();
  const gain = audioEngine.createGain();
  
  if (type === 'hover') {
    osc.type = 'sine'; osc.frequency.setValueAtTime(880, audioEngine.currentTime);
    gain.gain.setValueAtTime(0, audioEngine.currentTime);
    gain.gain.linearRampToValueAtTime(0.05, audioEngine.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, audioEngine.currentTime + 0.1);
  }
  // Add other SFX types from your original code here...
  
  osc.connect(gain); gain.connect(audioEngine.destination);
  osc.start(); osc.stop(audioEngine.currentTime + 0.1);
};

// Global Event Listeners for UI interaction
document.addEventListener('pointerdown', () => { initEngine(); playHaptic(); }, { once: true });
document.addEventListener('mouseover', (e) => {
  if (e.target.closest('[data-sound="hover"]')) { initEngine(); playSFX('hover'); }
});
