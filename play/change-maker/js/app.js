// coins objects array to hold information about the coins for the game to use
const COINS = [
    {
        name: "Quarter",
        value: 25,
        img: "https://upload.wikimedia.org/wikipedia/commons/4/44/2014_ATB_Quarter_Obv.png"
    },
    {
        name: "Dime",
        value: 10,
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/2017-D_Roosevelt_dime_obverse_transparent.png/440px-2017-D_Roosevelt_dime_obverse_transparent.png"
    },
    {
        name: "Nicket",
        value: 5,
        img: "https://i.dlpng.com/static/png/94407_thumb.png"
    },
    {
        name: "Penny",
        value: 1,
        img: "https://i.dlpng.com/static/png/303295_preview.png"
    }
];

// global variables to hold game state
let score = 0;
let targetValue = 0;
let currentValue = 0;

/**
 * Initalize the UI on script load.
 */
(function initUI() {
    // initialize coin behavior UI stuff
    enableCounterDropDetection();
    createCoinElements();

    // get a new target value for the user as their target
    targetValue = getRandomNumber();
    updateReadout();
})();

/**
 * Enable the counter element to have draggable elements dropped on it.
 */
function enableCounterDropDetection() {
    const counterEl = document.querySelector("#counter");

    counterEl.ondragover = e => e.preventDefault();

    counterEl.ondrop = e => {
        // prevent default drop behavior
        e.preventDefault();

        // get the coin object that was dragged
        let name = e.dataTransfer.getData("coin");
        let coin = COINS.find(x => x.name == name);

        // create coin image element
        let el = document.createElement("img");
        el.className = "coin";
        el.src = coin.img;

        // position coin to where it was dropped by the user
        el.style.position = "absolute";
        el.style.left = e.clientX;
        el.style.top = e.clientY;

        // add coin to the counter element
        counterEl.appendChild(el);

        // add the value
        currentValue += coin.value;
        // remove the coin from the counter and currentValue when clicked
        el.onclick = e => {
            currentValue -= coin.value;

            counterEl.removeChild(el);
        };

        // if the counting process is done
        if (Math.abs(currentValue - (targetValue * 100)) < .00000000000001) {
            // increment score
            score += 10;
            targetValue = getRandomNumber();

            // reset currentValue to zero to reset counting process
            currentValue = 0;

            // clear counter element to reset counting process
            document.querySelector("#counter").innerHTML = "";
        }

        // update the readout
        updateReadout();
    }
}

/**
 * Update the readout element which displays target value and user score.
 */
function updateReadout() {
    const scoreEl = document.querySelector("#score");
    const targetEl = document.querySelector("#target");

    scoreEl.textContent = "Score: " + score;
    targetEl.textContent = "Target Value: $" + targetValue;
}

/**
 * Create the coin elements in the register element for the user to drag and
 * drop onto the counter element.
 */
function createCoinElements() {
    const registerEl = document.querySelector("#register");

    COINS.forEach(coin => {
        // create an image element
        let el = document.createElement("img");
        el.className = "coin";
        el.src = coin.img;

        // bind drag action with code snippet transfer to instrument
        el.ondragstart = e => e.dataTransfer.setData("coin", coin.name);

        // add the instrument to the instruments element
        registerEl.appendChild(el);
    });
}

/**
 * Get a random number that is between 0 and 4. This is used for target values.
 * @returns {Number} randomNumber
*/
function getRandomNumber() {
    const min = 0;
    const max = 4;

    let num = Math.random() * (max - min) + min;
    num = num.toFixed(2);

    return num;
}
