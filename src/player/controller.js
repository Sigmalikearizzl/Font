// src/player/controller.js
// Player movement, stamina, and input handling

import * as THREE from 'three';
import { PLAYER_STATE } from '../utils/constants.js';

export class PlayerController {
  constructor(camera, settings) {
    this.camera = camera;
    this.settings = settings;

    // Physics
    this.position = camera.position.clone();
    this.velocity = new THREE.Vector3(0, 0, 0);
    this.isGrounded = true;

    // Movement state
    this.state = PLAYER_STATE.IDLE;
    this.moveInput = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      sprint: false,
      crouch: false,
      slide: false
    };

    // Stamina system
    this.stamina = 100;
    this.maxStamina = 100;
    this.staminaDrain = {
      sprint: 20,      // % per second
      crouch: 5,       // % per second
      slide: 30        // % per slide
    };
    this.staminaRegen = 15; // % per second

    // Movement parameters
    this.speeds = {
      walk: 5.0,       // m/s
      sprint: 9.0,     // m/s
      crouch: 2.5,     // m/s
      slide: 8.0       // m/s (initial momentum)
    };
    this.acceleration = 0.3;
    this.deceleration = 0.2;
    this.currentSpeed = 0;

    // Slide mechanics
    this.canSlide = true;
    this.slideTimer = 0;
    this.slideCooldown = 2.0; // seconds
    this.slideDuration = 0.7;

    // Camera control
    this.euler = new THREE.Euler(0, 0, 0, 'YXZ');
    this.mouseX = 0;
    this.mouseY = 0;
    this.sensitivity = settings.controls.sensitivity || 1.0;
    this.invertY = settings.controls.invertY || false;

    // Head bob
    this.headBobTimer = 0;
    this.headBobAmount = 0;
    this.headBobIntensity = settings.graphics.headBobIntensity || 'medium';

    // Animation
    this.armAnimationState = 'idle';
    this.isSprintingVisuallyIntense = false;

    this.setupInput();
  }

  setupInput() {
    // Keyboard input
    document.addEventListener('keydown', (e) => this.onKeyDown(e));
    document.addEventListener('keyup', (e) => this.onKeyUp(e));

    // Mouse input
    document.addEventListener('mousemove', (e) => this.onMouseMove(e));

    // Lock/unlock pointer
    document.addEventListener('click', () => {
      document.body.requestPointerLock =
        document.body.requestPointerLock || document.body.mozRequestPointerLock;
      document.body.requestPointerLock();
    });
  }

  onKeyDown(event) {
    const key = event.key.toUpperCase();
    const keyBindings = this.settings.controls.keyBindings;

    if (key === keyBindings.forward.toUpperCase()) this.moveInput.forward = true;
    if (key === keyBindings.backward.toUpperCase()) this.moveInput.backward = true;
    if (key === keyBindings.left.toUpperCase()) this.moveInput.left = true;
    if (key === keyBindings.right.toUpperCase()) this.moveInput.right = true;
    if (key === keyBindings.sprint.toUpperCase()) this.moveInput.sprint = true;
    if (key === keyBindings.crouch.toUpperCase()) this.moveInput.crouch = true;
    if (key === keyBindings.slide.toUpperCase()) this.moveInput.slide = true;
  }

  onKeyUp(event) {
    const key = event.key.toUpperCase();
    const keyBindings = this.settings.controls.keyBindings;

    if (key === keyBindings.forward.toUpperCase()) this.moveInput.forward = false;
    if (key === keyBindings.backward.toUpperCase()) this.moveInput.backward = false;
    if (key === keyBindings.left.toUpperCase()) this.moveInput.left = false;
    if (key === keyBindings.right.toUpperCase()) this.moveInput.right = false;
    if (key === keyBindings.sprint.toUpperCase()) this.moveInput.sprint = false;
    if (key === keyBindings.crouch.toUpperCase()) this.moveInput.crouch = false;
    if (key === keyBindings.slide.toUpperCase()) this.moveInput.slide = false;
  }

  onMouseMove(event) {
    if (document.pointerLockElement === document.body) {
      const movementX = event.movementX * this.sensitivity * 0.01;
      const movementY = event.movementY * this.sensitivity * 0.01;

      this.mouseX -= movementX;
      this.mouseY -= movementY;

      // Clamp vertical rotation
      const maxVertical = Math.PI / 2;
      this.mouseY = Math.max(-maxVertical, Math.min(maxVertical, this.mouseY));
    }
  }

  update(deltaTime) {
    // Update movement state machine
    this.updateMovementState(deltaTime);

    // Apply movement
    this.applyMovement(deltaTime);

    // Update camera rotation
    this.updateCameraRotation();

    // Update head bob
    this.updateHeadBob(deltaTime);

    // Update animation state
    this.updateAnimationState();

    // Sync camera with position
    this.camera.position.copy(this.position);
  }

  updateMovementState(deltaTime) {
    const hasHorizontalInput =
      this.moveInput.forward || this.moveInput.backward ||
      this.moveInput.left || this.moveInput.right;

    // State transitions
    if (this.moveInput.slide && this.canSlide && this.state === PLAYER_STATE.SPRINT) {
      this.state = PLAYER_STATE.SLIDE;
      this.stamina -= this.staminaDrain.slide;
      this.slideTimer = this.slideDuration;
      this.canSlide = false;
      this.playSlideAudio();
    } else if (this.moveInput.crouch && this.state !== PLAYER_STATE.SLIDE) {
      this.state = PLAYER_STATE.CROUCH;
      this.stamina -= this.staminaDrain.crouch * deltaTime;
    } else if (
      this.moveInput.sprint &&
      this.stamina > 0 &&
      hasHorizontalInput &&
      this.state !== PLAYER_STATE.CROUCH
    ) {
      this.state = PLAYER_STATE.SPRINT;
      this.stamina -= this.staminaDrain.sprint * deltaTime;
      this.isSprintingVisuallyIntense = true;
    } else if (hasHorizontalInput) {
      this.state = PLAYER_STATE.WALK;
      this.stamina += this.staminaRegen * deltaTime;
      this.isSprintingVisuallyIntense = false;
    } else {
      this.state = PLAYER_STATE.IDLE;
      this.stamina += this.staminaRegen * deltaTime;
      this.isSprintingVisuallyIntense = false;
    }

    // Update slide timer
    if (this.state === PLAYER_STATE.SLIDE) {
      this.slideTimer -= deltaTime;
      if (this.slideTimer <= 0) {
        this.state = this.moveInput.sprint ? PLAYER_STATE.SPRINT : PLAYER_STATE.WALK;
      }
    }

    // Update slide cooldown
    if (!this.canSlide) {
      this.slideTimer -= deltaTime;
      if (this.slideTimer <= -this.slideCooldown) {
        this.canSlide = true;
      }
    }

    // Clamp stamina
    this.stamina = Math.max(0, Math.min(this.maxStamina, this.stamina));
  }

  applyMovement(deltaTime) {
    // Get directional input
    const moveDirection = new THREE.Vector3(0, 0, 0);

    if (this.moveInput.forward) moveDirection.z -= 1;
    if (this.moveInput.backward) moveDirection.z += 1;
    if (this.moveInput.left) moveDirection.x -= 1;
    if (this.moveInput.right) moveDirection.x += 1;

    moveDirection.normalize();

    // Get target speed based on state
    const targetSpeed = this.getStateSpeed();

    // Smooth acceleration/deceleration
    const accelerationFactor = moveDirection.length() > 0 ? this.acceleration : this.deceleration;
    this.currentSpeed = THREE.MathUtils.lerp(
      this.currentSpeed,
      targetSpeed * moveDirection.length(),
      accelerationFactor
    );

    // Calculate velocity in camera space
    const cameraRight = new THREE.Vector3();
    const cameraForward = new THREE.Vector3();

    this.camera.getWorldDirection(cameraForward);
    cameraForward.y = 0;
    cameraForward.normalize();

    cameraRight.crossVectors(new THREE.Vector3(0, 1, 0), cameraForward).normalize();

    this.velocity = cameraRight.multiplyScalar(moveDirection.x * this.currentSpeed)
      .add(cameraForward.clone().multiplyScalar(moveDirection.z * this.currentSpeed));

    // Apply movement
    this.position.add(this.velocity.clone().multiplyScalar(deltaTime));
  }

  getStateSpeed() {
    switch (this.state) {
      case PLAYER_STATE.SPRINT:
        return this.speeds.sprint;
      case PLAYER_STATE.CROUCH:
        return this.speeds.crouch;
      case PLAYER_STATE.SLIDE:
        return this.speeds.slide;
      case PLAYER_STATE.WALK:
        return this.speeds.walk;
      default:
        return 0;
    }
  }

  updateCameraRotation() {
    this.euler.setFromQuaternion(this.camera.quaternion);
    this.euler.order = 'YXZ';
    this.euler.y -= this.mouseX;
    this.euler.x -= this.mouseY * (this.invertY ? -1 : 1);

    this.camera.quaternion.setFromEuler(this.euler);
  }

  updateHeadBob(deltaTime) {
    if (this.state === PLAYER_STATE.IDLE || this.headBobIntensity === 'off') {
      return;
    }

    const bobSpeed = this.state === PLAYER_STATE.SPRINT ? 1.2 : 0.8;
    this.headBobTimer += deltaTime * bobSpeed;

    const maxBob = this.headBobIntensity === 'high' ? 0.3 : 
                   this.headBobIntensity === 'medium' ? 0.15 : 0.08;

    const bobAmount = Math.sin(this.headBobTimer * Math.PI * 2) * maxBob;
    this.position.y = 1.7 + bobAmount;
  }

  updateAnimationState() {
    // Update arm animation state based on player state
    // This would sync with first-person hand animations
    if (this.state === PLAYER_STATE.SPRINT) {
      this.armAnimationState = 'sprint';
    } else if (this.state === PLAYER_STATE.CROUCH) {
      this.armAnimationState = 'crouch';
    } else if (this.state === PLAYER_STATE.SLIDE) {
      this.armAnimationState = 'slide';
    } else if (this.state === PLAYER_STATE.WALK) {
      this.armAnimationState = 'walk';
    } else {
      this.armAnimationState = 'idle';
    }
  }

  playSlideAudio() {
    // Trigger slide sound effect
    // This would be handled by AudioManager
  }

  reset() {
    this.stamina = this.maxStamina;
    this.state = PLAYER_STATE.IDLE;
    this.currentSpeed = 0;
    this.canSlide = true;
    this.slideTimer = 0;
  }
}
