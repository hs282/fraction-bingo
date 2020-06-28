let answer;
let score = 0;

/**
 * @returns {String} expression
 */
function getBooleanExpression(a, b) {
    let operation = Math.round(Math.random()) ? "&&" : "||";

    let operandOne = Math.random() < 0.7 ? a : `(${getBooleanExpression(a, b)})`;
    let operandTwo = Math.random() < 0.7 ? b : `(${getBooleanExpression(a, b)})`;

    return `${operandOne} ${operation} ${operandTwo}`;
}

const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
function getRandomUniqueIdentifier(prev=[]) {
    let id = alphabet[Math.floor(Math.random() * alphabet.length)];

    if (prev.length && prev.includes(id)) {
        return getRandomUniqueIdentifier(prev);
    }

    return id;
}

/**
 * Create a new boolean expression problem to show on screen.
 */
function generateProblem() {
    let start = Math.round(Math.random()) ? "!" : "";

    let booleanExpression = start;

    let a = getRandomUniqueIdentifier();
    let b = getRandomUniqueIdentifier([ a ]);

    if (start == "!") {
        booleanExpression += `(${getBooleanExpression(a, b)})`;
    }
    else {
        booleanExpression += `${getBooleanExpression(a, b)}`;
    }

    let aInitialValue = Math.round(Math.random()) ? 1 : 0;
    let bInitialValue = aInitialValue ? 0 : 1;

    let expression = `boolean ${a} = ${!!aInitialValue};\nboolean ${b} = ${!!bInitialValue};\n\n${booleanExpression}`;

    let executableExpression = booleanExpression.replace(new RegExp(a, "g"), aInitialValue);
    executableExpression = executableExpression.replace(new RegExp(b, "g"), bInitialValue);

    answer = !!eval(executableExpression);

    console.log(answer);

    const exampleEl = document.getElementById("example");

    // clear out anything that could still be in the code prompt element
    exampleEl.innerHTML = booleanExpression;

    // add code mirror className so syntax highlighting works
    exampleEl.className = "cm-s-default";

    // run CodeMirror syntax highlighting on the code
    CodeMirror.runMode(expression, { name: "text/x-java" }, example);
}

/**
 * Answer the question.
 * @param {Boolean} input 
 */
function answerPrompt(input) {
    // show the notification alert
    const notif = document.getElementById("notification");
    notif.style.display = "";

    if (input == answer) {
        setScore(10);

        // give the user feedback that they're right
        notif.innerHTML = "That's right!";
        notif.className = "success";
    }
    else {
        setScore(-10);

        // give the user feedback that they're wrong
        notif.innerHTML = "That's wrong.";
        notif.className = "failure";
    }

    // hide the notification alert after 1 second
    setTimeout(() => notif.style.display = "none", 1000);

    generateProblem();
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

document.querySelector("#answerTrue").onclick  = () => answerPrompt(true);
document.querySelector("#answerFalse").onclick = () => answerPrompt(false);

generateProblem();