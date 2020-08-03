
let globalEquation = "";

/**
 * Initialize the UI on script load.
 */
(function initUI() {
    generateProblem();
})();

// TODO make the graph height take up more room on the page
// TODO footer mode checkboxes like in SpeedyMath
// TODO footer difficulty modes like in SpeedyMath
// TODO add other equation types
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

    // console.log("global: " + globalEquation + ", local: " + equation);

    // compare the strings and generate another problem if correct
    if (globalEquation == equation.trim()) {
        generateProblem();
        document.querySelector("#eq").value = "";
        document.querySelector("#eq").style.color = "black";
    }
    // change text color to red if incorrect
    else {document.querySelector("#eq").style.color = "red";}
}

/**
 * Generate a random equation and plot it on the graph.
 */
function generateProblem() {
    globalEquation = getRandomEquation(Math.floor(Math.random()) ? "linear" : "quadratic");
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

    if (type == "linear") {
        let m = getRandomNumber(0, 10);
        let b = Math.round(Math.random()) ? `+ ${getRandomNumber(0, 10)}` : `- ${getRandomNumber(0, 10)}`;

        equation = `${m}x ${b}`;
    }
    else if (type == "quadratic") {
        let a = getRandomNumber(0, 5);
        let b = Math.round(Math.random()) ? `+ ${getRandomNumber(0, 10)}x` : `- ${getRandomNumber(0, 10)}x`;
        let c = Math.round(Math.random()) ? `+ ${getRandomNumber(0, 10)}` : `- ${getRandomNumber(0, 10)}`;

        equation = `${a}x^2 ${b} ${c}`;
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