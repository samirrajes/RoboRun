# RoboRun

Welcome to RoboRun, a 3D parkour game where you guide a robot through challenging environments, aiming to reach the end of each map. Navigate through icy platforms on the Ice Level and avoid lava pools on the Fire Level using intuitive controls. RoboRun is built for expansion, featuring custom-developed physics for a flexible and engaging gaming experience.

The current levels are particularly easy, but now that gravity, friction, and collision detection are working I intend to introduce some harder levels!

## Play Now

**[Play RoboRun!](https://samirrajes.github.io/RoboRun)**

**Disclaimer:** The game works particularly well (and as originally intended) when played in Chrome, with graphics accelaration enabled. 

## Game Introduction

RoboRun features various levels, each with unique environmental challenges and designs. Control the game using the WASD keys for movement, the spacebar to jump, and 'C' to toggle camera views. The game utilizes Three.js for 3D rendering, with UI elements developed using JavaScript/HTML and styled with CSS.

### Camera Mechanics

- **Third-person view:** Provides an immersive experience, following the robot closely.
- **Bird's eye view:** Offers a top-down perspective, ideal for planning your moves in complex environments.
- **Dynamic updates:** The camera smoothly transitions between views using linear interpolation to maintain synchronization with game physics.

### Platform Mechanics

Players navigate through the game by jumping across platforms, which are dynamically rendered using the Box class—a derivative of THREE.Mesh.

### Physics and Movement

RoboRun integrates a custom physics engine to handle gravity, friction, and collision detection, ensuring a realistic and responsive gameplay experience. The physics system is synchronized with a fixed time step, not frame rate, to provide a consistent gameplay experience on various hardware.

## Technical Development

### Box Class

The Box class is fundamental in creating the interactive game environment. Key features include:

- **Geometry and Material:** Utilizes THREE.BoxGeometry and THREE.MeshStandardMaterial.
- **Collision Detection:** Enhanced to detect collisions on all sides, ensuring objects do not overlap in 3D space.
- **Movement:** Includes methods to handle horizontal and vertical movements influenced by gravity and collisions.

### Blender Design

The playable character was modeled in Blender, designed to fit within a predefined bounding box to ensure compatibility with the game's collision system. The character design was simplified due to technical limitations, focusing on functionality and compatibility with the game's environment.

## Acknowledgements

### Resources

The development of RoboRun utilized several open-source resources and textures, ensuring a visually appealing and technically sound gaming experience. Below are the credits for the resources used:

1. **Skyboxes:**
   - Ice Level: [SkiingPenguin’s Skybox Pack, Skybox Blizzard](https://opengameart.org/content/skiingpenguins-skybox-pack)
   - Fire Level: [SkiingPenguin’s Skybox Pack, Skybox Cocoa](https://opengameart.org/content/skiingpenguins-skybox-pack)
2. **Textures:**
   - Ice Textures: [Hand-Painted Texture - Iceberg by Chad Wolfe, Kiira](https://opengameart.org/content/hand-painted-texture-iceberg)
   - Basalt Textures: [Cobblestone texture](https://opengameart.org/node/8038)
   - Lava Textures: [Lava texture](https://opengameart.org/node/24158)
3. **Physics Algorithm Inspiration:**
   - [ChrisCourses three.js game example](https://github.com/chriscourses/threejs-game/blob/main/index.html)

Special thanks to the creators of these resources for making their work available and supporting the game development community.

## Conclusion

I hope you enjoy playing RoboRun as much as I enjoyed creating it!
