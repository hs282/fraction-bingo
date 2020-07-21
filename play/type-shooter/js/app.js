let words = [
    "Adult", "Airplane", "Air", "Aircraft", "Airforce", "Airport", "Album", "Alphabet", "Apple", "Arm", "Army", "Baby", "Baby", "Backpack", "Balloon", "Banana", "Bank", "Barbecue", "Bathroom", "Bathtub", "Bed", "Bee", "Bible", "Bible", "Bird", "Bomb", "Book", "Boss", "Bottle", "Bowl", "Box", "Boy", "Brain", "Bridge", "Butterfly", "Button", "Cappuccino", "Car", "Card", "Carpet", "Carrot", "Cave", "Chair", "Chess", "Chief", "Child", "Chisel", "Chocolates", "Church", "Church", "Circle", "Circus", "Circus", "Clock", "Clown", "Coffee", "Comet", "Compact", "Compass", "Computer", "Crystal", "Cup", "Cycle", "Database", "Desk", "Diamond", "Dress", "Drill", "Drink", "Drum", "Dung", "Ears", "Earth", "Egg", "Electricity", "Elephant", "Eraser", "Explosive", "Eyes", "Family", "Fan", "Feather", "Festival", "Film", "Finger", "Fire", "Floodlight", "Flower", "Foot", "Fork", "Freeway", "Fruit", "Fungus", "Game", "Garden", "Gas", "Gate", "Gemstone", "Girl", "Gloves", "God", "Grapes", "Guitar", "Hammer", "Hat", "Hieroglyph", "Highway", "Horoscope", "Horse", "Hose", "Ice", "Icicle", "Insect", "Jet", "Junk", "Kaleidoscope", "Kitchen", "Knife", "Leather", "Leg", "Library", "Liquid", "Magnet", "Man", "Map", "Maze", "Meat", "Meteor", "Microscope", "Milk", "Milkshake", "Mist", "Money", "Monster", "Mosquito", "Mouth", "Nail", "Navy", "Necklace", "Needle", "Onion", "Paint", "Pants", "Parachute", "Passport", "Pebble", "Pendulum", "Pepper", "Perfume", "Pillow", "Plane", "Planet", "Pocket", "Poster", "Potato", "Printer", "Prison", "Pyramid", "Radar", "Rainbow", "Record", "Restaurant", "Rifle", "Ring", "Robot", "Rock", "Rocket", "Roof", "Room", "Rope", "Saddle", "Salt", "Sandpaper", "Sandwich", "Satellite", "School", "Ship", "Shoes", "Shop", "Shower", "Signature", "Skeleton", "Snail", "Software", "Solid", "Space", "Spectrum", "Sphere", "Spice", "Spiral", "Spoon", "Sports", "Spot", "Square", "Staircase", "Star", "Stomach", "Sun", "Sunglasses", "Surveyor", "Swimming", "Sword", "Table", "Tapestry", "Teeth", "Telescope", "Television", "Tennis", "Thermometer", "Tiger", "Toilet", "Tongue", "Torch", "Torpedo", "Train", "Treadmill", "Triangle", "Tunnel", "Typewriter", "Umbrella", "Vacuum", "Vampire", "Videotape", "Vulture", "Water", "Weapon", "Web", "Wheelchair", "Window", "Woman", "Worm"
];
            
let wordDiffLevel;
let difficulty = "medium";
let zIndex = 999999;
//let currentWord = undefined;
let currentWords = [];
let balloonsPopped = 0;
let spawnInterval = 3000;
let animationSpeed = 5000;
const sectors = ["sector_one", "sector_two", "sector_three"];

const EASY_MULTIPLIER = 1;
const MEDIUM_MULTIPLIER = 1.25;
const HARD_MULTIPLIER = 1.5;

(function initUI() {
    // show instructions modal
    $("#myModal").modal("show");
})();

/**
 * Starts the Type Shooter game loop
 */
function startGame() {

    document.getElementById("balloonShooter").style.display = "";
    document.getElementById('input').disabled = false;
    document.getElementById('input').focus();

    // Shuffle words list
    words = shuffle(words);

    spawnBalloon();

    let tempInterval = getInterval();

    // Spawn a new balloon every spawnInterval / difficulty multiplier seconds
    setInterval(() => {spawnBalloon();}, tempInterval);

    const input = document.getElementById('input');

    // always be focused on the input
    input.focus();
    input.onblur = () => setTimeout(() => input.focus());
}

/**
 * Get the true spawnInterval by multiplying it by the respective difficulty's multiplier
 */
function getInterval() {
    return spawnInterval / (
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
            if (difficulty == "easy") {elements[i].getElementsByTagName('option')[0].selected = 'selected';}
            else if (difficulty == "medium") {elements[i].getElementsByTagName('option')[1].selected = 'selected';}
            else if (difficulty == "hard") {elements[i].getElementsByTagName('option')[2].selected = 'selected';}
        }
    }
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
    if (nextWord.length < 4) {
        wordDiffLevel = 0;
    }
    else if (nextWord.length > 4 && nextWord.length < 6) {
        wordDiffLevel = 1;
    }
    else {
        wordDiffLevel = 2;
    }

    // Create balloon and add word into it
    let balloon = document.createElement("div");
    let text = document.createElement("span");
    text.appendChild(document.createTextNode(nextWord));
    balloon.appendChild(text);
                
    // Style the balloon
    balloon.id = nextWord;
    balloon.style.height = "150px";
    balloon.style.width = 150 * (nextWord.length / 3) + "px";
    balloon.style.backgroundImage = "url('img/typeshooterballoon.png')";
    balloon.style.backgroundSize = "contain";
    balloon.style.backgroundRepeat = "no-repeat";
    balloon.style.backgroundPosition = "center";
    balloon.style.filter = 'hue-rotate(' + Math.random() * 360 + 'deg)';
    balloon.style.position = "absolute";
    balloon.style.left = Math.random() * 90 + "%";
    balloon.style.zIndex = zIndex--;

    // reset zIndex if too low
    if (zIndex <= 1) {zIndex = 999999;}
                
    // Vertically center the text in the balloon
    text.style.position = "relative";
    text.style.top = "30%";
    text.style.fontSize = "22px";
    text.style.fontWeight = "bold";
    text.style.webkitTextStrokeWidth = "0.5px";
    text.style.webkitTextStrokeColor = "white";
    text.style.webkitTextFillColor = "black"
      
    // Place balloon in random sector based on word difficulty level
    let randSector = Math.floor(3 - Math.random() * (1 + wordDiffLevel)); // 3 -
    document.getElementById(sectors[randSector]).appendChild(balloon);

    let tempAnimationSpeed = animationSpeed;

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
        "top": document.getElementById("spaceship").style.bottom
    }, tempAnimationSpeed, "linear");

    // delete balloon after it goes out of bounds (WIP)
    // setTimeout(() => {
    //     console.log("Balloon dead :(");
    //     balloon.remove();

    //     // The new currentWord (index 0) becomes the word after it
    //     currentWords.shift();
    //     // if there isn't a word to be popped, disable the input text box
    //     if (currentWords.length == 0) {
    //         document.getElementById("input").disabled = true;
    //     }
    // }, tempAnimationSpeed);
}

/**
 * Whenever the user types into the input element.
 */
document.getElementById("input").addEventListener('keyup', () => {

    if (currentWords.length == 0) return;

    let input = document.getElementById("input").value;
    input = input.trim().toLowerCase();
                    
    if (input == currentWords[0]) {
        // Clear input box
        document.getElementById("input").value = "";
        document.getElementById("input").parentNode.style.color = "";
                    
        // Play popping animation and delete balloon
        let balloon = document.getElementById(currentWords[0]);
        balloon.style.backgroundImage = "url('img/typeshooterballoonpop.png')";
        balloon.style.filter = "none";
        balloon.removeChild(balloon.firstChild);
        setTimeout(() => {balloon.remove();}, 500);

        // Update balloons popped display
        balloonsPopped++;
        document.getElementById("balloonsPopped").innerHTML = "Balloons Popped: " + balloonsPopped;

        // The new currentWord (index 0) becomes the word after it
        currentWords.shift();

        // if there isn't a word to be popped, disable the input text box
        if (currentWords.length == 0) {
            document.getElementById("input").disabled = true;
        }
    }
                
    // If the input is correct
    else if (input == currentWords[0].substring(0, input.length)) {
        document.getElementById("input").style.color = "green";
    }
    // If the input is incorrect
    else if (input != currentWords[0].substring(0, input.length)) {
        document.getElementById("input").style.color = "red";
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