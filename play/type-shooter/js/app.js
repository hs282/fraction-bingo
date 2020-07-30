const APP_NAME = "type-shooter";
const DM = new DataManager(APP_NAME);

// default word list (used if text file cannot be read)
let words = [
    "Adult", "Airplane", "Air", "Aircraft", "Airforce", "Airport", "Album", "Alphabet", "Apple", "Arm", "Army", "Baby", "Baby", "Backpack", "Balloon", "Banana", "Bank", "Barbecue", "Bathroom", "Bathtub", "Bed", "Bee", "Bible", "Bible", "Bird", "Bomb", "Book", "Boss", "Bottle", "Bowl", "Box", "Boy", "Brain", "Bridge", "Butterfly", "Button", "Cappuccino", "Car", "Card", "Carpet", "Carrot", "Cave", "Chair", "Chess", "Chief", "Child", "Chisel", "Chocolates", "Church", "Church", "Circle", "Circus", "Circus", "Clock", "Clown", "Coffee", "Comet", "Compact", "Compass", "Computer", "Crystal", "Cup", "Cycle", "Database", "Desk", "Diamond", "Dress", "Drill", "Drink", "Drum", "Dung", "Ears", "Earth", "Egg", "Electricity", "Elephant", "Eraser", "Explosive", "Eyes", "Family", "Fan", "Feather", "Festival", "Film", "Finger", "Fire", "Floodlight", "Flower", "Foot", "Fork", "Freeway", "Fruit", "Fungus", "Game", "Garden", "Gas", "Gate", "Gemstone", "Girl", "Gloves", "God", "Grapes", "Guitar", "Hammer", "Hat", "Hieroglyph", "Highway", "Horoscope", "Horse", "Hose", "Ice", "Icicle", "Insect", "Jet", "Junk", "Kaleidoscope", "Kitchen", "Knife", "Leather", "Leg", "Library", "Liquid", "Magnet", "Man", "Map", "Maze", "Meat", "Meteor", "Microscope", "Milk", "Milkshake", "Mist", "Money", "Monster", "Mosquito", "Mouth", "Nail", "Navy", "Necklace", "Needle", "Onion", "Paint", "Pants", "Parachute", "Passport", "Pebble", "Pendulum", "Pepper", "Perfume", "Pillow", "Plane", "Planet", "Pocket", "Poster", "Potato", "Printer", "Prison", "Pyramid", "Radar", "Rainbow", "Record", "Restaurant", "Rifle", "Ring", "Robot", "Rock", "Rocket", "Roof", "Room", "Rope", "Saddle", "Salt", "Sandpaper", "Sandwich", "Satellite", "School", "Ship", "Shoes", "Shop", "Shower", "Signature", "Skeleton", "Snail", "Software", "Solid", "Space", "Spectrum", "Sphere", "Spice", "Spiral", "Spoon", "Sports", "Spot", "Square", "Staircase", "Star", "Stomach", "Sun", "Sunglasses", "Surveyor", "Swimming", "Sword", "Table", "Tapestry", "Teeth", "Telescope", "Television", "Tennis", "Thermometer", "Tiger", "Toilet", "Tongue", "Torch", "Torpedo", "Train", "Treadmill", "Triangle", "Tunnel", "Typewriter", "Umbrella", "Vacuum", "Vampire", "Videotape", "Vulture", "Water", "Weapon", "Web", "Wheelchair", "Window", "Woman", "Worm"
];
            
let wordDiffLevel;
let difficulty = "medium";
let zIndex = 999999;
let spawnIntervalID;
let timerIntervalID;
let timer;
let currentInputIndex;
let currentWords = [];

const GREEN_START_COLOR = 220;
const RED_START_COLOR = 0;
let greenTextColor = GREEN_START_COLOR;
let redTextColor = RED_START_COLOR;

// stats
let balloonsPopped = 0;
let balloonCollisions = 0;
let wpmStat;
let lettersTyped;
let typingErrors;

const WORD_LIST = "txt/typeshooterwordlist.txt";

// max length of words allowed in each respective difficulty
const EASY_LENGTH = 5;
const MEDIUM_LENGTH = 8;
const HARD_LENGTH = 12;

const SPAWN_INTERVAL = 3000;
const ANIMATION_SPEED = 4800;
const sectors = ["sector_one", "sector_two", "sector_three"];

const EASY_MULTIPLIER = 1;
const MEDIUM_MULTIPLIER = 1.25;
const HARD_MULTIPLIER = 1.5;

const STARTING_LIVES = 10;

(function initUI() {
    // show instructions modal
    $("#myModal").modal("show");

    // keep page scrolled to the very top
    document.body.scrollTop = 0;

    // edit styles for balloonsPopped text and livesLeft text
    let livesLeft = document.getElementById("livesLeft");
    livesLeft.style.fontSize = "25px";
    livesLeft.style.fontWeight = "bold";
    livesLeft.style.webkitTextStrokeWidth = "1px";
    livesLeft.style.webkitTextStrokeColor = "black";
    livesLeft.style.webkitTextFillColor = "rgb(0, " + greenTextColor + ", 0)";

    let poppedBalloons = document.getElementById("balloonsPopped");
    poppedBalloons.style.fontSize = "25px";
    poppedBalloons.style.fontWeight = "bold";
    poppedBalloons.style.webkitTextStrokeWidth = "1px";
    poppedBalloons.style.webkitTextStrokeColor = "black";
    poppedBalloons.style.webkitTextFillColor = "rgb(255, 255, 255)";

    let timeSurvived = document.getElementById("timeSurvived");
    timeSurvived.style.fontSize = "25px";
    timeSurvived.style.fontWeight = "bold";
    timeSurvived.style.webkitTextStrokeWidth = "1px";
    timeSurvived.style.webkitTextStrokeColor = "black";
    timeSurvived.style.webkitTextFillColor = "rgb(255, 255, 255)";

    let input = document.getElementById("input");
    input.style.fontSize = "25px";
    input.style.fontWeight = "bold";
    input.style.webkitTextStrokeWidth = "1px";
    input.style.webkitTextStrokeColor = "black";
    input.style.webkitTextFillColor = "rgb(255, 255, 255)";
    input.size = "" + HARD_LENGTH;
    input.maxLength = "" + HARD_LENGTH;
})();

/**
 * Starts the Type Shooter game loop
 */
async function startGame() {

    // wait to finish reading in the text file
    let promise = await readTextFile(WORD_LIST);

    // let the user know if an error occurred
    if (promise == -1) console.log("Error: Input text file could not be read");

    greenTextColor = GREEN_START_COLOR;
    redTextColor = RED_START_COLOR;

    document.body.scrollTop = 0;
    document.body.style.overflowY = "hidden";
    document.getElementById("balloonShooter").style.display = "";
    document.getElementById("endScreen").style.display = "none";
    document.getElementById("balloonsPopped").innerHTML = "Balloons Popped: 0";
    document.getElementById('input').disabled = false;
    document.getElementById('input').focus();
    document.getElementById("livesLeft").innerHTML = "Lives Left: " + STARTING_LIVES;
    document.getElementById("livesLeft").style.webkitTextFillColor = "rgb(" + redTextColor + ", " + greenTextColor + ", 0)";
    document.getElementById("timeSurvived").innerHTML = "Time Survived: 00:00"

    currentWords = [];
    zIndex = 999999;
    balloonsPopped = 0;
    balloonCollisions = 0;
    wpmStat = 0;
    lettersTyped = 0;
    typingErrors = 0;
    timer = 0;
    currentInputIndex = -1;

    // Shuffle words list
    words = shuffle(words);
    spawnBalloon();

    // add one to the timer and update wpmStat every second
    timerIntervalID = setInterval(() => {
        wpmStat = (balloonsPopped / (++timer)) * 60;
        let wpmStats = document.querySelectorAll("#wpmStat");
        for (let i = 0; i < wpmStats.length; i++) wpmStats[i].style.innerHTML = "WPM: " + wpmStat;

        // if the time played exceeds the maximum displayable time, end the game
        if (timer % (60 * 60) == 0) endGame();

        // calculate timeSurvived and display it in the form 00:00
        let timeSurvived = (Math.floor(timer / 60) < 10 ? "0" + Math.floor(timer / 60) : Math.floor(timer / 60));
        timeSurvived += ":" + (timer % 60 < 10 ? "0" + timer % 60 : timer % 60);

        document.querySelector("#timeSurvived").innerHTML = "Time Survived: " + timeSurvived;

    }, 1000);

    let tempInterval = getSpawnInterval();
    // Spawn a new balloon every spawnInterval / difficulty multiplier seconds
    spawnIntervalID = setInterval(() => {spawnBalloon();}, tempInterval);

    const input = document.getElementById('input');

    // always be focused on the input
    input.focus();
    input.onblur = () => setTimeout(() => input.focus());
}

/**
 * Ends the Type Shooter game loop and displays the endScreen
 */
function endGame() {

    // disable input and show end screen
    document.body.style.overflowY = "auto";
    document.getElementById('input').disabled = true;
    document.getElementById('input').value = "";
    document.getElementById('input').blur();
    document.getElementById("balloonShooter").style.display = "none";
    document.getElementById("endScreen").style.display = "";

    clearInterval(spawnIntervalID);
    clearInterval(timerIntervalID);

    // remove all balloons from the document and reset currentWords
    for (let i = 0; i < currentWords.length; i++) document.getElementById(currentWords[i]).remove();
    currentWords = [];

    // display player stats
    document.getElementById("wpmStat").innerHTML = wpmStat.toFixed() + " wpm";
    document.getElementById("wordCountStat").innerHTML = balloonsPopped;

    // set default accuracy to 0
    let wordAccuracyStat = 0.0;

    // if the lettersTyped are greater than 0, then calculate a proper wordAccuracyStat
    if (lettersTyped > 0) wordAccuracyStat = (((lettersTyped - typingErrors) / lettersTyped) * 100);

    // set the actual wordAccuracyStat in HTML
    document.getElementById("wordAccuracyStat").innerHTML = wordAccuracyStat.toFixed(1) + "%";

    // calculate current and past playerScore
    let playerScore = 0;
    playerScore = (wpmStat + timer / 60) * (balloonsPopped) * (wordAccuracyStat / 100);
    
    // multiply user score based on difficulty at which the race was completed
    if (difficulty == "easy") playerScore *= EASY_MULTIPLIER;
    else if (difficulty == "medium") playerScore *= MEDIUM_MULTIPLIER;
    else if (difficulty == "hard") playerScore *= HARD_MULTIPLIER;

    playerScore = playerScore.toFixed();
    let pastPlayerScore = DM.getItem("score");

    // if getItem() didn't return undefined
    if (pastPlayerScore != undefined) {

        // convert pastPlayerScore to a valid numeric score
        pastPlayerScore = JSON.stringify(pastPlayerScore).slice(3);
        pastPlayerScore = parseInt(pastPlayerScore);

        // save playerScore in DM if new score is higher than the old one
        if (playerScore > pastPlayerScore) DM.saveItem("score", playerScore);

        // display the higher score as the player's high score
        document.getElementById("playerHighScore").innerHTML = playerScore > pastPlayerScore ? playerScore : pastPlayerScore;
    }

    // save playerScore, if unable, then popup a warning message
    else if (DM.saveItem("score", playerScore) == false) {
        alert("Could not save your score. If you would like to save your score, please login first.");
        document.getElementById("playerHighScore").innerHTML = "Not logged in";
    }

    // only other behavior would be to display current playerScore as highest
    else document.getElementById("playerHighScore").innerHTML = playerScore;

    // display score and reset gameStarted
    document.getElementById("playerScore").innerHTML = playerScore;

    // calculate timeSurvived and display it in the form 00:00
    let timeSurvived = (Math.floor(timer / 60) < 10 ? "0" + Math.floor(timer / 60) : Math.floor(timer / 60));
    timeSurvived += ":" + (timer % 60 < 10 ? "0" + timer % 60 : timer % 60);

    document.querySelectorAll("#timeSurvived").forEach(timeStat => timeStat.innerHTML = timeSurvived);
}

/**
 * Get the true spawnInterval by multiplying it by the respective difficulty's multiplier
 */
function getSpawnInterval() {
    return SPAWN_INTERVAL / (
        difficulty == "easy" ? EASY_MULTIPLIER : (
            difficulty == "medium" ? MEDIUM_MULTIPLIER : (
                difficulty == "hard" ? HARD_MULTIPLIER : EASY_MULTIPLIER
    )));
}

/**
 * Change global difficulty to let the program know to adjust game settings appropriately
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
            if (difficulty == "easy") elements[i].getElementsByTagName('option')[0].selected = 'selected';
            else if (difficulty == "medium") elements[i].getElementsByTagName('option')[1].selected = 'selected';
            else if (difficulty == "hard") elements[i].getElementsByTagName('option')[2].selected = 'selected';
        }
    }
}

/**
 * Function uses the provided balloonID to play a popping animation and then delete the balloon
 * @param {String} balloonID
 * @param {Number} balloonIndex
 * @param {String} popImg
 */
function popBalloon(balloonID, balloonIndex, popImg) {
    let balloon = document.getElementById(balloonID);

    // only the first balloon can be popped (assuming it exists)
    if (!balloon) return false;
    else if (balloonID != currentWords[balloonIndex]) return false;

    // set balloon to remove text and become a popping image
    balloon.style.backgroundImage = "url('" + popImg + "')";
    balloon.style.filter = "none";
    balloon.style.zIndex = 0;
    if (balloon.firstChild) balloon.removeChild(balloon.firstChild);

    // the balloon at balloonIndex is removed from currentWords[]
    currentWords.splice(balloonIndex, 1);

    // reset input box value if currently in the process of typing the word at balloonIndex
    if (currentInputIndex == balloonIndex) document.getElementById("input").value = "";
    currentInputIndex--;

    setTimeout(() => {balloon.remove();}, 400);
    return true;
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
            if (textInput[i] != " " && textInput[i] != "\n" && textInput[i] != "\r") currentWord += textInput[i];
            // otherwise if the currentWord isn't empty, add to words list
            else if (currentWord != "") {
                let tempWord = currentWord;
                currentWord = "";

                // if the difficulty and current word length is acceptable, add the tempWord to words[]
                if ((difficulty == "easy" && tempWord.length <= EASY_LENGTH) ||
                    (difficulty == "medium" && tempWord.length <= MEDIUM_LENGTH) ||
                    (difficulty == "hard" && tempWord.length <= HARD_LENGTH)) { words.push(tempWord); tempWordIndex++; }
            }
        }
    }
    // invalid response leads to an HTTP error
    else { console.log("HTTP-Error: " + response.status); return -1; }

    return 0;
}
            
/**
 * Create a balloon and show it on screen.
 */
function spawnBalloon() {
    // Get next word
    nextWord = words.pop().toLowerCase();

    // set the currentWord if not currently set
    if (currentWords.length == 0) {
        let input = document.getElementById("input");
        input.value = "";
        input.disabled = false;
        input.focus();
    }

    // push the next word onto the list of words that need to be typed
    currentWords.push(nextWord);
                
    // Calculate word difficulty
    if (nextWord.length <= EASY_LENGTH) wordDiffLevel = 0;
    else if (nextWord.length <= MEDIUM_LENGTH) wordDiffLevel = 1;
    else if (nextWord.length <= HARD_LENGTH) wordDiffLevel = 2;

    // Create balloon and add word into it
    let balloon = document.createElement("div");
    let text = document.createElement("span");
    text.appendChild(document.createTextNode(nextWord));
    balloon.appendChild(text);
                
    // Style the balloon
    balloon.id = nextWord;
    balloon.style.height = "150px";

    // adjust width and height of balloon according to # of characters
    if (nextWord.length <= 5) balloon.style.height = 150 * (nextWord.length / 5.2) + "px";
    balloon.style.width = 150 * (nextWord.length / 9) + "px";

    balloon.style.backgroundImage = "url('img/typeshooterballoonsmall.png')";
    balloon.style.backgroundSize = "100% 100%";
    balloon.style.backgroundRepeat = "no-repeat";
    balloon.style.backgroundPosition = "center";
    balloon.style.filter = 'hue-rotate(' + Math.random() * 360 + 'deg)';
    balloon.style.position = "absolute";

    // convert maximum px width to a relative percentage to allow better resizing
    let maxPX = (document.getElementById("balloonShooter").offsetWidth - parseInt((balloon.style.width).replace("px", ""), 10));
    let maxPercent = maxPX / document.getElementById("balloonShooter").offsetWidth * 100;
    balloon.style.left = (Math.random() * maxPercent) + "%";

    balloon.style.zIndex = zIndex--;

    // reset zIndex if too low
    if (zIndex <= 1) zIndex = 999999;
                
    // Vertically center the text in the balloon
    text.style.position = "relative";
    text.style.top = "28%";
    text.style.fontSize = "22px";
    text.style.fontWeight = "bold";
    text.style.webkitTextStrokeWidth = "0.5px";
    text.style.webkitTextStrokeColor = "white";
    text.style.webkitTextFillColor = "black";
      
    let randValue = Math.random();
    // do not allow a random value of exactly 0
    while (randValue == 0) randValue = Math.random();

    // place balloon in random sector based on word difficulty level
    // hard words can spawn only in sector 2, medium in 1 and 2, and easy in 0, 1, and 2
    let randSector = Math.floor(3 - randValue * (3 - wordDiffLevel));
    document.getElementById(sectors[randSector]).appendChild(balloon);

    let tempAnimationSpeed = ANIMATION_SPEED;

    // normalize sector animation speeds to some extent
    if (randSector == 0) tempAnimationSpeed *= EASY_MULTIPLIER;
    else if (randSector == 1) tempAnimationSpeed *= MEDIUM_MULTIPLIER;
    else if (randSector == 2) tempAnimationSpeed *= HARD_MULTIPLIER;

    // increase the speed at which the animations occur based on difficulty
    if (difficulty == "easy") tempAnimationSpeed /= EASY_MULTIPLIER;
    else if (difficulty == "medium") tempAnimationSpeed /= MEDIUM_MULTIPLIER;
    else if (difficulty == "hard") tempAnimationSpeed /= HARD_MULTIPLIER;

    // animate the newly created balloon
    $("#" + balloon.id).animate({
        "top": document.getElementById("spaceship").getBoundingClientRect().bottom
    }, tempAnimationSpeed, "linear");

    // delete balloon after it goes out of bounds (WIP)
    setTimeout(() => {
        if (popBalloon(balloon.id, 0, "img/typeshooterballoonexplode.png")) {

            let livesLeft = STARTING_LIVES - (++balloonCollisions);
            document.getElementById("livesLeft").innerHTML = "Lives Left: " + livesLeft;

            // Determine appropriate text color depending on lives left
            let interval = (GREEN_START_COLOR / (STARTING_LIVES - 1));
            redTextColor += interval;
            greenTextColor -= interval;
            document.getElementById("livesLeft").style.webkitTextFillColor = "rgb(" + redTextColor + ", " + greenTextColor +", 0)";

            // end the game if the player is out of lives
            if (livesLeft <= 0) { endGame(); return; }

            // if there isn't a word to be popped, disable the input text box
            if (currentWords.length == 0) document.getElementById("input").disabled = true;
        }
    }, tempAnimationSpeed);
}

/**
 * Whenever the user types into the input element.
 */
document.getElementById("input").addEventListener('keyup', () => {

    if (currentWords.length == 0) return;

    lettersTyped++;

    let input = document.getElementById("input").value;
    input = input.trim().toLowerCase();

    let incorrect = 0;

    for (let i = 0; i < currentWords.length; i++) {

        if (input == currentWords[i]) {
            // clear input box
            document.getElementById("input").value = "";
            document.getElementById("input").parentNode.style.color = "";

            // pop the current balloon
            if (!popBalloon(currentWords[i], i, "img/typeshooterballoonpop.png")) {
                console.log("Error: Balloon \"" + currentWords[i] + "\" did not get popped");
                return;
            }

            // update balloons popped display and increment balloonsPopped
            document.getElementById("balloonsPopped").innerHTML = "Balloons Popped: " + (++balloonsPopped);

            // if there isn't a word to be popped, disable the input text box
            if (currentWords.length == 0) document.getElementById("input").disabled = true;
            return;
        }
                
        // If the input is correct
        else if (input == currentWords[i].substring(0, input.length)) {
            document.getElementById("input").style.webkitTextFillColor = "rgb(0, " + GREEN_START_COLOR + ", 0)";
            currentInputIndex = i;
        }
        // add to # of incorrect checks
        else incorrect++;
    }

    // if all checked substrings are incorrect
    if (incorrect == currentWords.length) {
        // increment typing errors, set input text color to red
        typingErrors++;
        document.getElementById("input").style.webkitTextFillColor = "rgb(" + GREEN_START_COLOR + ", 0, 0)";
    }
});

/**
 * Shuffle an array.
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