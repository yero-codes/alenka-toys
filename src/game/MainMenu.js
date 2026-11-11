import Phaser from 'phaser';
import alenkaImg from '../assets/alenka.png';

export default class MainMenu extends Phaser.Scene {
  constructor() {
    super({ key: 'MainMenu' });
  }

  preload() {
    this.load.image('alenka', alenkaImg);
  }

  create() {
    this.add.image(400, 250, 'alenka').setScale(0.5);
    
    this.add.text(400, 50, 'Алёнкины игрушки', {
      fontSize: '48px',
      fontFamily: 'Arial',
      color: '#000000',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    const playButton = this.add.rectangle(400, 500, 200, 60, 0x009379)
      .setInteractive({ useHandCursor: true });
    
    this.add.text(400, 500, 'Играть', {
      fontSize: '32px',
      fontFamily: 'Arial',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    playButton.on('pointerdown', () => {
      this.scene.start('GameScene');
    });
  }
}