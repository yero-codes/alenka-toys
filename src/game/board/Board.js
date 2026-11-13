import Phaser from 'phaser';

export default class Board {
  constructor(scene, x, y, tileSize, boardSize, tileTypes) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.tileSize = tileSize;
    this.boardSize = boardSize;
    this.tileTypes = tileTypes;
    this.tiles = [];
    this.hud = null;
  }

  setHUD(hud) {
    this.hud = hud;
  }

  create() {
    for (let row = 0; row < this.boardSize; row++) {
      this.tiles[row] = [];
      for (let col = 0; col < this.boardSize; col++) {
        const tileX = this.x + col * this.tileSize + this.tileSize / 2;
        const tileY = this.y + row * this.tileSize + this.tileSize / 2;
        const type = this.tileTypes[Math.floor(Math.random() * this.tileTypes.length)];

        const tile = this.scene.add.image(tileX, tileY, type).setDisplaySize(this.tileSize - 8, this.tileSize - 8);
        tile.setInteractive({ useHandCursor: true });
        tile.gridX = col;
        tile.gridY = row;

        tile.on('pointerdown', (pointer) => {
          this.scene.startX = pointer.x;
          this.scene.startY = pointer.y;
          this.scene.dragTile = tile;
        });

        this.tiles[row][col] = tile;
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

    this.scene.tweens.add({
      targets: tile1,
      x: this.x + tile1.gridX * this.tileSize + this.tileSize / 2,
      y: this.y + tile1.gridY * this.tileSize + this.tileSize / 2,
      duration: 200,
    });

    this.scene.tweens.add({
      targets: tile2,
      x: this.x + tile2.gridX * this.tileSize + this.tileSize / 2,
      y: this.y + tile2.gridY * this.tileSize + this.tileSize / 2,
      duration: 200,
    });

    this.scene.time.delayedCall(200, () => {
      const hasMatches = this.checkMatches();

      if (!hasMatches) {
        // Откат
        this.tiles[tile1.gridY][tile1.gridX] = tile2;
        this.tiles[tile2.gridY][tile2.gridX] = tile1;

        const tempX2 = tile1.gridX;
        const tempY2 = tile1.gridY;
        tile1.gridX = tile2.gridX;
        tile1.gridY = tile2.gridY;
        tile2.gridX = tempX2;
        tile2.gridY = tempY2;

        this.scene.tweens.add({
          targets: tile1,
          x: this.x + tile1.gridX * this.tileSize + this.tileSize / 2,
          y: this.y + tile1.gridY * this.tileSize + this.tileSize / 2,
          duration: 200,
        });

        this.scene.tweens.add({
          targets: tile2,
          x: this.x + tile2.gridX * this.tileSize + this.tileSize / 2,
          y: this.y + tile2.gridY * this.tileSize + this.tileSize / 2,
          duration: 200,
        });
      } else {
        if (this.hud) {
          this.hud.updateMoves(this.hud.moves - 1);
        }
      }
    });
  }

  checkMatches() {
    const matches = new Set();
    if (this.scene.isGameOver) return false;

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
      let collectedTarget = 0;
      matches.forEach(tile => {
        if (tile.texture.key === this.hud.targetType) {
          collectedTarget++;
        }
      });

      if (this.hud) {
        this.hud.updateScore(this.hud.score + matches.size * 10);
        this.hud.updateTarget(this.hud.collectedDucks + collectedTarget);
      }

      matches.forEach(tile => {
        if (tile.getData('bonusType')) return;
        tile.destroy();
        this.tiles[tile.gridY][tile.gridX] = null;
      });

      this.scene.time.delayedCall(250, () => {
        this.dropTiles();
        this.refillBoard();
        this.scene.time.delayedCall(300, () => this.checkMatches());
      });

      if (this.hud && this.hud.collectedDucks >= 10) {
        this.scene.showEndScreen('ПОБЕДА!', 'Вы собрали всех уточек!');
        return true;
      } else if (this.hud && this.hud.moves <= 0) {
        this.scene.showEndScreen('ПОРАЖЕНИЕ', 'У вас закончились ходы!');
        return true;
      }

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
              this.scene.tweens.add({
                targets: tileToMove,
                y: this.y + row * this.tileSize + this.tileSize / 2,
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
          const tileX = this.x + col * this.tileSize + this.tileSize / 2;
          const tileY = this.y + row * this.tileSize + this.tileSize / 2;
          const type = this.tileTypes[Math.floor(Math.random() * this.tileTypes.length)];

          const tile = this.scene.add.image(tileX, tileY, type).setDisplaySize(this.tileSize - 8, this.tileSize - 8);
          tile.setInteractive({ useHandCursor: true });
          tile.gridX = col;
          tile.gridY = row;

          tile.on('pointerdown', (pointer) => {
            this.scene.startX = pointer.x;
            this.scene.startY = pointer.y;
            this.scene.dragTile = tile;
          });

          this.tiles[row][col] = tile;
        }
      }
    }
  }

  createBonus(tile, type) {
    const x = tile.x;
    const y = tile.y;
    const gridX = tile.gridX;
    const gridY = tile.gridY;

    tile.destroy();

    const bonusImg = this.scene.add.image(x, y, `bonus-${type}`)
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

    this.scene.time.delayedCall(250, () => {
      this.dropTiles();
      this.refillBoard();
      this.scene.time.delayedCall(300, () => this.checkMatches());
    });
  }
}