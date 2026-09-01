let audioCtx: AudioContext | null = null;
let soundEnabled = true;

export const setSoundEnabled = (enabled: boolean) => { soundEnabled = enabled; };
export const getSoundEnabled = () => soundEnabled;

export const initAudio = () => {
  if (typeof window === "undefined") return;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === "suspended") audioCtx.resume();
};

export const playSFX = (type: "hover" | "click" | "note" | "riser", freqBase = 440) => {
  if (!soundEnabled || !audioCtx || audioCtx.state === "suspended") return;
  
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  if (type === "hover") {
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, audioCtx.currentTime);
    gain.gain.setValueAtTime(0, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.05, audioCtx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
  } else if (type === "click") {
    osc.type = "triangle";
    osc.frequency.setValueAtTime(440, audioCtx.currentTime);
    gain.gain.setValueAtTime(0, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
    if (navigator.vibrate) navigator.vibrate(15);
  } else if (type === "note") {
    // Generative magical chime for floating notes
    osc.type = "sine";
    osc.frequency.setValueAtTime(freqBase, audioCtx.currentTime);
    gain.gain.setValueAtTime(0, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.08, audioCtx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 2.0);
  } else if (type === "riser") {
    // Deep Cinematic Sub-Riser for the Preloader
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(30, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 3.0);
    gain.gain.setValueAtTime(0, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 2.0);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 4.0);

    const sub = audioCtx.createOscillator();
    sub.type = "sine";
    sub.frequency.setValueAtTime(20, audioCtx.currentTime);
    sub.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 3.0);
    const subGain = audioCtx.createGain();
    subGain.gain.setValueAtTime(0, audioCtx.currentTime);
    subGain.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 2.0);
    subGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 4.0);
    
    sub.connect(subGain); subGain.connect(audioCtx.destination);
    sub.start(); sub.stop(audioCtx.currentTime + 4.0);
  }

  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  
  const stopTime = type === "riser" ? 4.0 : type === "note" ? 2.0 : 0.15;
  osc.stop(audioCtx.currentTime + stopTime);
};
