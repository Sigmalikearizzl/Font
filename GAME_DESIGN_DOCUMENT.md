# LIMINAL ASYLUM – Game Design Document

**Version**: 1.0  
**Date**: 2026-06-06  
**Status**: Pre-Production

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Core Vision](#core-vision)
3. [Gameplay](#gameplay)
4. [Player Movement System](#player-movement-system)
5. [Entity Design](#entity-design)
6. [Level & Environment Design](#level--environment-design)
7. [Audio Direction](#audio-direction)
8. [Visual Style](#visual-style)
9. [UI/UX Design](#uiux-design)
10. [Settings & Customization](#settings--customization)
11. [Difficulty & Pacing](#difficulty--pacing)
12. [Technical Architecture](#technical-architecture)
13. [Production Timeline](#production-timeline)

---

## Executive Summary

**Liminal Asylum** is an original FPS survival-horror game that traps the player in a surreal, nightmarish maze of liminal spaces. The player must explore, survive, and evade an intelligent, terrifying animated entity while searching for exits and safe zones. The game emphasizes:

- **Polished, responsive movement** (sprint, crouch, slide)
- **Atmospheric horror** through sound, visuals, and pacing
- **Intelligent entity AI** with realistic but horrifying behavior
- **Replayable survival loops** with procedural variation
- **Production-quality polish** across all systems

---

## Core Vision

### Aesthetic Inspiration
The game draws inspiration from the "Backrooms" meme aesthetic without directly recreating any specific existing level, monster, or layout. The visual and thematic foundation is:
- Yellowed, damp, repetitive hallways
- Industrial-office hybrid environments
- Low ceilings and oppressive architecture
- Flickering fluorescent lighting
- Subtle environmental anomalies and distortions
- A sense of infinite, inescapable space

### Emotional Tone
- **Unsettling** over gory
- **Tense** and oppressive
- **Eerie** through repetition and subtle wrongness
- **Fear-based** on atmosphere and anticipation, not jump scares alone
- **Lonely** and isolating

### Intended Experience
Players should feel:
1. Initially confused and disoriented
2. Increasingly aware of a presence
3. Hunted and under constant pressure
4. Adrenaline-fueled during chases
5. Momentary relief in safe zones
6. Compelled to replay and improve

---

## Gameplay

### Core Loop

```
Spawn → Explore → Search → Evade → Escalate → Survive/Escape → End
```

1. **Spawn**: Player wakes in a random liminal hallway with minimal context
2. **Explore**: Navigate unfamiliar corridors, understand layout, find resources
3. **Search**: Look for keys, switches, exits, safe rooms, alternate routes
4. **Evade**: Entity appears and begins hunting; player uses movement and knowledge to escape
5. **Escalate**: Tension increases; entity becomes more aggressive, safety decreases
6. **Survive/Escape**: Either reach an exit (win condition) or survive X minutes (secondary goal)
7. **End**: Game over, results screen, restart option

### Primary Objectives
- **Survive as long as possible** (timer-based score)
- **Avoid the entity** through movement, stealth, and smart routing
- **Find and reach exits** (primary win condition)
- **Discover safe zones** and establish checkpoints
- **Unlock dynamic events** that increase difficulty/reward

### Secondary Objectives
- Collect hidden items or log entries for lore
- Reach survival milestones (5 min, 10 min, 15 min alive)
- Complete optional challenges (escape without using sprints, etc.)

### Win/Lose Conditions

**Win**: Reach an exit, escape the entity, leave the space
**Lose**: Entity catches the player (game over)
**Secondary**: Survive X minutes despite being caught or continue indefinitely in survival mode

---

## Player Movement System

Movement is a core pillar of **Liminal Asylum**. It must feel:
- Precise and responsive
- Weighty but not sluggish
- Modern and polished
- Satisfying to master
- Intentional and high-skill ceiling

### Base Movement (WASD)

**Mechanics**:
- Forward/backward/strafe input
- Smooth acceleration (not instant)
- Smooth deceleration (not instant stop)
- No air control (grounded, realistic)
- Footstep sounds vary by surface

**Feel**:
- Base speed: ~5–6 m/s (brisk walking)
- Acceleration ramp: 0.3s to reach max speed
- Deceleration ramp: 0.2s to full stop
- No floating sensation; feet stay grounded

**Animation**:
- Idle stance (slight body sway, breathing)
- Walk cycle that matches speed
- Smooth blending between animations

### Sprinting

**Mechanics**:
- Hold SHIFT to sprint (configurable)
- Speed boost: 1.5–1.8x base speed (~8–10 m/s)
- Stamina drain: -20% per second while sprinting
- Stamina regeneration: +15% per second while walking/still
- Cannot sprint with empty stamina
- Stamina fully regenerates in ~7–10 seconds from empty

**Feel**:
- Camera slightly rises (head-bob forward motion)
- Breathing audio intensifies (controllable intensity in settings)
- Field of view can subtly increase (optional, toggle in settings)
- Arms pump faster in animation
- Footstep cadence accelerates
- Screen edges may slightly blur (toggle "motion blur" or "sprint tunnel vision")

**Stamina UI**:
- Subtle bar at the bottom of screen or in corner
- Green → Yellow → Red as stamina depletes
- Warning tone when stamina is low
- Smooth drain and regen animations

### Crouching

**Mechanics**:
- Hold CTRL to crouch (configurable)
- Speed reduction: 0.5x base speed (~2.5–3 m/s)
- Silent footsteps (no sound generation while crouching)
- Lower sight-line (cameras lowers ~1m)
- Cannot sprint while crouching
- Stamina drain: -5% per second (very low cost)

**Feel**:
- Smooth camera lower with no jarring transition
- Body hunches forward in animation
- Breathing becomes quieter in audio
- Heightened tension while hiding
- Quick exit if entity appears (faster to stand than to sprint from crouch)

### Sliding

**Mechanics**:
- Press SPACE while sprinting to slide (configurable)
- Preserves sprint speed for 0.5–0.8s
- Momentum carries forward while sliding
- Can change direction slightly mid-slide (~20° turn)
- Stamina cost: -30% per slide
- Cooldown: 1.5–2s before slide can be triggered again
- Cannot slide while moving backward

**Feel**:
- Camera dips 0.5m during slide
- Body shifts forward and low
- Arms brace for impact (first-person visible)
- Surfaces make appropriate skid sounds
- Smooth momentum transition back to normal movement post-slide
- Highly satisfying and skill-expressive

**Use Cases**:
- Evade around corners during chases
- Slip through narrow spaces
- Maintain speed while turning sharply
- Dodge incoming threats

### Jumping

**Decision**: Jumping is **optional** and context-specific:
- If included: low jump height (~0.5m), used for small obstacles or ledges
- If excluded: emphasize sliding and alternative navigation paths
- **Recommendation**: Exclude jump for grounded, survival-focused feel; use slide instead

### Head Bob & Camera Sway

**Mechanics**:
- Subtle bob with every footstep (toggleable)
- Amplitude: ~0.1–0.2m vertical, ~0.05m horizontal
- Synchronized with footstep audio
- Intensity decreases while crouching
- Disabled while sliding or still
- Full toggle in settings

**Sway**:
- Slight side-to-side camera tilt while moving (toggleable)
- Amplitude: ~0.5–1° max tilt
- Creates organic, lived-in feel
- Can intensify during sprinting

### First-Person Animations

**Visible Elements** (from player's perspective):
- Arms and torso (never full body)
- Hands
- Flashlight or held item (if included)
- Breath visibility during sprint (subtle, camera fog)

**Animation Sets**:
- Idle: subtle breathing, arm resting
- Walk: natural arm swing
- Sprint: pumping arms, leaning forward
- Crouch: arms ready, tense posture
- Slide: arms brace, body low
- Interact: reaching/opening action
- Take damage: flinch or stumble

---

## Entity Design

The entity is the core threat. It must be:
- Visually horrifying without gore
- Intelligently animated
- Behaviorally threatening
- Aurally distinctive and dread-inducing
- Memorable and original

### Visual Design

**Silhouette**:
- Humanoid but deeply wrong
- Slightly too tall or short (uncanny valley)
- Limbs that move with unnatural angles
- Head position that feels off
- Posture that shifts between poses

**Materials & Details**:
- Possibly translucent or distorted in places
- Rough, undefined texture (not fully realistic)
- Eyes (if visible) that track and focus
- Movement distortion (slight blur, chromatic aberration around edges)
- Lighting interacts strangely (doesn't reflect light normally)

**Animation Qualities**:
- Jerky micro-pauses between movements
- Sudden bursts of speed contrasted with stillness
- Head rotations that aren't smooth
- Limb movements that aren't perfectly synchronized
- Breathing or pulsing that suggests life but wrongness

### Behavioral States

#### Idle
- Stands still or slowly sways
- Occasional head movements (searching, listening)
- Breathing or subtle pulsing
- Audio: soft hums, distant clicks

#### Patrol
- Walks hallways on predictable routes
- Pauses at intersections
- Turns smoothly but with unnatural grace
- Audio: measured footsteps, slight electrical hum

#### Investigate
- Moves toward sounds or disturbances
- Head tilts and rotates to listen
- Speed increases if interest is high
- Emits low-frequency scan sounds
- May pause and listen intently

#### Hunt
- Actively searches for player
- Faster movement (not full sprint)
- Head movements more frequent
- Audio: louder electrical hum, scanning pulses
- Periodically emits locating calls

#### Chase
- Full sprint after player
- Disregards obstacles partially
- Makes loud, rapid movements
- Audio: intense electrical noise, rhythmic hunting call
- Animation: jerky, erratic movements with sudden direction changes
- Becomes more aggressive; may attempt to cut off escape

#### Attack
- Attempts to grab or strike
- Quick lunge with extended reach
- Audio: piercing shriek or warning
- Visual: distortion effect around entity, possible screen flash
- If contact made: game over, brief stagger animation, fade to black

#### Lost/Return-to-Patrol
- Slows down and searches less aggressively
- Returns to patrol route if player escapes for 30+ seconds
- Audio: quieter, confused-sounding pulses
- Slower movement, more cautious

### Audio Cues

**Pre-Appearance** (dread-building):
- Very low-frequency hum (subsonic, felt more than heard)
- Distant electrical crackling
- Faint clicking sounds
- Flickering lights intensify

**Encounter**:
- Sharp, piercing alarm (not ear-damaging, but startling)
- Rhythmic pulse matching entity's heartbeat
- Layered hums at varying frequencies

**Chase**:
- Aggressive shrieking
- Rapid electrical sounds
- Loud footstep-like impacts
- Player's own breathing intensifies (controllable volume)

**Loss** (caught):
- Sudden silence followed by horrifying sound
- Brief distortion
- Fade to black

### AI Pathfinding & Awareness

**Senses**:
- **Sight**: Detects player movement in line of sight (60–90° FOV, 15m range, improved in direct view)
- **Sound**: Reacts to footsteps, doors, loud actions (hearing radius: 10–15m, better in quiet)
- **Proximity**: Unknown sense (vague "presence") within 3m
- **Memory**: Remembers last known position for 30–60 seconds

**Decision-Making**:
- Chooses between patrol, search, and chase based on confidence
- Cuts off exits if it predicts player movement
- Hunts more aggressively in narrow corridors
- May split focus if multiple stimuli present (coded as random choice)

**Difficulty Scaling**:
- Easy: Slower, worse hearing, longer memory fade, larger opening
- Normal: Balanced threat, medium speed, good hearing
- Hard: Faster, superhuman hearing, longer memory, aggressive cutting

---

## Level & Environment Design

### Visual Aesthetics

**Core Environment**:
- Yellowed/cream-colored walls (subtle stains, water marks)
- Damp carpet, frayed in places, worn patterns
- Low ceilings (7–8 feet), creating oppressive feeling
- Fluorescent panels (many flickering or dim)
- Exposed pipes, ductwork, electrical conduits
- Office doors with frosted glass (obscured interior)
- Occasional signage (illegible or cryptic)

**Architecture**:
- Repetitive hallways with subtle layout variations
- Sudden dead-ends and forced backtracks
- Impossible angles hinting at distorted space
- Rare, strange rooms (upside-down stairs, tilted floor, extra-long hallways)
- Vents and crawlspaces as alternate routes
- Maintenance areas with different aesthetic

**Lighting**:
- Dominant: flickering fluorescent overhead lights (60Hz buzz, occasional strobe)
- Emergency: dim red/orange backup lighting in some areas
- Darkness: completely dark rooms requiring flashlight or navigation by memory
- Distortion: areas where lighting behaves strangely (moving shadows, untraced light sources)

**Ambient Effects**:
- Volumetric haze/fog (slight dust in air, no fog machine effect)
- Subtle screen distortion in anomalous zones (chromatic aberration, warping)
- Water dripping sounds and echoes
- Temperature perceived changes (cold air currents from vents)

### Layout Design

#### Generation Strategy
**Semi-Procedural**:
- Hand-crafted "chunks" (hallway segments, room types, special set pieces)
- Procedural assembly of chunks into unique layouts each playthrough
- Fixed spawn and exit locations, variable middle section
- Ensures both familiarity and surprise

#### Navigation Features

**Landmarks**:
- Unique room with specific color or shape
- Unusual door or fixture
- Audio signature (vent noise from specific location)
- Visual graffiti or markings (player-recognizable)

**Signage**:
- Faded floor numbers or corridor labels
- Cryptic symbols or warnings (aesthetic, not literal)
- Emergency exit signs (may or may not lead anywhere)
- Directional arrows (sometimes misleading)

**Safe Zones**:
- Small, enclosed rooms with single entrance
- Locked doors (require found key)
- Equipped with supplies (battery, water, notes)
- Entity generally avoids if door is locked
- Not fully safe if entity breaks down door (possible late-game event)

#### Room Types

**Hallway Variations**:
- Standard corridor (8–15m long)
- L-turn corridor
- T-junction
- Cross-junction
- Narrowed section (forces crouch/slide)

**Unique Rooms**:
- Break room (tables, chairs, vending machine)
- Office cubicles
- Storage/filing area
- Maintenance closet
- Bathroom or shower area
- Stairwell (down-only or up-only, visually distorted)
- Elevator vestibule (non-functional, trapped feel)

**Transition Areas**:
- Vents (crawl-only, audio isolation)
- Crawlspaces (claustrophobic, squeeze animations)
- Ventilation shafts (can fall or climb)
- Underground passages (muddy, wet)

#### Procedural Rules

1. **Spawn Zone**: Player always spawns in a medium-length hallway (safety buffer)
2. **Middle Randomization**: 3–4 random chunks connect between spawn and exit
3. **Exit Zone**: Distinct area (e.g., secured door, shaft) with clear win condition
4. **Density**: ~40–60% hallways, ~30–40% rooms, ~10–15% special areas
5. **No Retracing**: Layout guarantees non-repetitive chunks (except intentional dead-ends)

### Exploration Mechanics

**Doors**:
- Some locked (require key found elsewhere)
- Some sealed (impassable)
- Some partially open (can be pried wider if code allows)
- Interact to open (smooth animation)
- Can slam shut from entity force (locking player out of safety)

**Keys & Switches**:
- Found scattered in rooms
- Switches unlock shortcuts or new areas
- Visual feedback when used (lights change, doors click open)

**Shortcuts**:
- Vent passages connecting distant hallways
- Crawlspaces with lower danger but tight confines
- Alternate routes that save time but risk exposure

---

## Audio Direction

Audio is critical for horror and atmosphere. Must be immersive, spatial, and dread-inducing.

### Ambient Soundscape

**Baseline Ambience** (always present, subtle):
- Deep, low-frequency hum (~40–60 Hz, felt as much as heard)
- Distant electrical buzz
- HVAC rumble and airflow
- Occasional creaks and groans (settling structure)
- Water dripping (distant, irregular intervals)

**Variation by Location**:
- Maintenance areas: louder hum, metallic ringing
- Office areas: fluorescent buzz, paper rustling
- Vents/crawlspaces: air rushing, vibrations
- Dead ends: echo chamber effect

### Fluorescent Lighting Audio

- **Normal**: 60 Hz buzzing hum (subtle)
- **Flickering**: Intermittent click/buzz as ballast struggles
- **Failing**: Louder buzzing, higher pitch, then sudden silence (ominous)
- **Dead**: Just darkness and ambient

### Entity Audio

**Presence Audio** (before sight):
- Distant low-frequency pulses (scanning)
- Electrical crackling or clicking
- Breathing sounds (not human)
- Subsonic vibration (felt in chest)

**Hunting Audio**:
- Rhythmic pulses (entity's "heartbeat" or signal)
- Escalating intensity as distance decreases
- Directional: player should sense direction of entity

**Chase Audio**:
- Piercing, multi-layered shriek (alarming but not painful)
- Aggressive electrical discharge sounds
- Rapid impacts (footsteps or movement)
- All sounds intensify as entity gets closer

**Capture Audio** (brief):
- Final shriek or command tone
- Sudden silence or distortion
- Brief visual/audio effect
- Fade to black

### Player Audio

**Movement Sounds**:
- Footsteps vary by surface (carpet, tile, metal grating)
- Crouching is quieter (silence while still)
- Sprinting is louder and faster cadence
- Sliding creates scraping/rushing sound
- Breathing audible when sprinting (settable volume)

**Interaction Audio**:
- Door opening (hinge creak, mechanism sound)
- Key insertion (metallic click)
- Switch activation (electrical engagement)
- Vent grating removal (metallic scrape)

### Music & Tension Escalation

**Structure**:
- Early game: minimal music, mostly ambient
- Detection: tension stinger (2–3 second audio spike)
- Hunt: sustained, building music layer
- Chase: aggressive, fast-paced music, full orchestra
- Safe zone: music drops or becomes calming

**Music Characteristics**:
- Minor key, dissonant harmonies
- Layered synths and strings
- Pulse that syncs with entity detection (tempo = threat level)
- Swells during near-miss encounters
- Silence punctuates horror (dynamic range crucial)

### Spatial Audio & 3D Positioning

- Entity sounds come from direction of entity (player senses location)
- Reverb/echo indicates room size
- Distance audio cues (loudness, clarity)
- Mono/stereo positioning for 3D immersion

### Accessibility

- All critical audio cues have visual indicators (subtitle, icon, screen flash)
- Adjustable volume for each channel (music, SFX, ambience, entity audio, player)
- Visual audio feedback for deaf players

---

## Visual Style

### Overall Aesthetic

**Rendering Target**:
- Clean, realistic or stylized-realistic
- High-contrast lighting and shadow
- Sharp material detail
- Atmospheric but not over-stylized

**Color Palette**:
- Dominant: Yellowed cream/beige (#D4AF7A–#F5DEB3)
- Accent: Rust orange/brown stains (#8B4513, #A0522D)
- Danger: Deep reds in rare anomaly areas (#8B0000)
- Cold: Blue-gray shadows (#4A5A6A)
- Sick green: Fluorescent reflection (#B0D090)

**Lighting**:
- Bright fluorescent wash (7000K color temp, harsh shadows)
- Occasional warm emergency lighting
- Cold shadows under fixtures
- Flickering creates subtle strobing effect
- No bloom or over-brightness; grounded lighting

### Materials & Texture

**Walls**:
- Drywall with semi-gloss finish
- Water stains and marks visible
- Slight mold/mildew in corners
- Paint imperfections and aging
- Normal maps for depth without bump

**Carpet**:
- Worn pile fabric
- Visible wear patterns in high-traffic areas
- Dust and debris on surface
- Fraying at seams
- Moisture darkening in spots

**Metal**:
- Brushed aluminum fixtures
- Oxidized or rusty pipes
- Smooth steel grating
- Scratches and wear marks

**Lighting Fixtures**:
- Frosted plastic diffusers
- Metal clips and mounts
- Internal ballast and wiring visible
- Dust accumulation inside

### Entity Visuals

**Design Principles**:
- Avoid realistic human shape (uncanny valley danger)
- Silhouette is distinctive and disturbing
- Movement quality is more frightening than appearance
- Slight distortion or shimmer effect around edges
- Animation is jerky with sudden fluidity

**Visual Effects During Encounter**:
- Screen chromatic aberration as entity approaches
- Lighting distortion (shadows move unnaturally)
- Slight vignette or tunnel effect during chase
- Screen bloom/distortion on capture

### First-Person Perspective

**Hands & Arms**:
- Visible in lower portion of screen
- Match player body (skin tone, sleeve)
- Animate naturally during movement
- Show fatigue during sprinting
- Include gloves or equipment if thematic

**Weapon/Flashlight**:
- If flashlight included: mounted on arm or held
- Beam has realistic cone and attenuation
- Battery indicator shows depletion
- Turns off if empty (risk/reward)
- Animation shows holding/aiming

### Screen Effects & Distortion

**Subtle Ambient Distortion** (always on, subtle):
- Slight chromatic aberration at edges
- Minimal vignette (10–15% darkness at corners)
- Can be toggled off in accessibility settings

**Proximity Stress Effects** (increase as entity nears):
- Stronger vignette
- Screen pulse (sync'd with entity audio)
- Brief visual glitches or lines
- Can reduce intensity or disable in settings

**Chase Intensification**:
- Motion blur (toggle in settings)
- Screen shake/camera bounce (mild)
- Red tint or desaturation
- Breathing fog on camera (rare, controlled)

**Damage/Capture Effect**:
- Red flash
- Chromatic aberration spike
- Screen distortion or warping
- Audio distortion

### Accessibility Visuals

- High-contrast mode (boost colors, darken shadows)
- Colorblind-friendly palette (red/green confusion avoided)
- Adjustable UI scaling
- Clear, readable fonts
- Toggle reduced flashing/strobing

---

## UI/UX Design

### HUD (Heads-Up Display)

**Minimal Default HUD**:
Keep the screen uncluttered. Only essential info visible:

1. **Stamina Bar** (bottom-center, 3–5% of screen width)
   - Horizontal bar, 20–30px tall
   - Color: Green (full) → Yellow (50%) → Red (0%)
   - Smooth animation during drain/regen
   - Semi-transparent background
   - Text label optional (toggle in settings)

2. **Objective/Survival Timer** (top-center or top-right, small)
   - MM:SS format
   - Current objective (e.g., "FIND EXIT" or "SURVIVE")
   - Color changes with intensity
   - Pulse or glow as danger escalates

3. **Entity Proximity Warning** (subtle, dynamic)
   - Audio-primary, optional visual indicator
   - Icon or pulsing dot if entity nearby
   - Appears when entity is hunting (within 20m)
   - Disappears when threat has passed
   - Can be toggled in settings

4. **Crosshair/Interaction Indicator** (screen center, minimal)
   - Simple dot or reticle (not over-designed)
   - Changes if hoverable object nearby (door, key, etc.)
   - "Press E to Open Door" prompt appears when looking at door
   - Auto-hides during non-interactive moments

5. **Item/Inventory Indicator** (if items exist)
   - Slot for key, battery, or equipment
   - Small icon grid or list on side
   - Only shows if player has items

**Optional Advanced HUD**:
- Waypoint markers (can be hidden)
- Sound direction indicator (optional)
- Entity distance meter (advanced diagnostics)
- Health/damage indicator (if applicable)

### Pause Menu

**Design**:
- Semi-transparent dark overlay with text
- Vertical menu with large, readable options
- 40–50px tall buttons, generous spacing

**Options**:
1. Resume Game
2. Settings
3. Save/Load
4. Restart Level
5. Exit to Main Menu
6. Quit to Desktop

**Feel**:
- Simple, functional design
- No animations necessary (speed is priority)
- Responsive to input
- Can toggle with ESC key

### Settings Menu

**Organization**:
- Tab-based: Gameplay | Graphics | Audio | Accessibility | Controls | Save/Load

#### **Gameplay Tab**
- [ ] Difficulty (Easy / Normal / Hard)
- [ ] Objective markers (On/Off)
- [ ] Tutorial prompts (On/Off)
- [ ] Survival timer display (On/Off)
- [ ] Damage indicators (On/Off)
- [ ] Show stamina bar (On/Off)
- [ ] Crosshair type (Dot / Reticle / Hidden)

#### **Graphics Tab**
- [ ] Resolution (dropdown or custom)
- [ ] Fullscreen / Windowed / Borderless
- [ ] Refresh Rate (Hz)
- [ ] Render scale (75% / 100% / 125% for supersampling)
- [ ] Anti-aliasing (None / FXAA / TAA)
- [ ] Quality preset (Low / Medium / High / Ultra)
- [ ] FOV (60–110°, default 90°)
- [ ] Motion blur (On/Off)
- [ ] Camera shake (Off / Low / Medium / High)
- [ ] Head bob intensity (Off / Low / Medium / High)
- [ ] Vignette intensity (Off / Low / Medium / High)
- [ ] Sprint FOV effect (Off / On)
- [ ] Volumetric fog (On/Off)
- [ ] Screen distortion in anomalies (On/Off)
- [ ] Color blind mode (Off / Red-blind / Green-blind / Blue-blind)
- [ ] High contrast mode (On/Off)

#### **Audio Tab**
- [ ] Master volume (slider, 0–100%)
- [ ] Music volume (slider)
- [ ] SFX volume (slider)
- [ ] Ambience volume (slider)
- [ ] Entity audio volume (slider)
- [ ] Voice/breathing volume (slider)
- [ ] Spatial audio (On/Off, if supported)
- [ ] Subtitles (On/Off)
- [ ] Audio cue visual indicators (On/Off)

#### **Accessibility Tab**
- [ ] Subtitles (On/Off)
- [ ] Reduced flashing/strobing (On/Off)
- [ ] Photosensitivity mode (On/Off)
- [ ] Screen reader support (On/Off)
- [ ] UI scaling (80% / 100% / 120% / 150%)
- [ ] Font size (Small / Normal / Large)
- [ ] High contrast UI (On/Off)
- [ ] Color adjustments (sliders for contrast, saturation, brightness)
- [ ] Toggle screen effects (chromatic aberration, vignette, distortion)
- [ ] Disable jump scares (On/Off)
- [ ] Camera motion sickness filters (On/Off)

#### **Controls Tab**
- [ ] Sensitivity (slider, 0.1–10x)
- [ ] Y-axis inversion (On/Off)
- [ ] Controller dead zone (slider)
- [ ] Controller sensitivity curve
- [ ] Key bindings (remappable):
  - Forward
  - Backward
  - Left strafe
  - Right strafe
  - Sprint
  - Crouch
  - Slide
  - Interact
  - Flashlight toggle (if applicable)
  - Pause
  - Inventory (if applicable)
  - Screenshot

#### **Save/Load Tab**
- [ ] Save game slot 1–5 with preview (datetime, survival time)
- [ ] Delete save
- [ ] Auto-save settings (On/Off)
- [ ] Load game slot
- [ ] Settings profile (Save / Load custom profiles)

### Game Over Screen

**Layout**:
- Large "GAME OVER" title
- Summary stats: Survival time, distance traveled, objective completion
- Options:
  - Restart (current level or reload save)
  - Main Menu
  - Quit

**Feel**:
- Dramatic but not overwhelming
- Red or desaturated color scheme
- Brief moment of silence before score presentation
- Option to skip animation with any button

### Main Menu

**Design** (if game has intro/launcher):
- Clean, minimal aesthetic
- Subtle ambience audio
- Buttons: New Game / Continue / Settings / Credits / Quit
- Background: Still from liminal space or abstract visual

---

## Settings & Customization

### Key Customization Goals

1. **Visual**: Players can disable effects that cause motion sickness, eye strain, or seizure risk
2. **Audio**: Players can adjust mix and disable intense sounds
3. **Difficulty**: Players can tune threat level to comfort
4. **Control**: Full key remapping and sensitivity control
5. **Performance**: Players can optimize for their hardware

### Persistent Save System

**Storage**:
- Settings saved to `%APPDATA%/LiminalAsylum/settings.json` (Windows) or equivalent
- Settings load automatically on game start
- Save on every settings change (not on exit only)

**Backup**:
- Automatic backup of previous settings
- Reset to defaults button always available

### Presets

**Graphics Presets**:
- Low: 1080p, 30 FPS target, minimum effects
- Medium: 1440p, 60 FPS target, moderate effects
- High: 1440p, 144 FPS target, full effects
- Ultra: 4K, 144 FPS target (requires high-end GPU), max effects
- Custom: User-defined

**Control Presets**:
- Mouse & Keyboard (default)
- Xbox-style controller
- PlayStation-style controller
- Custom remapping

---

## Difficulty & Pacing

### Difficulty Settings

#### Easy
- Entity speed: 0.8x
- Entity hearing range: 8m (reduced)
- Memory duration: 20s
- Chase duration before giving up: 60s
- Stamina drain: -15% per second (reduced)
- Safe zones are truly safe (entity won't breach)
- Survival timer: 20 minutes to reach exit
- Initial spawn has longer safety buffer

#### Normal
- Entity speed: 1.0x
- Entity hearing range: 12m
- Memory duration: 40s
- Chase duration: 90s
- Stamina drain: -20% per second
- Safe zones are safe if door is locked (may breach if door is broken)
- Survival timer: 15 minutes to reach exit
- Balanced threat and exploration time

#### Hard
- Entity speed: 1.3x
- Entity hearing range: 15m (excellent hearing)
- Memory duration: 60s
- Chase duration: indefinite (won't give up)
- Stamina drain: -25% per second
- Safe zones: entity may force entry after 30s inside
- Survival timer: 10 minutes to reach exit
- Constant pressure, minimal safety, high skill requirement

### Pacing Progression

**Timeline** (15-minute survival attempt):

**0–2 min: Exploration Phase**
- Entity is dormant or patrolling far away
- Player learns layout, finds initial items
- Ambient tension but no immediate threat
- Goal: Orient self, find safe zone or supplies

**2–5 min: Alert Phase**
- Entity becomes aware of player
- Begins searching (investigation state)
- Audio cues increase (low hum, distant pulses)
- Chases are brief (30–45 seconds) before entity loses interest
- Goal: Avoid direct encounter, continue exploring

**5–10 min: Hunt Phase**
- Entity actively hunts player
- Chases last longer (60–120 seconds)
- Player must use sprinting, sliding, stealth
- Stamina management becomes critical
- Audio intensity escalates
- Goal: Find exit or safe zone before exhaustion

**10–15 min: Escalation Phase**
- Entity becomes more aggressive
- Chases are near-constant
- Safe zones may be breached
- Desperation mechanics (low stamina, limited options)
- Audio is intense, visuals may distort
- Goal: Reach exit or survive until timer ends

### Entity Behavior Escalation

**Early Game (0–3 min)**:
- Patrols set routes
- Rarely initiates hunt
- If player detected, entity investigates (not aggressive)
- Entity returns to patrol if player escapes

**Mid Game (3–8 min)**:
- Patrols become less regular
- Entity hunts if player is nearby
- Chases are intense but survivable
- Entity has good memory of player location

**Late Game (8–15 min)**:
- Entity actively hunts almost constantly
- Chases escalate in aggressiveness
- Entity may attempt to cut off exits
- No safe zones outside of locked rooms
- Win condition becomes survival itself

---

## Technical Architecture

### Engine & Platform

**Primary Target**: PC (Windows, macOS, Linux)
**Engine**: Unity or Unreal Engine (recommendation: Unity for iteration speed, Unreal for visual fidelity)
**Minimum Specs**:
- GPU: GTX 960 / RX 470 or equivalent
- CPU: Intel i5-7600K or equivalent
- RAM: 8 GB
- Storage: 20–30 GB SSD space

**Target Specs**:
- GPU: RTX 2060 / RX 5700 XT or better
- CPU: Intel i7-10700K / Ryzen 5 5600X or better
- RAM: 16 GB
- Storage: NVMe SSD

### Core Systems

**1. Player Controller**
- Input handler (keyboard, mouse, controller)
- Movement state machine (walk, sprint, crouch, slide, idle)
- Stamina system
- Camera controller with head bob and sway
- Collision and grounding system

**2. Entity AI**
- Behavior state machine (idle, patrol, investigate, hunt, chase, attack, lost)
- Pathfinding (A* on nav mesh)
- Awareness system (sight, sound, proximity)
- Animation state synced with behavior

**3. Level Management**
- Procedural layout generation
- Room/chunk streaming and loading
- Player checkpoint/spawn system
- Door and interactive object management

**4. Audio System**
- 3D spatial audio engine
- Ambient loop management
- Entity audio queue system
- Player audio (footsteps, breathing, interactions)
- Music layer system (tension-based)

**5. Rendering**
- Deferred or forward rendering pipeline
- Material system for detail
- Lighting system (baked + dynamic)
- Post-processing (distortion, color grading, vignette)
- Particle system (dust, fog effects)

**6. UI System**
- HUD manager (stamina, timer, warnings)
- Menu system (pause, settings, game over)
- Settings persistence (JSON or native format)
- Accessibility features (subtitles, markers, text scaling)

**7. Save System**
- Game state serialization
- Settings save/load
- Auto-save on level transition
- Load latest save option

### Performance Targets

- **Frame Rate**: 60 FPS minimum (targeting 120+ FPS on high-end hardware)
- **Resolution**: 1440p @ 60 FPS, 1080p @ 120 FPS
- **Input Latency**: <50ms from input to on-screen response
- **Memory**: <6 GB peak usage (target)
- **Load Time**: <10 seconds between level restarts

---

## Production Timeline

### Phase 1: Foundation (Weeks 1–3)
- Project setup, version control, build pipeline
- Basic player controller (WASD movement, camera)
- Placeholder level (simple hallway)
- Settings menu skeleton

### Phase 2: Movement Polish (Weeks 4–6)
- Sprint mechanic with stamina
- Crouch mechanic with audio integration
- Slide mechanic with momentum
- Camera feel (head bob, sway, responsiveness)

### Phase 3: Entity (Weeks 7–10)
- Entity model and rig
- Basic animation set (idle, walk, run, attack)
- Behavior state machine
- Pathfinding and awareness system

### Phase 4: Level Design (Weeks 11–13)
- Procedural level generation system
- Environment art and materials
- Safe zones and spawn/exit design
- Interactive objects (doors, keys)

### Phase 5: Audio (Weeks 14–16)
- Ambient soundscapes
- Entity audio cues
- Music system with tension scaling
- Player audio (footsteps, breathing, interactions)

### Phase 6: Gameplay Systems (Weeks 17–19)
- Entity encounter escalation
- Survival timer and objectives
- Chase mechanics and win conditions
- Dynamic difficulty scaling

### Phase 7: Polish & Optimization (Weeks 20–22)
- Performance profiling and optimization
- Bug fixes and stability
- Settings tuning
- Audio mixing and balancing

### Phase 8: QA & Final Pass (Weeks 23–24)
- Comprehensive QA testing
- Accessibility review
- Final art and audio polish
- Release preparation

---

## Conclusion

**Liminal Asylum** aims to deliver a polished, terrifying, and replayable FPS survival-horror experience. The core pillars are:

1. **Movement Excellence**: Responsive, satisfying, weighty controls with sprint and slide
2. **Atmosphere**: Eerie, oppressive liminal spaces with strong audio-visual design
3. **Entity Terror**: Intelligently animated, horrifying but fair threat
4. **Replayability**: Procedural variation and survival loops
5. **Polish**: Production-ready across all systems

The game succeeds when players feel simultaneously in control (good movement) and hunted (excellent entity design and pacing). Every system serves the core experience: survive, evade, and escape.

---

**Document Version**: 1.0  
**Last Updated**: 2026-06-06  
**Status**: Ready for Pre-Production
