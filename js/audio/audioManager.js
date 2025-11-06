// js/audio/audioManager.js
export const AudioManager = {
  music: null,
  musicVolume: 0.3,
  sfxVolume: 0.3,

  playMusic(src) {
    // if same music, do nothing
    if (this.music && this.music.src.includes(src)) return;

    // stop previous
    if (this.music) {
      this.music.pause();
      this.music = null;
    }

    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = this.musicVolume;
    audio.play();

    this.music = audio;
  },

  stopMusic() {
    if (this.music) {
      this.music.pause();
      this.music = null;
    }
  },

  playSfx(src) {
    const sfx = new Audio(src);
    sfx.volume = this.sfxVolume;
    sfx.play();
    // we don't store it; let the browser GC it
  }
};
