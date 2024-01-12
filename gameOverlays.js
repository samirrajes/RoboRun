// Variables to track if the game over and win screens are displayed
let isGameOverDisplayed = false;
let isWinScreenDisplayed = false;

// Function to show the game over screen with a restart callback
export function showGameOverScreen(restartCallback) {
    if (isGameOverDisplayed) return; // Prevent multiple displays
    isGameOverDisplayed = true;

    // Create an overlay div for the game over screen
    const overlay = createOverlay('rgba(0, 0, 0, 0.2)');

    // Create game over text, respawn button, and append them to the overlay
    const respawnText = createTextElement('Game Over', 'white', '4em');
    const respawnButton = createButton('Respawn', '#FF4500', restartCallback);

    overlay.appendChild(respawnText);
    overlay.appendChild(respawnButton);
    document.body.appendChild(overlay);
}

// Function to show the win screen with a restart callback
export function showWinScreen(restartCallback) {
    if (isWinScreenDisplayed) return; // Prevent multiple displays
    isWinScreenDisplayed = true;

    // Create an overlay div for the win screen
    const overlay = createOverlay('rgba(0, 0, 0, 0.8)');

    // Create win text, instructions text, restart button, and append them to the overlay
    const winText = createTextElement('You Win!', '#FFD700', '5em');
    const instructionsText = createTextElement('(Refresh the webpage to try a different level)', '#FFD700', '1em');
    const restartButton = createButton('Restart', '#4CAF50', () => {
        location.reload();
    });

    overlay.appendChild(winText);
    overlay.appendChild(instructionsText);
    overlay.appendChild(restartButton);
    document.body.appendChild(overlay);
}

// Function to create and style an overlay div
function createOverlay(backgroundColor) {
    const overlay = document.createElement('div');
    setupOverlayStyle(overlay, backgroundColor);
    return overlay;
}

// Function to set up the styling of an overlay div
function setupOverlayStyle(overlay, backgroundColor) {
    overlay.style.position = 'absolute';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = backgroundColor;
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'column';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = '1000';
    overlay.style.fontFamily = 'Arial, sans-serif';
    overlay.style.animation = 'fadeIn 1s';
}

// Function to create and style a text element
function createTextElement(text, color, fontSize) {
    const textElement = document.createElement('div');
    textElement.innerHTML = text;
    textElement.style.color = color;
    textElement.style.fontSize = fontSize;
    textElement.style.marginBottom = '20px';
    return textElement;
}

// Function to create and style a button element with an onClick callback
function createButton(text, backgroundColor, onClick) {
    const button = document.createElement('button');
    button.innerHTML = text;
    button.style.fontSize = '2em';
    button.style.padding = '10px 20px';
    button.style.cursor = 'pointer';
    button.style.color = 'white';
    button.style.backgroundColor = backgroundColor;
    button.style.border = 'none';
    button.style.borderRadius = '5px';

    // Add a click event listener for the button
    button.addEventListener('click', () => {
        onClick();
        // Remove the button's parent element (the overlay) and reset display variables
        document.body.removeChild(button.parentElement);
        isGameOverDisplayed = false;
        isWinScreenDisplayed = false;
    });

    return button;
}
