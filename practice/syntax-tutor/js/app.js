// a list of all possible problem types
const ALL_PROBLEM_TYPES = [
    "forLoop", 
    "stringQuoteMismatch", 
    "closureMismatch", 
    "equalityOperator",
    "variableName",
    // "variableType"
];

// create a CodeMirror editor that will be used by the user to make syntax corrections
const editor = CodeMirror(document.getElementById("editor"), {
    mode: { name: "text/x-java" },
    lineNumbers: true,
    indentWithTabs: true,
    indentUnit: 4,
    lineWrapping: true
});

// globals
let score = 0;
let selectedProblemTypes = JSON.parse(JSON.stringify(ALL_PROBLEM_TYPES));
let currentProblem;

// initialize UI components
generateProblem();
createProblemTypeCheckboxes();

/**
 * Generate a code example to display to the user as a syntax problem.
 */
function generateProblem() {
    // properties of problem to be generated
    let problemText, isCorrect, answer;

    // get a random problem type to generate
    let problemType = selectRandom(selectedProblemTypes);

    if (problemType == "forLoop") {
        const variants = [ "missingFirstSemi", "missingSecondSemi", "correct" ];
        let variant = selectRandom(variants);
        let bound = getRandomNumber(1, 10);

        answer = `for (int x = 0; x < ${bound}; x++) {\n\n}`;

        if (variant == "missingFirstSemi") {
            problemText = `for (int x = 0 x < ${bound}; x++) {\n\n}`;
            isCorrect = false;
        }
        else if (variant == "missingSecondSemi") {
            problemText = `for (int x = 0; x < ${bound} x++) {\n\n}`;
            isCorrect = false;
        }
        else if (variant == "correct") {
            problemText = answer;
            isCorrect = true;
        }
    }
    else if (problemType == "stringQuoteMismatch") {
        const firstQuote  = Math.round(Math.random()) ? `"` : "'";
        const secondQuote = Math.round(Math.random()) ? `"` : "'";
        const text = getRandomText();

        problemText = `${firstQuote}${text}${secondQuote}`;
        answer = `"${text}"`;

        isCorrect = firstQuote == `"` && secondQuote == `"`;
    }
    else if (problemType == "closureMismatch") {
        const openings = ["{", "(", "["];
        const closings = ["}", ")", "]"];

        let opening = selectRandom(openings);
        let closing = selectRandom(closings);

        // TODO add function call variant
        const variants = [ "ifStatement", "functionDefinition", "arrayInitialization" ];

        let variant = selectRandom(variants);

        if (variant == "ifStatement") {
            let flavorText = getRandomText();

            problemText = `if ${opening}true${closing} {\n\tSystem.out.println("${flavorText}");\n}`;
            answer = `if (true) {\n\tSystem.out.println("${flavorText}");\n}`;

            isCorrect = opening == "(" && closing == ")";
        }
        else if (variant == "functionDefinition") {
            let flavorText = getRandomText();

            problemText = `public void myFunction() ${opening}\n\tSystem.out.println("${flavorText}");\n${closing}`;
            answer = `public void myFunction() {\n\tSystem.out.println("${flavorText}");\n}`;

            isCorrect = opening == "{" && closing == "}";
        }
        else if (variant == "arrayInitialization") {
            problemText = `int[] arr = ${opening}1, 2, 3, 4, 5${closing};`;
            answer = `int[] arr = {1, 2, 3, 4, 5};`;

            isCorrect = opening == "{" && closing == "}";
        }
    }
    else if (problemType == "equalityOperator") {
        const operator = Math.round(Math.random()) ? "=" : "==";

        problemText = `if (1 ${operator} 2) {\n\tSystem.out.println("${getRandomText()}");\n}`;
        answer = `if (1 == 2) {\n\tSystem.out.println("${getRandomText()}");\n}`;

        isCorrect = operator == "==";
    }
    else if (problemType == "variableName") {
        const identifier = "myVariable";
        let noisyIdentifier = addNoise(identifier);

        problemText = `int ${identifier} = 4;\n\n${noisyIdentifier} += 5;`;
        answer = `int ${identifier} = 4;\n${identifier} += 5;`;

        isCorrect = identifier == noisyIdentifier;
    }
    // else if (problemType == "variableType") {
    //     let types = [
    //         "String",
    //         "int",
    //         "char",
    //         "bool",
    //         "float"
    //     ];

    //     let declaredType = selectRandom(types);
    //     let valueType = selectRandom(types);
    //     let value = getRandomValue(valueType);
        

    //     problemText = `${declaredType} myVariable = ${value}`;
    //     answer = 

    //     isCorrect = declaredType == valueType;
    // }

    currentProblem = {
        text: problemText,
        isCorrect: isCorrect,
        answer: answer
    };

    updatePrompt();
}

function getRandomValue(type) {
    let value;

    if (type == "String") {
        value = `"${getRandomText()}"`;
    }
    else if (type == "int") {
        value = getRandomNumber(1, 10);
    }
    else if (type == "char") {
        value = `'${selectRandom("abcdefghijklmnopqrstuvwxyz".split(""))}'`
    }
    else if (type == "boolean") {
        value = Math.round(Math.floor()) ? "true" : "false";
    }

    return value;
}

/**
 * Check the user's answer.
 * @param {String} response 
 */
function answerPrompt(response) {
    // show the notification alert
    const notif = document.getElementById("notification");
    notif.style.display = "";

    // if the code syntax is correct
    if (currentProblem.isCorrect) {
        if (response == "correct") {
            // give the user feedback that they're right
            notif.innerHTML = "That's right!";
            notif.className = "success";

            // generate a new problem
            promptText = generateProblem();
            updatePrompt(promptText);

            // add ten to score for correct answer
            setScore(10);
        }
        else {
            // give the user feedback that they're wrong
            notif.innerHTML = "That's wrong.";
            notif.className = "failure";

            // take away five points for incorrect answer
            setScore(-5);
        }
    }
    // if the problem syntax is incorrect
    else {
        if (response == "correct") {
            // give the user feedback that they're wrong
            notif.innerHTML = "That's wrong.";
            notif.className = "failure";

            // take away five points for incorrect answer
            setScore(-5);
        }
        else {
            // give the user feedback that they're right
            notif.innerHTML = "That's right!";
            notif.className = "success";

            // show the editor and focus on it
            document.getElementById("makeCorrections").style.display = "";
            editor.refresh();
            editor.focus();

            // set the value to current prompt text and go to end of line
            editor.setValue(currentProblem.text);
            editor.setCursor(editor.lineCount(), 0);

            // give five points for correct identification of improper syntax
            setScore(5);
        }
    }

    // hide the notification alert after 1 second
    setTimeout(() => notif.style.display = "none", 1000);
}

/**
* Correct the syntax of the prompt
*/
function correctPrompt() {
    // show the notification alert
    const notif = document.getElementById("notification");
    notif.style.display = "";

    // if the user types in syntatically correct code
    let code = editor.getValue().trim();
    if (code == currentProblem.answer) {
        // give the user feedback that they're right
        notif.innerHTML = "That's right!";
        notif.className = "success";

        // hide the make corrections div since we're done correcting
        document.getElementById("makeCorrections").style.display = "none";

        // generate a new problem
        promptText = generateProblem();
        updatePrompt(promptText);

        // add ten to score for correct answer
        setScore(10);
    }
    else {
        // give the user feedback that they're wrong
        notif.innerHTML = "That's wrong.";
        notif.className = "failure";

        // take away five points for incorrect answer
        setScore(-5);
    }

    // hide the notification alert after 1 second
    setTimeout(() => notif.style.display = "none", 1000);
}

/**
 * Change the score UI element.
 * @param {Number} delta 
 */
function setScore(delta) {
    // change score by delta value
    score += delta;

    // update score UI element
    document.getElementById("score").innerText = "Score: " + score;
}

/**
 * Create the problem type checkboxes that allow users to customize what types of problems they
 * get to practice.
 */
function createProblemTypeCheckboxes() {
    // create checkboxes for the user to be able to customize problem types that they practice
    ALL_PROBLEM_TYPES.forEach(problemType => {
        // create list item element
        const li = document.createElement("li");

        // create a checkbox element
        const input = document.createElement("input");
        input.type = "checkbox";
        input.id = problemType;
        input.name = problemType;
        input.value = problemType;
        input.checked = true;

        // define click action to add/remove problem type from selected problem types
        input.onclick = () => {
            // get the value of the input element
            const val = input.value;

            // if the input is checked, add to list of selected problem types
            if (input.checked) {
                selectedProblemTypes.push(val);
            }
            // if input is unchecked, remove it from the list of selected problem types
            else {
                selectedProblemTypes.splice(selectedProblemTypes.indexOf(val), 1);
            }

            // update prompt
            generateProblem();
            updatePrompt(promptText);
        }

        // create label for checkbox input
        const label = document.createElement("label");
        label.htmlFor = problemType;
        label.innerText = problemType;

        // add checkbox and label to list item
        li.appendChild(input);
        li.appendChild(label);

        // add list item to the problem types list element
        document.getElementById("problemTypes").appendChild(li);
    });
}

/**
 * Set the contents of the code prompt view to formatted code text.
 * @param {String} code 
 */
function updatePrompt() {
    const exampleEl = document.getElementById("example");

    // clear out anything that could still be in the code prompt element
    exampleEl.innerHTML = "";

    // add code mirror className so syntax highlighting works
    exampleEl.className = "cm-s-default";

    // run CodeMirror syntax highlighting on the code
    CodeMirror.runMode(currentProblem.text, { name: "text/x-java" }, example);
}

/**
 * Select and return a random element from an array.
 * @param {any[]} arr
 * @returns {any} element
 */
function selectRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Get a random number within the range.
 * @param {Number} min 
 * @param {Number} max 
 * @returns {Number} randomNum
 */
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Get random string of text.
 * @returns {String} text
 */
function getRandomText() {
    return Math.random().toString(36).replace(/[^a-z]+/g, '');
}

/**
 * Switch around a small amount of characters to add "noise".
 * @param {String} str 
 */
function addNoise(str) {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
	
    let toReturn = str;
	
    while (Math.round(Math.random())) {
        toReturn = str.replace(selectRandom(str), selectRandom(alphabet));
    }
	
    return toReturn;
}

// bind onclick functions to the buttons
document.getElementById("correct").onclick = () => answerPrompt("correct");
document.getElementById("incorrect").onclick = () => answerPrompt("incorrect");
document.getElementById("submit").onclick = correctPrompt;