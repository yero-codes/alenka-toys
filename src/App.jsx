import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import alenkaImg from './assets/alenka.png';
import './App.css';

function App() {
  const gameRef = useRef(null);

  useEffect(() => {
    // --- Сцена 1: Главное меню ---
    class MainMenu extends Phaser.Scene {
      constructor() {
        super({ key: 'MainMenu' });
      }

      preload() {
        this.load.image('alenka', alenkaImg);
      }

      create() {
        // Куколка по центру
        this.add.image(400, 250, 'alenka').setScale(0.5);
        
        // Заголовок
        this.add.text(400, 50, 'Алёнкины игрушки', {
          fontSize: '48px',
          fontFamily: 'Arial',
          color: '#000000',
          fontStyle: 'bold'
        }).setOrigin(0.5);

        // Кнопка "Играть"
        const playButton = this.add.rectangle(400, 500, 200, 60, 0x009379)
          .setInteractive({ useHandCursor: true });
        
        this.add.text(400, 500, 'Играть', {
          fontSize: '32px',
          fontFamily: 'Arial',
          color: '#ffffff',
          fontStyle: 'bold'
        }).setOrigin(0.5);

        // При клике на кнопку переходим в GameScene
        playButton.on('pointerdown', () => {
          this.scene.start('GameScene');
        });
      }
    }

    // --- Сцена 2: Игровое поле ---
    class GameScene extends Phaser.Scene {
      constructor() {
        super({ key: 'GameScene' });
      }

      create() {
        const boardSize = 8;
        const tileSize = 70;
        const offsetX = (800 - boardSize * tileSize) / 2;
        const offsetY = (600 - boardSize * tileSize) / 2;

        const colors = [
          0xff0000, 0x0000ff, 0x00ff00, 0xffff00, 0x00ffff, 0xff00ff,
        ];

        for (let row = 0; row < boardSize; row++) {
          for (let col = 0; col < boardSize; col++) {
            const x = offsetX + col * tileSize + tileSize / 2;
            const y = offsetY + row * tileSize + tileSize / 2;
            const color = colors[Math.floor(Math.random() * colors.length)];
            this.add.rectangle(x, y, tileSize - 4, tileSize - 4, color);
          }
        }
        
        // Кнопка "Назад" (чтобы вернуться в меню)
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
    }

    // Конфигурация игры с двумя сценами
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: gameRef.current,
      backgroundColor: '#e0f7fa',
      scene: [MainMenu, GameScene], // Сначала MainMenu, потом GameScene
    };

    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
    };
  }, []);

  return (
    <div className="App">
      <div ref={gameRef} id="game-container"></div>
    </div>
  );
}

export default App;