/**
 * AAA Procedural Web Audio Engine for "BUTSU NO BAKA: TOKYO 3000"
 * Synthesizes Edo-period folklore instruments (koto, shakuhachi, suzu temple bells)
 * and Cyber-noir combat audio (hitstops, heavy cleaves, cyber pulses).
 * Zero remote dependencies, instant start, works offline.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private bgmGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.75;
  private bgmOscs: OscillatorNode[] = [];
  private melodyTimer: number | null = null;
  private droneTimer: number | null = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.bgmGain = this.ctx.createGain();
        this.sfxGain = this.ctx.createGain();

        this.bgmGain.connect(this.masterGain);
        this.sfxGain.connect(this.masterGain);
        this.masterGain.connect(this.ctx.destination);
        this.updateGain();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    this.updateGain();
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    this.updateGain();
  }

  private updateGain() {
    if (!this.ctx || !this.masterGain || !this.bgmGain || !this.sfxGain) return;
    const actual = this.isMuted ? 0 : this.volume;
    this.masterGain.gain.setValueAtTime(actual, this.ctx.currentTime);
    this.bgmGain.gain.setValueAtTime(0.28, this.ctx.currentTime);
    this.sfxGain.gain.setValueAtTime(0.85, this.ctx.currentTime);
  }

  public playSfx(
    type:
      | 'click'
      | 'dialogue'
      | 'discovery'
      | 'slash'
      | 'heavy_hit'
      | 'guard'
      | 'dodge'
      | 'ritual'
      | 'victory'
      | 'defeat'
      | 'sonar'
      | 'special'
  ) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;

    try {
      if (type === 'click') {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, t);
        osc.frequency.exponentialRampToValueAtTime(220, t + 0.035);
        g.gain.setValueAtTime(0.2, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.035);
        osc.connect(g);
        g.connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + 0.04);
      } else if (type === 'dialogue') {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'triangle';
        const f = 400 + Math.random() * 120;
        osc.frequency.setValueAtTime(f, t);
        g.gain.setValueAtTime(0.06, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
        osc.connect(g);
        g.connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + 0.032);
      } else if (type === 'sonar') {
        // High-tech scanner ping
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1400, t);
        osc.frequency.exponentialRampToValueAtTime(1800, t + 0.1);
        osc.frequency.exponentialRampToValueAtTime(900, t + 0.3);
        g.gain.setValueAtTime(0.25, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.32);
        osc.connect(g);
        g.connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + 0.33);
      } else if (type === 'discovery') {
        // Temple bell / Insen pentatonic arpeggio (D, Eb, G, A, Bb)
        const notes = [587.33, 622.25, 783.99, 880.0, 932.33, 1174.66];
        notes.forEach((freq, idx) => {
          const osc = this.ctx!.createOscillator();
          const g = this.ctx!.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, t + idx * 0.06);
          g.gain.setValueAtTime(0.22, t + idx * 0.06);
          g.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.06 + 0.7);
          osc.connect(g);
          g.connect(this.sfxGain!);
          osc.start(t + idx * 0.06);
          osc.stop(t + idx * 0.06 + 0.75);
        });
      } else if (type === 'slash') {
        // Filtered white noise sword swoosh
        const bufferSize = this.ctx.sampleRate * 0.12;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(2600, t);
        filter.frequency.exponentialRampToValueAtTime(450, t + 0.12);
        filter.Q.value = 3.2;
        const g = this.ctx.createGain();
        g.gain.setValueAtTime(0.65, t);
        g.gain.exponentialRampToValueAtTime(0.01, t + 0.12);
        noise.connect(filter);
        filter.connect(g);
        g.connect(this.sfxGain);
        noise.start(t);
        noise.stop(t + 0.12);
      } else if (type === 'heavy_hit') {
        // Deep bass impact rumble + hitstop punch
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(160, t);
        osc.frequency.exponentialRampToValueAtTime(32, t + 0.38);
        g.gain.setValueAtTime(0.9, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
        osc.connect(g);
        g.connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + 0.42);

        // Sub-thump
        const sub = this.ctx.createOscillator();
        const subG = this.ctx.createGain();
        sub.type = 'sine';
        sub.frequency.setValueAtTime(75, t);
        sub.frequency.exponentialRampToValueAtTime(28, t + 0.28);
        subG.gain.setValueAtTime(0.8, t);
        subG.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
        sub.connect(subG);
        subG.connect(this.sfxGain);
        sub.start(t);
        sub.stop(t + 0.3);
      } else if (type === 'guard') {
        // High-pitched katana steel parry
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1450, t);
        osc.frequency.exponentialRampToValueAtTime(850, t + 0.2);
        g.gain.setValueAtTime(0.6, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
        osc.connect(g);
        g.connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + 0.23);
      } else if (type === 'dodge') {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(250, t);
        osc.frequency.exponentialRampToValueAtTime(750, t + 0.08);
        osc.frequency.exponentialRampToValueAtTime(140, t + 0.22);
        g.gain.setValueAtTime(0.35, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
        osc.connect(g);
        g.connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + 0.23);
      } else if (type === 'special') {
        // Celestial Omni-slash: ascending sweep + heavy chord
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, t);
        osc.frequency.exponentialRampToValueAtTime(1200, t + 0.25);
        osc.frequency.exponentialRampToValueAtTime(60, t + 0.55);
        g.gain.setValueAtTime(0.7, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
        osc.connect(g);
        g.connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + 0.62);
      } else if (type === 'ritual') {
        // Arcane harmonic swell
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc1.type = 'sine';
        osc2.type = 'triangle';
        osc1.frequency.setValueAtTime(110, t);
        osc2.frequency.setValueAtTime(221, t);
        osc1.frequency.linearRampToValueAtTime(146.8, t + 0.6);
        osc2.frequency.linearRampToValueAtTime(293.6, t + 0.6);
        g.gain.setValueAtTime(0.08, t);
        g.gain.linearRampToValueAtTime(0.45, t + 0.3);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.85);
        osc1.connect(g);
        osc2.connect(g);
        g.connect(this.sfxGain);
        osc1.start(t);
        osc2.start(t);
        osc1.stop(t + 0.9);
        osc2.stop(t + 0.9);
      } else if (type === 'victory') {
        [220, 293.66, 329.63, 440, 587.33].forEach((freq, idx) => {
          const osc = this.ctx!.createOscillator();
          const g = this.ctx!.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, t + idx * 0.08);
          g.gain.setValueAtTime(0.35, t + idx * 0.08);
          g.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.08 + 1.4);
          osc.connect(g);
          g.connect(this.sfxGain!);
          osc.start(t + idx * 0.08);
          osc.stop(t + idx * 0.08 + 1.45);
        });
      } else if (type === 'defeat') {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, t);
        osc.frequency.exponentialRampToValueAtTime(40, t + 0.9);
        g.gain.setValueAtTime(0.5, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.95);
        osc.connect(g);
        g.connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + 1.0);
      }
    } catch {
      // Audio safety catch
    }
  }

  public startAtmosphericAmbience() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.bgmGain) return;
    this.stopAtmosphericAmbience();

    try {
      // 1. Deep Sub Drone (55Hz / A1)
      const droneOsc = this.ctx.createOscillator();
      const droneFilter = this.ctx.createBiquadFilter();
      droneOsc.type = 'sawtooth';
      droneOsc.frequency.setValueAtTime(55, this.ctx.currentTime);
      droneFilter.type = 'lowpass';
      droneFilter.frequency.setValueAtTime(160, this.ctx.currentTime);
      droneOsc.connect(droneFilter);
      droneFilter.connect(this.bgmGain);
      droneOsc.start();
      this.bgmOscs.push(droneOsc);

      // 2. Harmonic Pad (110Hz + 165Hz)
      const padOsc = this.ctx.createOscillator();
      const padGain = this.ctx.createGain();
      padOsc.type = 'sine';
      padOsc.frequency.setValueAtTime(110, this.ctx.currentTime);
      padGain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      padOsc.connect(padGain);
      padGain.connect(this.bgmGain);
      padOsc.start();
      this.bgmOscs.push(padOsc);

      // 3. Generative Koto / Shakuhachi Pentatonic Phrase Sequence
      const pentatonicScale = [220, 246.94, 293.66, 329.63, 392.0, 440, 493.88, 587.33];
      this.melodyTimer = window.setInterval(() => {
        if (!this.ctx || this.isMuted || !this.bgmGain) return;
        const now = this.ctx.currentTime;
        const note = pentatonicScale[Math.floor(Math.random() * pentatonicScale.length)];

        // Koto string pluck emulation
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note, now);
        g.gain.setValueAtTime(0.001, now);
        g.gain.linearRampToValueAtTime(0.09, now + 0.04);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);
        osc.connect(g);
        g.connect(this.bgmGain);
        osc.start(now);
        osc.stop(now + 2.85);
      }, 3400);
    } catch {
      // Audio safety catch
    }
  }

  public stopAtmosphericAmbience() {
    this.bgmOscs.forEach(o => {
      try {
        o.stop();
        o.disconnect();
      } catch {
        // Clean
      }
    });
    this.bgmOscs = [];
    if (this.melodyTimer) {
      clearInterval(this.melodyTimer);
      this.melodyTimer = null;
    }
    if (this.droneTimer) {
      clearInterval(this.droneTimer);
      this.droneTimer = null;
    }
  }
}

export const soundEngine = new SoundEngine();
