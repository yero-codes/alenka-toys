import Phaser from 'phaser';
import alenkaImg from '../assets/alenka.png';
import playBtnImg from '../assets/play-btn.png';
import titleImg from '../assets/title.png';
import bgRoomImg from '../assets/bg-room.png';
import iconHeartImg from '../assets/icon-heart.png'; // <-- 1. Добавили импорт
import MainHUD from './hud/MainHUD';
import bgMusic from '../assets/bg-music.mp3';
import AudioManager from './AudioManager';

const MAX_LIVES = 5;
const REGEN_TIME_MS = 5 * 60 * 1000; // 5 минут

export default class MainMenu extends Phaser.Scene {
  constructor() {
    super({ key: 'MainMenu' });
  }

  preload() {
    // Загружаем все картинки
    this.load.image('bg-room', bgRoomImg);
    this.load.image('alenka', alenkaImg);
    this.load.image('play-btn', playBtnImg);
    this.load.image('title', titleImg);
    this.load.image('icon-heart', iconHeartImg);
    this.load.audio('menu-music', bgMusic);
  }

  create() {
    // 1. Фон комнаты (на весь экран 430x932)
    this.add.image(215, 466, 'bg-room').setDisplaySize(430, 932);

    // 2. Заголовок
    this.add.image(215, 150, 'title').setScale(0.9);

    // 3. Куколка
    const alenka = this.add.image(280, 650, 'alenka').setScale(1.1);
    alenka.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);

    // 4. Кнопка "Играть"
    const playBtn = this.add.image(130, 650, 'play-btn').setDisplaySize(150, 240);
    playBtn.setInteractive({ useHandCursor: true });
    playBtn.on('pointerdown', () => this.scene.start('GameScene'));
    playBtn.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
     
     this.audioManager = new AudioManager(this);
    // Запускаем музыку меню (она будет крутиться, пока игрок в меню)
    this.audioManager.playBackgroundMusic('menu-music');

    // При переходе в игру — останавливаем музыку меню
    playBtn.on('pointerdown', () => {
      this.audioManager.stopBackgroundMusic();
      this.scene.start('GameScene');
    });

    // 5. HUD (создаем В КОНЦЕ, чтобы сердечки были поверх всех элементов)
    this.mainHud = new MainHUD(this);
    this.mainHud.create();

    // Загружаем жизни из localStorage и обновляем
    let savedLives = parseInt(localStorage.getItem('lives'));
    if (isNaN(savedLives)) {
      savedLives = MAX_LIVES;
      localStorage.setItem('lives', MAX_LIVES);
      localStorage.setItem('lastLivesRegenTime', Date.now());
    }
    // Отображение жизней на старте
    this.mainHud.updateLives(savedLives);

    // Запускаем проверку на восстановление жизней каждую секунду
    this.checkLivesRegen();
    this.time.addEvent({
      delay: 1000,
      callback: this.checkLivesRegen,
      callbackScope: this,
      loop: true
    });
  }

  checkLivesRegen() {
    let currentLives = parseInt(localStorage.getItem('lives')) || MAX_LIVES;
    let lastRegenTime = parseInt(localStorage.getItem('lastLivesRegenTime')) || Date.now();

    if (currentLives < MAX_LIVES) {
      const now = Date.now();
      const timePassed = now - lastRegenTime;
      const livesToAdd = Math.floor(timePassed / REGEN_TIME_MS);

      if (livesToAdd > 0) {
        currentLives = Math.min(MAX_LIVES, currentLives + livesToAdd);
        localStorage.setItem('lives', currentLives);
        // Сдвигаем время восстановления
        localStorage.setItem('lastLivesRegenTime', now - (timePassed % REGEN_TIME_MS));

        this.mainHud.updateLives(currentLives);
      }
    }
  }
}