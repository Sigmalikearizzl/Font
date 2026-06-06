// src/game.js
// Core game manager handling main game loop and system coordination

import * as THREE from 'three';
import { PlayerController } from './player/controller.js';
import { EntityAI } from './entity/ai-state-machine.js';
import { LevelGenerator } from './level/level-generator.js';
import { AudioManager } from './audio/audio-manager.js';
import { HUD } from './ui/hud.js';
import { MenuManager } from './ui/menu-manager.js';
import { GAME_STATE, ENTITY_STATE, PLAYER_STATE } from './utils/constants.js';

export class GameManager {
  constructor(settings) {
    this.settings = settings;

    // Scene setup
    this.scene = null;
    this.camera = null;
    this.renderer = null;

    // Game systems
    this.playerController = null;
    this.entity = null;
    this.levelManager = null;
    this.audioManager = null;
    this.hud = null;
    this.menuManager = null;

    // Game state
    this.gameState = GAME_STATE.MENU;
    this.survivalTimer = 0;
    this.isGameRunning = false;

    // Performance
    this.lastFrameTime = performance.now();
  }

  async init() {
    console.log('Initializing GameManager...');

    // Setup graphics
    await this.setupGraphics();

    // Initialize game systems
    this.audioManager = new AudioManager();
    this.hud = new HUD(this.settings);
    this.menuManager = new MenuManager(this);

    // Load and generate level
    await this.generateLevel();

    // Initialize player and entity
    this.playerController = new PlayerController(this.camera, this.settings);
    this.entity = new EntityAI(this.scene);

    // Setup event listeners
    this.setupEventListeners();

    console.log('GameManager initialization complete');
  }

  async setupGraphics() {
    // Create scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x1a1a1a);
    this.scene.fog = new THREE.Fog(0xd4af7a, 50, 150);

    // Setup camera
    const fov = this.settings.graphics.fov || 90;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 0.1;
    const far = 1000;
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.camera.position.set(0, 1.7, 0); // Eye level

    // Setup renderer
    const canvas = document.createElement('canvas');
    document.body.appendChild(canvas);

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: 'high-performance'
    });

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowShadowMap;

    // Lighting setup
    this.setupLighting();

    // Handle window resize
    window.addEventListener('resize', () => this.onWindowResize());
  }

  setupLighting() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    // Directional light (simulating fluorescent panels)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.far = 100;
    this.scene.add(directionalLight);

    // Point lights for fluorescent fixtures
    this.setupFlourescent();
  }

  setupFlourescent() {
    // Add flickering fluorescent lights during level setup
    // This will be expanded in level generation
  }

  async generateLevel() {
    console.log('Generating level...');
    const levelGenerator = new LevelGenerator(this.settings);
    const levelData = await levelGenerator.generateLevel();

    // Add level to scene
    this.scene.add(levelData.mesh);

    // Store level reference
    this.levelData = levelData;
    this.levelManager = levelData.manager;
  }

  setupEventListeners() {
    // Pause/unpause
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.togglePause();
      }
    });

    // Window resize
    window.addEventListener('resize', () => this.onWindowResize());
  }

  update(deltaTime) {
    if (!this.isGameRunning || this.gameState === GAME_STATE.PAUSED) {
      return;
    }

    // Update survival timer
    this.survivalTimer += deltaTime;

    // Update player
    this.playerController.update(deltaTime);

    // Update entity
    this.entity.update(deltaTime, this.playerController.position);

    // Update audio
    this.audioManager.update(deltaTime, {
      playerPos: this.playerController.position,
      entityPos: this.entity.position,
      entityState: this.entity.state,
      threatLevel: this.calculateThreatLevel()
    });

    // Check collisions
    this.checkCollisions();

    // Check win/lose conditions
    this.checkGameConditions();

    // Update HUD
    this.hud.update({
      stamina: this.playerController.stamina,
      survivalTime: this.survivalTimer,
      threatLevel: this.calculateThreatLevel(),
      objective: this.getObjective()
    });
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  checkCollisions() {
    // Entity catches player
    const distToEntity = this.playerController.position.distanceTo(this.entity.position);
    if (distToEntity < 1.0) {
      this.onPlayerCaught();
    }

    // Player reaches exit
    if (this.levelManager.playerAtExit(this.playerController.position)) {
      this.onPlayerEscaped();
    }

    // Player at safe zone
    if (this.levelManager.playerAtSafeZone(this.playerController.position)) {
      this.hud.showSafeZoneIndicator();
    }
  }

  checkGameConditions() {
    // Custom conditions based on difficulty and game state
    // Escalate entity behavior over time
    this.escalateDifficulty();
  }

  escalateDifficulty() {
    // Increase entity aggression based on survival time
    const phase = Math.floor(this.survivalTimer / 300); // Phase every 5 minutes

    if (phase === 1 && this.entity.state === ENTITY_STATE.PATROL) {
      this.entity.setState(ENTITY_STATE.HUNT);
    } else if (phase === 2) {
      this.entity.speed *= 1.1; // Increase speed
      this.entity.hearingRange *= 1.15; // Better hearing
    } else if (phase === 3) {
      this.entity.aggressiveness = 0.9; // Very aggressive
    }
  }

  calculateThreatLevel() {
    const dist = this.playerController.position.distanceTo(this.entity.position);
    
    if (this.entity.state === ENTITY_STATE.CHASE) {
      return Math.max(0, 1 - (dist / 20));
    } else if (this.entity.state === ENTITY_STATE.HUNT) {
      return Math.max(0, 0.5 * (1 - (dist / 25)));
    }
    return 0;
  }

  getObjective() {
    if (this.levelManager.playerAtExit(this.playerController.position)) {
      return 'ESCAPE!';
    }
    return 'FIND EXIT';
  }

  onPlayerCaught() {
    console.log('Player caught by entity!');
    this.isGameRunning = false;
    this.gameState = GAME_STATE.GAME_OVER;
    this.menuManager.showGameOverScreen({
      survivalTime: this.survivalTimer,
      reason: 'CAUGHT',
      score: Math.floor(this.survivalTimer * 100)
    });
  }

  onPlayerEscaped() {
    console.log('Player escaped!');
    this.isGameRunning = false;
    this.gameState = GAME_STATE.WIN;
    this.menuManager.showVictoryScreen({
      survivalTime: this.survivalTimer,
      score: Math.floor(this.survivalTimer * 100)
    });
  }

  togglePause() {
    if (this.gameState === GAME_STATE.PLAYING) {
      this.gameState = GAME_STATE.PAUSED;
      this.menuManager.showPauseMenu();
    } else if (this.gameState === GAME_STATE.PAUSED) {
      this.gameState = GAME_STATE.PLAYING;
      this.menuManager.hidePauseMenu();
    }
  }

  startNewGame() {
    // Reset timers and state
    this.survivalTimer = 0;
    this.isGameRunning = true;
    this.gameState = GAME_STATE.PLAYING;

    // Regenerate level
    this.generateLevel();

    // Reset systems
    this.playerController.reset();
    this.entity.reset();
    this.audioManager.reset();

    console.log('New game started');
  }

  onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }

  dispose() {
    this.renderer.dispose();
    this.audioManager.dispose();
    window.removeEventListener('resize', () => this.onWindowResize());
  }
}
