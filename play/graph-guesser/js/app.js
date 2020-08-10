
let globalEquation = "";
let playerScore = 0;

const PROBLEM_TYPES = ["linear", "quadratic", "cubic", "quartic", "exponential", "logarithmic"];
const SCORE_INCREASE = 20;
const SCORE_DECREASE = 1;
/**
 * Initialize the UI on script load.
 */
(function initUI() {
    // show instructions modal
    $("#myModal").modal("show");

    playerScore = 0;
    generateProblem();
})();

// TODO make the graph height take up more room on the page
// TODO footer mode checkboxes like in SpeedyMath
// TODO footer difficulty modes like in SpeedyMath
// TODO add feedback alerts from Tutor programs
// TODO Add score from Tutor programs
// TODO find better place to put the guess input box?

/**
 * Whenever the equation form is submitted, draw the equation.
 */
document.getElementById("form").onsubmit = event => {
    event.preventDefault();

    let equation = document.querySelector("#eq").value;

    draw(equation);

    let globalExpression = math.compile(globalEquation);
    let localExpression = math.compile(equation);

    // instead of using string comparison which needs to account for many edge cases, we use the actual
    // calculated expression value and compare it to that which was provided for each point on the graph
    for (let i = -10; i <= 10; i++) {
        let evaluatedGlobal = globalExpression.evaluate({x: i});
        let evaluatedLocal = localExpression.evaluate({x: i});

        // if one value is finite and the other isn't, or they are both finite but do not equal each other
        if  (xor(isFinite(evaluatedGlobal), isFinite(evaluatedLocal)) ||
            (isFinite(evaluatedGlobal) && isFinite(evaluatedLocal) && (evaluatedGlobal != evaluatedLocal))) {
            // change text color and decrease the score
            document.querySelector("#eq").style.color = "red";
            playerScore -= SCORE_DECREASE;
            document.querySelector("#playerScore").innerHTML = "Score: " + playerScore;
            return;
        }
    }

    // if all of the values are the same, generate another problem, reset values, increase player score
    setTimeout(generateProblem, 2200);
    document.querySelector("#eq").value = "";
    document.querySelector("#eq").style.color = "black";
    playerScore += SCORE_INCREASE;
    document.querySelector("#playerScore").innerHTML = "Score: " + playerScore;
}

/**
 * Generate a random equation and plot it on the graph.
 */
function generateProblem() {
    // get a random equation from all of the different kinds that can be created
    globalEquation = getRandomEquation(PROBLEM_TYPES[getRandomNumber(0, PROBLEM_TYPES.length - 1)]);
    
    // console.log("global: " + globalEquation);
    
    const expr = math.compile(globalEquation);

    const xValues = math.range(-10, 11, 1).toArray();
    const yValues = xValues.map(x => expr.evaluate({ x: x }));

    const pointsTrace = {
        x: xValues,
        y: yValues,
        mode: "markers",
        name: "Equation Points"
    };

    // arrange data, layout, and config settings for the plot
    const data = [ pointsTrace ];
    const layout = { showlegend: false };
    const config = { displayModeBar: false, responsive: true };

    // render the plot using plotly
    Plotly.newPlot("plot", data, layout, config);
}

/**
 * Draw an equation on the graph plot.
 */
function draw(equation) {
    try {
        // get the expression from page and compile the expression
        const expr = math.compile(equation);

        // evaluate the expression repeatedly for different values of x
        const xValues = math.range(-10, 11, 1).toArray();
        const yValues = xValues.map(x => expr.evaluate({ x: x }));

        // create a trace for the line plot
        const lineTrace = {
            x: xValues,
            y: yValues,
            mode: "lines",
            name: "Path Equation"
        };

        // remove the previous guess trace, if there is one
        try {
            Plotly.deleteTraces(plot, 1);
        } catch {}
        
        // add a trace to the plot
        Plotly.addTraces(plot, lineTrace);
    }
    catch (err) {
        console.error(err);
    }
}

/**
 * Get a random equation.
 * @param {String} type 
 * @returns {String} equation
 */
function getRandomEquation(type) {
    let equation = "";

    // if linear
    if (type == PROBLEM_TYPES[0]) {
        let a = getRandomNumber(0, 10);
        let b = getRandomNumber(-10, 10);

        equation = `${a}x + ${b}`;
    }
    // if quadratic
    else if (type == PROBLEM_TYPES[1]) {
        let a = getRandomNumber(0, 5);
        let b = getRandomNumber(-10, 10);
        let c = getRandomNumber(-10, 10);

        equation = `${a}x^2 + ${b}x + ${c}`;
    }
    // if cubic
    else if (type == PROBLEM_TYPES[2]) {
        let a = getRandomNumber(0, 5);
        let b = getRandomNumber(-10, 10);
        let c = getRandomNumber(-10, 10);
        let d = getRandomNumber(-10, 10);

        equation = `${a}x^3 + ${b}x^2 + ${c}x + ${d}`;
    }
    // if quartic
    else if (type == PROBLEM_TYPES[3]) {
        let a = getRandomNumber(0, 5);
        let b = getRandomNumber(-10, 10);
        let c = getRandomNumber(-10, 10);
        let d = getRandomNumber(-10, 10);
        let e = getRandomNumber(-10, 10);

        equation = `${a}x^4 + ${b}x^3 + ${c}x^2 + ${d}x + ${e}`;
    }
    // if exponential
    else if (type == PROBLEM_TYPES[4]) {
        let a = getRandomNumber(1, 10);
        let b = getRandomNumber(-10, 10);
        let c = getRandomNumber(-10, 10);

        equation = `${a}^(${b}x + ${c})`;
    }
    // if logarithmic
    else if (type == PROBLEM_TYPES[5]) {
        let a = getRandomNumber(1, 5);
        let b = getRandomNumber(-10, 10);
        let c = getRandomNumber(-5, 5);
        let d = getRandomNumber(-10, 10);

        equation = `${a}log(${b}x + ${c}) + ${d}`;
    }

    return equation.trim();
}

/**
 * Generates and returns a random number within a given range.
 * @param {Number} min 
 * @param {Number} max 
 * @returns {Number} randomNumber
 */
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Performs an exclusive OR operation on the provided booleans.
 * @param {Boolean} bool1
 * @param {Boolean} bool2
 * @returns {Boolean} xor
 */
function xor(bool1, bool2) {
    return bool1 ? (bool2 ? false : true) : (bool2 ? true : false);
}