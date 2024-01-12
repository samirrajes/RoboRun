// Define an object 'keys' to track the state of movement keys
export const keys = {
    // initialize all movement keys as unpressed
    w: { pressed: false },   
    a: { pressed: false },   
    s: { pressed: false },   
    d: { pressed: false },   
    space: { pressed: false } 
};

// Sets up event listeners for keydown and keyup events
export function setupKeyListeners() {
    // Add a 'keydown' event listener to track when keys are pressed
    window.addEventListener('keydown', (event) => {
        // Check the key code and update the corresponding key state to 'pressed'
        switch (event.code) {
            case 'KeyW': keys.w.pressed = true; break;
            case 'KeyA': keys.a.pressed = true; break;
            case 'KeyS': keys.s.pressed = true; break;
            case 'KeyD': keys.d.pressed = true; break;
            case 'Space': keys.space.pressed = true; break;
        }
    });

    // Add a 'keyup' event listener to track when keys are released
    window.addEventListener('keyup', (event) => {
        // Check the key code and update the corresponding key state to 'not pressed'
        switch (event.code) {
            case 'KeyW': keys.w.pressed = false; break;
            case 'KeyA': keys.a.pressed = false; break;
            case 'KeyS': keys.s.pressed = false; break;
            case 'KeyD': keys.d.pressed = false; break;
            case 'Space': keys.space.pressed = false; break;
        }
    });
}
