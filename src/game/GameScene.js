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
  }
}