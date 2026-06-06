// src/entity/ai-state-machine.js
// Entity AI with behavior states and awareness system

import * as THREE from 'three';
import { ENTITY_STATE } from '../utils/constants.js';

export class EntityAI {
  constructor(scene) {
    this.scene = scene;

    // Position and physics
    this.position = new THREE.Vector3(0, 1.5, -10);
    this.velocity = new THREE.Vector3(0, 0, 0);
    this.speed = 5.0; // m/s (base speed)

    // Behavior state
    this.state = ENTITY_STATE.PATROL;
    this.stateTimer = 0;
    this.lastKnownPlayerPos = null;
    this.memoryTimer = 0;
    this.maxMemoryDuration = 40; // seconds

    // Awareness parameters
    this.sightRange = 15;     // meters
    this.sightFOV = 90;       // degrees
    this.hearingRange = 12;   // meters
    this.proximityRange = 3;  // meters

    // Difficulty scaling
    this.difficulty = 'normal';
    this.applyDifficulty();

    // Aggression
    this.aggressiveness = 0.5;
    this.confidence = 0;

    // Animation state
    this.animationState = 'idle';
    this.animationMixer = null;

    // Audio
    this.audioEmitter = null;

    // Pathfinding
    this.targetPos = null;
    this.currentPath = [];
    this.pathfindingTimer = 0;
    this.pathfindingInterval = 0.5; // Update path every 0.5s

    this.createEntityMesh();
  }

  createEntityMesh() {
    // Placeholder entity mesh (to be replaced with proper model)
    const geometry = new THREE.ConeGeometry(0.5, 2, 8);
    const material = new THREE.MeshStandardMaterial({
      color: 0x333333,
      emissive: 0x111111,
      roughness: 0.8
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.copy(this.position);
    this.mesh.castShadow = true;
    this.scene.add(this.mesh);
  }

  applyDifficulty() {
    const difficultySettings = {
      easy: {
        speed: 4.0,
        sightRange: 10,
        hearingRange: 8,
        memoryDuration: 20,
        aggressiveness: 0.3
      },
      normal: {
        speed: 5.0,
        sightRange: 15,
        hearingRange: 12,
        memoryDuration: 40,
        aggressiveness: 0.5
      },
      hard: {
        speed: 6.5,
        sightRange: 20,
        hearingRange: 15,
        memoryDuration: 60,
        aggressiveness: 0.9
      }
    };

    const settings = difficultySettings[this.difficulty] || difficultySettings.normal;
    Object.assign(this, settings);
  }

  update(deltaTime, playerPos) {
    // Update awareness
    this.updateAwareness(deltaTime, playerPos);

    // Update state
    this.updateBehaviorState(deltaTime, playerPos);

    // Pathfind and move
    this.updatePathfinding(deltaTime);
    this.applyMovement(deltaTime);

    // Update animation
    this.updateAnimation(deltaTime);

    // Sync mesh with position
    this.mesh.position.copy(this.position);
  }

  updateAwareness(deltaTime, playerPos) {
    const distToPlayer = this.position.distanceTo(playerPos);
    const canSeePlayer = this.canSeePlayer(playerPos);
    const canHearPlayer = this.canHearPlayer(playerPos);
    const isPlayerNearby = distToPlayer < this.proximityRange;

    // Update memory
    if (canSeePlayer || canHearPlayer || isPlayerNearby) {
      this.lastKnownPlayerPos = playerPos.clone();
      this.memoryTimer = 0;
    } else if (this.lastKnownPlayerPos) {
      this.memoryTimer += deltaTime;
      if (this.memoryTimer > this.maxMemoryDuration) {
        this.lastKnownPlayerPos = null;
      }
    }

    // Update confidence based on awareness
    this.confidence = 0;
    if (canSeePlayer) this.confidence = 1.0;
    else if (this.lastKnownPlayerPos) this.confidence = 0.7;
    else if (canHearPlayer) this.confidence = 0.5;
  }

  canSeePlayer(playerPos) {
    const distToPlayer = this.position.distanceTo(playerPos);
    if (distToPlayer > this.sightRange) return false;

    // Check FOV
    const dirToPlayer = new THREE.Vector3()
      .subVectors(playerPos, this.position)
      .normalize();

    const entityForward = new THREE.Vector3(0, 0, 1)
      .applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI); // Adjust based on entity rotation

    const angle = Math.acos(Math.max(-1, Math.min(1, dirToPlayer.dot(entityForward))));
    return angle < (this.sightFOV / 2) * (Math.PI / 180);
  }

  canHearPlayer(playerPos) {
    const distToPlayer = this.position.distanceTo(playerPos);
    return distToPlayer < this.hearingRange;
  }

  updateBehaviorState(deltaTime, playerPos) {
    this.stateTimer += deltaTime;

    switch (this.state) {
      case ENTITY_STATE.IDLE:
        this.updateIdleState(deltaTime, playerPos);
        break;
      case ENTITY_STATE.PATROL:
        this.updatePatrolState(deltaTime, playerPos);
        break;
      case ENTITY_STATE.INVESTIGATE:
        this.updateInvestigateState(deltaTime, playerPos);
        break;
      case ENTITY_STATE.HUNT:
        this.updateHuntState(deltaTime, playerPos);
        break;
      case ENTITY_STATE.CHASE:
        this.updateChaseState(deltaTime, playerPos);
        break;
      case ENTITY_STATE.ATTACK:
        this.updateAttackState(deltaTime, playerPos);
        break;
      case ENTITY_STATE.LOST:
        this.updateLostState(deltaTime, playerPos);
        break;
    }
  }

  updateIdleState(deltaTime, playerPos) {
    if (this.lastKnownPlayerPos) {
      this.setState(ENTITY_STATE.INVESTIGATE);
    }
    this.targetPos = this.position.clone();
  }

  updatePatrolState(deltaTime, playerPos) {
    if (this.lastKnownPlayerPos) {
      this.setState(ENTITY_STATE.INVESTIGATE);
      return;
    }

    // Simple patrol: wander around
    if (!this.targetPos || this.position.distanceTo(this.targetPos) < 1) {
      const randomAngle = Math.random() * Math.PI * 2;
      const randomDist = 5 + Math.random() * 10;
      this.targetPos = this.position.clone()
        .add(new THREE.Vector3(
          Math.cos(randomAngle) * randomDist,
          0,
          Math.sin(randomAngle) * randomDist
        ));
    }
  }

  updateInvestigateState(deltaTime, playerPos) {
    if (this.canSeePlayer(playerPos)) {
      this.setState(ENTITY_STATE.HUNT);
      return;
    }

    if (!this.lastKnownPlayerPos) {
      this.setState(ENTITY_STATE.LOST);
      return;
    }

    this.targetPos = this.lastKnownPlayerPos.clone();
  }

  updateHuntState(deltaTime, playerPos) {
    const distToPlayer = this.position.distanceTo(playerPos);

    if (distToPlayer < 5 && this.canSeePlayer(playerPos)) {
      this.setState(ENTITY_STATE.CHASE);
      return;
    }

    if (!this.lastKnownPlayerPos && this.memoryTimer > 30) {
      this.setState(ENTITY_STATE.LOST);
      return;
    }

    this.targetPos = this.lastKnownPlayerPos ? this.lastKnownPlayerPos.clone() : playerPos.clone();
  }

  updateChaseState(deltaTime, playerPos) {
    const distToPlayer = this.position.distanceTo(playerPos);

    if (distToPlayer < 1) {
      this.setState(ENTITY_STATE.ATTACK);
      return;
    }

    if (distToPlayer > 20 && !this.canSeePlayer(playerPos)) {
      this.setState(ENTITY_STATE.HUNT);
      return;
    }

    this.targetPos = playerPos.clone();
    this.speed = this.speed * 1.3; // Boost speed during chase
  }

  updateAttackState(deltaTime, playerPos) {
    // Attack animation and trigger game over
    // Handled by game manager
    this.speed = 0;
  }

  updateLostState(deltaTime, playerPos) {
    if (this.stateTimer > 5) {
      this.setState(ENTITY_STATE.PATROL);
    }

    // Slow searching behavior
    this.speed = 2.0;
  }

  setState(newState) {
    if (this.state !== newState) {
      this.state = newState;
      this.stateTimer = 0;
      this.emitStateAudio(newState);
    }
  }

  updatePathfinding(deltaTime) {
    this.pathfindingTimer += deltaTime;

    if (this.pathfindingTimer > this.pathfindingInterval && this.targetPos) {
      // Simple pathfinding: move toward target
      this.currentPath = [this.targetPos.clone()];
      this.pathfindingTimer = 0;
    }
  }

  applyMovement(deltaTime) {
    if (!this.targetPos) return;

    const dirToTarget = new THREE.Vector3()
      .subVectors(this.targetPos, this.position)
      .normalize();

    this.velocity.copy(dirToTarget).multiplyScalar(this.speed);
    this.position.add(this.velocity.clone().multiplyScalar(deltaTime));
  }

  updateAnimation(deltaTime) {
    // Update animation state based on behavior
    if (this.state === ENTITY_STATE.CHASE) {
      this.animationState = 'chase';
    } else if (this.state === ENTITY_STATE.HUNT) {
      this.animationState = 'hunt';
    } else if (this.state === ENTITY_STATE.PATROL) {
      this.animationState = 'walk';
    } else if (this.state === ENTITY_STATE.IDLE) {
      this.animationState = 'idle';
    }

    // Subtle unnatural rotation/distortion for horror effect
    this.mesh.rotation.y += (Math.random() - 0.5) * 0.01;
  }

  emitStateAudio(newState) {
    // Trigger audio cues based on state change
    // Would be handled by AudioManager
  }

  reset() {
    this.position.set(0, 1.5, -10);
    this.velocity.set(0, 0, 0);
    this.state = ENTITY_STATE.PATROL;
    this.lastKnownPlayerPos = null;
    this.memoryTimer = 0;
    this.confidence = 0;
  }

  dispose() {
    this.scene.remove(this.mesh);
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
  }
}
