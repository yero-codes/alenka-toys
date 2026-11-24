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
        const type = this.getSafeTileType(col, row);

        const tile = this.scene.add.image(tileX, tileY, type).setDisplaySize(this.tileSize - 10, this.tileSize - 10);
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
    if (this.scene.isGameOver) return false;

    const matches = new Set();

    // Горизонтальные (код не меняем)
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

    // Вертикальные (код не меняем)
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
  if (this.hud) {
    this.hud.updateScore(this.hud.score + matches.size * 10);
    
    // Сообщаем HUD о каждой собранной фишке
    matches.forEach(tile => {
      if (!tile.getData('bonusType')) {
        this.hud.collectTile(tile.texture.key);
      }
    });
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

  return true;
}

//ДОБАВЛЯЕМ ПРОВЕРКУ ЕСТЬ ЛИ ВОЗМОЖНОСТЬ СДЕЛАТЬ ХОД
    if (!this.hasPossibleMoves()) {
      this.shuffleBoard();
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
          const type = this.getSafeTileType(col, row);

          const tile = this.scene.add.image(tileX, tileY, type).setDisplaySize(this.tileSize - 10, this.tileSize - 10);
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

  // Новый метод: выбирает фишку, которая не создает линию из 3-х при старте
  getSafeTileType(col, row) {
    let availableTypes = [...this.tileTypes];

    // Проверяем 2 фишки слева
    if (col >= 2) {
      const left1 = this.tiles[row][col - 1];
      const left2 = this.tiles[row][col - 2];
      if (left1 && left2 && left1.texture.key === left2.texture.key) {
        // Убираем этот тип из доступных, чтобы не было тройки по горизонтали
        availableTypes = availableTypes.filter(t => t !== left1.texture.key);
      }
    }

    // Проверяем 2 фишки сверху
    if (row >= 2) {
      const top1 = this.tiles[row - 1][col];
      const top2 = this.tiles[row - 2][col];
      if (top1 && top2 && top1.texture.key === top2.texture.key) {
        // Убираем этот тип из доступных, чтобы не было тройки по вертикали
        availableTypes = availableTypes.filter(t => t !== top1.texture.key);
      }
    }

    // Если вдруг все типы отфильтровались (маловероятно, но бывает), берем любую
    if (availableTypes.length === 0) {
      availableTypes = this.tileTypes;
    }

    return availableTypes[Math.floor(Math.random() * availableTypes.length)];
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

    // ЗВУКИ ДЛЯ БОНУСОВ
    if (type === 'scissors') {
      this.scene.audioManager.playSound('scissors');
    } else if (type === 'umbrella') {
      this.scene.audioManager.playSound('umbrella');
    } else if (type === 'palette') {
      this.scene.audioManager.playSound('palette'); // или 'explosion'
    }

    bonusTile.destroy();
    this.tiles[gridY][gridX] = null;

    //  СОБИРАЕМ ВСЕ УНИЧТОЖЕННЫЕ ФИШКИ В МАССИВ
    let destroyedTiles = [];

    if (type === 'scissors') {
      for (let col = 0; col < this.boardSize; col++) {
        const tile = this.tiles[gridY][col];
        if (tile) {
          destroyedTiles.push(tile);
          tile.destroy();
          this.tiles[gridY][col] = null;
        }
      }
    } else if (type === 'umbrella') {
      for (let row = 0; row < this.boardSize; row++) {
        const tile = this.tiles[row][gridX];
        if (tile) {
          destroyedTiles.push(tile);
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
              destroyedTiles.push(tile);
              tile.destroy();
              this.tiles[r][c] = null;
            }
          }
        }
      }
    }

    // 👇 ОТПРАВЛЯЕМ ВСЕ УНИЧТОЖЕННЫЕ ФИШКИ В HUD
    if (this.hud && destroyedTiles.length > 0) {
      this.hud.updateScore(this.hud.score + destroyedTiles.length * 10);
      destroyedTiles.forEach(tile => {
        if (!tile.getData('bonusType')) { // Игнорируем сами бонусы
          this.hud.collectTile(tile.texture.key);
        }
      });
    }

    this.scene.time.delayedCall(250, () => {
      this.dropTiles();
      this.refillBoard();
      this.scene.time.delayedCall(300, () => this.checkMatches());
    });
  }

    // Проверка, есть ли на доске хотя бы один возможный ход
  hasPossibleMoves() {
    // Перебираем все фишки, меняем их местами с соседями и проверяем, не создается ли тройка
    for (let row = 0; row < this.boardSize; row++) {
      for (let col = 0; col < this.boardSize; col++) {
        // Проверяем свап вправо
        if (col < this.boardSize - 1) {
          if (this.isSwapValid(row, col, row, col + 1)) return true;
        }
        // Проверяем свап вниз
        if (row < this.boardSize - 1) {
          if (this.isSwapValid(row, col, row + 1, col)) return true;
        }
      }
    }
    return false;
  }

  // Вспомогательный метод: проверяет, создает ли свап двух фишек тройку
  isSwapValid(row1, col1, row2, col2) {
    const tile1 = this.tiles[row1][col1];
    const tile2 = this.tiles[row2][col2];
    if (!tile1 || !tile2) return false;

    // Временно меняем местами (только в массиве)
    this.tiles[row1][col1] = tile2;
    this.tiles[row2][col2] = tile1;

    // Проверяем, есть ли теперь совпадения (вызываем логику поиска, но без удаления)
    const hasMatch = this.checkMatchesTemporary();
    
    // Возвращаем всё как было
    this.tiles[row1][col1] = tile1;
    this.tiles[row2][col2] = tile2;

    return hasMatch;
  }

  // Временная проверка на совпадения (упрощенная копия checkMatches, только для проверки)
  checkMatchesTemporary() {
    // Горизонтальные
    for (let row = 0; row < this.boardSize; row++) {
      for (let col = 0; col < this.boardSize - 2; col++) {
        const t1 = this.tiles[row][col];
        const t2 = this.tiles[row][col + 1];
        const t3 = this.tiles[row][col + 2];
        if (t1 && t2 && t3 && t1.texture.key === t2.texture.key && t2.texture.key === t3.texture.key) {
          return true;
        }
      }
    }
    // Вертикальные
    for (let col = 0; col < this.boardSize; col++) {
      for (let row = 0; row < this.boardSize - 2; row++) {
        const t1 = this.tiles[row][col];
        const t2 = this.tiles[row + 1][col];
        const t3 = this.tiles[row + 2][col];
        if (t1 && t2 && t3 && t1.texture.key === t2.texture.key && t2.texture.key === t3.texture.key) {
          return true;
        }
      }
    }
    return false;
  }

  // Перемешиваем доску
  shuffleBoard() {
    console.log("Перемешиваем поле!");
    
    // 1. Собираем все текущие типы фишек в массив
    let allTypes = [];
    for (let row = 0; row < this.boardSize; row++) {
      for (let col = 0; col < this.boardSize; col++) {
        if (this.tiles[row][col]) {
          allTypes.push(this.tiles[row][col].texture.key);
        }
      }
    }

    // 2. Перемешиваем массив (алгоритм Фишера-Йетса)
    for (let i = allTypes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allTypes[i], allTypes[j]] = [allTypes[j], allTypes[i]];
    }

    // 3. Присваиваем фишкам новые типы
    let index = 0;
    for (let row = 0; row < this.boardSize; row++) {
      for (let col = 0; col < this.boardSize; col++) {
        const tile = this.tiles[row][col];
        if (tile) {
          tile.setTexture(allTypes[index]);
          index++;
        }
      }
    }

    // 4. После перемешивания нужно проверить, не собрались ли случайные тройки
    // Если собрались — вызываем каскад (checkMatches)
    this.scene.time.delayedCall(300, () => {
      this.checkMatches();
    });
  }
}