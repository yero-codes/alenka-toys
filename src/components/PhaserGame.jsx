import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import MainMenu from '../game/MainMenu';
import GameScene from '../game/GameScene';

function PhaserGame() {
  const gameRef = useRef(null);

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: 430,
      height: 932,
      parent: gameRef.current,
      backgroundColor: '#e0f7fa',
      scene: [MainMenu, GameScene],
    };

    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
    };
  }, []); // <--- ВОТ ТАК ПРАВИЛЬНО

  return <div ref={gameRef} id="game-container"></div>;
}

export default PhaserGame;