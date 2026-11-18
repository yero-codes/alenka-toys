import Phaser from 'phaser';

export default class HUD {
  constructor(scene) {
    this.scene = scene;
    this.score = 0;
    this.moves = 20;
    this.targetType = 'tile-duck';
    this.collectedDucks = 10;
  }

  create() {
    // 1. Кнопка "Назад"
    const backButton = this.scene.add.image(50, 50, 'btn-back')
      .setDisplaySize(60, 60)
      .setInteractive({ useHandCursor: true });

    backButton.on('pointerdown', () => {
      this.scene.scene.start('MainMenu');
    });

    // 2. Кнопка счетчика ходов (справа)
    const movesPanel = this.scene.add.image(380, 50, 'btn-moves')
      .setDisplaySize(60, 60);

    // 3. Текст ходов поверх кнопки
    this.movesText = this.scene.add.text(380, 50, '20', {
      fontSize: '28px',
      fontFamily: 'Arial',
      color: '#0C98C7', // Голубой
      fontStyle: 'bold',
      stroke: '#FFD700', // Желтая обводка
      strokeThickness: 4
    }).setOrigin(0.5);

    // 4. Панель целей (только для фона, если она нужна)
    // Если хотите убрать полностью голубую плашку - закомментируйте эту строку
    const hudBg = this.scene.add.image(215, 120, 'hud-bg')
      .setDisplaySize(320, 160);

    // 5. Иконка цели (уточка) + цифра
    // Размещаем уточку по центру панели, а цифру сбоку от неё
    const targetIcon = this.scene.add.image(215, 140, 'tile-duck').setDisplaySize(45, 45);
    
    // Текст цели (изначально 0)
    this.targetText = this.scene.add.text(250, 160, '10', {
      fontSize: '32px',
      fontFamily: 'Arial',
      color: 'rgb(15, 105, 224)',
      fontStyle: 'bold',
      stroke: '#FFD700',
      strokeThickness: 5
    }).setOrigin(0.5);

    // 6. Плашка УРОВНЯ
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

  // Обновление очков (можно оставить для сохранения)
  updateScore(score) {
    this.score = score;
    localStorage.setItem('currentScore', score);
  }

  // Обновление ходов (теперь цифра меняется на розовой кнопке)
  updateMoves(moves) {
    this.moves = moves;
    if (this.movesText) {
      this.movesText.setText(`${moves}`);
    }
    localStorage.setItem('currentMoves', moves);
  }

  // Обновление цели (только цифра рядом с уточкой)
  updateTarget(collected) {
    this.collectedDucks = collected;
    if (this.targetText) {
      this.targetText.setText(`${collected}`);
    }

    // Проверка на победу
    if (this.collectedDucks <= 0 && !this.scene.isGameOver) {
      this.scene.showEndScreen('ПОБЕДА!', 'Вы собрали всех уточек!');
    }
  }

  updateLevel(level) {
    this.levelValue.setText(level.toString());
  }
}