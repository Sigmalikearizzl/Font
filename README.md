# Liminal Asylum

An original FPS survival-horror game inspired by liminal space aesthetics. Explore a surreal, nightmarish maze of yellowed hallways and oppressive architecture while evading a terrifying animated entity. Survive as long as possible in an atmosphere of dread, tension, and unsettling isolation.

## Core Vision

**Liminal Asylum** is a first-person horror survival game featuring:
- **Atmosphere**: Eerie, unsettling liminal spaces—yellowed hallways, damp carpet, buzzing fluorescents, distorted architecture
- **Survival Loop**: Explore, manage resources, evade the entity, search for exits and safe zones
- **Movement**: Smooth, responsive, polished first-person controls with sprinting, crouching, and sliding
- **Entity**: A terrifying, intelligently-animated creature that hunts, chases, and stalks the player
- **Replayability**: Procedural/semi-procedural layout variation with dynamic escalating tension
- **Polish**: Production-ready audio, visuals, controls, and UX

## Gameplay Loop

1. **Wake Up**: Player spawns in an unknown liminal environment
2. **Explore**: Navigate hallways, rooms, and vents to understand the space
3. **Search**: Find keys, switches, exits, and safe zones
4. **Survive**: Evade the stalking entity through stealth, speed, and smart routing
5. **Escalate**: Tension increases over time; more frequent encounters, reduced safety
6. **Escape or Endure**: Reach an exit or survive as long as possible

## Key Features

### Movement System
- **WASD**: Directional movement with smooth acceleration/deceleration
- **Sprint**: High-speed dash with stamina cost, breathing audio, and camera intensity
- **Crouch**: Silent, slower movement for stealth
- **Slide**: Momentum-preserving evasive maneuver with cooldown
- **Weighty, Responsive**: Felt and satisfying without sluggishness
- **Polish**: Head bob, camera sway, smooth transitions

### Entity Design
- Deeply unsettling animated creature
- Intelligent AI: patrol, investigate, hunt, chase, attack
- Unnatural movement patterns and jerky animations
- Audio cues and visual warnings before appearances
- Chase state with unique animations and sound
- Fear through atmosphere and timing, not gore

### Level Design
- Yellowed, damp hallways with low ceilings
- Office-like rooms, maintenance corridors, storage spaces
- Broken liminal architecture and distorted space
- Procedural/semi-procedural layout with handcrafted set pieces
- Safe zones, hidden routes, vents, crawlspaces, shortcuts
- Environmental storytelling and subtle signage

### Audio
- Deep ambient hums and fluorescent buzz
- Distant footsteps, vent rattles, low-frequency rumbles
- Entity audio stingers and warning cues
- Breath audio during sprinting
- Footstep variation by surface
- Dynamic chase music with spatial audio

### Settings & Customization
- Mouse sensitivity and Y-axis inversion
- FOV, resolution, fullscreen/windowed
- Volume controls (master, music, SFX, ambience, voice)
- Accessibility: subtitles, motion blur, camera shake, head bob, vignette
- Toggle sprint FOV effects, flashlight flicker, reduced flashing
- Key remapping for all controls
- Graphics presets and color/contrast options
- Persistent save system

### UI/UX
- Minimal, immersive HUD
- Stamina bar and objective timer
- Entity proximity warning system
- Clean pause and settings menus
- Readable, modern design without clutter

## Technical Requirements

- **Performance**: Smooth, responsive gameplay at target FPS
- **Input**: Tight, reactive controls with no dead zones
- **Animation**: Clean transitions, no janky behavior
- **Code**: Modular, readable, well-documented structure
- **Audio**: High-quality spatial sound and mixing
- **Visuals**: Polished lighting, materials, and effects
- **Stability**: No crashes, save/load functionality
- **Accessibility**: Colorblind modes, subtitles, adjustable intensity

## Project Structure

```
Font/
├── README.md
├── GAME_DESIGN_DOCUMENT.md
├── .github/
│   └── workflows/
├── src/
│   ├── main/
│   │   ├── gameplay/
│   │   ├── entity/
│   │   ├── player/
│   │   ├── level/
│   │   ├── ui/
│   │   ├── audio/
│   │   └── settings/
│   ├── engine/
│   │   ├── rendering/
│   │   ├── physics/
│   │   ├── input/
│   │   └── utils/
│   └── tests/
├── assets/
│   ├── audio/
│   ├── visuals/
│   ├── models/
│   └── shaders/
├── docs/
├── build/
└── package.json (or equivalent)
```

## Development Phases

### Phase 1: Foundation
- [ ] Project setup and build pipeline
- [ ] Core player controller with WASD movement
- [ ] Sprint and crouch mechanics
- [ ] Camera and input handling
- [ ] Settings menu and save system

### Phase 2: Movement Polish
- [ ] Slide mechanic with momentum and cooldown
- [ ] Smooth acceleration/deceleration curves
- [ ] Head bob and camera sway
- [ ] Sprint animation and breathing audio
- [ ] Stamina system and UI

### Phase 3: Level Design
- [ ] Basic liminal hallway generation
- [ ] Safe zones and checkpoints
- [ ] Interactive doors, vents, crawlspaces
- [ ] Environmental details and storytelling
- [ ] Procedural layout variation

### Phase 4: Entity Implementation
- [ ] Entity model and rig
- [ ] Core behavior states (idle, patrol, search, chase, attack)
- [ ] Animation system and transitions
- [ ] AI pathfinding and awareness
- [ ] Audio cues and warnings

### Phase 5: Gameplay Systems
- [ ] Objectives and survival timer
- [ ] Entity encounter escalation
- [ ] Chase mechanics and win conditions
- [ ] Safe zone checkpoints
- [ ] Dynamic difficulty scaling

### Phase 6: Audio & Atmosphere
- [ ] Ambient soundscapes
- [ ] Entity audio stingers
- [ ] Breathing and footstep sounds
- [ ] Dynamic chase music
- [ ] Spatial audio implementation

### Phase 7: Visual Polish
- [ ] Lighting and shadows
- [ ] Material details and distortion effects
- [ ] Volumetric fog/haze
- [ ] Screen effects for stress/proximity
- [ ] First-person hand/weapon animations

### Phase 8: Optimization & QA
- [ ] Performance profiling and optimization
- [ ] Bug fixes and stability testing
- [ ] Audio mixing and balancing
- [ ] Settings tuning and defaults
- [ ] Final polish pass

## Contributing

This project is an original creation inspired by liminal space aesthetic without copying specific existing games, monsters, or assets.

## License

To be determined.

---

**Status**: Early Development | **Last Updated**: 2026-06-06
