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
    this.selectedTile = null;
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
        tile.on('pointerdown', () => this.handleTileClick(tile));
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

  handleTileClick(tile) {
    if (!this.selectedTile) {
      this.selectedTile = tile;
      tile.setStrokeStyle(4, 0xffffff);
    } else {
      if (this.selectedTile === tile) {
        this.selectedTile.setStrokeStyle(0);
        this.selectedTile = null;
        return;
      }

      const dx = Math.abs(this.selectedTile.gridX - tile.gridX);
      const dy = Math.abs(this.selectedTile.gridY - tile.gridY);

      if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
        this.swapTiles(this.selectedTile, tile);
        this.selectedTile.setStrokeStyle(0);
        this.selectedTile = null;
      } else {
        this.selectedTile.setStrokeStyle(0);
        this.selectedTile = tile;
        tile.setStrokeStyle(4, 0xffffff);
      }
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

    // --- ПРОВЕРКА ГОРИЗОНТАЛЬНЫХ ЛИНИЙ ---
    for (let row = 0; row < this.boardSize; row++) {
      let count = 1;
      for (let col = 1; col < this.boardSize; col++) {
        const prevTile = this.tiles[row][col - 1];
        const currTile = this.tiles[row][col];

        if (prevTile && currTile && prevTile.fillColor === currTile.fillColor) {
          count++;
        } else {
          // Если линия закончилась, и она была 3 или больше
          if (count >= 3) {
            const startCol = col - count;
            // Если 4 в ряд — создаем Ракету (4 матч)
            if (count === 4) {
              const bonusTile = this.tiles[row][startCol + 1]; // Берем вторую фишку в линии
              bonusTile.setData('bonus', 'rocket'); // Помечаем как бонус
              bonusTile.setStrokeStyle(4, 0x000000); // Черная обводка для видимости
              console.log('4 матч! Создана Ракета');
            }
            // Если 5 в ряд — создаем Бомбу (5 матч)
            else if (count >= 5) {
              const bonusTile = this.tiles[row][startCol + 2]; // Берем центральную фишку
              bonusTile.setData('bonus', 'bomb'); // Помечаем как бонус
              bonusTile.setStrokeStyle(4, 0xffffff); // Белая обводка для видимости
              console.log('5 матч! Создана Бомба');
            }
            
            // Добавляем все фишки линии в список на удаление
            for (let i = startCol; i < col; i++) {
              matches.add(this.tiles[row][i]);
            }
          }
          count = 1;
        }
      }
      // Проверка в конце строки (если линия тянется до края)
      if (count >= 3) {
        const startCol = this.boardSize - count;
        if (count === 4) {
          const bonusTile = this.tiles[row][startCol + 1];
          bonusTile.setData('bonus', 'rocket');
          bonusTile.setStrokeStyle(4, 0x000000);
          console.log('4 матч! Создана Ракета');
        } else if (count >= 5) {
          const bonusTile = this.tiles[row][startCol + 2];
          bonusTile.setData('bonus', 'bomb');
          bonusTile.setStrokeStyle(4, 0xffffff);
          console.log('5 матч! Создана Бомба');
        }
        for (let i = startCol; i < this.boardSize; i++) {
          matches.add(this.tiles[row][i]);
        }
      }
    }

    // --- ПРОВЕРКА ВЕРТИКАЛЬНЫХ ЛИНИЙ ---
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
              console.log('4 матч! Создана Ракета');
            } else if (count >= 5) {
              const bonusTile = this.tiles[startRow + 2][col];
              bonusTile.setData('bonus', 'bomb');
              bonusTile.setStrokeStyle(4, 0xffffff);
              console.log('5 матч! Создана Бомба');
            }
            for (let i = startRow; i < row; i++) {
              matches.add(this.tiles[i][col]);
            }
          }
          count = 1;
        }
      }
      // Проверка в конце столбца
      if (count >= 3) {
        const startRow = this.boardSize - count;
        if (count === 4) {
          const bonusTile = this.tiles[startRow + 1][col];
          bonusTile.setData('bonus', 'rocket');
          bonusTile.setStrokeStyle(4, 0x000000);
          console.log('4 матч! Создана Ракета');
        } else if (count >= 5) {
          const bonusTile = this.tiles[startRow + 2][col];
          bonusTile.setData('bonus', 'bomb');
          bonusTile.setStrokeStyle(4, 0xffffff);
          console.log('5 матч! Создана Бомба');
        }
        for (let i = startRow; i < this.boardSize; i++) {
          matches.add(this.tiles[i][col]);
        }
      }
    }

    // --- УДАЛЕНИЕ ---
    if (matches.size > 0) {
      matches.forEach(tile => {
        // Если это бонусная фишка, мы НЕ удаляем её, а оставляем на поле
        if (tile.getData('bonus')) {
          return;
        }
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
  
  // Гравитация: фишки падают вниз
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

  // Создаем новые фишки на месте пустот
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
          tile.on('pointerdown', () => this.handleTileClick(tile));
          
          this.tiles[row][col] = tile;
        }
      }
    }
  }
}