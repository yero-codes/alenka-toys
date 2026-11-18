import Phaser from 'phaser';

export default class HUD {
  constructor(scene) {
    this.scene = scene;
    this.score = 0;
    this.moves = 0;
    this.targets = []; 
    this.targetTexts = {}; 
  }

  initLevel(levelData) {
    this.moves = levelData.moves;
    this.targets = levelData.targets.map(t => ({
      type: t.type,
      remaining: t.count
    }));
    
    this.createUI();
  }

  createUI() {
   // Очищаем старый интерфейс (если был)
    this.scene.children.list.filter(child => child.getData('isHUD')).forEach(child => child.destroy());

    // 1. Кнопка "Назад"
    const backButton = this.scene.add.image(50, 50, 'btn-back')
      .setDisplaySize(60, 60)
      .setInteractive({ useHandCursor: true })
      .setData('isHUD', true);

    backButton.on('pointerdown', () => {
      this.scene.scene.start('MainMenu');
    });

    // 2. Кнопка счетчика ходов (справа)
    this.scene.add.image(380, 50, 'btn-moves')
      .setDisplaySize(60, 60)
      .setData('isHUD', true);

    // 3. Текст ходов поверх кнопки
    this.movesText = this.scene.add.text(380, 50, this.moves.toString(), {
      fontSize: '28px', 
      fontFamily: 'Arial', 
      color: '#0C98C7', 
      fontStyle: 'bold', 
      stroke: '#FFD700', 
      strokeThickness: 4
    }).setOrigin(0.5).setData('isHUD', true);

    // 4. Панель целей (голубая плашка)
    this.scene.add.image(215, 120, 'hud-bg')
      .setDisplaySize(320, 160) // Размер плашки
      .setData('isHUD', true);

    // 5. Рисуем цели (динамически)
    // Центрируем их внутри плашки
    const totalTargets = this.targets.length;
    const spacing = 70; // Расстояние между целями
    // Вычисляем начальную позицию X, чтобы цели были по центру
    const startX = 215 - ((totalTargets - 1) * spacing) / 2; 
    const startY = 140;

    this.targets.forEach((target, index) => {
      const x = startX + (index * spacing);
      
      // Иконка фишки
      this.scene.add.image(x, startY, target.type)
        .setDisplaySize(45, 45)
        .setData('isHUD', true);
      
      // Текст с цифрой
      const textObj = this.scene.add.text(x + 25, startY + 10, target.remaining.toString(), {
        fontSize: '32px', 
        fontFamily: 'Arial', 
        color: 'rgb(15, 105, 224)', // Синий цвет цифр
        fontStyle: 'bold', 
        stroke: '#FFD700', 
        strokeThickness: 5
      }).setOrigin(0.5).setData('isHUD', true);

      this.targetTexts[target.type] = textObj;
    });

    // 6. Плашка УРОВНЯ
    this.scene.add.image(215, 225, 'level-bg')
      .setDisplaySize(240, 60)
      .setData('isHUD', true);

    this.scene.add.text(190, 225, 'Уровень:', {
      fontSize: '22px', 
      fontFamily: 'Arial', 
      color: '#003366', 
      fontStyle: 'bold', 
      stroke: '#66ccff', 
      strokeThickness: 4
    }).setOrigin(0.5).setData('isHUD', true);

    this.levelValue = this.scene.add.text(260, 225, '1', {
      fontSize: '22px', 
      fontFamily: 'Arial', 
      color: '#660033', 
      fontStyle: 'bold', 
      stroke: '#cc99ff', 
      strokeThickness: 4
    }).setOrigin(0.5).setData('isHUD', true);
  } 
  updateScore(score) {
    this.score = score;
    localStorage.setItem('currentScore', score);
  }

  updateMoves(moves) {
    this.moves = moves;
    if (this.movesText) {
      this.movesText.setText(`${moves}`);
    }
    localStorage.setItem('currentMoves', moves);
  }

  // 👇 Новый метод для сбора фишек
  collectTile(type) {
    const target = this.targets.find(t => t.type === type);
    if (!target || target.remaining <= 0) return;

    target.remaining -= 1;
    
    if (this.targetTexts[type]) {
      this.targetTexts[type].setText(target.remaining.toString());
    }

    // Проверка на победу
    const isWin = this.targets.every(t => t.remaining <= 0);
    if (isWin && !this.scene.isGameOver) {
      this.scene.showEndScreen('ПОБЕДА!', '');
    }
  }

  updateLevel(level) {
    if (this.levelValue) {
      this.levelValue.setText(level.toString());
    }
  }
}