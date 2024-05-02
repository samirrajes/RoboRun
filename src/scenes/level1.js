import * as THREE from '../../node_modules/three/build/three.module.js';
import { GLTFLoader } from '../../node_modules/three/examples/jsm/loaders/GLTFLoader.js';

import { setupCameraToggleListener, updateCamera, setupSkybox } from '../utilities/commonSetup.js';
import { Box, boxCollision, updatePlayer } from '../utilities/gameUtils.js';
import { showGameOverScreen, showWinScreen } from '../interfaces/gameOverlays.js';

// decalre global variables
let boundingBox;
let animationId = null;
let useFollowCamera = true;

// function to create level 1
export function createLevel1({ scene, camera, controls, renderer, keys}) {

    scene.background = new THREE.Color(0x000000); // Set a black background

    // setting up camera vectors
    const followCameraOffset = new THREE.Vector3(0, 6, 8);
    const overheadCameraPosition = new THREE.Vector3(0, 20, 0);

    // setup camera toggle listener 
    setupCameraToggleListener(() => { useFollowCamera = !useFollowCamera });

    // setup skybox
    setupSkybox(scene, ['../../assets/skyboxes/blizzard_ft.jpg',
                        '../../assets/skyboxes/blizzard_bk.jpg',
                        '../../assets/skyboxes/blizzard_up.jpg',
                        '../../assets/skyboxes/blizzard_dn.jpg',
                        '../../assets/skyboxes/blizzard_rt.jpg',
                        '../../assets/skyboxes/blizzard_lf.jpg']);

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

    // load character
    const characterloader = new GLTFLoader();
    let character;

    characterloader.load('../../assets/models/robot.glb', (gltf) => {
        character = gltf.scene;
        character.castShadow = true;
        // make sure character casts shadows
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
        character.rotation.y = Math.PI; // Rotate the model by 180 degrees, to make it face away
        character.scale.set(0.5, 0.5, 0.5); // Adjust scale 
        character.position.set(boundingBox.position.x, boundingBox.position.y, boundingBox.position.z); // Set initial position
        scene.add(character);
    }, undefined, (error) => {
        console.error(error);
    });
    
    // load textures and set different wrapping parameters for different sizes of platforms
    const textureLoader = new THREE.TextureLoader();
    const squareGroundTexture = textureLoader.load('../../assets/textures/ice_texture.png', undefined, undefined, (error) => {
        console.error('Error loading texture:', error);
    });
    squareGroundTexture.wrapS = THREE.RepeatWrapping;
    squareGroundTexture.wrapT = THREE.RepeatWrapping;
    squareGroundTexture.repeat.set(2, 2);
    const wideGroundTexture = textureLoader.load('../../assets/textures/ice_texture.png', undefined, undefined, (error) => {
        console.error('Error loading texture:', error);
    });
    wideGroundTexture.wrapS = THREE.RepeatWrapping;
    wideGroundTexture.wrapT = THREE.RepeatWrapping;
    wideGroundTexture.repeat.set(5, 0.5);
    const longGroundTexture = textureLoader.load('../../assets/textures/ice_texture.png', undefined, undefined, (error) => {
        console.error('Error loading texture:', error);
    });
    longGroundTexture.wrapS = THREE.RepeatWrapping;
    longGroundTexture.wrapT = THREE.RepeatWrapping;
    longGroundTexture.repeat.set(0.5, 2.5);

    // create grounds array
    const grounds = [
        new Box({ width: 4, height: 0.5, depth: 8, position: { x: 0, y: -2, z: -2 }, texture: squareGroundTexture }),
        new Box({ width: 4, height: 0.5, depth: 4, position: { x: 0, y: -2, z: -10 }, texture: squareGroundTexture }), 
        new Box({ width: 3, height: 0.5, depth: 3, position: { x: -3, y: -1, z: -16 }, texture: squareGroundTexture }),

        new Box({ width: 20, height: 0.5, depth: 2, position: { x: 5, y: -2, z: -22 }, texture: wideGroundTexture }),

        new Box({ width: 3, height: 0.5, depth: 3, position: { x: 15, y: -2, z: -28 }, texture: squareGroundTexture }),
        new Box({ width: 3, height: 0.5, depth: 3, position: { x: 10, y: -3, z: -33 }, texture: squareGroundTexture }), 
        new Box({ width: 3, height: 0.5, depth: 3, position: { x: 3, y: -2, z: -33 }, texture: squareGroundTexture }), 
        new Box({ width: 3, height: 0.5, depth: 3, position: { x: 0, y: -1, z: -39 }, texture: squareGroundTexture }),

        new Box({ width: 2, height: 0.5, depth: 10, position: { x: 0, y: 0, z: -49 }, texture: longGroundTexture }),

        new Box({ width: 3, height: 0.5, depth: 3, position: { x: -2, y: -1, z: -57 }, texture: squareGroundTexture }), 
        new Box({ width: 3, height: 0.5, depth: 3, position: { x: -3, y: 0, z: -63 }, texture: squareGroundTexture }), 
        new Box({ width: 3, height: 0.5, depth: 3, position: { x: -1, y: 0, z: -69 }, texture: squareGroundTexture }),
        new Box({ width: 3, height: 0.5, depth: 3, position: { x: 0, y: 0, z: -76 }, texture: squareGroundTexture }),
        new Box({ width: 5, height: 0.5, depth: 5, position: { x: 0, y: 0, z: -84 }, texture: squareGroundTexture }),
    ]

    // add grounds to the scene, and allow grounds to receive shadows
    grounds.forEach(ground => {
        ground.receiveShadow = true;
        scene.add(ground);
    });

    // creates win box, game ends if player reached win box
    const winBox = new Box({ width: 1, height: 1, depth: 1, position: { x: 0, y: 0, z: -85 }, color: 'yellow' });
    winBox.castShadow = true;
    scene.add(winBox);

    // light blue ambient light for whole scene
    const ambLight = new THREE.AmbientLight(0xADD8E6, 1);
    scene.add(ambLight);

    // directional light 
    const dlight = new THREE.DirectionalLight(0xffffff, 1);
    dlight.position.set(0, 3, 2);
    dlight.castShadow = true;
    scene.add(dlight);

    // hemisphere light
    const hemiLight = new THREE.HemisphereLight(0x000000, 0xffffff);
    scene.add(hemiLight);

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
            updatePlayer(boundingBox, keys, 1);
            boundingBox.update(grounds);

            // checkgame  win/loss conditions
            checkGameConditions();
    
            accumulator -= timeStep;
        }

        // Update character position to match boundingBox position
        if (character) {
            character.position.set(boundingBox.position.x, boundingBox.position.y, boundingBox.position.z);
        }

        // update camera and renderer
        updateCamera(useFollowCamera, camera, followCameraOffset, overheadCameraPosition, boundingBox);
        renderer.render(scene, camera);

        // update player controls check
        controls.update();
    }

    // function to check win/loss conditions
    function checkGameConditions() {
        // loss condition
        if (boundingBox.position.y < -35) {
            cancelAnimationFrame(animationId); // cancel animation loop
            showGameOverScreen(respawnPlayer); // show game over screen with respawn button
        }
    
        // win condition
        if (boxCollision(boundingBox, winBox)) {
            cancelAnimationFrame(animationId); // cancel animation loop
            showWinScreen(); // show win screen with restart button that reloads webpage back to main menu
        }
    }

    // function that 'respawns' player
    function respawnPlayer() {
        // Reset the boundingBox's position and state
        boundingBox.position.set(0, 0, 1);
        boundingBox.velocity.x = 0;
        boundingBox.velocity.y = 0;
        boundingBox.velocity.z = 0;
    
        // Restart the animation loop
        animate();
    }

    animate(); // call animation loop
}
