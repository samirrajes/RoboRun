// function to generate the title/menu screen for the game

export function createTitleScreen({ scene, camera, controls, renderer, keys }, createLevel1, createLevel2) {
    // Set the background to black
    document.body.style.backgroundColor = 'black';

    // Create and style the title element
    const title = document.createElement('h1');
    title.innerHTML = '<span style="color: #ADD8E6; text-shadow: 0 0 10px #ADD8E6, 0 0 20px #ADD8E6;">Robo</span> ' +
        '<span style="color: white; text-shadow: 0 0 10px #ADD8E6, 0 0 20px #ADD8E6;"></span> ' +
        '<span style="color: #FF4500; text-shadow: 0 0 10px #FF4500, 0 0 20px #FF4500;"> Run</span>';
    title.style.cssText = `
        text-align: center;
        position: absolute;
        top: 20%;
        left: 50%;
        transform: translateX(-50%);
        font-size: 6em;
        font-family: Arial, sans-serif;
    `;
    document.body.appendChild(title);

    let currentPopup = null; // flag to track popup

    // function that creates and shows/hides the popup for controls and objectives
    function togglePopup(content, button) {
        if (currentPopup && currentPopup.button === button) {
            document.body.removeChild(currentPopup.popup);
            currentPopup = null;
            return;
        }

        if (currentPopup) {
            document.body.removeChild(currentPopup.popup);
        }

        const popup = document.createElement('div');
        popup.style.cssText = `
            position: fixed;
            top: 50%;
            right: 10%;
            transform: translateY(-50%);
            background-color: rgba(0, 0, 0, 0.8);
            padding: 20px;
            border-radius: 10px;
            color: white;
            text-align: left;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
            z-index: 1001;
            font-size: 1.2em;
            font-family: Arial, sans-serif;
        `;
        popup.innerHTML = content;

        document.body.appendChild(popup);
        currentPopup = { popup, button };
    }

    // function to create a styled button
    function createButton(text, topPosition, onClick) {
        const button = document.createElement('button');
        button.innerText = text;
        button.style.cssText = `
            position: absolute;
            top: ${topPosition};
            left: 50%;
            transform: translateX(-50%);
            font-size: 24px;
            padding: 15px 30px;
            cursor: pointer;
            color: white;
            background: none;
            border: none;
            font-family: Arial, sans-serif;
            text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
            transition: color 0.3s, text-shadow 0.3s;
        `;

        // mouse hover effect
        button.addEventListener('mouseover', () => {
            button.style.color = '#ff4500'; // Change color on hover
            button.style.textShadow = '0 0 10px #ff4500'; // Dynamic shadow on hover
        });
        button.addEventListener('mouseout', () => {
            button.style.color = 'white';
            button.style.textShadow = '0 0 5px rgba(255, 255, 255, 0.5)';
        });

        button.addEventListener('click', () => onClick(button));
        return button;
    }

    // Play Level 1 button
    const playLevel1Button = createButton('Play Level 1', '45%', () => {
        clearScreen();
        createLevel1({ scene, camera, controls, renderer, keys });
    });
    document.body.appendChild(playLevel1Button);

    // Play Level 2 button
    const playLevel2Button = createButton('Play Level 2', '55%', () => {
        clearScreen();
        createLevel2({ scene, camera, controls, renderer, keys }); // Start Level 2
    });
    document.body.appendChild(playLevel2Button);

    // Controls button
    const instructionsButton = createButton('Controls', '65%', (button) => {
        togglePopup('<h2>Game Controls: </h2><p>W-A-S-D to move <br> Space to Jump <br> C to toggle camera view </p>', button);
    });
    document.body.appendChild(instructionsButton);

    // Objectives button
    const objectivesButton = createButton('Objectives', '75%', (button) => {
        togglePopup('<h2>Objectives</h2><p>Finish the parkour and touch the yellow box at the end! <br><br> Level 1 (Ice): Be careful not to slip on the ice! <br> <br> Level 2 (Fire): Be careful of the lava, you dont wanna melt!</p>', button);
    });
    document.body.appendChild(objectivesButton);

    function clearScreen() {
        document.body.removeChild(playLevel1Button);
        document.body.removeChild(playLevel2Button);
        document.body.removeChild(instructionsButton);
        document.body.removeChild(objectivesButton);
        document.body.removeChild(title);
        if (currentPopup) document.body.removeChild(currentPopup.popup);
    }
}
