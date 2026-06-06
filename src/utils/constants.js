// src/utils/constants.js
// Game constants, enums, and configuration values

export const GAME_STATE = {
  MENU: 'menu',
  PLAYING: 'playing',
  PAUSED: 'paused',
  GAME_OVER: 'gameOver',
  WIN: 'win',
  LOADING: 'loading',
  SETTINGS: 'settings'
};

export const PLAYER_STATE = {
  IDLE: 'idle',
  WALK: 'walk',
  SPRINT: 'sprint',
  CROUCH: 'crouch',
  SLIDE: 'slide'
};

export const ENTITY_STATE = {
  IDLE: 'idle',
  PATROL: 'patrol',
  INVESTIGATE: 'investigate',
  HUNT: 'hunt',
  CHASE: 'chase',
  ATTACK: 'attack',
  LOST: 'lost'
};

export const DIFFICULTY = {
  EASY: 'easy',
  NORMAL: 'normal',
  HARD: 'hard'
};

export const AUDIO_LAYER = {
  AMBIENCE: 'ambience',
  ENTITY: 'entity',
  MUSIC: 'music',
  SFX: 'sfx',
  PLAYER: 'player',
  VOICE: 'voice'
};

// Movement constants (m/s)
export const MOVEMENT_SPEEDS = {
  WALK: 5.0,
  SPRINT: 9.0,
  CROUCH: 2.5,
  SLIDE: 8.0
};

// Stamina constants
export const STAMINA = {
  MAX: 100,
  DRAIN_SPRINT: 20,     // % per second
  DRAIN_CROUCH: 5,      // % per second
  DRAIN_SLIDE: 30,      // % per slide
  REGEN: 15,            // % per second
  SLIDE_COOLDOWN: 2.0   // seconds
};

// Camera constants
export const CAMERA = {
  DEFAULT_FOV: 90,
  MIN_FOV: 60,
  MAX_FOV: 110,
  NEAR_PLANE: 0.1,
  FAR_PLANE: 1000,
  HEAD_HEIGHT: 1.7      // Eye level (meters)
};

// Entity constants
export const ENTITY = {
  BASE_SPEED: 5.0,
  BASE_SIGHT_RANGE: 15,
  BASE_SIGHT_FOV: 90,   // degrees
  BASE_HEARING_RANGE: 12,
  PROXIMITY_RANGE: 3,
  MEMORY_DURATION: 40,  // seconds
  PATHFINDING_INTERVAL: 0.5 // seconds
};

// Level generation
export const LEVEL = {
  CHUNK_SIZE: 10,       // meters
  SPAWN_SAFETY_DISTANCE: 20,
  MIN_CHUNKS: 3,
  MAX_CHUNKS: 5,
  EXIT_DISTANCE_MULTIPLIER: 2.0
};

// UI constants
export const UI = {
  HUD_OPACITY: 0.8,
  MENU_FADE_TIME: 0.3,
  NOTIFICATION_DURATION: 3.0
};

// Audio constants (Hz)
export const AUDIO_FREQ = {
  FLUORESCENT_BUZZ: 60,
  ENTITY_IDLE_HUM: 50,
  ENTITY_HUNT_HUM: 120,
  ENTITY_CHASE_FREQ: 200
};

// Color palette (hex)
export const COLORS = {
  WALL_YELLOW: '#D4AF7A',
  STAIN_RUST: '#8B4513',
  DANGER_RED: '#8B0000',
  COLD_SHADOW: '#4A5A6A',
  SICK_GREEN: '#B0D090',
  HUD_GREEN: '#00FF00',
  HUD_YELLOW: '#FFFF00',
  HUD_RED: '#FF0000'
};

// Performance targets
export const PERFORMANCE = {
  TARGET_FPS: 60,
  TARGET_FRAME_TIME: 16.67,     // ms (1000/60)
  MAX_MEMORY_MB: 6000,
  MAX_LOAD_TIME: 10              // seconds
};

// Default settings
export const DEFAULT_SETTINGS = {
  gameplay: {
    difficulty: DIFFICULTY.NORMAL,
    objectiveMarkers: true,
    tutorialEnabled: true,
    damageIndicators: true,
    showStaminaBar: true,
    crosshairType: 'dot'
  },
  graphics: {
    resolution: '1440x900',
    fullscreen: false,
    renderScale: 1.0,
    fov: CAMERA.DEFAULT_FOV,
    motionBlur: true,
    cameraShake: 'medium',
    headBobIntensity: 'medium',
    vignetteIntensity: 'low',
    sprintFovEffect: true,
    volumetricFog: true,
    colorblindMode: 'none',
    highContrastMode: false
  },
  audio: {
    masterVolume: 100,
    musicVolume: 80,
    sfxVolume: 90,
    ambienceVolume: 85,
    entityAudioVolume: 95,
    voiceVolume: 85,
    subtitles: true,
    spatialAudio: true
  },
  accessibility: {
    reducedFlashing: false,
    photosensitivityMode: false,
    screenReaderSupport: false,
    uiScale: 1.0,
    fontSize: 'normal'
  },
  controls: {
    sensitivity: 1.0,
    invertY: false,
    controllerDeadzone: 0.1,
    keyBindings: {
      forward: 'W',
      backward: 'S',
      left: 'A',
      right: 'D',
      sprint: 'Shift',
      crouch: 'Control',
      slide: 'Space',
      interact: 'E',
      flashlight: 'F',
      pause: 'Escape',
      inventory: 'I'
    }
  }
};

// Procedural generation
export const ROOM_TYPES = {
  HALLWAY: 'hallway',
  STANDARD: 'standard',
  CORRIDOR_L: 'corridor_l',
  CORRIDOR_T: 'corridor_t',
  CORRIDOR_CROSS: 'corridor_cross',
  CORRIDOR_NARROW: 'corridor_narrow',
  BREAK_ROOM: 'break_room',
  OFFICE: 'office',
  STORAGE: 'storage',
  BATHROOM: 'bathroom',
  MAINTENANCE: 'maintenance',
  VENT: 'vent',
  STAIRWELL: 'stairwell',
  ELEVATOR: 'elevator',
  UNDERGROUND: 'underground'
};

// Difficulty modifiers
export const DIFFICULTY_MODIFIERS = {
  [DIFFICULTY.EASY]: {
    entitySpeedMultiplier: 0.8,
    sightRangeMultiplier: 0.65,
    hearingRangeMultiplier: 0.65,
    memoryDurationMultiplier: 0.5,
    aggressiveness: 0.3,
    chaseTimeout: 60
  },
  [DIFFICULTY.NORMAL]: {
    entitySpeedMultiplier: 1.0,
    sightRangeMultiplier: 1.0,
    hearingRangeMultiplier: 1.0,
    memoryDurationMultiplier: 1.0,
    aggressiveness: 0.5,
    chaseTimeout: 90
  },
  [DIFFICULTY.HARD]: {
    entitySpeedMultiplier: 1.3,
    sightRangeMultiplier: 1.33,
    hearingRangeMultiplier: 1.25,
    memoryDurationMultiplier: 1.5,
    aggressiveness: 0.9,
    chaseTimeout: 999 // Indefinite chase
  }
};

// Pacing phases (time in seconds)
export const PACING_PHASES = {
  EXPLORATION: { start: 0, end: 120 },      // 0-2 min
  ALERT: { start: 120, end: 300 },          // 2-5 min
  HUNT: { start: 300, end: 600 },           // 5-10 min
  ESCALATION: { start: 600, end: 900 }      // 10-15 min
};

// Event types for triggers
export const EVENT_TYPE = {
  ENTITY_SPAWN: 'entitySpawn',
  ENTITY_DETECT: 'entityDetect',
  ENTITY_CHASE: 'entityChase',
  ENTITY_CAPTURE: 'entityCapture',
  PLAYER_FOUND_KEY: 'playerFoundKey',
  PLAYER_FOUND_EXIT: 'playerFoundExit',
  PLAYER_REACHED_SAFE_ZONE: 'playerReachedSafeZone',
  ENVIRONMENTAL_EVENT: 'environmentalEvent',
  ANOMALY_TRIGGERED: 'anomalyTriggered'
};

// Logging
export const LOG_LEVEL = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
};

export const CURRENT_LOG_LEVEL = LOG_LEVEL.INFO;
