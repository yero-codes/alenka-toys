import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import MainMenu from '../game/MainMenu';
import GameScene from '../game/GameScene';

function PhaserGame() {
  const gameRef = useRef(null);

  useEffect(() => {
    // Ждем 100 мс, чтобы React отрисовал контейнер и применил CSS
    const timer = setTimeout(() => {
      const config = {
        type: Phaser.AUTO,
        width: 430,
        height: 932,
        parent: gameRef.current,
        backgroundColor: '#f5efe6',
        scene: [MainMenu, GameScene],
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH,
          width: 430,
          height: 932,
        },
      };

      const game = new Phaser.Game(config);

      // Принудительный ресайз через 200 мс
      setTimeout(() => {
        game.scale.refresh();
      }, 200);

      // Сохраняем игру в ref для очистки
      gameRef.current.game = game;
    }, 100);

    return () => {
      clearTimeout(timer);
      if (gameRef.current && gameRef.current.game) {
        gameRef.current.game.destroy(true);
      }
    };
  }, []);

  return (
    <div 
      ref={gameRef} 
      id="game-container"
      style={{ 
        width: '100vw', 
        height: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        overflow: 'hidden',
        margin: 0,
        padding: 0,
        backgroundColor: '#f5efe6', /* Светлый фон вместо черного */
      }}
    ></div>
  );
}

export default PhaserGame;