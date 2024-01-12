import * as THREE from 'three';

// sets up a listener for toggling the camera mode
export const setupCameraToggleListener = (toggleCameraFunction) => {
    // Add an event listener to the window for keydown events
    // When the 'C' key is pressed, trigger the 'toggleCameraFunction'
    window.addEventListener('keydown', (event) => {
        if (event.code === 'KeyC') {
            toggleCameraFunction(); // Call the provided function to toggle the camera
        }
    });
};

// Function to update the camera position and orientation based on the camera mode
export const updateCamera = (useFollowCamera, camera, followCameraOffset, overheadCameraPosition, boundingBox) => {
    if (useFollowCamera) {
        // If using the follow camera, smoothly move the camera towards the desired position
        const desiredPosition = boundingBox.position.clone().add(followCameraOffset);
        camera.position.lerp(desiredPosition, 0.05); // Lerping for smooth movement
        camera.lookAt(boundingBox.position.x, boundingBox.position.y, boundingBox.position.z); // Look at the target object
    } else {
        // If using the overhead camera, set the camera's position and orientation above the player
        camera.position.y = boundingBox.position.y + overheadCameraPosition.y;
        camera.position.z = boundingBox.position.z + overheadCameraPosition.z;
        camera.position.x = overheadCameraPosition.x;
        camera.lookAt(0, boundingBox.position.y, boundingBox.position.z); // Look at the center of the scene
    }
};

// Sets up a skybox in the scene using provided texture paths
export const setupSkybox = (scene, texturePaths) => {
    const loader = new THREE.TextureLoader(); // Create a texture loader

    // Load textures and create an array of materials for the skybox
    const texturesArray = texturePaths.map(path => new THREE.MeshBasicMaterial({ map: loader.load(path), side: THREE.BackSide }));
    
    // Create a box geometry for the skybox with a large size
    const skyBoxGeometry = new THREE.BoxGeometry(1000, 1000, 1000);
    
    // Create a mesh with the skybox geometry and materials
    const skyBox = new THREE.Mesh(skyBoxGeometry, texturesArray);
    
    // Add skybox to scene
    scene.add(skyBox);
    
    return skyBox; // Return the skybox mesh
};