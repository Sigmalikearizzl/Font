// src/main.js
// Entry point for Liminal Asylum
// Initializes all core systems and starts the game loop

import { GameManager } from './game.js';
import { SettingsManager } from './settings/settings-manager.js';
import { PerformanceMonitor } from './utils/performance-monitor.js';

class Application {
  constructor() {
    this.settingsManager = new SettingsManager();
    this.gameManager = null;
    this.performanceMonitor = new PerformanceMonitor();
    this.isRunning = false;
  }

  async init() {
    try {
      console.log('Initializing Liminal Asylum...');

      // Apply loaded settings
      this.settingsManager.applySettings();

      // Initialize game manager with settings
      this.gameManager = new GameManager(this.settingsManager.settings);
      await this.gameManager.init();

      console.log('Initialization complete. Starting game...');
      this.start();
    } catch (error) {
      console.error('Failed to initialize game:', error);
      this.displayErrorScreen(error);
    }
  }

  start() {
    this.isRunning = true;
    this.gameLoop();
  }

  gameLoop() {
    if (!this.isRunning) return;

    const deltaTime = this.performanceMonitor.getDeltaTime();
    this.performanceMonitor.update(deltaTime);

    // Update game logic
    this.gameManager.update(deltaTime);

    // Render frame
    this.gameManager.render();

    // Continue loop
    requestAnimationFrame(() => this.gameLoop());
  }

  pause() {
    this.isRunning = false;
  }

  resume() {
    this.isRunning = true;
    this.gameLoop();
  }

  displayErrorScreen(error) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #1a1a1a;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ff4444;
      font-family: monospace;
      z-index: 9999;
    `;
    errorDiv.innerHTML = `
      <div style="text-align: center;">
        <h1>INITIALIZATION ERROR</h1>
        <p>${error.message}</p>
        <p style="color: #888; font-size: 12px; margin-top: 20px;">
          Check browser console for details
        </p>
      </div>
    `;
    document.body.appendChild(errorDiv);
  }
}

// Start application when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const app = new Application();
    app.init();
  });
} else {
  const app = new Application();
  app.init();
}
