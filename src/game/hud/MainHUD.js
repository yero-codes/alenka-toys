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

    // 2. Счетчик МОНЕТ (в левом верхнем углу)
    // (Пока используем заглушку, если нет иконки монеты)
    this.scene.add.text(50, 50, '🪙 0', { 
      fontSize: '24px', 
      color: '#000', 
      fontStyle: 'bold' 
    }).setOrigin(0.5).setName('coinsValue');

    // 3. Кнопка НАСТРОЕК (в левом верхнем углу под монетами)
    // (Пока используем текст, если нет иконки шестеренки)
    const settingsBtn = this.scene.add.text(50, 90, '⚙️', { 
      fontSize: '32px' 
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    settingsBtn.on('pointerdown', () => {
      // TODO: Здесь будет открытие меню настроек
      console.log('Настройки');
    });
  }

  updateLives(lives) {
    this.lives = lives;
    this.livesText.setText(lives.toString());
  }
}