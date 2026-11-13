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
    // Кнопка "Назад"
    const backButton = this.scene.add.text(20, 20, '← Назад', {
      fontSize: '18px',
      color: '#000',
      backgroundColor: '#fff',
      padding: { x: 8, y: 4 }
    }).setInteractive({ useHandCursor: true });

    backButton.on('pointerdown', () => {
      this.scene.scene.start('MainMenu');
    });

    // Счетчики
    this.scoreText = this.scene.add.text(20, 60, 'Очки: 0', {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#000',
      backgroundColor: '#fff',
      padding: { x: 10, y: 5 }
    });

    this.movesText = this.scene.add.text(20, 100, 'Ходы: 20', {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#000',
      backgroundColor: '#fff',
      padding: { x: 10, y: 5 }
    });

    this.targetText = this.scene.add.text(20, 140, 'Цель: 0/10 уточек', {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#000',
      backgroundColor: '#fff',
      padding: { x: 10, y: 5 }
    });
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
}