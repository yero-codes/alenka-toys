export default class AudioManager {
  constructor(scene) {
    this.scene = scene;
    this.bgMusic = null;
  }

  // Метод теперь проверяет настройку из localStorage перед запуском
  playBackgroundMusic(trackKey = 'bg-music') {
    // Если музыка выключена в настройках — не запускаем
    const isMusicMuted = localStorage.getItem('musicMuted') === 'true';
    if (isMusicMuted) return;

    if (this.bgMusic && this.bgMusic.isPlaying && this.bgMusic.key === trackKey) {
      return;
    }

    if (this.bgMusic && this.bgMusic.isPlaying) {
      this.bgMusic.stop();
      this.bgMusic.destroy();
    }

    if (this.scene.cache.audio.exists(trackKey)) {
      this.bgMusic = this.scene.sound.add(trackKey, { 
        loop: true, 
        volume: 0.15 // Сделали тише, как договаривались ранее
      });
      this.bgMusic.play();
    }
  }

  stopBackgroundMusic() {
    if (this.bgMusic && this.bgMusic.isPlaying) {
      this.bgMusic.stop();
      this.bgMusic.destroy();
      this.bgMusic = null;
    }
  }

  // Метод теперь проверяет настройку звуков
  playSound(key, volume = 0.8) {
    const isSfxMuted = localStorage.getItem('sfxMuted') === 'true';
    if (isSfxMuted) return; // Если звуки выключены — не играем

    if (this.scene.cache.audio.exists(key)) {
      this.scene.sound.play(key, { volume: volume });
    }
  }

  destroy() {
    if (this.bgMusic) {
      this.bgMusic.stop();
      this.bgMusic.destroy();
      this.bgMusic = null;
    }
  }
}