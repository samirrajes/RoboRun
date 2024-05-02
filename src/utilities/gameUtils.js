import * as THREE from 'three';

// code is inspired and built on by Chris Course's implementation of a simple threejs collision detection game (https://github.com/chriscourses/threejs-game)
// we added collisiond detection on all faces, more robust movement, collision detection against multiple disconnected platforms, & textures
// among other additions

// Create a custom class 'Box' that extends THREE.Mesh.
export class Box extends THREE.Mesh {
    constructor({
        width,
        height,
        depth,
        color = 'white', 
        velocity = {x:0, y:0, z:0},
        position = {x:0, y:0, z:0},
        texture = null, // Add a texture parameter
        wireframe = false,
    }) {
        //creates the geometry
        const geometry = new THREE.BoxGeometry(width, height, depth);
        let material;

        // applies a texture if a texture is provided, else color
        if (texture) {
            material = new THREE.MeshStandardMaterial({ map: texture });
        } else {
            material = new THREE.MeshStandardMaterial({ color: color });
        }

        // wireframe implementation (allowed for checking if bounding box fit objects well during development)
        if (wireframe) {
            material.wireframe = true;
        }

        super(geometry, material);

        this.width = width;
        this.height = height;
        this.depth = depth;
        this.position.set(position.x, position.y, position.z);

        this.right = this.position.x + this.width / 2
        this.left = this.position.x - this.width / 2
  
        this.bottom = this.position.y - this.height / 2
        this.top = this.position.y + this.height / 2
  
        this.front = this.position.z + this.depth / 2
        this.back = this.position.z - this.depth / 2

        this.velocity = velocity;
        this.gravity = -0.005; // gravity coefficient

        this.updateSides(); // updates sides
    }

    // updates the sides of the Box for robust collision detection
    updateSides() {

        this.bottom = this.position.y - this.height / 2;
        this.top = this.position.y + this.height / 2;

        this.right = this.position.x + this.width / 2;
        this.left = this.position.x - this.width / 2;

        this.front = this.position.z + this.depth / 2;
        this.back = this.position.z - this.depth / 2;
    }

    // updates the bounding box in terms of an array grounds (the platforms that make up the levels)
    update(grounds) {
        this.updateSides(); //update the sides

        this.applyXZmovement(grounds); // apply horizontal movement

        this.applyYmovement(grounds); // apply vertical movement
    }

    // function to apply vertical movement
    applyYmovement(grounds) {
        
        // find the ground we are colliding with
        let collidingGround = grounds.find(ground => {
            return groundCollision(this, ground) && this.bottom <= ground.top;
        });
    
        // if we are colliding with the top of a ground, set y velocity to 0, and the object position to right on top of the ground
        // otherwise apply gravity
        if (collidingGround) {
            this.velocity.y = Math.max(this.velocity.y, 0);
            this.position.y = collidingGround.top + this.height / 2; // Adjust character's Y position
        } else {
            this.velocity.y += this.gravity;
        }
    
        // update the y position based on the y velocity
        this.position.y += this.velocity.y;
    }

    // function to apply horizontal movement
    applyXZmovement(grounds) {
        // if we are colliding with the side of the ground, find out what side and update the horizontal velocity and positions accordingly
        for (let ground of grounds) {
            let result = sideCollision(this, ground);
    
            // Apply collision logic for X movement
            if (result.onSameLevel && result.withinZBounds) {
                if (result.onLeft && this.velocity.x > 0) {
                    this.velocity.x = 0; // Stop rightward movement
                } else if (result.onRight && this.velocity.x < 0) {
                    this.velocity.x = 0; // Stop leftward movement
                }
            }
    
            // Apply collision logic for Z movement
            if (result.onSameLevel && result.withinXBounds) {
                if (result.onBack && this.velocity.z > 0) {
                    this.velocity.z = 0; // Stop forward movement
                } else if (result.onFront && this.velocity.z < 0) {
                    this.velocity.z = 0; // Stop backward movement
                }
            }
        }
    
        // update position based on velocities
        this.position.x += this.velocity.x;
        this.position.z += this.velocity.z;
    }
}

// function that returns true if any 2 boxes are touching
// taken from Chris course (attributed at top), used only to check winBox collision
// rest of the collision detection implementation is original and can be seen in groundCollision and sideCollision
// and their applications within the movement functions above
export function boxCollision(box1, box2) {
    const xCollision = box1.right >= box2.left && box1.left <= box2.right;
    const yCollision = box1.bottom <= box2.top && box1.top >= box2.bottom;
    const zCollision = box1.front >= box2.back && box1.back <= box2.front;

    return xCollision && yCollision && zCollision;
}

// function that checks if a box is colliding with the grounds top face
export function groundCollision(box, ground) {
    const threshold = 0.2;

    // Check if the bottom of the box is at or just above the top of the ground
    const isVerticallyAligned = box.bottom <= ground.top && box.bottom >= ground.top - threshold;

    // Check if the box is within the horizontal bounds of the ground
    const isHorizontallyAligned = box.right >= ground.left && box.left <= ground.right &&
                                    box.front >= ground.back && box.back <= ground.front;

    return isVerticallyAligned && isHorizontallyAligned;
}

// function that checks for the position of box1 relative to box2
// detemines if you are within the x and z bounds of the box, in order to find out if you are 
// on the left, right, front, or back of the box.
export function sideCollision(box1, box2) {
    const isAboveTop = box1.bottom >= box2.top;
    const onSameLevel = (
        (box1.top > box2.bottom && box1.bottom < box2.top) && !isAboveTop
    );

    const withinXBounds = (
        box1.right > box2.left && box1.left < box2.right // X-axis alignment
    );

    const withinZBounds = (
        box1.front > box2.back && box1.back < box2.front // Z-axis alignment
    );

    const onLeft = box1.right >= box2.left && box1.left < box2.left;
    const onRight = box1.left <= box2.right && box1.right > box2.right;
    const onFront = box1.back <= box2.front && box1.front > box2.front;
    const onBack = box1.front >= box2.back && box1.back < box2.back;

    return { onSameLevel, withinXBounds, withinZBounds, onLeft, onRight, onFront, onBack };
}

// updates the player's velocity based on user input and level-specific conditions 
export function updatePlayer(cube, keys, level) {

    // level 1 has a slippery ground, level 2 doesnt
    if (level == 1) {
        cube.velocity.x *= 0.96;
        cube.velocity.z *= 0.96;
    } else if (level == 2) {
        cube.velocity.x = 0;
        cube.velocity.z = 0;
    }

    if (keys.w.pressed) cube.velocity.z = -0.1;
    if (keys.s.pressed) cube.velocity.z = 0.1;
    if (keys.a.pressed) cube.velocity.x = -0.1;
    if (keys.d.pressed) cube.velocity.x = 0.1;
    // if space is pressed and the cube's velocity is 0 (on the ground) then jump
    // cube velocity is also 0 at the apex of the jump
    // but its not logged as an exact 0 due to refresh rate so double jumps dont occur
    if (keys.space.pressed && cube.velocity.y == 0) {
        cube.velocity.y = 0.12;
    }
}
