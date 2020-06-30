const types = [ "integer", "decimal", "fraction" ];

const operations = [
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
    }
];

const OPERATION_SETTINGS = [];
types.forEach(type => {
    operations.forEach(operation => {
        let obj = {};

        obj.name = operation.name;
        obj.type = type;
        obj.sign = operation.sign;
        obj.difficultyLevel = 1;

        // integer operations are enabled by default
        obj.enabled = type == "integer";

        OPERATION_SETTINGS.push(obj);
    });
});

const ALLOW_NEGATIVE_NUMBERS = false;

// references to HTML elements
const problemEl = document.querySelector("#problem");
const inputEl = document.querySelector("#input");
const changeSettingsEl = document.querySelector("#changeSettingsView");

/**
 * Initialize the UI components when the script is loaded.
 */
(function initUI() {
    // create a new problem and show it to the user
    newProblem();

    createProblemDifficultyAdjusters();

    // whenever the user types something, check their answer
    inputEl.oninput = checkAnswer;

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
        changeSettingsEl.innerText = "View Integer Operation Settings";

        customizeProblemTypesEl.innerText = "Customize Fraction Problem Types";
        document.querySelector("#fraction").classList.remove("hide");
    }
    else if (buttonText.includes("Integer")) {
        changeSettingsEl.innerText = "View Decimal Operation Settings";

        customizeProblemTypesEl.innerText = "Customize Integer Problem Types";
        document.querySelector("#integer").classList.remove("hide");
    }
}

/**
 * Check the user's answer.
 */
function checkAnswer() {
    // get the user's answer and the actual answer
    let userAnswer = inputEl.value;
    let actualAnswer = getAnswer();

    // if the user answers with a fraction, calculate decimal form
    if (userAnswer.includes("/")) {
        userAnswer = eval(userAnswer);
    }

    // if the user's answer is correct with float tolerance taken into account as well
    if (Math.abs(userAnswer - actualAnswer) < .00000000000001) {
        newProblem();
    }
    // if the user's answer is incorrect
    else {
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

    // randomly select an enabled operation
    let possibleOperations = OPERATION_SETTINGS.filter(operation => operation.enabled);
    let operation = selectRandom(possibleOperations);

    // get operands for that operation
    let [ operandOne, operandTwo ] = getOperands(operation);

    // set the problem display to the newly generated problem
    problemEl.innerHTML = `${operandOne} ${operation.sign} ${operandTwo} = ?`;
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
                operands = getOperands(operation);
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
    // if no special validation is needed
    else {
        operands[0] = getRandomNumber(0, 10 * difficultyLevel, operation.type);
        operands[1] = getRandomNumber(0, 10 * difficultyLevel, operation.type);
    }

    return operands;
}

/**
 * Calculate the answer to the problem that is currently being shown to the user.
 * @returns {Number} answer
 */
function getAnswer() {
    // get the mathematical problem from the problem text shown to the user
    // also replace fractional sign with division sign
    let problem = problemEl.innerHTML.replace(" = ?", "").replace(new RegExp("⁄", "g"), " / ");

    // TODO Fix fraction division answer calculation

    // create a function object and execute it to get the answer
    let answer = new Function(`return ${problem}`)();

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

        num = `${numerator}&frasl;${denominator}`;
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