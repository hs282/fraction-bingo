let words = [
    "Adult", "Airplane", "Air", "Aircraft", "Airforce", "Airport", "Album", "Alphabet", "Apple", "Arm", "Army", "Baby", "Baby", "Backpack", "Balloon", "Banana", "Bank", "Barbecue", "Bathroom", "Bathtub", "Bed", "Bee", "Bible", "Bible", "Bird", "Bomb", "Book", "Boss", "Bottle", "Bowl", "Box", "Boy", "Brain", "Bridge", "Butterfly", "Button", "Cappuccino", "Car", "Card", "Carpet", "Carrot", "Cave", "Chair", "Chess", "Chief", "Child", "Chisel", "Chocolates", "Church", "Church", "Circle", "Circus", "Circus", "Clock", "Clown", "Coffee", "Comet", "Compact", "Compass", "Computer", "Crystal", "Cup", "Cycle", "Database", "Desk", "Diamond", "Dress", "Drill", "Drink", "Drum", "Dung", "Ears", "Earth", "Egg", "Electricity", "Elephant", "Eraser", "Explosive", "Eyes", "Family", "Fan", "Feather", "Festival", "Film", "Finger", "Fire", "Floodlight", "Flower", "Foot", "Fork", "Freeway", "Fruit", "Fungus", "Game", "Garden", "Gas", "Gate", "Gemstone", "Girl", "Gloves", "God", "Grapes", "Guitar", "Hammer", "Hat", "Hieroglyph", "Highway", "Horoscope", "Horse", "Hose", "Ice", "Icicle", "Insect", "Jet", "Junk", "Kaleidoscope", "Kitchen", "Knife", "Leather", "Leg", "Library", "Liquid", "Magnet", "Man", "Map", "Maze", "Meat", "Meteor", "Microscope", "Milk", "Milkshake", "Mist", "Money", "Monster", "Mosquito", "Mouth", "Nail", "Navy", "Necklace", "Needle", "Onion", "Paint", "Pants", "Parachute", "Passport", "Pebble", "Pendulum", "Pepper", "Perfume", "Pillow", "Plane", "Planet", "Pocket", "Poster", "Potato", "Printer", "Prison", "Pyramid", "Radar", "Rainbow", "Record", "Restaurant", "Rifle", "Ring", "Robot", "Rock", "Rocket", "Roof", "Room", "Rope", "Saddle", "Salt", "Sandpaper", "Sandwich", "Satellite", "School", "Ship", "Shoes", "Shop", "Shower", "Signature", "Skeleton", "Snail", "Software", "Solid", "Space", "Spectrum", "Sphere", "Spice", "Spiral", "Spoon", "Sports", "Spot", "Square", "Staircase", "Star", "Stomach", "Sun", "Sunglasses", "Surveyor", "Swimming", "Sword", "Table", "Tapestry", "Teeth", "Telescope", "Television", "Tennis", "Thermometer", "Tiger", "Toilet", "Tongue", "Torch", "Torpedo", "Train", "Treadmill", "Triangle", "Tunnel", "Typewriter", "Umbrella", "Vacuum", "Vampire", "Videotape", "Vulture", "Water", "Weapon", "Web", "Wheelchair", "Window", "Woman", "Worm"
];
            
let wordDiffLevel;
let currentWord;
let balloonsPopped = 0;
const sectors = ["sector_one", "sector_two", "sector_three"];

(function initUI() {
    // show instructions modal
    $("#myModal").modal("show");
})();

/**
 * Starts the Type Shooter game loop
 */
function startGame() {
    // Shuffle words list
    words = shuffle(words);

    // Spawn a new balloon every three seconds
    setInterval(spawnBalloon(), 3000);

    const el = document.getElementById('input');

    // always be focused on the input
    el.focus();
    el.onblur = () => setTimeout(() => el.focus());
}
            
/**
 * Create a balloon and show it on screen.
 */
function spawnBalloon() {
    // Get current word
    currentWord = words.pop().toLowerCase();
                
    // Calculate word difficulty
    if (currentWord.length < 4) {
        wordDiffLevel = 0;
    }
    else if (currentWord.length > 4 && currentWord.length < 6) {
        wordDiffLevel = 1;
    }
    else {
        wordDiffLevel = 2;
    }

    // Create balloon and add word into it
    let balloon = document.createElement("div");
    let text = document.createElement("span");
    text.appendChild(document.createTextNode(currentWord));
    balloon.appendChild(text);
                
    // Style the balloon
    balloon.id = currentWord;
    balloon.style.height = "150px";
    balloon.style.width = "150px";
    balloon.style.backgroundImage = "url('balloon.png')";
    balloon.style.backgroundSize = "contain";
    balloon.style.backgroundRepeat = "no-repeat";
    balloon.style.backgroundPosition = "center";
    balloon.style.filter = 'hue-rotate(' + Math.random() * 360 + 'deg)';
    balloon.style.position = "absolute";
    balloon.style.left = Math.random() * 90 + "%";
                
    // Vertically center the text in the balloon
    text.style.position = "relative";
    text.style.top = "30%";
                
    // Place balloon in random sector based on word difficulty level
    document.getElementById(sectors[Math.floor(Math.random() * (3 - wordDiffLevel))]).appendChild(balloon);
}

/**
 * Whenever the user types into the input element.
 */
document.getElementById("input").addEventListener('keyup', () => {
    let input = document.getElementById("input").value;
    input = input.trim().toLowerCase();
                    
    if (input == currentWord) {
        // Clear input box
        document.getElementById("input").value = "";
        document.getElementById("input").parentNode.style.color = "";
                    
        // Delete balloon
        document.getElementById(currentWord).remove();
                    
        // Spawn new balloon
        spawnBalloon();
                    
        // Update balloons popped display
        balloonsPopped++;
        document.getElementById("balloonsPopped").innerHTML = "Balloons Popped: " + balloonsPopped;
                    
        // // Move the player div
        // $("#player").animate({
        //     "left": newLeft
        // }, 200, "linear");
    }
                
    // If the input is correct
    else if (input == currentWord.substring(0, input.length)) {
        document.getElementById("input").style.color = "green";
    }
    // If the input is incorrect
    else if (input != currentWord.substring(0, input.length)) {
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