export default class AudioManager {
  constructor(scene) {
    this.scene = scene;
    this.bgMusic = null;
    this.isMusicMuted = false;
  }

  // Метод теперь принимает ключ трека (например, 'menu-music' или 'game-music')
  playBackgroundMusic(trackKey = 'bg-music') {
    // Если уже играет эта же музыка — ничего не делаем
    if (this.bgMusic && this.bgMusic.isPlaying && this.bgMusic.key === trackKey) {
      return;
    }

    // Если играет другая музыка — останавливаем её
    if (this.bgMusic && this.bgMusic.isPlaying) {
      this.bgMusic.stop();
      this.bgMusic.destroy();
    }

    // Создаем и запускаем новую
    if (this.scene.cache.audio.exists(trackKey)) {
      this.bgMusic = this.scene.sound.add(trackKey, { 
        loop: true, 
        volume: 0.4 
      });
      this.bgMusic.play();
    } else {
      console.warn(`Аудио ${trackKey} не найдено в кэше.`);
    }
  }

  stopBackgroundMusic() {
    if (this.bgMusic && this.bgMusic.isPlaying) {
      this.bgMusic.stop();
      this.bgMusic.destroy();
      this.bgMusic = null;
    }
  }

  // Воспроизведение коротких эффектов (свайп, хлопок)
  playSound(key, volume = 0.6) {
    if (this.scene.cache.audio.exists(key)) {
      this.scene.sound.play(key, { volume: volume });
    }
  }
}