import Phaser from 'phaser';
import bgRoomImg from '../assets/bg-room.png';
import boardBgImg from '../assets/board-bg.png';
import bowImg from '../assets/tile-bow.png';
import cubeBlueImg from '../assets/tile-cube-blue.png';
import cubeRedImg from '../assets/tile-cube-red.png';
import duckImg from '../assets/tile-duck.png';
import pyramidImg from '../assets/tile-pyramid.png';
import ballGreenImg from '../assets/tile-ball-green.png';
import scissorsBonusImg from '../assets/tile-scissors.png';
import umbrellaBonusImg from '../assets/tile-umbrella.png';
import paletteBonusImg from '../assets/tile-palette.png';
import btnBackImg from '../assets/btn-back.png';
import hudBgImg from '../assets/hud-bg.png';
import Board from './board/Board';
import HUD from './hud/HUD';
import levelBgImg from '../assets/level-bg.png';
import iconHeartImg from '../assets/icon-heart.png';
import btnMovesImg from '../assets/btn-moves.png';
import { getLevelData } from './Levels';
import AudioManager from './AudioManager';
import bgMusic from '../assets/bg-music.mp3';
import swipeSnd from '../assets/swipe.mp3';
import scissorsSnd from '../assets/scissors.mp3';
import umbrellaSnd from '../assets/umbrella.mp3';
import paletteSnd from '../assets/palette.mp3';
import victorySnd from '../assets/victory.mp3';
import failSnd from '../assets/fail.mp3';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    this.load.image('bg-room', bgRoomImg);
    this.load.image('board-bg', boardBgImg);
    this.load.image('icon-heart', iconHeartImg);
    this.load.image('tile-bow', bowImg);
    this.load.image('tile-cube-blue', cubeBlueImg);
    this.load.image('tile-cube-red', cubeRedImg);
    this.load.image('tile-duck', duckImg);
    this.load.image('tile-pyramid', pyramidImg);
    this.load.image('tile-ball-green', ballGreenImg);
    this.load.image('bonus-scissors', scissorsBonusImg);
    this.load.image('bonus-umbrella', umbrellaBonusImg);
    this.load.image('bonus-palette', paletteBonusImg);
    this.load.image('btn-back', btnBackImg);
    this.load.image('hud-bg', hudBgImg);
    this.load.image('level-bg', levelBgImg);
    this.load.image('btn-moves', btnMovesImg);
    this.load.audio('bg-music', bgMusic);
    this.load.audio('swipe', swipeSnd);
    this.load.audio('scissors', scissorsSnd);
    this.load.audio('umbrella', umbrellaSnd);
    this.load.audio('palette', paletteSnd);
    this.load.audio('victory', victorySnd);
    this.load.audio('fail', failSnd);
  }

  create() {
    // Создаем менеджер звука
    this.audioManager = new AudioManager(this);

    // Фон комнаты, картинка с окном
    this.add.image(215, 466, 'bg-room').setDisplaySize(430, 932);

    // Голубая подложка, игровое поле 8х8
    const boardBg = this.add.image(215, 500, 'board-bg').setDisplaySize(420, 420);

    // Получаем уровень
    this.currentLevel = parseInt(localStorage.getItem('currentLevel')) || 1;
    const levelData = getLevelData(this.currentLevel);

    // Создаем HUD
    this.hud = new HUD(this);
    this.hud.initLevel(levelData);
    this.hud.updateLevel(this.currentLevel);

    // Вычисляем координаты для центрирования доски
    const boardSize = 8;
    const tileSize = 45;
    const boardWidth = boardSize * tileSize;
    const boardHeight = boardSize * tileSize;

    const boardX = boardBg.x - (boardWidth / 2);
    const boardY = boardBg.y - (boardHeight / 2);

    // ФОРМИРУЕМ СПИСОК ФИШЕК НА ОСНОВЕ ЦЕЛЕЙ УРОВНЯ
    let availableTiles = levelData.targets.map(t => t.type);

    // Если целей мало (например, 2), добавляем случайные фишки для разнообразия
    const allPossibleTiles = ['tile-duck', 'tile-pyramid', 'tile-bow', 'tile-cube-blue', 'tile-cube-red', 'tile-ball-green'];
    allPossibleTiles.forEach(tile => {
      if (availableTiles.length < 4 && !availableTiles.includes(tile)) {
        availableTiles.push(tile);
      }
    });

    // Создаем доску с новым списком фишек
    this.board = new Board(this, boardX, boardY, tileSize, boardSize, availableTiles);
    this.board.setHUD(this.hud);
    this.board.create();

    // Обработчик свайпа (ВОССТАНОВЛЕН И ИСПРАВЛЕН)
    this.input.on('pointerup', (pointer) => {
      if (!this.dragTile) return;

      const dx = pointer.x - this.startX;
      const dy = pointer.y - this.startY;

      // Если свайп был достаточно длинным (больше 20 пикселей)
      if (Math.abs(dx) > 20 || Math.abs(dy) > 20) {
        let targetX = this.dragTile.gridX;
        let targetY = this.dragTile.gridY;

        // Определяем направление
        if (Math.abs(dx) > Math.abs(dy)) {
          targetX += dx > 0 ? 1 : -1;
        } else {
          targetY += dy > 0 ? 1 : -1;
        }

        // Проверяем, не выходим ли за границы поля
        if (targetX >= 0 && targetX < this.board.boardSize && targetY >= 0 && targetY < this.board.boardSize) {
          const targetTile = this.board.tiles[targetY][targetX];

          // Если там есть фишка — меняем их местами
          if (targetTile) {
            this.board.swapTiles(this.dragTile, targetTile);
            this.audioManager.playSound('swipe');

            // Проверяем конец игры чуть позже, после анимации
            this.time.delayedCall(500, () => this.checkGameState());
          }
        }
      }

      // Сбрасываем активную фишку
      this.dragTile = null;
    });

    // 👇 ДОБАВЛЯЕМ ЭТОТ БЛОК:
    // При закрытии сцены (переход в меню, рестарт) — останавливаем и уничтожаем музыку
    this.events.once('shutdown', () => {
      this.audioManager.destroy();
    });
  }

  checkGameState() {
    if (this.isGameOver) return;

    // Если ходы кончились, а победа не была вызвана через HUD.collectTile() — это поражение
    if (this.hud.moves <= 0) {
      this.showEndScreen('ПОПРОБУЙ ЕЩЕ!', 'У вас закончились ходы!');
    }
  }



  showEndScreen(title, message) {
    // ДОБАВЛЕНО: Защита от повторного вызова окна
    if (this.isGameOver) return;
        this.isGameOver = true;
        //  ДОБАВЛЯЕМ МУЗЫКУ ДЛЯ ЭКРАНА
    if (title === 'ПОБЕДА!') {
      this.audioManager.playSound('victory', 1.0); // Победа
    } else {
      this.audioManager.playSound('fail', 1.0);    // Поражение (тише)
    }

    //  ЕСЛИ ЭТО ПОРАЖЕНИЕ, ОТНИМАЕМ ЖИЗНЬ
    if (title === 'ПОПРОБУЙ ЕЩЕ!') {
      let currentLives = parseInt(localStorage.getItem('lives')) || 5;
      currentLives = Math.max(0, currentLives - 1); // Не уходим в минус
      localStorage.setItem('lives', currentLives);

      //запускаем таймер восстановления при потере жизни
      if (currentLives < 5) {
        localStorage.setItem('lastLivesRegenTime', Date.now());
      }

      if (currentLives === 0) {
        // TODO: Здесь будет блокировка игры и таймер
        message = 'Жизни закончились! Ждите восстановления.';
      }
    }

    // затемнение фона
    this.add.rectangle(215, 466, 430, 932, 0x000000, 0.7).setDepth(999);
    // заголовок
    this.add.text(215, 350, title, {
      fontSize: '48px',
      fontFamily: 'Arial',
      color: title === 'ПОБЕДА!' ? '#00ff00' : '#ff0000',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(1000);

    // текст сообщения
    this.add.text(215, 450, message, {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#ffffff',
      align: 'center',
      wordWrap: { width: 350 }
    }).setOrigin(0.5).setDepth(1000);

    // Кнопка перезапуска
    const restartBtn = this.add.text(215, 600, 'Играть снова', {
      fontSize: '32px',
      color: '#fff',
      backgroundColor: '#009379',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(1000);

    restartBtn.on('pointerdown', () => {
      this.isGameOver = false;

      // Если это была победа, повышаем уровень. Если поражение — нет.
      if (title === 'ПОБЕДА!') {
        this.currentLevel++;
        localStorage.setItem('currentLevel', this.currentLevel);
      }

      // Если жизни кончились, отправляем в меню, а не рестартим
      let currentLives = parseInt(localStorage.getItem('lives')) || 5;
      if (currentLives === 0) {
        this.scene.start('MainMenu');
        return;
      }

      this.hud.updateLevel(this.currentLevel);
      this.scene.restart();
    });
  }
}