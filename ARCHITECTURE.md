# ARCHITECTURE & TECHNICAL REFERENCE

**Document Version**: 1.0  
**Date**: 2026-06-06  
**Purpose**: Technical guide for implementation

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Core Systems Overview](#core-systems-overview)
3. [Player Controller](#player-controller)
4. [Entity AI System](#entity-ai-system)
5. [Level Generation](#level-generation)
6. [Audio System](#audio-system)
7. [Settings & Persistence](#settings--persistence)
8. [Performance Guidelines](#performance-guidelines)

---

## Project Structure

```
Font/
├── README.md                           # Project overview
├── GAME_DESIGN_DOCUMENT.md            # Full design spec
├── ARCHITECTURE.md                     # This file
├── package.json                        # Node dependencies (if web-based)
│
├── src/                                # Source code
│   ├── main.js                         # Entry point
│   ├── game.js                         # Main game loop manager
│   │
│   ├── player/
│   │   ├── controller.js               # Player input & movement
│   │   ├── camera.js                   # Camera system with head bob
│   │   ├── stamina.js                  # Stamina management
│   │   └── animations.js               # First-person arm/hand animations
│   │
│   ├── entity/
│   │   ├── entity.js                   # Entity class & properties
│   │   ├── ai-state-machine.js         # Behavior states (patrol, hunt, etc.)
│   │   ├── pathfinding.js              # A* navigation
│   │   ├── awareness.js                # Sight, sound, proximity detection
│   │   ├── animator.js                 # Animation playback & transitions
│   │   └── audio-emitter.js            # Entity audio cues
│   │
│   ├── level/
│   │   ├── level-generator.js          # Procedural layout generation
│   │   ├── level-manager.js            # Level state & interactions
│   │   ├── room-types.js               # Predefined room templates
│   │   ├── checkpoint-system.js        # Safe zones & spawn points
│   │   └── interactive-objects.js      # Doors, keys, switches
│   │
│   ├── audio/
│   │   ├── audio-manager.js            # Central audio controller
│   │   ├── ambience.js                 # Ambient soundscape layers
│   │   ├── music-manager.js            # Dynamic music system
│   │   ├── sfx-manager.js              # Sound effects (footsteps, etc.)
│   │   └── spatial-audio.js            # 3D positional audio
│   │
│   ├── ui/
│   │   ├── hud.js                      # In-game HUD (stamina, timer, etc.)
│   │   ├── menu-manager.js             # Pause/settings/game over menus
│   │   ├── settings-ui.js              # Settings panel logic
│   │   └── accessibility.js            # Accessibility features
│   │
│   ├── rendering/
│   │   ├── renderer.js                 # Graphics setup (Three.js or Babylon.js)
│   │   ├── post-processing.js          # Distortion, vignette, effects
│   │   ├── lighting.js                 # Lighting setup & flickering
│   │   └── materials.js                # Material definitions
│   │
│   ├── settings/
│   │   ├── settings-manager.js         # Settings load/save
│   │   ├── default-settings.js         # Default values
│   │   └── keybinds.js                 # Key remapping
│   │
│   ├── utils/
│   │   ├── math.js                     # Utility math functions
│   │   ├── constants.js                # Game constants & enums
│   │   ├── logger.js                   # Logging & debugging
│   │   └── performance-monitor.js      # FPS counter & profiling
│   │
│   └── tests/
│       ├── player-controller.test.js
│       ├── entity-ai.test.js
│       └── level-generation.test.js
│
├── assets/
│   ├── models/
│   │   ├── entity/
│   │   │   ├── entity.gltf             # Entity 3D model
│   │   │   ├── entity.animations.js    # Animation data
│   │   │   └── entity-materials.js     # Material setup
│   │   ├── environment/
│   │   │   ├── hallway.gltf
│   │   │   ├── room-templates.gltf
│   │   │   └── props.gltf
│   │   └── hands/
│   │       └── first-person-arms.gltf
│   │
│   ├── audio/
│   │   ├── ambience/
│   │   │   ├── fluorescent-hum.wav
│   │   │   ├── distant-rumble.ogg
│   │   │   └── vent-noise.wav
│   │   ├── entity/
│   │   │   ├── entity-idle.wav
│   │   │   ├── entity-hunt.wav
│   │   │   ├── entity-chase.wav
│   │   │   └── entity-capture.wav
│   │   ├── sfx/
│   │   │   ├── footstep-carpet.wav
│   │   │   ├── footstep-tile.wav
│   │   │   ├── door-open.wav
│   │   │   └── key-insert.wav
│   │   ├── music/
│   │   │   ├── exploration.ogg
│   │   │   ├── hunt-layer-1.ogg
│   │   │   ├── hunt-layer-2.ogg
│   │   │   ├── chase-theme.ogg
│   │   │   └── safe-zone.ogg
│   │   └── player/
│   │       ├── breathing-light.wav
│   │       ├── breathing-heavy.wav
│   │       └── heartbeat.wav
│   │
│   ├── textures/
│   │   ├── walls/
│   │   ├── carpet/
│   │   ├── metal/
│   │   └── lighting/
│   │
│   └── shaders/
│       ├── distortion.glsl
│       ├── chromatic-aberration.glsl
│       └── vignette.glsl
│
├── docs/
│   ├── ANIMATION_GUIDE.md
│   ├── AUDIO_DESIGN.md
│   ├── ENTITY_AI.md
│   └── PROCEDURAL_GENERATION.md
│
├── build/
│   ├── webpack.config.js
│   ├── dev-server.js
│   └── build.js
│
├── .gitignore
├── .eslintrc.js
├── jest.config.js
└── LICENSE

```

---

## Core Systems Overview

### 1. Game Loop

```javascript
// Pseudocode
class GameManager {
  constructor() {
    this.running = false;
    this.deltaTime = 0;
    this.lastFrameTime = 0;
  }

  start() {
    this.running = true;
    this.gameLoop();
  }

  gameLoop() {
    const now = performance.now();
    this.deltaTime = (now - this.lastFrameTime) / 1000;
    this.lastFrameTime = now;

    this.update(this.deltaTime);
    this.render();

    if (this.running) {
      requestAnimationFrame(() => this.gameLoop());
    }
  }

  update(deltaTime) {
    this.playerController.update(deltaTime);
    this.entity.update(deltaTime);
    this.levelManager.update(deltaTime);
    this.audioManager.update(deltaTime);
    this.checkCollisions();
    this.checkWinLoseConditions();
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}
```

### 2. Input System

**Supported Input**:
- Keyboard (WASD, CTRL, SHIFT, SPACE, etc.)
- Mouse (look, sensitivity adjustment)
- Controller (gamepad API)

**Event Flow**:
1. Input detected (keyboard/mouse/gamepad)
2. Mapped to action via keybind system
3. Action queued in input buffer
4. PlayerController consumes action during update

### 3. State Management

**Game States**:
- `MENU` – Main menu
- `SETTINGS` – Settings open
- `PLAYING` – Active gameplay
- `PAUSED` – Game paused
- `GAME_OVER` – Loss screen
- `WIN` – Victory screen

**Entity Behavior States**:
- `IDLE` – Standing still
- `PATROL` – Walking route
- `INVESTIGATE` – Investigating sound
- `HUNT` – Searching for player
- `CHASE` – Actively pursuing
- `ATTACK` – Attacking player
- `LOST` – Lost player, returning to patrol

---

## Player Controller

### Movement State Machine

```javascript
class PlayerController {
  constructor() {
    this.state = 'idle';
    this.velocity = new Vector3(0, 0, 0);
    this.stamina = 100;
    this.maxStamina = 100;
    this.isGrounded = false;
  }

  update(deltaTime) {
    this.processInput();
    this.updateMovementState(deltaTime);
    this.applyMovement(deltaTime);
    this.updateAnimations(deltaTime);
    this.updateAudio(deltaTime);
  }

  processInput() {
    this.moveInput = {
      forward: this.isKeyDown('W') ? 1 : 0,
      backward: this.isKeyDown('S') ? 1 : 0,
      left: this.isKeyDown('A') ? 1 : 0,
      right: this.isKeyDown('D') ? 1 : 0,
      sprint: this.isKeyDown('Shift'),
      crouch: this.isKeyDown('Control'),
      slide: this.isKeyDown('Space')
    };
  }

  updateMovementState(deltaTime) {
    // State transitions based on input and stamina
    if (this.moveInput.slide && this.canSlide()) {
      this.state = 'slide';
      this.stamina -= 30; // Stamina cost
      this.slideTimer = 0.7; // Duration
    } else if (this.moveInput.crouch) {
      this.state = 'crouch';
      this.stamina -= 5 * deltaTime; // Low drain
    } else if (this.moveInput.sprint && this.stamina > 0) {
      this.state = 'sprint';
      this.stamina -= 20 * deltaTime;
    } else if (this.moveInput.forward || this.moveInput.backward ||
               this.moveInput.left || this.moveInput.right) {
      this.state = 'walk';
      this.stamina += 15 * deltaTime; // Regenerate
    } else {
      this.state = 'idle';
      this.stamina += 15 * deltaTime;
    }

    // Clamp stamina
    this.stamina = Math.max(0, Math.min(this.maxStamina, this.stamina));
  }

  applyMovement(deltaTime) {
    const moveVector = new Vector3(
      this.moveInput.right - this.moveInput.left,
      0,
      this.moveInput.forward - this.moveInput.backward
    ).normalize();

    const moveSpeed = this.getStateSpeed();
    const acceleration = 0.3;

    // Smooth acceleration
    this.currentSpeed = lerp(this.currentSpeed, moveSpeed, acceleration);

    this.velocity.copy(moveVector).multiplyScalar(this.currentSpeed);
    this.position.add(this.velocity.clone().multiplyScalar(deltaTime));
  }

  getStateSpeed() {
    const baseSpeed = 5.0; // m/s
    if (this.state === 'sprint') return baseSpeed * 1.8;
    if (this.state === 'crouch') return baseSpeed * 0.5;
    if (this.state === 'slide') return baseSpeed * 1.5;
    if (this.state === 'walk') return baseSpeed;
    return 0;
  }

  updateAnimations(deltaTime) {
    // Update first-person arm animations based on movement state
    // Sync with audio (footsteps, breathing, etc.)
  }

  updateAudio(deltaTime) {
    // Play footsteps based on surface and movement speed
    // Update breathing volume based on sprint state
    // Play landing sound if jumping
  }

  canSlide() {
    return this.state === 'sprint' && 
           this.slideTimer >= 1.5 && 
           this.stamina >= 30;
  }
}
```

### Stamina System

**Drain Rate**:
- Sprint: 20% per second
- Crouch: 5% per second (low)
- Walk: 0% (no drain)
- Idle: 0%

**Regeneration Rate**:
- Walk/idle: 15% per second
- Regeneration time from empty: ~7 seconds

**UI Representation**:
- Green: 66–100% (safe)
- Yellow: 33–65% (caution)
- Red: 0–32% (warning)

---

## Entity AI System

### Behavior State Machine

```javascript
class EntityAI {
  constructor() {
    this.state = 'idle';
    this.lastKnownPlayerPos = null;
    this.memoryTimer = 0;
    this.maxMemoryDuration = 40; // seconds
  }

  update(deltaTime) {
    this.updateAwareness(deltaTime);
    this.updateState(deltaTime);
    this.updateAnimation(deltaTime);
    this.updateAudio(deltaTime);
  }

  updateAwareness(deltaTime) {
    const playerDist = distance(this.position, this.playerPosition);
    const playerVisible = this.canSeePlayer();
    const playerAudible = this.canHearPlayer();
    const playerNearby = playerDist < 3; // Proximity sense

    if (playerVisible || playerAudible || playerNearby) {
      this.lastKnownPlayerPos = this.playerPosition.clone();
      this.memoryTimer = 0;
    } else if (this.lastKnownPlayerPos) {
      this.memoryTimer += deltaTime;
      if (this.memoryTimer > this.maxMemoryDuration) {
        this.lastKnownPlayerPos = null;
      }
    }

    this.confidence = this.calculateConfidence(playerDist, playerVisible);
  }

  updateState(deltaTime) {
    switch (this.state) {
      case 'idle':
        this.updateIdleState(deltaTime);
        break;
      case 'patrol':
        this.updatePatrolState(deltaTime);
        break;
      case 'investigate':
        this.updateInvestigateState(deltaTime);
        break;
      case 'hunt':
        this.updateHuntState(deltaTime);
        break;
      case 'chase':
        this.updateChaseState(deltaTime);
        break;
      case 'attack':
        this.updateAttackState(deltaTime);
        break;
      case 'lost':
        this.updateLostState(deltaTime);
        break;
    }
  }

  updateIdleState(deltaTime) {
    if (this.lastKnownPlayerPos) {
      this.setState('investigate');
    }
    // Slight sway, breathing animation
  }

  updatePatrolState(deltaTime) {
    // Move along predefined patrol route
    // Check for player awareness
    if (this.lastKnownPlayerPos) {
      this.setState('investigate');
    }
  }

  updateInvestigateState(deltaTime) {
    // Move toward last known player position
    // Listen intently for sounds
    if (this.canSeePlayer() || this.canHearPlayer()) {
      this.setState('hunt');
    } else if (!this.lastKnownPlayerPos) {
      this.setState('lost');
    }
  }

  updateHuntState(deltaTime) {
    // Actively search for player
    // Move between possible hiding spots
    if (distance(this, this.playerPosition) < 5) {
      this.setState('chase');
    } else if (!this.lastKnownPlayerPos && this.memoryTimer > 30) {
      this.setState('lost');
    }
  }

  updateChaseState(deltaTime) {
    // Sprint toward player
    // Attempt to cut off escape routes
    const playerDist = distance(this, this.playerPosition);
    if (playerDist < 1) {
      this.setState('attack');
    } else if (playerDist > 20 && !this.canSeePlayer()) {
      this.setState('hunt');
    }
  }

  updateAttackState(deltaTime) {
    // Grab/strike animation
    // Trigger game over after contact
  }

  updateLostState(deltaTime) {
    // Slow movement, confused sounds
    // Return to patrol route
    const timeInLost = 5; // seconds before resuming patrol
    if (this.timeSinceLastKnown > timeInLost) {
      this.setState('patrol');
    }
  }

  setState(newState) {
    this.state = newState;
    this.stateTimer = 0;
    // Trigger state-specific audio cues and animations
  }

  calculateConfidence(distance, visible) {
    if (visible) return 1.0;
    if (this.lastKnownPlayerPos) return 0.7;
    return 0.0;
  }

  canSeePlayer() {
    const dist = distance(this, this.playerPosition);
    if (dist > 15) return false; // Max sight range
    const angle = angleToPlayer();
    return Math.abs(angle) < 45; // 90° FOV
  }

  canHearPlayer() {
    const dist = distance(this, this.playerPosition);
    return dist < 12; // Hearing range
  }
}
```

### Pathfinding

**Navigation Mesh**:
- Pre-baked navigation mesh for each level layout
- Regenerated when procedural layout is created
- Allows intelligent agent movement and routing

**A\* Algorithm**:
- Find shortest path between entity position and target (player or patrol point)
- Dynamic avoidance of obstacles
- Smooth path interpolation

---

## Level Generation

### Procedural Layout System

```javascript
class LevelGenerator {
  constructor() {
    this.chunkLibrary = this.loadChunks();
    this.layout = [];
  }

  generateLevel() {
    // 1. Select spawn chunk
    const spawnChunk = this.chunkLibrary['spawn'];
    this.addChunk(spawnChunk, { x: 0, y: 0 });

    // 2. Generate random middle section (3–4 chunks)
    const middleChunkCount = random(3, 5);
    for (let i = 0; i < middleChunkCount; i++) {
      const randomChunk = this.selectRandomChunk();
      const position = this.calculateNextPosition();
      this.addChunk(randomChunk, position);
    }

    // 3. Add exit chunk
    const exitChunk = this.chunkLibrary['exit'];
    this.addChunk(exitChunk, this.calculateNextPosition());

    // 4. Generate navigation mesh
    this.generateNavMesh();

    // 5. Place interactive objects (keys, safe zones, etc.)
    this.placeInteractiveObjects();

    return this.buildLevel();
  }

  selectRandomChunk() {
    const categories = ['hallway', 'room', 'transition'];
    const category = random(categories);
    const chunksInCategory = this.chunkLibrary[category];
    return random(chunksInCategory);
  }

  calculateNextPosition() {
    // Determine attachment point of next chunk
    const lastChunk = this.layout[this.layout.length - 1];
    return lastChunk.exitPoint;
  }

  addChunk(chunk, position) {
    const newChunk = {
      type: chunk.type,
      position,
      objects: chunk.objects.map(obj => this.placeObject(obj, position)),
      doors: chunk.doors.map(door => this.placeDoor(door, position))
    };
    this.layout.push(newChunk);
  }

  buildLevel() {
    // Instantiate all objects in 3D scene
    const levelGroup = new THREE.Group();
    
    this.layout.forEach(chunk => {
      const chunkMesh = this.createChunkMesh(chunk);
      levelGroup.add(chunkMesh);
    });

    return levelGroup;
  }
}
```

### Chunk Types

**Hallway Chunks**:
- Standard corridor (8–15m)
- L-turn
- T-junction
- Cross-junction
- Narrow section (crouch/slide required)

**Room Chunks**:
- Break room
- Office cubicles
- Storage/filing
- Bathroom
- Maintenance closet

**Transition Chunks**:
- Vent (crawlspace)
- Stairwell
- Elevator vestibule
- Underground passage

### Safe Zone Placement

- Locked rooms with single entrance
- Distributed throughout level (1 per 2–3 chunks)
- Contains supplies and checkpoint function
- Entity avoids if door is locked

---

## Audio System

### Audio Manager Architecture

```javascript
class AudioManager {
  constructor() {
    this.audioContext = new AudioContext();
    this.ambience = new AmbienceLayer();
    this.entity = new EntityAudioEmitter();
    this.music = new MusicManager();
    this.sfx = new SFXManager();
    this.spatialAudio = new SpatialAudioProcessor();
  }

  update(deltaTime) {
    this.updateAmbience(deltaTime);
    this.updateEntity(deltaTime);
    this.updateMusic(deltaTime);
    this.updateSpatialAudio(deltaTime);
  }

  updateAmbience(deltaTime) {
    // Layer ambient sounds based on location and time
    // Fluorescent hum, water dripping, HVAC noise
    // Crossfade between different ambience presets
  }

  updateEntity(deltaTime) {
    // Position entity audio in 3D space
    // Adjust volume/frequency based on distance
    // Trigger audio cues for state transitions
  }

  updateMusic(deltaTime) {
    // Gradually add music layers as tension increases
    // Sync tempo and intensity with entity threat level
  }

  updateSpatialAudio(deltaTime) {
    // Apply HRTF filtering for directional audio
    // Adjust pan and volume based on listener position
  }

  playSFX(sfxName, position, volume = 1.0) {
    const sfxClip = this.sfx.get(sfxName);
    const positionedSource = this.spatialAudio.createPositionalAudio(
      sfxClip,
      position,
      volume
    );
    positionedSource.play();
  }
}
```

### Audio Layers

**Ambience**:
- Base hum (60 Hz, always present)
- Fluorescent buzz (intermittent)
- HVAC airflow
- Water dripping
- Distant electrical crackling

**Entity Audio**:
- Idle hum and clicking
- Hunt searching pulses
- Chase shrieking and impacts
- Capture finisher

**Player Audio**:
- Footsteps (carpet, tile, metal, grating)
- Breathing (light, moderate, heavy)
- Landing/impact sounds

**Music**:
- Exploration (minimal, ambient)
- Tension layers 1–3
- Chase theme (aggressive)
- Safe zone (calming or quiet)

---

## Settings & Persistence

### Settings Data Structure

```javascript
const defaultSettings = {
  gameplay: {
    difficulty: 'normal', // 'easy', 'normal', 'hard'
    objectiveMarkers: true,
    showStaminaBar: true,
    crosshairType: 'dot' // 'dot', 'reticle', 'hidden'
  },
  graphics: {
    resolution: '1440x900',
    fullscreen: true,
    renderScale: 1.0,
    fov: 90,
    motionBlur: true,
    cameraShake: 'medium',
    headBobIntensity: 'medium',
    vignetteIntensity: 'low',
    sprintFovEffect: true
  },
  audio: {
    masterVolume: 100,
    musicVolume: 80,
    sfxVolume: 90,
    ambienceVolume: 85,
    entityAudioVolume: 95,
    subtitles: true
  },
  accessibility: {
    reducedFlashing: false,
    highContrastMode: false,
    colorblindMode: 'none',
    uiScale: 1.0
  },
  controls: {
    sensitivity: 1.0,
    invertY: false,
    keyBindings: {
      forward: 'W',
      backward: 'S',
      left: 'A',
      right: 'D',
      sprint: 'Shift',
      crouch: 'Control',
      slide: 'Space',
      interact: 'E',
      pause: 'Escape'
    }
  }
};
```

### Settings Persistence

```javascript
class SettingsManager {
  constructor() {
    this.settings = this.loadSettings();
  }

  loadSettings() {
    const storageKey = 'LiminalAsylumSettings';
    const stored = localStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) : defaultSettings;
  }

  saveSettings(newSettings) {
    this.settings = deepMerge(this.settings, newSettings);
    localStorage.setItem('LiminalAsylumSettings', JSON.stringify(this.settings));
    this.applySettings();
  }

  applySettings() {
    // Apply graphics settings to renderer
    // Apply audio settings to AudioContext
    // Apply input settings to input manager
    // Apply difficulty to game parameters
  }

  resetToDefaults() {
    this.saveSettings(defaultSettings);
  }
}
```

---

## Performance Guidelines

### Target Metrics

- **Frame Rate**: 60 FPS minimum, target 120 FPS on mid-range hardware
- **Frame Time**: <16.67ms (60 FPS) or <8.33ms (120 FPS)
- **Memory**: <6 GB peak usage
- **Load Time**: <10 seconds between level transitions

### Optimization Strategies

**Rendering**:
- Frustum culling for off-screen objects
- LOD (Level of Detail) for distant geometry
- Occlusion culling where appropriate
- Texture atlasing to reduce draw calls

**Audio**:
- Limit simultaneous audio sources to 32
- Stream long audio files instead of loading fully
- Use Web Audio API pooling for rapid SFX

**Logic**:
- Limit entity pathfinding updates to every 0.5s (not every frame)
- Batch collision checks
- Use spatial partitioning (quadtree) for proximity queries

**Memory**:
- Unload/reload level chunks as player moves
- Stream textures on demand
- Use object pooling for frequently-created objects (footsteps, effects)

### Profiling

```javascript
class PerformanceMonitor {
  constructor() {
    this.frameTimeHistory = [];
    this.fps = 60;
  }

  update(deltaTime) {
    this.frameTimeHistory.push(deltaTime * 1000); // ms
    if (this.frameTimeHistory.length > 60) {
      this.frameTimeHistory.shift();
    }

    const avgFrameTime = this.frameTimeHistory.reduce((a, b) => a + b) / 
                         this.frameTimeHistory.length;
    this.fps = Math.round(1000 / avgFrameTime);

    if (this.fps < 50) {
      console.warn(`Performance warning: FPS dropped to ${this.fps}`);
    }
  }

  logStats() {
    console.log(`FPS: ${this.fps}, Frame Time: ${(1000/this.fps).toFixed(2)}ms`);
  }
}
```

---

## Next Steps

1. **Prototype Phase 1**: Set up Three.js scene, basic player controller, and placeholder level
2. **Implement Movement**: Sprint, crouch, slide mechanics with feel tuning
3. **Entity Basics**: Create entity model, basic animation, simple AI pathfinding
4. **Level Gen**: Procedural chunk system and layout generation
5. **Audio Integration**: Ambience layers, entity audio cues, music system
6. **Polish Pass**: Settings tuning, visual effects, optimization

---

**Version**: 1.0  
**Last Updated**: 2026-06-06  
**Status**: Ready for Development
