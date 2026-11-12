import Phaser from 'phaser';
import bgRoomImg from '../assets/bg-room.png';
import boardBgImg from '../assets/board-bg.png';
import bowImg from '../assets/tile-bow.png';
import cubeBlueImg from '../assets/tile-cube-blue.png';
import cubeRedImg from '../assets/tile-cube-red.png';
import duckImg from '../assets/tile-duck.png';
import scissorsImg from '../assets/tile-scissors.png';
import paletteImg from '../assets/tile-palette.png';
import pyramidImg from '../assets/tile-pyramid.png';
import umbrellaImg from '../assets/tile-umbrella.png';
import ballGreenImg from '../assets/tile-ball-green.png';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    // Загружаем фон и рамку поля
    this.load.image('bg-room', bgRoomImg);
    this.load.image('board-bg', boardBgImg);

    // Загружаем фишки
    this.load.image('tile-bow', bowImg);
    this.load.image('tile-cube-blue', cubeBlueImg);
    this.load.image('tile-cube-red', cubeRedImg);
    this.load.image('tile-duck', duckImg);
    this.load.image('tile-scissors', scissorsImg);
    this.load.image('tile-palette', paletteImg);
    this.load.image('tile-pyramid', pyramidImg);
    this.load.image('tile-umbrella', umbrellaImg);
    this.load.image('tile-ball-green', ballGreenImg);
  }

    create() {
    // 1. Фон комнаты (на весь экран 430x932)
    this.add.image(215, 466, 'bg-room').setDisplaySize(430, 932);

    // 2. Ставим рамку поля (по центру)
    const boardBg = this.add.image(215, 466, 'board-bg').setDisplaySize(430, 430);

    // 3. Настройки сетки (подгоняем под рамку)
    this.boardSize = 8;
    // Размер ячейки = (размер рамки - отступы) / 8
    // Рамка 430px, но у неё есть внутренние отступы (примерно 10px с каждой стороны)
    // Поэтому берем 410 / 8 = 51.25
    this.tileSize = 46; 
    
    // Отступы для первой ячейки (от левого верхнего угла рамки)
    const padding = 20; 
       // Вычисляем реальный центр рамки
    const frameCenterX = boardBg.x;
    const frameCenterY = boardBg.y;

    // Центрируем сетку относительно центра рамки
    this.offsetX = frameCenterX - (this.boardSize * this.tileSize) / 2;
    this.offsetY = frameCenterY - (this.boardSize * this.tileSize) / 2;

    // 4. Массив доступных фишек
    this.tileTypes = [
      'tile-bow', 'tile-cube-blue', 'tile-cube-red',
      'tile-duck', 'tile-pyramid', 'tile-ball-green'
    ];

    this.tiles = [];

    // 5. Создаем сетку
    for (let row = 0; row < this.boardSize; row++) {
      this.tiles[row] = [];
      for (let col = 0; col < this.boardSize; col++) {
        const x = this.offsetX + col * this.tileSize + this.tileSize / 2;
        const y = this.offsetY + row * this.tileSize + this.tileSize / 2;
        
        const type = this.tileTypes[Math.floor(Math.random() * this.tileTypes.length)];

        const tile = this.add.image(x, y, type).setDisplaySize(this.tileSize - 8, this.tileSize - 8);
        tile.setInteractive({ useHandCursor: true });
        tile.gridX = col;
        tile.gridY = row;
        
        this.input.setDraggable(tile);
        tile.on('drag', (pointer, dragX, dragY) => this.handleTileDrag(tile, dragX, dragY));
        this.tiles[row][col] = tile;
      }
    }

    // Кнопка "Назад"
    const backButton = this.add.text(20, 20, '← Назад', {
      fontSize: '18px',
      color: '#000',
      backgroundColor: '#fff',
      padding: { x: 8, y: 4 }
    }).setInteractive({ useHandCursor: true });

    backButton.on('pointerdown', () => {
      this.scene.start('MainMenu');
    });
  }

  // Логика перетаскивания (Drag)
  handleTileDrag(tile, dragX, dragY) {
    tile.x = dragX;
    tile.y = dragY;

    const dx = dragX - (this.offsetX + tile.gridX * this.tileSize + this.tileSize / 2);
    const dy = dragY - (this.offsetY + tile.gridY * this.tileSize + this.tileSize / 2);

    if (Math.abs(dx) > this.tileSize / 2 || Math.abs(dy) > this.tileSize / 2) {
      let targetX = tile.gridX;
      let targetY = tile.gridY;

      if (Math.abs(dx) > Math.abs(dy)) {
        targetX += dx > 0 ? 1 : -1;
      } else {
        targetY += dy > 0 ? 1 : -1;
      }

      if (targetX >= 0 && targetX < this.boardSize && targetY >= 0 && targetY < this.boardSize) {
        const targetTile = this.tiles[targetY][targetX];
        if (targetTile) {
          this.input.setDraggable(tile, false);
          this.input.setDraggable(targetTile, false);

          this.swapTiles(tile, targetTile);

          this.time.delayedCall(200, () => {
            if (tile && tile.active) this.input.setDraggable(tile, true);
            if (targetTile && targetTile.active) this.input.setDraggable(targetTile, true);
          });
        }
      }

      this.tweens.add({
        targets: tile,
        x: this.offsetX + tile.gridX * this.tileSize + this.tileSize / 2,
        y: this.offsetY + tile.gridY * this.tileSize + this.tileSize / 2,
        duration: 100,
      });
    }
  }

  swapTiles(tile1, tile2) {
    const tempX = tile1.gridX;
    const tempY = tile1.gridY;
    tile1.gridX = tile2.gridX;
    tile1.gridY = tile2.gridY;
    tile2.gridX = tempX;
    tile2.gridY = tempY;

    this.tiles[tile1.gridY][tile1.gridX] = tile1;
    this.tiles[tile2.gridY][tile2.gridX] = tile2;

    this.tweens.add({
      targets: tile1,
      x: this.offsetX + tile1.gridX * this.tileSize + this.tileSize / 2,
      y: this.offsetY + tile1.gridY * this.tileSize + this.tileSize / 2,
      duration: 200,
    });

    this.tweens.add({
      targets: tile2,
      x: this.offsetX + tile2.gridX * this.tileSize + this.tileSize / 2,
      y: this.offsetY + tile2.gridY * this.tileSize + this.tileSize / 2,
      duration: 200,
    });

    this.time.delayedCall(200, () => this.checkMatches());
  }

  checkMatches() {
    const matches = new Set();

    // Горизонтальные
    for (let row = 0; row < this.boardSize; row++) {
      let count = 1;
      for (let col = 1; col < this.boardSize; col++) {
        const prevTile = this.tiles[row][col - 1];
        const currTile = this.tiles[row][col];

        if (prevTile && currTile && prevTile.texture.key === currTile.texture.key) {
          count++;
        } else {
          if (count >= 3) {
            const startCol = col - count;
            if (count === 4) {
              const bonusTile = this.tiles[row][startCol + 1];
              bonusTile.setData('bonus', 'rocket');
              bonusTile.setTint(0x000000);
            } else if (count >= 5) {
              const bonusTile = this.tiles[row][startCol + 2];
              bonusTile.setData('bonus', 'bomb');
              bonusTile.setTint(0xffffff);
            }
            for (let i = startCol; i < col; i++) {
              matches.add(this.tiles[row][i]);
            }
          }
          count = 1;
        }
      }
      if (count >= 3) {
        const startCol = this.boardSize - count;
        if (count === 4) {
          const bonusTile = this.tiles[row][startCol + 1];
          bonusTile.setData('bonus', 'rocket');
          bonusTile.setTint(0x000000);
        } else if (count >= 5) {
          const bonusTile = this.tiles[row][startCol + 2];
          bonusTile.setData('bonus', 'bomb');
          bonusTile.setTint(0xffffff);
        }
        for (let i = startCol; i < this.boardSize; i++) {
          matches.add(this.tiles[row][i]);
        }
      }
    }

    // Вертикальные
    for (let col = 0; col < this.boardSize; col++) {
      let count = 1;
      for (let row = 1; row < this.boardSize; row++) {
        const prevTile = this.tiles[row - 1][col];
        const currTile = this.tiles[row][col];

        if (prevTile && currTile && prevTile.texture.key === currTile.texture.key) {
          count++;
        } else {
          if (count >= 3) {
            const startRow = row - count;
            if (count === 4) {
              const bonusTile = this.tiles[startRow + 1][col];
              bonusTile.setData('bonus', 'rocket');
              bonusTile.setTint(0x000000);
            } else if (count >= 5) {
              const bonusTile = this.tiles[startRow + 2][col];
              bonusTile.setData('bonus', 'bomb');
              bonusTile.setTint(0xffffff);
            }
            for (let i = startRow; i < row; i++) {
              matches.add(this.tiles[i][col]);
            }
          }
          count = 1;
        }
      }
      if (count >= 3) {
        const startRow = this.boardSize - count;
        if (count === 4) {
          const bonusTile = this.tiles[startRow + 1][col];
          bonusTile.setData('bonus', 'rocket');
          bonusTile.setTint(0x000000);
        } else if (count >= 5) {
          const bonusTile = this.tiles[startRow + 2][col];
          bonusTile.setData('bonus', 'bomb');
          bonusTile.setTint(0xffffff);
        }
        for (let i = startRow; i < this.boardSize; i++) {
          matches.add(this.tiles[i][col]);
        }
      }
    }

    // Удаление
    if (matches.size > 0) {
      matches.forEach(tile => {
        if (tile.getData('bonus')) return;
        tile.destroy();
        this.tiles[tile.gridY][tile.gridX] = null;
      });

      this.time.delayedCall(250, () => {
        this.dropTiles();
        this.refillBoard();
        this.time.delayedCall(300, () => this.checkMatches());
      });
    }
  }

  dropTiles() {
    for (let col = 0; col < this.boardSize; col++) {
      for (let row = this.boardSize - 1; row >= 0; row--) {
        if (this.tiles[row][col] === null) {
          for (let r = row - 1; r >= 0; r--) {
            if (this.tiles[r][col] !== null) {
              const tileToMove = this.tiles[r][col];
              this.tiles[row][col] = tileToMove;
              this.tiles[r][col] = null;
              tileToMove.gridY = row;
              this.tweens.add({
                targets: tileToMove,
                y: this.offsetY + row * this.tileSize + this.tileSize / 2,
                duration: 200,
              });
              break;
            }
          }
        }
      }
    }
  }

  refillBoard() {
    for (let col = 0; col < this.boardSize; col++) {
      for (let row = 0; row < this.boardSize; row++) {
        if (this.tiles[row][col] === null) {
          const x = this.offsetX + col * this.tileSize + this.tileSize / 2;
          const y = this.offsetY + row * this.tileSize + this.tileSize / 2;
          const type = this.tileTypes[Math.floor(Math.random() * this.tileTypes.length)];

          const tile = this.add.image(x, y, type).setDisplaySize(this.tileSize - 8, this.tileSize - 8);
          tile.setInteractive({ useHandCursor: true });
          tile.gridX = col;
          tile.gridY = row;
          
          this.input.setDraggable(tile);
          tile.on('drag', (pointer, dragX, dragY) => this.handleTileDrag(tile, dragX, dragY));
          
          this.tiles[row][col] = tile;
        }
      }
    }
  }
}