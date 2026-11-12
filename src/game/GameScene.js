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

    // Бонусы
    this.load.image('bonus-scissors', scissorsBonusImg);
    this.load.image('bonus-umbrella', umbrellaBonusImg);
    this.load.image('bonus-palette', paletteBonusImg);
  }

  create() {
    this.add.image(215, 466, 'bg-room').setDisplaySize(430, 932);

    const boardBg = this.add.image(215, 466, 'board-bg').setDisplaySize(430, 430);

    this.boardSize = 8;
    this.tileSize = 46;

    const frameCenterX = boardBg.x;
    const frameCenterY = boardBg.y;

    this.offsetX = frameCenterX - (this.boardSize * this.tileSize) / 2;
    this.offsetY = frameCenterY - (this.boardSize * this.tileSize) / 2;

    this.tileTypes = [
      'tile-bow', 'tile-cube-blue', 'tile-cube-red',
      'tile-duck', 'tile-pyramid', 'tile-ball-green'
    ];

    this.tiles = [];

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

        tile.on('pointerdown', (pointer) => {
          // Запоминаем, где нажали
          this.startX = pointer.x;
          this.startY = pointer.y;
          this.dragTile = tile; // Запоминаем, какую фишку тащим
        });
        this.tiles[row][col] = tile;
        // Обработчик отпускания пальца
        this.input.on('pointerup', (pointer) => {
          if (!this.dragTile) return;

          const dx = pointer.x - this.startX;
          const dy = pointer.y - this.startY;

          // Если сдвинули больше 20 пикселей
          if (Math.abs(dx) > 20 || Math.abs(dy) > 20) {
            let targetX = this.dragTile.gridX;
            let targetY = this.dragTile.gridY;

            if (Math.abs(dx) > Math.abs(dy)) {
              targetX += dx > 0 ? 1 : -1;
            } else {
              targetY += dy > 0 ? 1 : -1;
            }

            if (targetX >= 0 && targetX < this.boardSize && targetY >= 0 && targetY < this.boardSize) {
              const targetTile = this.tiles[targetY][targetX];
              if (targetTile) {
                this.swapTiles(this.dragTile, targetTile);
              }
            }
          }

          this.dragTile = null;
        });
      }
    }

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

  handleTileDrag(tile, dragX, dragY) {
    // Вычисляем центр клетки
    const centerX = this.offsetX + tile.gridX * this.tileSize + this.tileSize / 2;
    const centerY = this.offsetY + tile.gridY * this.tileSize + this.tileSize / 2;

    const dx = dragX - centerX;
    const dy = dragY - centerY;

    // Ограничиваем движение
    const maxOffset = this.tileSize / 2;
    const clampedX = centerX + Math.max(-maxOffset, Math.min(maxOffset, dx));
    const clampedY = centerY + Math.max(-maxOffset, Math.min(maxOffset, dy));

    tile.x = clampedX;
    tile.y = clampedY;

    // Если сдвинули больше половины — меняем местами
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
    }
  }

  swapTiles(tile1, tile2) {
    // 1. Меняем местами в массиве
    const tempX = tile1.gridX;
    const tempY = tile1.gridY;
    tile1.gridX = tile2.gridX;
    tile1.gridY = tile2.gridY;
    tile2.gridX = tempX;
    tile2.gridY = tempY;

    this.tiles[tile1.gridY][tile1.gridX] = tile1;
    this.tiles[tile2.gridY][tile2.gridX] = tile2;

    // 2. Анимация обмена
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

    // 3. Проверяем, есть ли совпадения ПОСЛЕ обмена
    this.time.delayedCall(200, () => {
      const hasMatches = this.checkMatches(); // <--- ВОТ ЗДЕСЬ МЫ ЛОВИМ РЕЗУЛЬТАТ

      if (!hasMatches) {
        // Если совпадений нет — откатываем обмен
        this.tiles[tile1.gridY][tile1.gridX] = tile2;
        this.tiles[tile2.gridY][tile2.gridX] = tile1;

        const tempX2 = tile1.gridX;
        const tempY2 = tile1.gridY;
        tile1.gridX = tile2.gridX;
        tile1.gridY = tile2.gridY;
        tile2.gridX = tempX2;
        tile2.gridY = tempY2;

        // Анимация возврата
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
      }
    });
  }

  createBonus(tile, type) {
    const x = tile.x;
    const y = tile.y;
    const gridX = tile.gridX;
    const gridY = tile.gridY;

    tile.destroy();

    const bonusImg = this.add.image(x, y, `bonus-${type}`)
      .setDisplaySize(this.tileSize - 10, this.tileSize - 10);

    bonusImg.setInteractive({ useHandCursor: true });
    bonusImg.gridX = gridX;
    bonusImg.gridY = gridY;
    bonusImg.setData('bonusType', type);

    this.tiles[gridY][gridX] = bonusImg;

    bonusImg.on('pointerdown', () => this.activateBonus(bonusImg));
  }

  activateBonus(bonusTile) {
    const type = bonusTile.getData('bonusType');
    const gridX = bonusTile.gridX;
    const gridY = bonusTile.gridY;

    bonusTile.destroy();
    this.tiles[gridY][gridX] = null;

    if (type === 'scissors') {
      for (let col = 0; col < this.boardSize; col++) {
        const tile = this.tiles[gridY][col];
        if (tile) {
          tile.destroy();
          this.tiles[gridY][col] = null;
        }
      }
    } else if (type === 'umbrella') {
      for (let row = 0; row < this.boardSize; row++) {
        const tile = this.tiles[row][gridX];
        if (tile) {
          tile.destroy();
          this.tiles[row][gridX] = null;
        }
      }
    } else if (type === 'palette') {
      for (let r = gridY - 1; r <= gridY + 1; r++) {
        for (let c = gridX - 1; c <= gridX + 1; c++) {
          if (r >= 0 && r < this.boardSize && c >= 0 && c < this.boardSize) {
            const tile = this.tiles[r][c];
            if (tile) {
              tile.destroy();
              this.tiles[r][c] = null;
            }
          }
        }
      }
    }

    this.time.delayedCall(250, () => {
      this.dropTiles();
      this.refillBoard();
      this.time.delayedCall(300, () => this.checkMatches());
    });
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
              this.createBonus(bonusTile, 'scissors');
            } else if (count >= 5) {
              const bonusTile = this.tiles[row][startCol + 2];
              this.createBonus(bonusTile, 'palette');
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
          this.createBonus(bonusTile, 'scissors');
        } else if (count >= 5) {
          const bonusTile = this.tiles[row][startCol + 2];
          this.createBonus(bonusTile, 'palette');
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
              this.createBonus(bonusTile, 'umbrella');
            } else if (count >= 5) {
              const bonusTile = this.tiles[startRow + 2][col];
              this.createBonus(bonusTile, 'palette');
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
          this.createBonus(bonusTile, 'umbrella');
        } else if (count >= 5) {
          const bonusTile = this.tiles[startRow + 2][col];
          this.createBonus(bonusTile, 'palette');
        }
        for (let i = startRow; i < this.boardSize; i++) {
          matches.add(this.tiles[i][col]);
        }
      }
    }

    // Удаление
    if (matches.size > 0) {
      matches.forEach(tile => {
        if (tile.getData('bonusType')) return;
        tile.destroy();
        this.tiles[tile.gridY][tile.gridX] = null;
      });

      this.time.delayedCall(250, () => {
        this.dropTiles();
        this.refillBoard();
        this.time.delayedCall(300, () => this.checkMatches());
      });

      return true;
    }

    return false;
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

          tile.on('pointerdown', (pointer) => {
            this.startX = pointer.x;
            this.startY = pointer.y;
            this.dragTile = tile;
          });

          this.tiles[row][col] = tile;
        }
      }
    }
  }
}