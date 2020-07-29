/**
* coins objects array to hold information about the coins for the game to use
* The image source points to the change-maker directory instead of relative path so keep the path static and local
**/
const COINS = [
    {
        name: "Quarter",
        value: 25,
        img: "quarter.png",
        description : "The value is $0.25"
    },
    {
        name: "Dime",
        value: 10,
        img: "dime.png",
        description : "The value is $0.10"
    },
    {
        name: "Nickel",
        value: 5,
        img: "nickle.png",
        description : "The value is $0.05"
    },
    {
        name: "Penny",
        value: 1,
        img: "penny.png",
        description : "The value is $0.01"
    }
];

const BILLS = [
        {
            name: "One Dollar Bill",
            value: 100,
            img : "one-dollar.jpg",
            description : "The value is $1.00"
        }
];

// global variables to hold game state
let score = 0;
let targetValue = 0;
let currentValue = 0;
let booleanTimer = false;
let timeLeft = 30;
let cashierBoolean = false;
let payedAmount = 0;
let amountOfItem = 0;

/**
 * Initalize the UI on script load.
 */
function initUI() {
    const model = document.querySelector(".modal");
    model.style.display = "none";
    // initialize coin behavior UI stuff
    enableCounterDropDetection();
    createCoinElements();

    // get a new target value for the user as their target
    targetValue = getRandomNumber();
    updateReadout();

    // bind bootstrap popper.js to the tooltips
    $(`[data-toggle="tooltip"]`).tooltip({html: true, placement: "top", animation: true });

    if (booleanTimer) {
        document.getElementById("timer").style.display = "inline-block";
        setTimer();
    }
};

//to set the timer to true if race mode is enabled
function setDifficulty(str) {
    //set mode
    //race mode
    if (str == "race") {
        booleanTimer = true;
        cashierBoolean = false;
        normalDisplay();
    //cashier mode
    } else if (str == "cashier") {
        setCashierLayout();
        booleanTimer = false;
        cashierBoolean = true;
    }
    //learning mode
    else {
        booleanTimer = false;
        cashierBoolean = false;
        normalDisplay();
    }
}

//fucntion to set the timer for race mode
function setTimer() {
    let interval = setInterval(function(){
        if(timeLeft <= 0){
            clearInterval(interval);
            endGame();
        }
        document.getElementById("timer").textContent = "Time: " + timeLeft + " seconds left";
        timeLeft -= 1;
    }, 1000);

}

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

        checkCoins();

    }
}

function checkCoins() {
    // if the counting process is done
    if (Math.abs(currentValue - (targetValue * 100)) < .00000000000001) {
        // increment score
        score += 10;
        targetValue = getRandomNumber();

        // reset currentValue to zero to reset counting process
        currentValue = 0;
        //reset the timer
        if (booleanTimer) {
            timeLeft = 30;
        }

        // clear counter element to reset counting process
        document.querySelector("#counter").innerHTML = "";
    }
    updateReadout();

}

/**
 * Update the readout element which displays target value and user score.
 */
function updateReadout() {
    const scoreEl = document.querySelector("#score");
    const targetEl = document.querySelector("#target");
    const counterEl = document.querySelector("#amountOfItem");
    if(cashierBoolean) {
        targetEl.textContent = "Amount payed: $" + payedAmount;
        counterEl.textContent = "Amount of Item $" + amountOfItem;
        scoreEl.textContent = "Score: " + score;
    } else {
        scoreEl.textContent = "Score: " + score;
        targetEl.textContent = "Target Value: $" + targetValue;
    }
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

        // have tooltip show name on hover
        el.setAttribute("data-toggle", "tooltip");

        el.setAttribute("title", `${coin.name}
        <br> ${coin.description}`);

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
    const MaxBillPay = 19;
    const Bills = [1, 5, 10, 20];
    let num;

    if(!(cashierBoolean)) {
        num = Math.random() * (max - min) + min;
        num = num.toFixed(2);
    } else {
        //to set the target value as the change amount due
        num = Math.random() * MaxBillPay;
        amountOfItem = num.toFixed(2);
        for(let i = 0; i < Bills.length; i++) {
            if(Bills[i] >= num) {
                payedAmount = Bills[i];
                break;
            }
        }
        num = payedAmount - num;
        num = num.toFixed(2);

    }
    //update the html for the cashier
    updateCashierHtml(num);
    return num;
}

function updateCashierHtml() {
    //replace the target value and clock with
    const targetEl = document.querySelector("#target");
    const counterEl = document.querySelector("#amountOfItem");
    targetEl.textContent = "Amount payed: $" + payedAmount;
    counterEl.textContent = "Amount of Item $" + amountOfItem;
}

function setCashierLayout() {
    document.getElementById("cashier").style.display = "inline-block";
    document.getElementById("amountOfItem").style.display = "inline-block";
}
function normalDisplay() {
    document.getElementById("counter").style.height = "99%";
    document.getElementById("cashier").style.display = "none";
    document.getElementById("amountOfItem").style.display = "none";
}
function endGame() {
    document.getElementById("readout").style.display = "none";
    document.getElementById("container").style.display = "none";
    document.getElementById("gameOver").style.display = "block";
    document.getElementById("userScore").textContent = `Your score: ${score}`;
}
