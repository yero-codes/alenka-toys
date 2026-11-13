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

import Board from './board/Board';
import HUD from './hud/HUD';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    this.load.image('bg-room', bgRoomImg);
    this.load.image('board-bg', boardBgImg);

    this.load.image('tile-bow', bowImg);
    this.load.image('tile-cube-blue', cubeBlueImg);
    this.load.image('tile-cube-red', cubeRedImg);
    this.load.image('tile-duck', duckImg);
    this.load.image('tile-pyramid', pyramidImg);
    this.load.image('tile-ball-green', ballGreenImg);

    this.load.image('bonus-scissors', scissorsBonusImg);
    this.load.image('bonus-umbrella', umbrellaBonusImg);
    this.load.image('bonus-palette', paletteBonusImg);
  }

  create() {
    this.isGameOver = false;
    this.add.image(215, 466, 'bg-room').setDisplaySize(430, 932);

    const boardBg = this.add.image(215, 466, 'board-bg').setDisplaySize(430, 430);

    const boardSize = 8;
    const tileSize = 46;
    const offsetX = boardBg.x - (boardSize * tileSize) / 2;
    const offsetY = boardBg.y - (boardSize * tileSize) / 2;

    const tileTypes = [
      'tile-bow', 'tile-cube-blue', 'tile-cube-red',
      'tile-duck', 'tile-pyramid', 'tile-ball-green'
    ];

    // Создаем HUD и Board
    this.hud = new HUD(this);
    this.hud.create();

    this.board = new Board(this, offsetX, offsetY, tileSize, boardSize, tileTypes);
    this.board.setHUD(this.hud);
    this.board.create();

    // Обработчик свайпа (перенесен из GameScene)
    this.input.on('pointerup', (pointer) => {
      if (!this.dragTile) return;

      const dx = pointer.x - this.startX;
      const dy = pointer.y - this.startY;

      if (Math.abs(dx) > 20 || Math.abs(dy) > 20) {
        let targetX = this.dragTile.gridX;
        let targetY = this.dragTile.gridY;

        if (Math.abs(dx) > Math.abs(dy)) {
          targetX += dx > 0 ? 1 : -1;
        } else {
          targetY += dy > 0 ? 1 : -1;
        }

        if (targetX >= 0 && targetX < boardSize && targetY >= 0 && targetY < boardSize) {
          const targetTile = this.board.tiles[targetY][targetX];
          if (targetTile) {
            this.board.swapTiles(this.dragTile, targetTile);
          }
        }
      }

      this.dragTile = null;
    });
  }

  showEndScreen(title, message) {
    this.isGameOver = true;
    this.add.rectangle(215, 466, 430, 932, 0x000000, 0.7).setDepth(999);

    this.add.text(215, 350, title, {
      fontSize: '48px',
      fontFamily: 'Arial',
      color: title === 'ПОБЕДА!' ? '#00ff00' : '#ff0000',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(1000);

    this.add.text(215, 450, message, {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#ffffff',
      align: 'center',
      wordWrap: { width: 350 }
    }).setOrigin(0.5).setDepth(1000);

    const restartBtn = this.add.text(215, 600, 'Играть снова', {
      fontSize: '32px',
      color: '#fff',
      backgroundColor: '#009379',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(1000);

    restartBtn.on('pointerdown', () => {
      this.isGameOver = false;
      this.scene.restart();
    });
  }
}