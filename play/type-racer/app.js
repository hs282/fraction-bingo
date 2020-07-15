const APP_NAME = "type-racer";
const DM = new DataManager(APP_NAME);

// the list of words that can show up for the user to type
let words = [];

// previously used word list
// let words = [
//     "Adult", "Airplane", "Air", "Aircraft", "Airforce", "Airport", "Album", "Alphabet", "Apple", "Arm", "Army", "Baby", "Baby", "Backpack", "Balloon", "Banana", "Bank", "Barbecue", "Bathroom", "Bathtub", "Bed", "Bee", "Bible", "Bible", "Bird", "Bomb", "Book", "Boss", "Bottle", "Bowl", "Box", "Boy", "Brain", "Bridge", "Butterfly", "Button", "Cappuccino", "Car", "Card", "Carpet", "Carrot", "Cave", "Chair", "Chess", "Chief", "Child", "Chisel", "Chocolates", "Church", "Church", "Circle", "Circus", "Circus", "Clock", "Clown", "Coffee", "Comet", "Compact", "Compass", "Computer", "Crystal", "Cup", "Cycle", "Database", "Desk", "Diamond", "Dress", "Drill", "Drink", "Drum", "Dung", "Ears", "Earth", "Egg", "Electricity", "Elephant", "Eraser", "Explosive", "Eyes", "Family", "Fan", "Feather", "Festival", "Film", "Finger", "Fire", "Floodlight", "Flower", "Foot", "Fork", "Freeway", "Fruit", "Fungus", "Game", "Garden", "Gas", "Gate", "Gemstone", "Girl", "Gloves", "God", "Grapes", "Guitar", "Hammer", "Hat", "Hieroglyph", "Highway", "Horoscope", "Horse", "Hose", "Ice", "Icicle", "Insect", "Jet", "Junk", "Kaleidoscope", "Kitchen", "Knife", "Leather", "Leg", "Library", "Liquid", "Magnet", "Man", "Map", "Maze", "Meat", "Meteor", "Microscope", "Milk", "Milkshake", "Mist", "Money", "Monster", "Mosquito", "Mouth", "Nail", "Navy", "Necklace", "Needle", "Onion", "Paint", "Pants", "Parachute", "Passport", "Pebble", "Pendulum", "Pepper", "Perfume", "Pillow", "Plane", "Planet", "Pocket", "Poster", "Potato", "Printer", "Prison", "Pyramid", "Radar", "Rainbow", "Record", "Restaurant", "Rifle", "Ring", "Robot", "Rock", "Rocket", "Roof", "Room", "Rope", "Saddle", "Salt", "Sandpaper", "Sandwich", "Satellite", "School", "Ship", "Shoes", "Shop", "Shower", "Signature", "Skeleton", "Snail", "Software", "Solid", "Space", "Spectrum", "Sphere", "Spice", "Spiral", "Spoon", "Sports", "Spot", "Square", "Staircase", "Star", "Stomach", "Sun", "Sunglasses", "Surveyor", "Swimming", "Sword", "Table", "Tapestry", "Teeth", "Telescope", "Television", "Tennis", "Thermometer", "Tiger", "Toilet", "Tongue", "Torch", "Torpedo", "Train", "Treadmill", "Triangle", "Tunnel", "Typewriter", "Umbrella", "Vacuum", "Vampire", "Videotape", "Vulture", "Water", "Weapon", "Web", "Wheelchair", "Window", "Woman", "Worm"
// ];

// variables to keep track of user typing statistics
let wordIndex = 0;
let numWords;
let typingErrors;
let lettersTyped;

// variables keep track of the timer
let timer;
let timerID;

// prevent startGame() from being called more than once before ending
let gameStarted = false;

// set difficulty to medium by default
let difficulty = "medium";

// track window width as the game progresses, so players cannot use resizing to their advantage
let windowWidth;

// const value for relative link to word list txt file
const WORD_LIST = "txt/typeracerwordlist.txt";

// offset value needed to center player car and road
const CENTER_VALUE = "8%";

// stagger stop light times by 1000ms
const STOP_LIGHT_TIME = 1000;

// set the animation value to create a sliding road
const ROAD_ANIMATION = "slide 120s linear infinite";

// number of words typed that will be required to move the player fully to the other side of the screen
const WORDS_REQUIRED = 50;

// time left on the timer at end of game required to achieve a specific medal
const MEDAL_GOLD = 25;
const MEDAL_SILVER = 13;
const MEDAL_BRONZE = 1;

// medal-earning messages to the player
const GOLD_MESSAGE = "Congratulations, you earned a Gold medal!!!";
const SILVER_MESSAGE = "Congratulations, you earned a Silver medal!!";
const BRONZE_MESSAGE = "Congratulations, you earned a Bronze medal!";

// max length of words allowed in each respective difficulty
const EASY_LENGTH = 5;
const MEDIUM_LENGTH = 8;
const HARD_LENGTH = 12;

// score multipliers applied to ending score based on the difficulty at which the game is played
const EASY_MULTIPLIER = 1;
const MEDIUM_MULTIPLIER = 1.25;
const HARD_MULTIPLIER = 1.5;


(function initUI() {
    // show instructions modal
    $("#myModal").modal("show");

    // adjust road sprite
    adjustPlayerAndRoad();
})();

/**
 * Adjust both the player and the road to fit properly on the screen
 */
function adjustPlayerAndRoad() {
    let road = document.querySelector("#road");

    // set the player and road's top
    document.querySelector("#player").style.marginTop = CENTER_VALUE;
    road.style.marginTop = CENTER_VALUE;
    
    road.style.height = 150 + "px";
}

/**
 * Read in the wordlist text file in order to use its contents as words in the game
 */
async function readTextFile(file) {

    let response = await fetch(file);

    // if HTTP-status is valid
    if (response.ok) {

        // get the response body
        let textInput = await response.text();
        words = [];
        let tempWordIndex = 0;
        let currentWord = "";

        // loop through the entire string retrieved from the text file
        for (let i = 0; i < textInput.length; i++) {

            // if the string element is not a whitespace character, add the character to currentWord
            if (textInput[i] != " " && textInput[i] != "\n" && textInput[i] != "\r") {
                currentWord += textInput[i];
            }
            // otherwise if the currentWord isn't empty, add to words list
            else if (currentWord != "") {
                let tempWord = currentWord;
                currentWord = "";

                // if the difficulty and current word length is acceptable, add the tempWord to words[]
                if ((difficulty == "easy" && tempWord.length <= EASY_LENGTH) ||
                    (difficulty == "medium" && tempWord.length <= MEDIUM_LENGTH) ||
                    (difficulty == "hard" && tempWord.length <= HARD_LENGTH)) { words[tempWordIndex++] = tempWord; }
            }
        }
    }
    // invalid response leads to an HTTP error
    else { console.log("HTTP-Error: " + response.status); return -1;}

    return 0;
}

/**
 * Change global difficulty to let the program know to adjust word list appropriately
 */
function setDifficulty(element) {
    // if the id of the calling element is proper, set difficulty based on its value
    if (element.id == "difficultySelector") {
        difficulty = element.value;

        // get all elements of the same difficultySelector id
        let elements = document.querySelectorAll("#difficultySelector");

        // loop through all dropdown difficultySelector elements and change selected value of all.
        // this prevents the dropdowns from having differing selected values
        for (let i = 0; i < elements.length; i++) {
            if (difficulty == "easy") {elements[i].getElementsByTagName('option')[0].selected = 'selected';}
            else if (difficulty == "medium") {elements[i].getElementsByTagName('option')[1].selected = 'selected';}
            else if (difficulty == "hard") {elements[i].getElementsByTagName('option')[2].selected = 'selected';}
        }
    }
}

/*
* Reset the stop light and input, then startTimer() after stopLight turns green
*/
function stopLightStart() {
    // reset timer and display the main game screen
    document.getElementById("timer").innerHTML = "2:00";
    document.getElementById("wordRace").style.display = "";
    document.getElementById("end").style.display = "none";

    // reset and keep input disabled until stopLight is over
    let input = document.querySelector("#input");
    input.disabled = true;
    input.value = "";

    // keep the player focused on the text box at all times
    input.onblur = () => setTimeout(() => input.focus());

    // get all lights to change light display with timer
    let redLight = document.getElementById("redLight");
    let yellowLight = document.getElementById("yellowLight");
    let greenLight = document.getElementById("greenLight");
    redLight.style.display = "block";
    yellowLight.style.display = "none";
    greenLight.style.display = "none";

    // starts on redLight, then yellowLight, then greenLight
    setTimeout(() => {
        redLight.style.display = "none";
        yellowLight.style.display = "block";

        setTimeout(() => {
            yellowLight.style.display = "none";
            greenLight.style.display = "block";

            setTimeout(() => {
                greenLight.style.display = "none";

                // enable input and then start the timer
                input.disabled = false;
                startTimer();

                // set road to start moving underneath the player
                document.getElementById("road").style.animation = ROAD_ANIMATION;

                // focus on input box after starting
                input.focus();
            }, STOP_LIGHT_TIME);
        }, STOP_LIGHT_TIME);
    }, STOP_LIGHT_TIME);
}

/**
 * Start the game.
 */
async function startGame() {
    // prevent startGame() from being called multiple times before ending
    if (gameStarted) {return;}
    gameStarted = true;

    // wait to finish reading in the text file
    let promise = await readTextFile(WORD_LIST);

    // let the user know if an error occurred
    if (promise == -1) {console.log("Error: Input text file could not be read");}

    // set appropriate global window width
    windowWidth = document.getElementById("wordRace").offsetWidth;

    // upon resizing the window, move the car appropriately left or right to prevent cheating
    window.onresize = () => {

        let newWindowWidth = document.getElementById("wordRace").offsetWidth;
        let widthRatio = newWindowWidth / windowWidth;
        windowWidth = newWindowWidth;

        // calculate how much the player will move
        let left = document.getElementById("player").style.left;

        // calculate new position of the player
        let newLeft;
        if (!left.includes("px")) {
            newLeft = "0px";
        }
        else {
            left = left.replace("px", "");
            newLeft = (parseInt(left, 10) * widthRatio) + "px";
        }
            
        // move the player div
        document.getElementById("player").style.left = newLeft;

    };

    // reset stats
    numWords = 0;
    timer = 120;
    wordIndex = 2;
    typingErrors = 0;
    lettersTyped = 0;

    words = shuffle(words);

    // reset the player's car
    document.querySelector("#player").style.left = "0px";

    populateWordTray();

    // handles the stopLight, input resetting, and startTimer()
    stopLightStart();
}

/**
 * Start the main gameplay timer
 */
function startTimer() {
    // Timer function that counts down the seconds
    timerID = setInterval(() => {
        timer--;
            
        // If is over a minute
        if (timer - 60 > 0) {
            if (timer - 60 >= 10)
                document.getElementById("timer").innerHTML = 1 + ":" + (timer - 60);
            else 
                document.getElementById("timer").innerHTML = 1 + ":0" + (timer - 60);
        }
        // If timer is at exactly 1 minute
        else if (timer == 60)
            document.getElementById("timer").innerHTML = "1:00";
        // If time is up
        else if (timer == 0) 
            endWordRace();
        // If is less than a minute
        else {
            if (timer >= 10)
                document.getElementById("timer").innerHTML = 0 + ":" + timer;
            else
                document.getElementById("timer").innerHTML = 0 + ":0" + timer;
        }
        
        // Calculate words per minute
        let seconds = 120 - timer;
        document.getElementById("wpmBox").innerHTML = ((numWords * 60)/ seconds).toFixed() + " wpm";
    }, 1000);
}

/**
 * 
 */
document.getElementById("input").addEventListener('keyup', () => {
    let inputEl = document.querySelector("#input");

    let input = document.getElementById("input").value;
    input = input.trim();
    
    let currentWord = document.getElementById("wordTray").children[0].innerHTML;
        
    if (input == currentWord) {
        // get ref to wordTray element
        let wordTray = document.querySelector("#wordTray");
        
        // remove the word that was just typed
        wordTray.removeChild(wordTray.firstChild);

        // add a new word to the end
        let span = document.createElement("span");
        span.innerText = words[wordIndex++].toLowerCase();
        wordTray.appendChild(span);
        
        // clear input box
        inputEl.value = "";
        inputEl.style.color = "";
    
        // keep track of the word that was just typed
        numWords++;
            
        // calculate how much the player will move
        let left = document.getElementById("player").style.left;
        let width = document.getElementById("wordRace").offsetWidth;

        // the width to animate the car every time a word is typed
        let animateWidth = width / WORDS_REQUIRED;
            
        // if user is at end of screen. end the game
        if (parseInt(left.replace("px", ""), 10) >= width) {
            endWordRace();
        }
        
        // calcualte new position of the player
        let newLeft;
        if (!left.includes("px")) {
            newLeft = animateWidth + "px";
        }
        else {
            left = left.replace("px", "");
            newLeft = (parseInt(left, 10) + animateWidth) + "px";
        }
            
        // move the player div
        $("#player").animate({ "left": newLeft }, 200, "linear");
            
        // Calculate words per minute
        let seconds = 120 - timer;
        document.getElementById("wpmBox").innerHTML = ((numWords * 60) / seconds).toFixed() + " wpm";
    }
    // If the input is correct
    else if (input == currentWord.substring(0, input.length)) {
        inputEl.style.color = "green";
    }
    // If the input is incorrect
    else if (input != currentWord.substring(0, input.length)) {
        inputEl.style.color = "red";
        typingErrors++;
    }
    
    lettersTyped++;
});

/**
 * 
 */
function populateWordTray() {
    let wordTray = document.querySelector("#wordTray");
    wordTray.innerHTML = "";

    for (let i = 0; i < 5; i++) {
        let span = document.createElement("span");
        span.innerText = words[wordIndex++].toLowerCase();

        wordTray.appendChild(span);
    }
}

/**
 * 
 */
function endWordRace() {
    // stop road animation
    document.getElementById("road").style.animation = "none";

    // Stop timer
    clearInterval(timerID);
        
    // Show timer at 0:00
    document.getElementById("timer").innerHTML = "0:00";
        
    // Disable input
    document.getElementById("input").disabled = true;
    document.getElementById("input").value = "";
    
    // Hide game and show end screen
    document.getElementById("wordRace").style.display = "none";
    document.getElementById("end").style.display = "";

    // display a medal and respective message based on how much time is left on the timer
    if (timer >= MEDAL_GOLD) {
        $("#medalModal").modal("show");
        document.getElementById("medalTitle").innerHTML = GOLD_MESSAGE;
        document.getElementById("goldMedal").style.display = "block";
        document.getElementById("silverMedal").style.display = "none";
        document.getElementById("bronzeMedal").style.display = "none";
    }
    else if (timer >= MEDAL_SILVER) {
        $("#medalModal").modal("show");
        document.getElementById("medalTitle").innerHTML = SILVER_MESSAGE;
        document.getElementById("goldMedal").style.display = "none";
        document.getElementById("silverMedal").style.display = "block";
        document.getElementById("bronzeMedal").style.display = "none";
    }
    else if (timer >= MEDAL_BRONZE) {
        $("#medalModal").modal("show");
        document.getElementById("medalTitle").innerHTML = BRONZE_MESSAGE;
        document.getElementById("goldMedal").style.display = "none";
        document.getElementById("silverMedal").style.display = "none";
        document.getElementById("bronzeMedal").style.display = "block";
    }
    
    // Show stats
    let seconds = 120 - timer;
    let wpm = ((numWords * 60) / seconds);
    document.getElementById("wpmStat").innerHTML = wpm.toFixed() + " wpm";
    document.getElementById("wordCountStat").innerHTML = numWords;

    // set default accuracy to 0
    let wordAccuracyStat = 0.0;

    // if the lettersTyped are greater than 0, then calculate a proper wordAccuracyStat
    if (lettersTyped > 0) {
        wordAccuracyStat = (((lettersTyped - typingErrors) / lettersTyped) * 100);
    }

    // set the actual wordAccuracyStat in HTML
    document.getElementById("wordAccuracyStat").innerHTML = wordAccuracyStat.toFixed(1) + "%";

    // calculate current and past playerScore
    let playerScore = 0;
    playerScore = (wpm + seconds) * numWords * (wordAccuracyStat / 100);
    
    // multiply user score based on difficulty at which the race was completed
    if (difficulty == "easy") {playerScore *= EASY_MULTIPLIER;}
    else if (difficulty == "medium") {playerScore *= MEDIUM_MULTIPLIER;}
    else if (difficulty == "hard") {playerScore *= HARD_MULTIPLIER;}

    playerScore = playerScore.toFixed();
    let pastPlayerScore = DM.getItem("score");

    // if getItem() didn't return undefined
    if (pastPlayerScore != undefined) {

        // convert pastPlayerScore to a valid numeric score
        pastPlayerScore = JSON.stringify(pastPlayerScore).slice(3);
        pastPlayerScore = parseInt(pastPlayerScore);

        // save playerScore in DM if new score is higher than the old one
        if (playerScore > pastPlayerScore) {
            DM.saveItem("score", playerScore);
        }

        // display the higher score as the player's high score
        document.getElementById("playerHighScore").innerHTML = playerScore > pastPlayerScore ? playerScore : pastPlayerScore;
    }

    // save playerScore, if unable, then popup a warning message
    else if (DM.saveItem("score", playerScore) == false) {
        alert("Could not save your score. If you would like to save your score, please login first.");
        document.getElementById("playerHighScore").innerHTML = "Not logged in";
    }

    // only other behavior would be to display current playerScore as highest
    else {
        document.getElementById("playerHighScore").innerHTML = playerScore;
    }

    // display score and reset gameStarted
    document.getElementById("playerScore").innerHTML = playerScore;
    gameStarted = false;
}

/**
 * 
 * @param {any[]} array 
 */
function shuffle(array) {
  let m = array.length, t, i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}