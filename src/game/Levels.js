export const LEVELS = {
  // --- БЛОК 1: РАЗМИНКА (1-5 уровни) ---
  1: { moves: 20, targets: [{ type: 'tile-duck', count: 10 }] },
  2: { moves: 20, targets: [{ type: 'tile-pyramid', count: 12 }] },
  3: { moves: 18, targets: [{ type: 'tile-cube-blue', count: 15 }] },
  4: { moves: 18, targets: [{ type: 'tile-bow', count: 18 }] },
  5: { moves: 16, targets: [{ type: 'tile-cube-red', count: 20 }] },

  // --- БЛОК 2: ДВЕ ЦЕЛИ (6-15 уровни) ---
  6: { moves: 20, targets: [
    { type: 'tile-duck', count: 10 },
    { type: 'tile-pyramid', count: 10 }
  ]},
  7: { moves: 20, targets: [
    { type: 'tile-ball-green', count: 12 },
    { type: 'tile-bow', count: 12 }
  ]},
  8: { moves: 18, targets: [
    { type: 'tile-cube-blue', count: 15 },
    { type: 'tile-cube-red', count: 15 }
  ]},
  9: { moves: 18, targets: [
    { type: 'tile-duck', count: 15 },
    { type: 'tile-cube-blue', count: 15 }
  ]},
  10: { moves: 16, targets: [
    { type: 'tile-pyramid', count: 18 },
    { type: 'tile-ball-green', count: 18 }
  ]},
  11: { moves: 16, targets: [
    { type: 'tile-bow', count: 20 },
    { type: 'tile-cube-red', count: 20 }
  ]},
  12: { moves: 15, targets: [
    { type: 'tile-duck', count: 20 },
    { type: 'tile-pyramid', count: 20 }
  ]},
  13: { moves: 15, targets: [
    { type: 'tile-cube-blue', count: 22 },
    { type: 'tile-ball-green', count: 22 }
  ]},
  14: { moves: 14, targets: [
    { type: 'tile-bow', count: 25 },
    { type: 'tile-duck', count: 25 }
  ]},
  15: { moves: 14, targets: [
    { type: 'tile-cube-red', count: 28 },
    { type: 'tile-pyramid', count: 28 }
  ]},

  // --- БЛОК 3: ТРИ ЦЕЛИ (16-25 уровни) ---
  16: { moves: 20, targets: [
    { type: 'tile-duck', count: 12 },
    { type: 'tile-pyramid', count: 12 },
    { type: 'tile-bow', count: 12 }
  ]},
  17: { moves: 20, targets: [
    { type: 'tile-cube-blue', count: 15 },
    { type: 'tile-cube-red', count: 15 },
    { type: 'tile-ball-green', count: 15 }
  ]},
  18: { moves: 18, targets: [
    { type: 'tile-duck', count: 18 },
    { type: 'tile-bow', count: 18 },
    { type: 'tile-cube-blue', count: 18 }
  ]},
  19: { moves: 18, targets: [
    { type: 'tile-pyramid', count: 20 },
    { type: 'tile-ball-green', count: 20 },
    { type: 'tile-cube-red', count: 20 }
  ]},
  20: { moves: 16, targets: [
    { type: 'tile-duck', count: 22 },
    { type: 'tile-cube-blue', count: 22 },
    { type: 'tile-bow', count: 22 }
  ]},
  21: { moves: 16, targets: [
    { type: 'tile-pyramid', count: 25 },
    { type: 'tile-cube-red', count: 25 },
    { type: 'tile-ball-green', count: 25 }
  ]},
  22: { moves: 15, targets: [
    { type: 'tile-duck', count: 28 },
    { type: 'tile-pyramid', count: 28 },
    { type: 'tile-cube-blue', count: 28 }
  ]},
  23: { moves: 15, targets: [
    { type: 'tile-bow', count: 30 },
    { type: 'tile-cube-red', count: 30 },
    { type: 'tile-ball-green', count: 30 }
  ]},
  24: { moves: 14, targets: [
    { type: 'tile-duck', count: 35 },
    { type: 'tile-pyramid', count: 35 },
    { type: 'tile-bow', count: 35 }
  ]},
  25: { moves: 14, targets: [
    { type: 'tile-cube-blue', count: 40 },
    { type: 'tile-cube-red', count: 40 },
    { type: 'tile-ball-green', count: 40 }
  ]},

  // --- БЛОК 4: ХАРДКОР (26-30 уровни) ---
  26: { moves: 12, targets: [
    { type: 'tile-duck', count: 30 },
    { type: 'tile-pyramid', count: 30 },
    { type: 'tile-cube-red', count: 30 }
  ]},
  27: { moves: 12, targets: [
    { type: 'tile-bow', count: 35 },
    { type: 'tile-cube-blue', count: 35 },
    { type: 'tile-ball-green', count: 35 }
  ]},
  28: { moves: 10, targets: [
    { type: 'tile-duck', count: 40 },
    { type: 'tile-pyramid', count: 40 },
    { type: 'tile-bow', count: 40 }
  ]},
  29: { moves: 10, targets: [
    { type: 'tile-cube-blue', count: 45 },
    { type: 'tile-cube-red', count: 45 },
    { type: 'tile-ball-green', count: 45 }
  ]},
  30: { moves: 8, targets: [
    { type: 'tile-duck', count: 50 },
    { type: 'tile-pyramid', count: 50 },
    { type: 'tile-bow', count: 50 }
  ]}
};

export function getLevelData(levelId) {
  // Если уровня нет (например, игрок прошел все 30), возвращаем последний, 
  // чтобы игра не сломалась и можно было похвалить игрока
  if (!LEVELS[levelId]) {
    console.warn(`Уровень ${levelId} не найден! Загружен последний доступный уровень.`);
    return LEVELS[30] || LEVELS[1]; 
  }
  return LEVELS[levelId];
}