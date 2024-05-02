import * as THREE from 'https://unpkg.com/three/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three/examples/jsm/controls/OrbitControls.js';

import { createTitleScreen } from '../interfaces/titleScreen.js'; // import the function that creates the title/menu screen
import { createLevel1 } from '../scenes/level1.js'; // import the function that creates level 1
import { createLevel2 } from '../scenes/level2.js'; // import the function that creates level 2
import { keys, setupKeyListeners } from '../utilities/gameControls.js'; // import necessary attributes and functions that keep track of key presses for player movement

const scene = new THREE.Scene(); // initialize scene
scene.background = new THREE.Color(0x000000); // Set a background color

// Camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Renderer setup
const renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.localClippingEnabled = false;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// OrbitControls setup for development
const controls = new OrbitControls(camera, renderer.domElement);

// Resizing
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

// Start the game with the title screen.
createTitleScreen({scene, camera, controls, renderer, keys}, createLevel1, createLevel2);

// createLevel1({scene, camera, controls, renderer, keys}); //generate only level 1
// createLevel2({scene, camera, controls, renderer, keys}); //generate only level 2

// Setup key listeners for player controls
setupKeyListeners();
