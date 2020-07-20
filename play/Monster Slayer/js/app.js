//jshint esversion: 6

const APP_NAME = "monsterSlayer";
const DM = new DataManager(APP_NAME);

const TYPES = [ "integer", "decimal", "fraction", "exponent" ];

const OPERATIONS = [
    {
        name: "addition",
        sign: "+"
    },
    {
        name: "subtraction",
        sign: "-"
    },
    {
        name: "multiplication",
        sign: "*"
    },
    {
        name: "division",
        sign: "/"
    },
];

const OPERATION_SETTINGS = [];
TYPES.forEach(type => {

    if (type != "exponent") {
        OPERATIONS.forEach(operation => {
            let obj = {};

            obj.name = operation.name;
            obj.type = type;
            obj.sign = operation.sign;
            obj.difficultyLevel = 1;

            // integer operations are enabled by default
            obj.enabled = type == "integer";

            OPERATION_SETTINGS.push(obj);
        })
    }
    else {
        // custom singular object for exponent settings
        let exponentSettings = {
            name: type,
            type: type,
            sign: "^",
            difficultyLevel: 1,
            enabled: false
        };

        OPERATION_SETTINGS.push(exponentSettings);
    }
});

const ALLOW_NEGATIVE_NUMBERS = false;

//* Global Variables //*

// monsters slain
let slainMonsters = 0;

// last monster shown
let lastMonster = null;

// monster hp
let totalMonsterHP, currentMonsterHP = 0;

// player hp
let currentPlayerHP = 100;
let totalPlayerHP = 100;

// array of monster image names
let monsterArr = [
  "monster1.jpg", "monster2.png", "monster3.jpg"
]

// current problem
let currentProblem = {
  operandOne: "",
  operandTwo: "",
  sign: "",
  answer: "",

  // holds formatted fraction strings
  fractions: [],

  isCorrect: ""
};

// array of answered problems
let answeredProblems = [];

// references to HTML elements
const problemEl = document.querySelector("#problem");
const inputEl = document.querySelector("#input");
const changeSettingsEl = document.querySelector("#changeSettingsView");
const timerEl = document.querySelector("#gameTimer");
const countdownEl = document.querySelector("#countdown");
const startingEl = document.querySelector("#startScreen");
const startButtonEl = document.querySelector("#startButton");
const slainMonstersEl = document.querySelector("#slainMonsters");
const resultEl = document.querySelector("#resultScreen");
const totalScoreEl = document.querySelector("#totalScore");
const highScoreEl = document.querySelector("#highScore");
const problemsAnsweredEl = document.querySelector("#problemsAnswered");
const correctProblemsEl = document.querySelector("#correctProblems");
const correctProblemListEl = document.querySelector("#correctProblemList");
const endButtonEl = document.querySelector("#endButton");
const resetButtonEl = document.querySelector("#resetButton");
const hpBarsEl = document.querySelector("#hpBars");
const playerHPBarEl = document.querySelector("#playerHPBar");
const monsterHPBarEl = document.querySelector("#monsterHPBar");
const monsterImgEl = document.querySelector("#monsterIMG");
const totalMonstersSlainEl = document.querySelector("#totalMonstersSlain");

/**
 * Initialize the UI components when the script is loaded.
 */
(function initUI() {
    // starting sequence
    startScreen();

    // get monster
    getMonster();

    // create a new problem and show it to the user
    newProblem();

    createProblemDifficultyAdjusters();

    // whenever the user types something, check their answer
    // inputEl.oninput = checkAnswer;

    // on enter, check user answer
    inputEl.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            checkAnswer();
        }
    });

    // always stay focused on input element
    // inputEl.onblur = () => inputEl.focus();

    changeSettingsEl.onclick = changeSettingsView;
})();

/**
 * Create the problem difficulty adjuster components in the footer.
 */
function createProblemDifficultyAdjusters() {
    // reference to problemTypes div to show the difficulty adjusters
    const problemTypesEl = document.getElementById("problemTypes");

    // group by problem types
    let problemTypes = OPERATION_SETTINGS.reduce((groups, item) => {
        const operationType = item.type;

        groups[operationType] = groups[operationType] || [];
        groups[operationType].push(item);

        return groups;
    }, {});

    Object.entries(problemTypes).forEach(([ type, operations ]) => {
            let el = document.createElement("ul");
            el.id = type;
            problemTypesEl.appendChild(el);
            el.className = "hide";

            operations.forEach(operation => {
                let li = document.createElement("li");

                // create checkbox to enable or disable
                let enablingCheckbox = document.createElement("input");
                enablingCheckbox.type = "checkbox";
                enablingCheckbox.id = operation.name;
                enablingCheckbox.name = operation.name;
                enablingCheckbox.value = operation.name;
                enablingCheckbox.checked = operation.enabled;

                // create a function to handle checkbox click
                enablingCheckbox.onclick = () => {
                    // change the operation enable state to the checkbox checked state
                    operation.enabled = enablingCheckbox.checked;

                    // create problem with new edited operations
                    newProblem();
                }

                // create number input to change the difficulty level
                let difficultyInput = document.createElement("input");
                difficultyInput.type = "number";
                difficultyInput.value = operation.difficultyLevel;
                difficultyInput.min = 1;
                difficultyInput.max = 5;

                // create a function to handle number changes
                difficultyInput.oninput = () => {
                    // set the operation difficulty level to the inputted value
                    operation.difficultyLevel = difficultyInput.value;

                    // create problem with new edited operations
                    newProblem();
                }

                // create label with name of the operation
                let operationLabel = document.createElement("label");
                operationLabel.htmlFor = operation.name;
                operationLabel.innerText = getProperCapitalization(operation.name);

                // add checkbox and label to list item
                li.appendChild(enablingCheckbox);
                li.appendChild(operationLabel);
                li.appendChild(difficultyInput);

                // add list item to the problem types list element
                el.appendChild(li);
            });
    });

    problemTypesEl.querySelectorAll("ul.hide")[0].classList.toggle("hide");
}

/**
 * Change the settings view to a different number type.
 */
function changeSettingsView() {
    // customize X problem types span
    const customizeProblemTypesEl = document.querySelector("#customizeProblemTypes");

    // hide all the checkbox lists
    problemTypes.querySelectorAll("#problemTypes ul").forEach(el => el.classList.add("hide"));

    // change the mode to whatever the button says
    let buttonText = changeSettingsEl.innerText;
    if (buttonText.includes("Decimal")) {
        changeSettingsEl.innerText = "View Fraction Operation Settings";

        customizeProblemTypesEl.innerText = "Customize Decimal Problem Types";
        document.querySelector("#decimal").classList.remove("hide");
    }
    else if (buttonText.includes("Fraction")) {
        changeSettingsEl.innerText = "View Exponent Operation Settings";

        customizeProblemTypesEl.innerText = "Customize Fraction Problem Types";
        document.querySelector("#fraction").classList.remove("hide");
    }
    else if (buttonText.includes("Integer")) {
        changeSettingsEl.innerText = "View Decimal Operation Settings";

        customizeProblemTypesEl.innerText = "Customize Integer Problem Types";
        document.querySelector("#integer").classList.remove("hide");
    }
    else if (buttonText.includes("Exponent")) {
        changeSettingsEl.innerText = "View Integer Operation Settings";

        customizeProblemTypesEl.innerText = "Customize Exponent Problem Types";
        document.querySelector("#exponent").classList.remove("hide");
    }
}

/**
 * Check the user's answer.
 */
function checkAnswer() {
    // get the user's answer and the actual answer
    let userAnswer = inputEl.value;
    let actualAnswer = currentProblem.answer;

    // if the user answers with a fraction, calculate decimal form
    if (userAnswer.includes("/")) {
        userAnswer = eval(userAnswer);
    }

    // if the user's answer is correct with float tolerance taken into account as well
    if (Math.abs(userAnswer - actualAnswer) < .00000000000001) {

        damageMonster();
        healPlayer();

        // store the current problem
        storeProblem(true,currentProblem.answer);

        newProblem();
    }
    // if the user's answer is incorrect
    else {
        damagePlayer()

        inputEl.value = "";

        // store the current problem
        storeProblem(false, eval(userAnswer));

        inputEl.style.border = "2px solid rgba(255, 0, 0, .75)";
    }
}

/**
 * Generate a new problem and show it to the user.
 */
function newProblem() {
    // reset input element to default state
    inputEl.value = "";
    inputEl.style.border = "";

    // reset current problem
    currentProblem.operandOne = "";
    currentProblem.operandTwo = "";
    currentProblem.sign = "";
    currentProblem.answer = "";
    currentProblem.fractions = [];

    // randomly select an enabled operation
    let possibleOperations = OPERATION_SETTINGS.filter(operation => operation.enabled);
    let operation = selectRandom(possibleOperations);

    // get operands for that operation
    let [ operandOne, operandTwo ] = getOperands(operation);

    // log current problem
    currentProblem.operandOne = operandOne;
    currentProblem.operandTwo = operandTwo;
    currentProblem.sign = operation.sign;
    currentProblem.answer = getAnswer();

    // apply fraction formatting
    if (operation.type == "fraction") {
      operandOne = currentProblem.fractions[0];
      operandTwo = currentProblem.fractions[1];
    }

    // set the problem display to the newly generated problem
    if (operation.type != "exponent") {
      problemEl.innerHTML = `${operandOne} ${operation.sign} ${operandTwo} = ?`;
    }
    else {
      problemEl.innerHTML = `${operandOne}<sup>${operandTwo}</sup> = ?`;
    }
}

/**
 * Get proper operands depending on the operation.
 * @param {String} operation
 * @returns {Number[]} operands
 */
function getOperands(operation) {
    // array to store the two operands to be generated
    let operands = [];

    // get the difficulty level of the operation
    let difficultyLevel = operation.difficultyLevel;

    // subtraction needs special validation for negative results if ALLOW_NEGATIVE_NUMBERS is false
    if (operation.name == "subtraction") {
        operands[0] = getRandomNumber(0, 10 * difficultyLevel, operation.type);
        operands[1] = getRandomNumber(0, 10 * difficultyLevel, operation.type);

        // validate operands if user is not practicing with negative numbers
        if (ALLOW_NEGATIVE_NUMBERS == false) {
            // if the second operand is greater, then the result would be negative, which is not allowed in this mode
            if (operands[0] < operands[1]) {
                // if fractions, just switch them
                if (operation.type == "fraction") {
                    // switch the actual numbers
                    let temp = operands[0];
                    operands[0] = operands[1];
                    operands[1] = temp;

                    // switch the formatted strings
                    temp = currentProblem.fractions[0];
                    currentProblem.fractions[0] = currentProblem.fractions[1];
                    currentProblem.fractions[1] = temp;
                }
                else {
                    operands = getOperands(operation);
                }
            }
        }
    }
    // division needs special validation to make sure operands are actually divisible by each other
    else if (operation.name == "division") {
        // second operand cannot be zero since you cannot divide by zero
        operands[0] = getRandomNumber(0, 10 * difficultyLevel, operation.type);
        operands[1] = getRandomNumber(1, 10 * difficultyLevel, operation.type);

        // if the operands are not divisible by each other, generate another
        if (operands[0] % operands[1] !== 0 && operation.type != "fraction") {
            operands = getOperands(operation);
        }
    }
    // exponent problems need a smaller power for easier math
    else if (operation.name == "exponent") {
      operands[0] = getRandomNumber(0, 10 * difficultyLevel, operation.type);
      operands[1] = getRandomNumber(0, 4 * difficultyLevel, operation.type);
    }
    // if no special validation is needed
    else {
        operands[0] = getRandomNumber(0, 10 * difficultyLevel, operation.type);
        operands[1] = getRandomNumber(0, 10 * difficultyLevel, operation.type);
    }

    return operands;
}

/**
 * Calculates answer to current problem
 * @returns {Number}
 */
function getAnswer() {
    let answer;

    // if problem is an exponent
    if (currentProblem.sign == "^") {
        answer = Math.pow(currentProblem.operandOne, currentProblem.operandTwo);
    }
    else {
        answer = eval(currentProblem.operandOne + currentProblem.sign + currentProblem.operandTwo);
    }

    return answer;
}

/**
 * Given an array, it selects a random element and returns it.
 * @param {any[]} items
 * @returns {any} randomItem
 */
function selectRandom(items) {
    return items[Math.floor(Math.random() * items.length)];
}

/**
 * Get a random number [min, max].
 * @param {Number} min
 * @param {Number} max
 * @returns {Number}
 */
function getRandomNumber(min, max, type) {
    let num;

    if (type == "decimal") {
        num = Math.random() * (max - min) + min;
        num = num.toFixed(1);
    }
    else if (type == "fraction") {
        let numerator = Math.floor(Math.random() * (max - min + 1)) + min;

        // prevent a zero in the denominator
        if (min === 0) {
            min = 1;
        }

        let denominator = Math.floor(Math.random() * (max - min + 1)) + min;

        currentProblem.fractions.push(`${numerator}&frasl;${denominator}`);
        num = numerator / denominator;
    }
    else {
        num = Math.floor(Math.random() * (max - min + 1)) + min;
    }

    return num;
}

/**
 * Capitalizes the first letter of the word.
 * @param {String} str
 * @returns {String} properCaptitalizedStr
 */
function getProperCapitalization(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Display start screen, then initial countdown.
 */
function startScreen() {
    // Hide result screen
    resultEl.classList.toggle("hide");
    toggleProblems();
    startButtonEl.onclick = countdown;
    endButtonEl.onclick = endGame;
}

// Just for development purposes
function skipCountdown() {
    startingEl.classList.toggle("hide");
    countdownEl.classList.toggle("hide");
  toggleProblems();
}

/**
 * Counts down from 3, then starts game
 */
function countdown() {
    let count = 3;
    startingEl.classList.toggle("hide");

    countdownEl.innerHTML = count;

    const INTERVAL = setInterval( () => {
        count--;

        if (count < 1) {
            clearInterval(INTERVAL);
            countdownEl.classList.toggle("hide");

            // show the UI
            toggleProblems();
            // startTimer();
        }

        countdownEl.innerHTML = count;

    }, 1000);
}

/**
  * Ends the game
  */
function endGame() {
  resultScreen();
}

/**
 * Toggles the problem, timer, and score elements
 */
function toggleProblems() {
    inputEl.classList.toggle("hide");
    inputEl.focus();
    problemEl.classList.toggle("hide");
    endButtonEl.classList.toggle("hide");
    hpBarsEl.classList.toggle("hide");
}

/**
 * Stores the current problem in the answered problems array
 * @param {Boolean} isCorrect is the answer correct or not
 * @param {Number/String} answer either the real answer, or the user's wrong answer
 */
function storeProblem(isCorrect, answer) {
    // creating a new temporary object for storage
    let tempCurrentProblem = {
        operandOne: currentProblem.operandOne,
        operandTwo: currentProblem.operandTwo,
        sign: currentProblem.sign,
        answer: answer,
        fractions: currentProblem.fractions,
        isCorrect: isCorrect
    }
    answeredProblems.push(tempCurrentProblem);
}

/**
 * Ends game, shows all answered problems and score
 * @param {Interval object} 60 second timer
 */
function resultScreen() {

    let correctProblems = 0;

    toggleProblems();
    resultEl.classList.toggle("hide");

    // If high score exists
    if (DM.getItem("kills") != undefined) {
        // If high score is less than current score
        if (DM.getItem("kills") < slainMonsters) {
            DM.saveItem("kills", slainMonsters);
        }
        highScoreEl.innerHTML = "Highest Monsters Slain: " + DM.getItem("kills");
    }
    // Save score if no high score
    else {
      DM.saveItem("kills", slainMonsters);
    }

    resetButtonEl.onclick = reset;

    answeredProblems.forEach( (problem) => {
        let answer;
        let li = document.createElement("li");
        li.classList.add("list-group-item");

        // if exponent problem
        if (problem.sign == "^") {
            answer = `${problem.operandOne}<sup>${problem.operandTwo}</sup> = ` + problem.answer;
        }
        // if it's a fraction problem
        else if (problem.fractions.length) {
            answer = problem.fractions[0] + " " + problem.sign + " " + problem.fractions[1] + " = " + fractionize(problem.answer);
        }
        // normal problem
        else {
              answer = problem.operandOne + " " + problem.sign + " " + problem.operandTwo + " = " + parseFloat(problem.answer.toPrecision(10));
        }

        // check if answer is correct or not
        if (problem.isCorrect) {
            li.classList.add("list-group-item-success");
            correctProblems++;
        }
        else {
          li.classList.add("list-group-item-danger");
        }

        li.innerHTML = answer;
        correctProblemListEl.appendChild(li);
    })

    problemsAnsweredEl.innerHTML = "Problems Answered Correctly: " +  correctProblems;
    totalMonstersSlainEl.innerHTML = "Total Monsters Slain: " + slainMonsters;
}

/**
 * Converts a decimal into a formatted fraction string via Stern-Brocot Binary Search Tree
 * @param {Number} decimal to be converted
 * @return {string}
 */
function fractionize(decimal) {
    // desired precision
    let error = 0.000001;

    let numerator, denominator;
    let roundedDecimal = parseInt(Math.floor(decimal));
    decimal -= roundedDecimal;

    // If integer
    if (decimal < error) {
        return (roundedDecimal);
    }

    // The lower fraction limit is 0/1
    lowerNumerator = 0;
    lowerDenominator = 1;

    // The upper fraction limit is 1/1
    upperNumerator = 1;
    upperDenominator = 1;

    while (true) {
        // The middle fraction is (lowerNumerator + upperNumerator) / (lowerDenominator + upperDenominator)
        let middleNumerator = lowerNumerator + upperNumerator;
        let middleDenominator = lowerDenominator + upperDenominator;

        // if decimal + error < middle
        if (middleDenominator * (decimal + error) < middleNumerator) {
            // middle is our new upper
            upperNumerator = middleNumerator;
            upperDenominator = middleDenominator;
        }
        // else if middle < decimal - error
        else if (middleNumerator < (decimal - error) * middleDenominator) {
            // middle is our new lower
            lowerNumerator = middleNumerator;
            lowerDenominator = middleDenominator;
        }
        // else middle is our best fraction approximation
        else {
            numerator = (roundedDecimal * middleDenominator + middleNumerator);
            denominator = (middleDenominator);

            return `${numerator}&frasl;${denominator}`
        }
    }
}

/**
 * Resets the game
 */
function reset() {
    answeredProblems = [];
    startingEl.classList.toggle("hide");
    countdownEl.classList.toggle("hide");
    countdownEl.innerHTML = ""
    currentPlayerHP = 100;
    slainMonsters = 0;

    // clear list of answered problems
    while (correctProblemListEl.firstChild) {
        correctProblemListEl.removeChild(correctProblemListEl.lastChild);
    }
    toggleProblems();
    startScreen();
    getMonster();
}

/**
  * Generates a new monster
  */
function getMonster() {

    // Generate new monster HP
    totalMonsterHP = Math.floor(Math.random() * 100) + 1;
    currentMonsterHP = totalMonsterHP;

    let index = Math.floor(Math.random() * (monsterArr.length));

    // ensuring different monster from last time
    while (lastMonster == index) {
        index = Math.floor(Math.random() * (monsterArr.length));
    }

    lastMonster = index;

    monsterImgEl.src = "img/" + monsterArr[index];
    monsterImgEl.className = "formatImg"
    monsterHPBarEl.className = "progress-bar progress-bar-striped progress-bar-animated bg-success";
    monsterHPBarEl.style.width = (currentMonsterHP / totalMonsterHP).toFixed(2) * 100 + "%";
    monsterHPBarEl.setAttribute("aria-valuenow", (currentMonsterHP / totalMonsterHP).toFixed(2) * 100 + "");
}

/**
 * Damages monster
 */
function damageMonster() {
   $("#monsterIMG").effect("shake");

   // Inflict damage
   currentMonsterHP -= 10;
   let percentage = ((currentMonsterHP / totalMonsterHP) * 100).toFixed(2);

   // Update progress bar
   monsterHPBarEl.style.width = (currentMonsterHP / totalMonsterHP).toFixed(2) * 100 + "%";
   monsterHPBarEl.setAttribute("aria-valuenow", (currentMonsterHP / totalMonsterHP).toFixed(2) * 100 + "");

   if (percentage <= 0) {
       slainMonsters++;
       slainMonstersEl.innerHTML = "Monsters Slain: " + slainMonsters;
       getMonster();
   }
   else if (percentage < 33.33)
       monsterHPBarEl.className = "progress-bar progress-bar-striped progress-bar-animated bg-danger";
   else if (percentage > 66.66)
       monsterHPBarEl.className = "progress-bar progress-bar-striped progress-bar-animated bg-success";
   else if (33.33 < percentage < 66.66)
       monsterHPBarEl.className = "progress-bar progress-bar-striped progress-bar-animated bg-warning";
}

 /**
  * Damages player
  */
function damagePlayer() {
   $("#input").effect("shake");
   currentPlayerHP -= 10;
   updatePlayerHP();
}

/**
 * Add health back to player
 */
function healPlayer() {
    currentPlayerHP += 2;
    updatePlayerHP();
}

/**
 * Updates the player's hp
 */
function updatePlayerHP() {
    let percentage = ((currentPlayerHP / totalPlayerHP) * 100).toFixed(2);

    // Update progress bar
    playerHPBarEl.style.width = (currentPlayerHP / totalPlayerHP).toFixed(2) * 100 + "%";
    playerHPBarEl.setAttribute("aria-valuenow", (currentPlayerHP / totalPlayerHP).toFixed(2) * 100 + "");

    if (percentage <= 0)
        endGame();
    else if (percentage < 33.33)
        playerHPBarEl.className = "progress-bar bg-danger";
    else if (percentage > 66.66)
        playerHPBarEl.className = "progress-bar bg-success";
    else if (33.33 < percentage < 66.66)
        playerHPBarEl.className = "progress-bar bg-warning";
}
