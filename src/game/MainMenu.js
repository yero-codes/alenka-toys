import Phaser from 'phaser';
import alenkaImg from '../assets/alenka.png';
import playBtnImg from '../assets/play-btn.png';
import titleImg from '../assets/title.png';
import bgRoomImg from '../assets/bg-room.png';

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
  }

  create() {
    // 1. Фон комнаты (на весь экран 430x932)
    this.add.image(215, 466, 'bg-room').setDisplaySize(430, 932);

    // 2. Заголовок (размер из Figma: 158x362, но ставим по центру сверху)
    this.add.image(215, 150, 'title').setScale(0.9);

    // 3. Куколка (размер из Figma: 158x362)
    this.add.image(280, 650, 'alenka').setScale(1.1);

    // 4. Кнопка "Играть" (мяч с надписью)
    // В Figma он был примерно 150x150, ставим такой же размер
    const playBtn = this.add.image(130, 800, 'play-btn').setDisplaySize(150, 150);
    playBtn.setInteractive({ useHandCursor: true });
    playBtn.on('pointerdown', () => this.scene.start('GameScene'));
  }
}