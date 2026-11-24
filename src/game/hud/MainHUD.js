import Phaser from 'phaser';

export default class MainHUD {
  constructor(scene) {
    this.scene = scene;
    this.lives = 5;
    this.coins = 0;
  }

  create() {
    // 1. Счетчик ЖИЗНЕЙ (в правом верхнем углу)
    this.scene.add.image(390, 50, 'icon-heart').setDisplaySize(50, 50);
    this.livesText = this.scene.add.text(390, 50, '5', {
      fontSize: '24px',
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5).setName('livesValue');


    // Таймер восстановления
    this.timerText = this.scene.add.text(390, 85, '', {
      fontSize: '16px',
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5);
  }
  updateLives(lives) {
    this.lives = lives;
    this.livesText.setText(lives.toString());
  }
  //Обновление таймера
  updateTimer(timeString) {
    if (this.timerText) {
      this.timerText.setText(timeString);
    }
  }
}

