// Soft romantic ambient music generated with the Web Audio API.
// If the couple places a song in src/assets/music, that song plays instead.

import { getCustomTrack } from "./musicSource";

class AmbientMusic {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.delay = null;
    this.playing = false;
    this.timer = null;
    this.step = 0;
    this.tempo = 2.0; // seconds per note (slow & dreamy)

    // custom song support
    this.audioEl = null;
    this.usingCustom = false;
    this.fadeTimer = null;

    // I–V–vi–IV progression in C major, arpeggiated (frequencies in Hz)
    this.progression = [
      [261.63, 329.63, 392.0, 523.25], // C major
      [196.0, 293.66, 392.0, 493.88], // G major
      [220.0, 329.63, 440.0, 523.25], // A minor
      [174.61, 261.63, 349.23, 440.0], // F major
    ];
  }

  _ensure() {
    if (this.ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AC();

    this.master = this.ctx.createGain();
    this.master.gain.value = 0; // fade in later
    this.master.connect(this.ctx.destination);

    // gentle feedback delay for warmth / space
    this.delay = this.ctx.createDelay();
    this.delay.delayTime.value = 0.32;
    const fb = this.ctx.createGain();
    fb.gain.value = 0.28;
    const wet = this.ctx.createGain();
    wet.gain.value = 0.35;
    this.delay.connect(fb);
    fb.connect(this.delay);
    this.delay.connect(wet);
    wet.connect(this.master);
    this._delayInput = this.delay;
  }

  _note(freq, time, dur = 2.6) {
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const g = ctx.createGain();

    osc.type = "sine";
    osc2.type = "triangle";
    osc.frequency.value = freq;
    osc2.frequency.value = freq * 2; // soft overtone
    const g2 = ctx.createGain();
    g2.gain.value = 0.12;

    // soft attack + long release (bell/piano-like)
    const peak = 0.5;
    g.gain.setValueAtTime(0.0001, time);
    g.gain.exponentialRampToValueAtTime(peak, time + 0.06);
    g.gain.exponentialRampToValueAtTime(0.0001, time + dur);

    osc.connect(g);
    osc2.connect(g2);
    g2.connect(g);
    g.connect(this.master);
    g.connect(this._delayInput);

    osc.start(time);
    osc2.start(time);
    osc.stop(time + dur + 0.1);
    osc2.stop(time + dur + 0.1);
  }

  _schedule() {
    if (!this.playing) return;
    const chord = this.progression[Math.floor(this.step / 4) % this.progression.length];
    const idxInChord = this.step % 4;
    const now = this.ctx.currentTime;
    // main arpeggio note
    this._note(chord[idxInChord], now + 0.02, 2.8);
    // soft higher shimmer every other note
    if (idxInChord % 2 === 0) {
      this._note(chord[(idxInChord + 2) % 4] * 2, now + 0.02, 2.2);
    }
    this.step++;
    this.timer = setTimeout(() => this._schedule(), this.tempo * 1000);
  }

  _fadeAudio(el, from, to, ms, onDone) {
    if (this.fadeTimer) clearInterval(this.fadeTimer);
    const steps = 24;
    let i = 0;
    el.volume = from;
    this.fadeTimer = setInterval(() => {
      i++;
      el.volume = Math.max(0, Math.min(1, from + (to - from) * (i / steps)));
      if (i >= steps) {
        clearInterval(this.fadeTimer);
        this.fadeTimer = null;
        if (onDone) onDone();
      }
    }, ms / steps);
  }

  start() {
    // Prefer the couple's custom song if present
    const track = getCustomTrack();
    if (track) {
      if (!this.audioEl) {
        this.audioEl = new Audio(track);
        this.audioEl.loop = true;
        this.audioEl.preload = "auto";
      }
      this.usingCustom = true;
      this.playing = true;
      const el = this.audioEl;
      el.volume = 0;
      const p = el.play();
      if (p && p.catch) p.catch(() => {});
      this._fadeAudio(el, 0, 0.5, 2500);
      return;
    }

    // Fallback: generated ambient melody
    this._ensure();
    if (this.ctx.state === "suspended") this.ctx.resume();
    if (this.playing) return;
    this.playing = true;
    const t = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(t);
    this.master.gain.setValueAtTime(0.0001, t);
    this.master.gain.exponentialRampToValueAtTime(0.14, t + 3);
    this._schedule();
  }

  stop() {
    if (this.usingCustom && this.audioEl) {
      this.playing = false;
      const el = this.audioEl;
      this._fadeAudio(el, el.volume, 0, 900, () => el.pause());
      return;
    }
    if (!this.ctx || !this.playing) return;
    this.playing = false;
    if (this.timer) clearTimeout(this.timer);
    const t = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(t);
    this.master.gain.setValueAtTime(this.master.gain.value, t);
    this.master.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);
  }

  toggle() {
    if (this.playing) this.stop();
    else this.start();
    return this.playing;
  }

  isPlaying() {
    return this.playing;
  }
}

const ambientMusic = new AmbientMusic();
export default ambientMusic;
