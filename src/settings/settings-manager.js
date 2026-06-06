// src/settings/settings-manager.js
// Settings persistence and management

import { DEFAULT_SETTINGS } from '../utils/constants.js';

export class SettingsManager {
  constructor() {
    this.storageKey = 'LiminalAsylumSettings';
    this.settings = this.loadSettings();
    this.listeners = [];
  }

  loadSettings() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        return this.mergeSettings(JSON.parse(stored), DEFAULT_SETTINGS);
      }
    } catch (error) {
      console.warn('Failed to load settings from localStorage:', error);
    }
    return JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
  }

  saveSettings(newSettings) {
    try {
      this.settings = this.mergeSettings(newSettings, this.settings);
      localStorage.setItem(this.storageKey, JSON.stringify(this.settings));
      this.notifyListeners();
      return true;
    } catch (error) {
      console.error('Failed to save settings:', error);
      return false;
    }
  }

  mergeSettings(source, target) {
    const result = JSON.parse(JSON.stringify(target));
    for (const key in source) {
      if (typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = this.mergeSettings(source[key], target[key] || {});
      } else {
        result[key] = source[key];
      }
    }
    return result;
  }

  getSetting(path) {
    const keys = path.split('.');
    let value = this.settings;
    for (const key of keys) {
      value = value?.[key];
    }
    return value;
  }

  setSetting(path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    let obj = this.settings;

    for (const key of keys) {
      if (!(key in obj)) obj[key] = {};
      obj = obj[key];
    }

    obj[lastKey] = value;
    this.saveSettings(this.settings);
  }

  applySettings() {
    // Apply graphics settings
    this.applyGraphicsSettings();

    // Apply audio settings
    this.applyAudioSettings();

    // Apply control settings
    this.applyControlSettings();

    // Apply accessibility settings
    this.applyAccessibilitySettings();
  }

  applyGraphicsSettings() {
    const graphics = this.settings.graphics;

    // Update canvas resolution if needed
    if (graphics.fullscreen) {
      document.body.requestFullscreen?.();
    }

    // Update FOV
    if (window.gameManager?.camera) {
      window.gameManager.camera.fov = graphics.fov;
      window.gameManager.camera.updateProjectionMatrix();
    }
  }

  applyAudioSettings() {
    const audio = this.settings.audio;
    
    if (window.audioManager) {
      window.audioManager.setVolume('master', audio.masterVolume / 100);
      window.audioManager.setVolume('music', audio.musicVolume / 100);
      window.audioManager.setVolume('sfx', audio.sfxVolume / 100);
      window.audioManager.setVolume('ambience', audio.ambienceVolume / 100);
    }
  }

  applyControlSettings() {
    const controls = this.settings.controls;

    if (window.playerController) {
      window.playerController.sensitivity = controls.sensitivity;
      window.playerController.invertY = controls.invertY;
    }
  }

  applyAccessibilitySettings() {
    const accessibility = this.settings.accessibility;

    // Apply UI scaling
    document.documentElement.style.fontSize = `${accessibility.uiScale * 16}px`;

    // Apply color/contrast if needed
    if (accessibility.highContrastMode) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }

    // Apply color blindness filter if needed
    if (accessibility.colorblindMode !== 'none') {
      document.body.classList.add(`colorblind-${accessibility.colorblindMode}`);
    } else {
      document.body.classList.remove('colorblind-protanopia', 'colorblind-deuteranopia', 'colorblind-tritanopia');
    }
  }

  resetToDefaults() {
    this.settings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
    this.saveSettings(this.settings);
  }

  onChange(callback) {
    this.listeners.push(callback);
  }

  notifyListeners() {
    this.listeners.forEach(callback => callback(this.settings));
  }

  exportSettings() {
    return JSON.stringify(this.settings, null, 2);
  }

  importSettings(jsonString) {
    try {
      const imported = JSON.parse(jsonString);
      this.saveSettings(imported);
      return true;
    } catch (error) {
      console.error('Failed to import settings:', error);
      return false;
    }
  }
}
