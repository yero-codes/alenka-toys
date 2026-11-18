// src/components/game/Levels.js

export const LEVELS = {
  1: {
    id: 1,
    moves: 20,
    targets: [
      { type: 'tile-duck', count: 10 }
    ],
    // Позже здесь можно будет добавить настройки доски:
    // boardSize: 8,
    // tileTypes: [...]
  },
  2: {
    id: 2,
    moves: 15,
    targets: [
      { type: 'tile-duck', count: 5 },
      { type: 'tile-pyramid', count: 5 }
    ],
  },
  3: {
    id: 3,
    moves: 12,
    targets: [
      { type: 'tile-bow', count: 8 },
      { type: 'tile-cube-blue', count: 8 }
    ],
  }
};

// Вспомогательная функция, чтобы потом было удобно получать уровень
export function getLevelData(levelId) {
  return LEVELS[levelId] || LEVELS[1]; // Если уровня нет, возвращаем первый
}