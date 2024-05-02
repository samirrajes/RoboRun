import * as THREE from 'https://unpkg.com/three/build/three.module.js';
import { GLTFLoader } from 'https://unpkg.com/three/examples/jsm/loaders/GLTFLoader.js';

import { setupCameraToggleListener, updateCamera, setupSkybox } from '../utilities/commonSetup.js';
import { Box, boxCollision, groundCollision, updatePlayer } from '../utilities/gameUtils.js';
import { showGameOverScreen, showWinScreen } from '../interfaces/gameOverlays.js';

// declare global variables
let boundingBox;
let animationId = null;
let useFollowCamera = true;

// function that creates level 2
export function createLevel2({ scene, camera, controls, renderer, keys }) {

    scene.background = new THREE.Color(0x000000); // black background

    // setting up camera vectors
    const followCameraOffset = new THREE.Vector3(0, 6, 8);
    const overheadCameraPosition = new THREE.Vector3(0, 20, 0);

    // setup camera toggle listener
    setupCameraToggleListener(() => { useFollowCamera = !useFollowCamera });

    //setup skybox
    setupSkybox(scene, ['../../assets/skyboxes/cocoa_ft.jpg',
                        '../../assets/skyboxes/cocoa_bk.jpg',
                        '../../assets/skyboxes/cocoa_up.jpg',
                        '../../assets/skyboxes/cocoa_dn.jpg',
                        '../../assets/skyboxes/cocoa_rt.jpg',
                        '../../assets/skyboxes/cocoa_lf.jpg']);

    // create bounding box for playable character
    boundingBox = new Box({
        width: 2,
        height: 1,
        depth: 1,
        position: {x:0, y:0, z:1},
        velocity: {x:0, y:0, z:0},
        color: 'cyan',
        wireframe: true,
    });
    boundingBox.material.opacity = 0;
    boundingBox.material.transparent = true;
    scene.add(boundingBox);
    
    // load character model
    const characterloader = new GLTFLoader();
    let character;

    characterloader.load('../../assets/models/robot.glb', (gltf) => {
        character = gltf.scene;
        character.castShadow = true;
        character.traverse((node) => {
            if (node.isMesh) {
                node.castShadow = true;
                const originalMaterial = node.material;
                node.material = new THREE.MeshStandardMaterial({
                    map: originalMaterial.map,
                    color: originalMaterial.color,
                    metalness: originalMaterial.metalness,
                    roughness: originalMaterial.roughness
                });
            }
        });
        character.rotation.y = Math.PI; // Rotate the model by 180 degrees
        character.scale.set(0.5, 0.5, 0.5); // Adjust scale
        character.position.set(boundingBox.position.x, boundingBox.position.y, boundingBox.position.z); // Set initial position
        scene.add(character);
    }, undefined, (error) => {
        console.error(error);
    });

     // Load textures for ground and lava
    const textureLoader = new THREE.TextureLoader();
    const groundTexture = textureLoader.load('../assets/textures/cobble_texture.png');
    const lavaTexture = textureLoader.load('../../assets/textures/lava_texture.jpg');
    groundTexture.wrapS = THREE.RepeatWrapping;
    groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set(1, 1);
 
    // Define platforms that make up the level
    const grounds = [
        new Box({ width: 5, height: 0.5, depth: 7, position: { x: 0, y: -2, z: 0 }, texture: groundTexture }),
        new Box({ width: 5, height: 0.5, depth: 5, position: { x: 0, y: -1, z: -7 }, texture: groundTexture }),
        new Box({ width: 8, height: 0.5, depth: 8, position: { x: -10, y: 0, z: -11 }, texture: groundTexture }),
        new Box({ width: 5, height: 0.5, depth: 5, position: { x: -7, y: -1, z: -20 }, texture: groundTexture }),
        new Box({ width: 6, height: 0.5, depth: 6, position: { x: 0, y: -2, z: -20 }, texture: groundTexture }),
        new Box({ width: 3, height: 0.5, depth: 3, position: { x: 3, y: -4, z: -29 }, texture: groundTexture }),
        new Box({ width: 5, height: 0.5, depth: 5, position: { x: 9, y: -3, z: -34 }, texture: groundTexture }),
        new Box({ width: 3, height: 0.5, depth: 3, position: { x: 5, y: -2, z: -40 }, texture: groundTexture }),
        new Box({ width: 2, height: 0.5, depth: 2, position: { x: 0, y: -2, z: -40 }, texture: groundTexture }),
        new Box({ width: 2, height: 0.5, depth: 2, position: { x: 0, y: -2, z: -43 }, texture: groundTexture }),
        new Box({ width: 2, height: 0.5, depth: 2, position: { x: 0, y: -2, z: -46 }, texture: groundTexture }),
        new Box({ width: 2, height: 0.5, depth: 2, position: { x: 0, y: -2, z: -49 }, texture: groundTexture }),
        new Box({ width: 2, height: 0.5, depth: 2, position: { x: 0, y: -2, z: -52 }, texture: groundTexture }),
        new Box({ width: 2, height: 0.5, depth: 2, position: { x: 0, y: -2, z: -55 }, texture: groundTexture }),
        new Box({ width: 2, height: 0.5, depth: 2, position: { x: 0, y: -2, z: -58 }, texture: groundTexture }),
        new Box({ width: 2, height: 0.5, depth: 2, position: { x: 0, y: -2, z: -61 }, texture: groundTexture }),
        new Box({ width: 2, height: 0.5, depth: 2, position: { x: 0, y: -2, z: -64 }, texture: groundTexture }),
        new Box({ width: 2, height: 0.5, depth: 2, position: { x: 0, y: -2, z: -67 }, texture: groundTexture }),
        new Box({ width: 2, height: 0.5, depth: 2, position: { x: 0, y: -2, z: -70 }, texture: groundTexture }),

    ];
    
    // add platforms to scene
    grounds.forEach(ground => {
        ground.receiveShadow = true;
        scene.add(ground);
    });

    // creates win box, game ends if player reached win box
    const winBox = new Box({ width: 1, height: 1, depth: 1, position: {x: 0, y: -2, z: -70 }, color: 'yellow' });
    winBox.castShadow = true;
    scene.add(winBox);

    // low intensity ambient light for whole scene
    const ambLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambLight);

    // hemisphere light, to give a orange effect to the bottom half of the scene
    const hemiLight = new THREE.HemisphereLight(0x000000, 0xFFA500, 3);
    scene.add(hemiLight);

    // defines pools of lava character must avoid
    const lavas = [
        new Box({ width: 2, height: 0.2, depth: 2, position: {x:1.5, y:-1.84, z:-2.5}, texture: lavaTexture}),
        new Box({ width: 5, height: 0.2, depth: 5, position: {x:-9, y:0.16, z:-12}, texture: lavaTexture}),
        new Box({ width: 3, height: 0.2, depth: 3, position: {x:1.5, y:-1.84, z:-21.5}, texture: lavaTexture}),
        new Box({ width: 3, height: 0.2, depth: 3, position: {x:1.5, y:-1.84, z:-18.5}, texture: lavaTexture}),
        new Box({ width: 1.8, height: 0.2, depth: 1.8, position: {x: 0, y: -1.84, z: -43}, texture: lavaTexture}),
        new Box({ width: 1.8, height: 0.2, depth: 1.8, position: {x: 0, y: -1.84, z: -49}, texture: lavaTexture}),
        new Box({ width: 1.8, height: 0.2, depth: 1.8, position: {x: 0, y: -1.84, z: -55}, texture: lavaTexture}),
        new Box({ width: 1.8, height: 0.2, depth: 1.8, position: {x: 0, y: -1.84, z: -61}, texture: lavaTexture}),
        new Box({ width: 1.8, height: 0.2, depth: 1.8, position: {x: 0, y: -1.84, z: -67}, texture: lavaTexture}),
        new Box({ width: 3, height: 0.2, depth: 3, position: {x: 9, y: -2.84, z: -34 }, texture: lavaTexture}),
    ];

    // add lava to the scene
    lavas.forEach(lava => {
       scene.add(lava);
    });

    // define the point lights that give the lava pools a glow
    const lavalights = [
        { color: 0xFFA500, intensity: 15, distance: 400, position: {x:1.5, y:-1, z:-2.5} },
        { color: 0xFFA500, intensity: 25, distance: 400, position: {x:-9, y:1, z:-12} },
        { color: 0xFFA500, intensity: 25, distance: 400, position: {x:1.5, y:-1, z:-21.5} },
        { color: 0xFFA500, intensity: 20, distance: 400, position: {x:1.5, y:-1, z:-18.5} },
        { color: 0xFFA500, intensity: 15, distance: 400, position: {x: 0, y: -1, z: -43} },
        { color: 0xFFA500, intensity: 15, distance: 400, position: {x: 0, y: -1, z: -49} },
        { color: 0xFFA500, intensity: 15, distance: 400, position: {x: 0, y: -1, z: -55} },
        { color: 0xFFA500, intensity: 15, distance: 400, position: {x: 0, y: -1, z: -61} },
        { color: 0xFFA500, intensity: 15, distance: 400, position: {x: 0, y: -1, z: -67} },
        { color: 0xFFA500, intensity: 25, distance: 400, position: {x: 9, y: -2, z: -34} },
    ];

    // Create and add lava point lights to the scene
    lavalights.forEach(lightConfig => {
        const llight = new THREE.PointLight(lightConfig.color, lightConfig.intensity, lightConfig.distance);
        llight.position.set(lightConfig.position.x, lightConfig.position.y, lightConfig.position.z);
        // llight.castShadow = true; // had to turn off because of lag
        scene.add(llight);
    });

    // defining time step and animation loop
    const timeStep = 1 / 60; // 60 updates per second
    let accumulator = 0;
    let lastTime = 0;

    function animate(currentTime = 0) {
        animationId = requestAnimationFrame(animate);

        currentTime *= 0.001; // convert to seconds
        const deltaTime = currentTime - lastTime;
        lastTime = currentTime;

        accumulator += deltaTime;

        while (accumulator >= timeStep) {
            // Physics and game logic updates
            updatePlayer(boundingBox, keys, 2);
            boundingBox.update(grounds);

            //check win/loss conditions
            checkGameConditions();

            accumulator -= timeStep;
        }

        // Update character position to match boundingBox position
        if (character) {
            character.position.set(boundingBox.position.x, boundingBox.position.y, boundingBox.position.z);
        }

        //update camera and renderer
        updateCamera(useFollowCamera, camera, followCameraOffset, overheadCameraPosition, boundingBox);
        renderer.render(scene, camera);
        
        //update controls
        controls.update();
    }

    //function to check win loss conditions
    function checkGameConditions() {
        
        // loss condition
        if (boundingBox.position.y < -35) {
            cancelAnimationFrame(animationId); // cancel animation loop
            showGameOverScreen(respawnPlayer); // show game over screen with respawn button
        }

        // loss condition
        lavas.forEach(lava => {
            if (boxCollision(boundingBox, lava)) {
                cancelAnimationFrame(animationId); // cancel animation loop
                showGameOverScreen(respawnPlayer); // show game over screen with rspawn button
            }
        });

        // win condition
        if (boxCollision(boundingBox, winBox)) {
            cancelAnimationFrame(animationId); // cancel animation loop
            showWinScreen(); // show win screen
        }
    }

    // function that 'respawns' player
    function respawnPlayer() {
        // Reset the boundingBox's position and state
        boundingBox.position.set(0, 0, 0);
        boundingBox.velocity.x = 0;
        boundingBox.velocity.y = 0;
        boundingBox.velocity.z = 0;

        // Restart the animation loop
        animate();
    }

    animate();
}