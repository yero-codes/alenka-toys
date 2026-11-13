import Phaser from 'phaser';

export default class HUD {
  constructor(scene) {
    this.scene = scene;
    this.score = 0;
    this.moves = 20;
    this.targetType = 'tile-duck';
    this.collectedDucks = 0;
  }

  create() {
    // 1. Кнопка "Назад"
    const backButton = this.scene.add.image(50, 50, 'btn-back')
      .setDisplaySize(60, 60)
      .setInteractive({ useHandCursor: true });

    backButton.on('pointerdown', () => {
      this.scene.scene.start('MainMenu');
    });

    // 2. Панель целей
    const hudBg = this.scene.add.image(215, 120, 'hud-bg')
      .setDisplaySize(320, 160);

    // 3. Текст (Очки, Ходы, Цель)
    this.scoreText = this.scene.add.text(215, 80, 'Очки: 0', {
      fontSize: '20px',
      fontFamily: 'Arial',
      color: '#000',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.movesText = this.scene.add.text(215, 115, 'Ходы: 20', {
      fontSize: '20px',
      fontFamily: 'Arial',
      color: '#000',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.targetText = this.scene.add.text(215, 150, 'Цель: 0/10 уточек', {
      fontSize: '20px',
      fontFamily: 'Arial',
      color: '#000',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // 4. Плашка УРОВНЯ
    const levelBg = this.scene.add.image(215, 225, 'level-bg')
      .setDisplaySize(240, 60);

    this.levelText = this.scene.add.text(190, 225, 'Уровень:', {
      fontSize: '22px',
      fontFamily: 'Arial',
      color: '#003366',
      fontStyle: 'bold',
      stroke: '#66ccff',
      strokeThickness: 4
    }).setOrigin(0.5);

    this.levelValue = this.scene.add.text(260, 225, '1', {
      fontSize: '22px',
      fontFamily: 'Arial',
      color: '#660033',
      fontStyle: 'bold',
      stroke: '#cc99ff',
      strokeThickness: 4
    }).setOrigin(0.5);
  }

  updateScore(score) {
    this.score = score;
    this.scoreText.setText('Очки: ' + this.score);
  }

  updateMoves(moves) {
    this.moves = moves;
    this.movesText.setText('Ходы: ' + this.moves);
  }

  updateTarget(collected) {
    this.collectedDucks = collected;
    this.targetText.setText(`Цель: ${this.collectedDucks} / 10 уточек`);
  }

  updateLevel(level) {
    this.levelValue.setText(level.toString());
  }
}