import Phaser from 'phaser';
import bgRoomImg from '../assets/bg-room.png'; // Используем фон из меню
import btnBackImg from '../assets/btn-back.png';
import AudioManager from './AudioManager';

export default class SettingsScene extends Phaser.Scene {
  constructor() {
    super({ key: 'SettingsScene' });
  }

  preload() {
    // Загружаем то, что нужно только для этой сцены
    this.load.image('bg-room', bgRoomImg);
    this.load.image('btn-back', btnBackImg);
  }

  create() {
    // Фон
    this.add.image(215, 466, 'bg-room').setDisplaySize(430, 932);

        // Заголовок
    this.add.text(215, 100, 'НАСТРОЙКИ', {
      fontSize: '36px', 
      fontFamily: 'Arial', 
      color: '#003366', // Темно-синий цвет (виден на белом)
      fontStyle: 'bold',
      stroke: '#ffffff', // Белая обводка
      strokeThickness: 4
    }).setOrigin(0.5);

    // Кнопка Назад
    const backBtn = this.add.image(50, 50, 'btn-back')
      .setDisplaySize(60, 60)
      .setInteractive({ useHandCursor: true });
    
    backBtn.on('pointerdown', () => {
      this.scene.start('MainMenu');
    });

        // --- Блок музыки ---
    this.add.text(50, 200, 'Музыка:', { fontSize: '24px', color: '#003366', fontStyle: 'bold' }).setOrigin(0, 0.5);
    
    this.musicToggle = this.add.text(250, 200, this.getMusicLabel(), { 
      fontSize: '24px', 
      color: '#ffffff', 
      backgroundColor: '#009379', // Зеленый фон кнопки
      padding: { x: 15, y: 5 } 
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    this.musicToggle.on('pointerdown', () => {
      let isMuted = localStorage.getItem('musicMuted') === 'true';
      localStorage.setItem('musicMuted', !isMuted);
      this.musicToggle.setText(this.getMusicLabel());
    });

    // --- Блок звуков ---
    this.add.text(50, 280, 'Звуки:', { fontSize: '24px', color: '#003366', fontStyle: 'bold' }).setOrigin(0, 0.5);
    
    this.sfxToggle = this.add.text(250, 280, this.getSfxLabel(), { 
      fontSize: '24px', 
      color: '#ffffff', 
      backgroundColor: '#009379', 
      padding: { x: 15, y: 5 } 
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    this.sfxToggle.on('pointerdown', () => {
      let isMuted = localStorage.getItem('sfxMuted') === 'true';
      localStorage.setItem('sfxMuted', !isMuted);
      this.sfxToggle.setText(this.getSfxLabel());
    });

        // --- Профиль ---
    this.add.text(215, 400, 'Выбери иконку профиля:', { 
      fontSize: '20px', 
      color: '#003366', 
      fontStyle: 'bold' 
    }).setOrigin(0.5);
    
    // ... код иконок (🐱, 🐶, 🐰) ...

    // --- Юридические ссылки ---
    this.add.text(215, 700, 'Политика конфиденциальности', { 
      fontSize: '16px', 
      color: '#003366', 
      underline: true 
    }).setOrigin(0.5).setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.showToast('Политика откроется позже'));
      
    this.add.text(215, 740, 'Условия использования', { 
      fontSize: '16px', 
      color: '#003366', 
      underline: true 
    }).setOrigin(0.5).setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.showToast('Условия откроются позже'));
   }
  // Вспомогательные функции для отображения состояния кнопок
  getMusicLabel() {
    const isMuted = localStorage.getItem('musicMuted') === 'true';
    return isMuted ? 'ВЫКЛ' : 'ВКЛ';
  }
  
  getSfxLabel() {
    const isMuted = localStorage.getItem('sfxMuted') === 'true';
    return isMuted ? 'ВЫКЛ' : 'ВКЛ';
  }

  // Всплывающее сообщение
  showToast(message) {
    const toast = this.add.text(215, 600, message, {
      fontSize: '18px', color: '#fff', backgroundColor: '#009379', padding: { x: 15, y: 10 }
    }).setOrigin(0.5).setDepth(1000).setAlpha(1);

    this.tweens.add({
      targets: toast,
      alpha: 0,
      y: 550,
      duration: 2000,
      onComplete: () => toast.destroy()
    });
  }
  }