import Phaser from 'phaser';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    this.boardSize = 8;
    this.tileSize = 70;
    this.offsetX = (800 - this.boardSize * this.tileSize) / 2;
    this.offsetY = (600 - this.boardSize * this.tileSize) / 2;

    this.colors = [0xff0000, 0x0000ff, 0x00ff00, 0xffff00, 0x00ffff, 0xff00ff];
    this.tiles = [];

    for (let row = 0; row < this.boardSize; row++) {
      this.tiles[row] = [];
      for (let col = 0; col < this.boardSize; col++) {
        const x = this.offsetX + col * this.tileSize + this.tileSize / 2;
        const y = this.offsetY + row * this.tileSize + this.tileSize / 2;
        const color = this.colors[Math.floor(Math.random() * this.colors.length)];

        const tile = this.add.rectangle(x, y, this.tileSize - 4, this.tileSize - 4, color);
        tile.setInteractive({ useHandCursor: true });
        tile.gridX = col;
        tile.gridY = row;
        
        this.input.setDraggable(tile);
        tile.on('drag', (pointer, dragX, dragY) => this.handleTileDrag(tile, dragX, dragY));
        this.tiles[row][col] = tile;
      }
    }

    const backButton = this.add.text(50, 30, '← Назад', {
      fontSize: '24px',
      color: '#000',
      backgroundColor: '#fff',
      padding: { x: 10, y: 5 }
    }).setInteractive({ useHandCursor: true });

    backButton.on('pointerdown', () => {
      this.scene.start('MainMenu');
    });
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
       ///////////////////////////////////////
       
    handleTileDrag(tile, dragX, dragY) {
    // 1. Вычисляем, насколько далеко мы увели палец от центра фишки
    const dx = dragX - tile.x;
    const dy = dragY - tile.y;

    // 2. Если палец сдвинулся достаточно далеко (больше 20 пикселей)
    if (Math.abs(dx) > 20 || Math.abs(dy) > 20) {
      let targetX = tile.gridX;
      let targetY = tile.gridY;

      // 3. Определяем направление
      if (Math.abs(dx) > Math.abs(dy)) {
        targetX += dx > 0 ? 1 : -1; // Вправо или влево
      } else {
        targetY += dy > 0 ? 1 : -1; // Вниз или вверх
      }

      // 4. Проверяем, что не вышли за границы
      if (targetX >= 0 && targetX < this.boardSize && targetY >= 0 && targetY < this.boardSize) {
        const targetTile = this.tiles[targetY][targetX];
        if (targetTile) {
          // 5. Отключаем перетаскивание на время обмена
          this.input.setDraggable(tile, false);
          this.input.setDraggable(targetTile, false);

          // 6. Меняем местами
          this.swapTiles(tile, targetTile);

          // 7. Возвращаем перетаскивание через 200 мс (после анимации)
          this.time.delayedCall(200, () => {
            if (tile && tile.active) this.input.setDraggable(tile, true);
            if (targetTile && targetTile.active) this.input.setDraggable(targetTile, true);
          });
        }
      }

      // 8. Возвращаем фишку на место (если обмен не удался)
      this.tweens.add({
        targets: tile,
        x: this.offsetX + tile.gridX * this.tileSize + this.tileSize / 2,
        y: this.offsetY + tile.gridY * this.tileSize + this.tileSize / 2,
        duration: 100,
      });
    }
  }
       /////////////////////////////
  checkMatches() {
    const matches = new Set();

    for (let row = 0; row < this.boardSize; row++) {
      let count = 1;
      for (let col = 1; col < this.boardSize; col++) {
        const prevTile = this.tiles[row][col - 1];
        const currTile = this.tiles[row][col];

        if (prevTile && currTile && prevTile.fillColor === currTile.fillColor) {
          count++;
        } else {
          if (count >= 3) {
            const startCol = col - count;
            if (count === 4) {
              const bonusTile = this.tiles[row][startCol + 1];
              bonusTile.setData('bonus', 'rocket');
              bonusTile.setStrokeStyle(4, 0x000000);
            } else if (count >= 5) {
              const bonusTile = this.tiles[row][startCol + 2];
              bonusTile.setData('bonus', 'bomb');
              bonusTile.setStrokeStyle(4, 0xffffff);
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
          bonusTile.setStrokeStyle(4, 0x000000);
        } else if (count >= 5) {
          const bonusTile = this.tiles[row][startCol + 2];
          bonusTile.setData('bonus', 'bomb');
          bonusTile.setStrokeStyle(4, 0xffffff);
        }
        for (let i = startCol; i < this.boardSize; i++) {
          matches.add(this.tiles[row][i]);
        }
      }
    }

    for (let col = 0; col < this.boardSize; col++) {
      let count = 1;
      for (let row = 1; row < this.boardSize; row++) {
        const prevTile = this.tiles[row - 1][col];
        const currTile = this.tiles[row][col];

        if (prevTile && currTile && prevTile.fillColor === currTile.fillColor) {
          count++;
        } else {
          if (count >= 3) {
            const startRow = row - count;
            if (count === 4) {
              const bonusTile = this.tiles[startRow + 1][col];
              bonusTile.setData('bonus', 'rocket');
              bonusTile.setStrokeStyle(4, 0x000000);
            } else if (count >= 5) {
              const bonusTile = this.tiles[startRow + 2][col];
              bonusTile.setData('bonus', 'bomb');
              bonusTile.setStrokeStyle(4, 0xffffff);
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
          bonusTile.setStrokeStyle(4, 0x000000);
        } else if (count >= 5) {
          const bonusTile = this.tiles[startRow + 2][col];
          bonusTile.setData('bonus', 'bomb');
          bonusTile.setStrokeStyle(4, 0xffffff);
        }
        for (let i = startRow; i < this.boardSize; i++) {
          matches.add(this.tiles[i][col]);
        }
      }
    }

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
          const color = this.colors[Math.floor(Math.random() * this.colors.length)];

          const tile = this.add.rectangle(x, y, this.tileSize - 4, this.tileSize - 4, color);
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