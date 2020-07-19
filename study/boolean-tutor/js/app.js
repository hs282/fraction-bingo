const exampleEl = document.getElementById("example");

const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");

// the starting probability of boolean expression nesting
const EASY_DIFF_NESTING_PROBABILITY = 0.80;

// the rate in which the nesting probability diminishes each recursive step
const PROB_DECAY = 0.50;

// global state variable
let answer;
let score = 0;

/**
 * Initialize UI components when the script starts.
 */
(function initUI() {
    document.querySelector("#answerTrue").onclick  = () => answerPrompt(true);
    document.querySelector("#answerFalse").onclick = () => answerPrompt(false);

    generateProblem();
})();

/**
 * Recursively create an evaluateable boolean expression.
 * @param {String[]} operands
 * @param {Number} nestingProbability
 * @returns {String} expression
 */
function getBooleanExpression(operands, nestingProbability) {
    // generate boolean expressions from the given operands
    let expressions = operands.map(x => {
        // if number is under the probabilty threshold, generate nested expression
        if (Math.random() < nestingProbability) {
            return `(${getBooleanExpression(operands, nestingProbability - PROB_DECAY)})`;
        }
        else {
            return x;
        }
    });

    // choose the boolean operations that will be performed between expressions
    let operations = operands.map(_ => {
        // flip a coin to choose
        if (Math.round(Math.random())) {
            return " && ";
        }
        else {
            return " || ";
        }
    });

    // combine the expressions and operations together
    return expressions.reduce((a, b, i) => [a, b].join(operations[(i - 1) % operations.length]));
}

/**
 * Create a new boolean expression problem to show on screen.
 */
function generateProblem() {
    let start = Math.round(Math.random()) ? "!" : "";

    let booleanExpression = start;

    // generate a random number of operands depending on difficulty level
    // TODO skew towards lower numbers? and change based on diff level
    let min = 2, max = 2;
    let numOperands = Math.floor(Math.random() * (max - min + 1)) + min;
    
    // generate array of unique operand identifiers
    let operands =[...Array(numOperands).keys()].reduce((ids, _) => {
        ids.push(getRandomUniqueIdentifier(ids));

        return ids;
    }, []);

    // if starts with negation, there needs to be parenthesis around the expression
    if (start == "!") {
        booleanExpression += `(${getBooleanExpression(operands, EASY_DIFF_NESTING_PROBABILITY)})`;
    }
    else {
        booleanExpression += `${getBooleanExpression(operands, EASY_DIFF_NESTING_PROBABILITY)}`;
    }

    // generate initial values for the operands
    let initValues = operands.map(_ => Math.round(Math.random()) ? 1 : 0);

    // if all initial values are true, make one false
    if (initValues.every(x => x === 1)) {
        initValues[Math.floor(Math.random() * initValues.length)] = 0;
    }
    // if all initial values are false, make one true
    else if (initValues.every(x => !x)) {
        initValues[Math.floor(Math.random() * initValues.length)] = 1;
    }

    // create the boolean expression
    let expression = initValues.reduce((acc, curr, i) => {
        return acc + `boolean ${operands[i]} = ${!!curr};\n`;
    }, "");
    expression += `\n${booleanExpression}`;

    // create an executable javascript boolean expression to eval()
    let executableExpression = operands.reduce((acc, curr, i) => {
        return acc.replace(new RegExp(curr, "g"), initValues[i]);
    }, booleanExpression);

    // evaluate the expression and make that the answer
    answer = !!eval(executableExpression);

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

/**
 * Get a random one-letter identifier that does is not a duplicate of
 * any ones in the prev array.
 * @param {String[]} prev 
 * @returns String
 */
function getRandomUniqueIdentifier(prev) {
    let id = alphabet[Math.floor(Math.random() * alphabet.length)];

    if (prev.length && prev.includes(id)) {
        return getRandomUniqueIdentifier(prev);
    }

    return id;
}