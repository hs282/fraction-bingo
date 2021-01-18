
let globalEquation = "";
let playerScore = 0;

const SCORE_INCREASE = 20;
const SCORE_DECREASE = 1;

let currPageNum = 0;
const minPageNum = 0;
const maxPageNum = 6;

let nextBtnOn = true;
let backBtnOn = false;

// Every type of graph and identifying factors about it's current state
let graphTypes = [
    {
        name: "Linear",
        enabled: true,
        difficulty: 1
    }, {
        name: "Quadratic",
        enabled: true,
        difficulty: 1
    }, {
        name: "Cubic",
        enabled: true,
        difficulty: 1
    }, {
        name: "Quartic",
        enabled: true,
        difficulty: 1
    }, {
        name: "Exponential",
        enabled: true,
        difficulty: 1
    }, {
        name: "Logarithmic",
        enabled: true,
        difficulty: 1
    }];

/**
 * Initialize the UI on script load.
 */
(function initUI() {
    // show instructions modal
    $("#myModal").modal("show");

    createProblemDifficultyAdjusters();
})();

/**
 * Set the proper elements to be diplayed and setup game for its initial state
 */
function startGame() {
    document.querySelector("#startScreen").style.display = "none";
    document.querySelector("#gameScreen").style.display = "inline";

    // return instantly if the problem isn't properly generated
    if (!generateProblem()) {
        endGame();
        return;
    }

    playerScore = 0;
    document.querySelector("#playerScore").innerHTML = "Score: " + playerScore;
}

/**
 * Set the proper elements to be diplayed for the learning screen
 */
function startLearning() {
    document.querySelector("#startScreen").style.display = "none";
    document.querySelector("#learnScreen").style.display = "inline";
    document.querySelector('#backbtn').style.display = "none";

    currPageNum = 0;
    changePageText();
}

/**
 * Checks the currPageNum to make sure the proper page locomotion buttons are visible
 */
function checkVisibleBtns() {
    if (currPageNum == maxPageNum && nextBtnOn) {document.querySelector('#nextbtn').style.display = "none"; nextBtnOn = false;}
    else if (!nextBtnOn) {document.querySelector('#nextbtn').style.display = "inline"; nextBtnOn = true;}

    if (currPageNum == minPageNum && backBtnOn) {document.querySelector('#backbtn').style.display = "none"; backBtnOn = false;}
    else if (!backBtnOn) {document.querySelector('#backbtn').style.display = "inline"; backBtnOn = true;}
}

/**
 * Changes the text and image(s) on the screen when a learning page change is requested
 */
function changePageText() {

    let img1 = document.querySelector("#learnPageImage1");
    let img2 = document.querySelector("#learnPageImage2");
    let img3 = document.querySelector("#learnPageImage3");

    switch (currPageNum) {
        case 0:
            document.querySelector("#learnPageTitle").innerHTML = "Graph Introduction";

            img1.src = "";
            img1.height = "0";
            img1.width = "0";
            img2.src = "";
            img2.height = "0";
            img2.width = "0";
            img3.src = "";
            img3.height = "0";
            img3.width = "0";

            document.querySelector("#learnPageText").innerHTML = "There are many different types of graphs for different mathematical functions. In this learning section we will be taking a look at linear, quadratic, cubic, quartic, exponential, and logarithmic function graphs. You will learn the identifying factors and general shapes of these different kinds of graphs in order to more easily be able to identify them just by shape and structure. You can navigate through these learning pages using the \"Next\" and \"Back\" buttons above. Also, if you would like to quit the learning section and return to the game at any time, press the \"Return to Game\" button at the top.";
            break;
        case 1:
            document.querySelector("#learnPageTitle").innerHTML = "Linear Function Graphs";
            
            img1.src = "img/linearGraph1.jpg";
            img1.height = "350";
            img1.width = "350";
            img2.src = "img/linearGraph2.jpg";
            img2.height = "350";
            img2.width = "350";
            img3.src = "img/linearGraph3.jpg";
            img3.height = "350";
            img3.width = "350";

            document.querySelector("#learnPageText").innerHTML = "There are many different types of linear graphs but some examples of the main types are shown above. Linear graphs can be made from any linear functions of the form <b>y = x</b>, <b>y = x + i</b>, or <b>y = i</b> where <b>i</b> is any number. Linear functions basically map <b>y</b> to <b>x</b> directly or <b>y</b> to some constant number. As shown in the first example graph <b>y = x</b>, we can see that every coordinate on the graphed line has a matching <b>y</b> and <b>x</b> value since <b>y = x</b>. Many linear functions use this form and transformations can be made to change the way the graph looks as well. The simplest looking linear graph is one like the second graph <b>y = 1</b> shown above. Graphs like this simply map every <b>y</b> coordinate to a specific value for every <b>x</b>, in this case, <b>1</b>. As for transformations of linear graphs, <b>x</b> can be multiplied to change the slope of the graph and numbers can be added or subtracted in order to shift the graph left or right. Such a transformation is shown in the third example, <b>y = -x - 1</b>, where we can see that multiplying <b>x</b> by <b>-1</b> has made the slope of the graph negative and then subtracting <b>1</b> has shifted the whole graph over to the left by <b>1</b> unit.";
            break;
        case 2:
            document.querySelector("#learnPageTitle").innerHTML = "Quadratic Function Graphs";
            
            img1.src = "img/quadraticGraph1.jpg";
            img1.height = "350";
            img1.width = "350";
            img2.src = "img/quadraticGraph2.jpg";
            img2.height = "350";
            img2.width = "350";
            img3.src = "img/quadraticGraph3.jpg";
            img3.height = "350";
            img3.width = "350";

            document.querySelector("#learnPageText").innerHTML = "Quadratic graphs are those of quadratic functions of the form <b>y = x^2</b> like <b>y = x^2 + x + 1</b>. The first example shown above is a graph of <b>y = x^2</b>. The shape this graph makes is known as a <b>\"parabola\"</b> and is usually very distinct to quadratic functions. The graph makes this shape because every <b>y</b> coordinate is equal to an <b>x coordinate squared</b>, and since negative numbers squared cannot be negative, the graph looks mirrored. A simple example of the most common quadratic form graph is shown in the second example where <b>y = x^2 + x - 1</b>. In this example the <b>- 1</b> at the end shifts the graph downwards by one unit and the added <b>x</b> throws a linear offset of <b>x</b> into the mix. Thinking about how each coordinate is calculated is helpful in determining graphs, especially when it comes to quadratic graphs. Finally, the third example of <b>y = -x^2 + 3x</b> shows how multiplying the <b>x^2</b> factor by a negative number flips the graph upside-down and the <b>3x</b> adds an extra <b>3x</b> to every coordinate.";
            break;
        case 3:
            document.querySelector("#learnPageTitle").innerHTML = "Cubic Function Graphs";
            
            img1.src = "img/cubicGraph1.jpg";
            img1.height = "350";
            img1.width = "350";
            img2.src = "img/cubicGraph2.jpg";
            img2.height = "350";
            img2.width = "350";
            img3.src = "img/cubicGraph3.jpg";
            img3.height = "350";
            img3.width = "350";

            document.querySelector("#learnPageText").innerHTML = "Cubic graphs are graphs of cubic functions, in other words any function of the form <b>x^3</b> like <b>x^3 + x^2 + x + 1</b>. Shown above, the first example of a graph of one of these kinds of functions is simply the graph of <b>y = x^3</b>. The graph actually looks similar to quadratic graphs because it is a similar exponent graph, but this cubic graph looks like it is mirrored diagonally whereas quadratic graphs appear to be mirrored horizontally over the <b>y</b> axis and sometimes vertically over the <b>x</b> axis if rotated. This shape is prevalent because coordinates are exponentiated to the third power, but unlike the <b>x^2</b> in quadratic functions, the <b>x^3</b> in cubic functions can be negative, and it is negative for all negative <b>x</b> values. This usually gives cubic functions a diagonally mirrored appearance. In the second example, we can see that when <b>y = x^3 + x^2 + x + 1</b>, the graph gets a little bit diluted by the <b>x^2</b> and <b>x</b> factors while the <b>+ 1</b> at the end simply shifts the graph upwards by one unit. Moving on to the last example, <b>y = -x^3 + x^2 + x - 1</b> shows us that once again, the graph is flipped upside-down when the <b>x^3</b> factor is multiplied by a negative value. Since the <b>x^2</b> and <b>x</b> factors are added to an already negative <b>x^3</b> value, the middle of the graph gets a bit distorted upwards. The remaining <b>- 1</b> shifts the graph downwards by one unit.";
            break;
        case 4:
            document.querySelector("#learnPageTitle").innerHTML = "Quartic Function Graphs";
            
            img1.src = "img/quarticGraph1.jpg";
            img1.height = "350";
            img1.width = "350";
            img2.src = "img/quarticGraph2.jpg";
            img2.height = "350";
            img2.width = "350";
            img3.src = "img/quarticGraph3.jpg";
            img3.height = "350";
            img3.width = "350";

            document.querySelector("#learnPageText").innerHTML = "Worked???";
            break;
        case 5:
            document.querySelector("#learnPageTitle").innerHTML = "Exponential Function Graphs";
            
            img1.src = "img/exponentialGraph1.jpg";
            img1.height = "350";
            img1.width = "350";
            img2.src = "img/exponentialGraph2.jpg";
            img2.height = "350";
            img2.width = "350";
            img3.src = "img/exponentialGraph3.jpg";
            img3.height = "350";
            img3.width = "350";

            document.querySelector("#learnPageText").innerHTML = "Worked???";
            break;
        case 6:
            document.querySelector("#learnPageTitle").innerHTML = "Logarithmic Function Graphs";
            
            img1.src = "img/logarithmicGraph1.jpg";
            img1.height = "350";
            img1.width = "350";
            img2.src = "img/logarithmicGraph2.jpg";
            img2.height = "350";
            img2.width = "350";
            img3.src = "img/logarithmicGraph3.jpg";
            img3.height = "350";
            img3.width = "350";

            document.querySelector("#learnPageText").innerHTML = "Worked???";
            break;
        default:
            break;
    }
}

/*
* Allow the user to go to the next page when browsing learning pages
*/
function pageNext() {
    //console.log("Pressed");
    currPageNum++;
    checkVisibleBtns();
    changePageText();
}

/*
* Allow the user to go to the last page when browsing learning pages
*/
function pageBack() {
    currPageNum--;
    checkVisibleBtns();
    changePageText();
}

/**
 * Set the proper screen elements to bring the user back to the start screen
 */
function endGame() {
    let inputText = document.querySelector("#eq");
    inputText.value = "";
    inputText.style.color = "black";

    document.querySelector("#gameScreen").style.display = "none";
    document.querySelector("#learnScreen").style.display = "none";
    document.querySelector("#startScreen").style.display = "inline";

    $("#myModal").modal("show");
}

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

    const notif = document.querySelector("#notification");
    notif.style.display = "";

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
            
            // restyle the incorrect trace using attribute strings
            var update = {
                'marker.color': 'red'
            };
            Plotly.restyle(plot, update, 1);

            playerScore -= SCORE_DECREASE;
            document.querySelector("#playerScore").innerHTML = "Score: " + playerScore;

            // syntax tutor-style user feedback
            notif.innerHTML = "Incorrect answer.";
            notif.className = "failure";
            setTimeout(() => notif.style.display = "none", 2200);

            return;
        }
    }

    // if all of the values are the same, generate another problem, reset values, increase player score
    setTimeout(generateProblem, 2200);
    document.querySelector("#eq").value = "";
    document.querySelector("#eq").style.color = "black";

    // restyle the correct trace using attribute strings
    var update = {
        'marker.color': 'green'
    };
    Plotly.restyle(plot, update, 1);

    playerScore += SCORE_INCREASE;
    document.querySelector("#playerScore").innerHTML = "Score: " + playerScore;

    // syntax tutor-style user feedback
    notif.innerHTML = "Correct!";
    notif.className = "success";
    setTimeout(() => notif.style.display = "none", 2200);
}

/**
 * Generate a random equation and plot it on the graph.
 * @returns {Boolean} didGenerate
 */
function generateProblem() {
    // get all enabled graphType indexes
    let typeIndexArray = [];
    for (let i = 0; i < graphTypes.length; i++) if (graphTypes[i].enabled) typeIndexArray.push(i);

    if (typeIndexArray.length < 1) {
        alert("Error: At least one graph type must be enabled to proceed");
        return false;
    }

    // get a random equation from all of the different kinds that can be created
    globalEquation = getRandomEquation(graphTypes[typeIndexArray[getRandomNumber(0, typeIndexArray.length - 1)]]);
    
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

    return true;
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
 * Create the problem difficulty adjuster components in the footer.
 */
function createProblemDifficultyAdjusters() {
    // reference to problemTypes div to show the difficulty adjusters
    const problemTypesEl = document.getElementById("problemTypes");

    // group by problem types
    //let problemTypes;
    // let el = document.createElement("ul");
    //         el.id = type;
    //         problemTypesEl.appendChild(el);
    //         el.className = "hide";

    graphTypes.forEach(graphType => {
        let li = document.createElement("li");
        problemTypesEl.appendChild(li);

        // create checkbox to enable or disable
        let enablingCheckbox = document.createElement("input");
        enablingCheckbox.type = "checkbox";
        enablingCheckbox.id = graphType.name;
        enablingCheckbox.name = graphType.name;
        enablingCheckbox.value = graphType.name;
        enablingCheckbox.checked = graphType.enabled;

        // create a function to handle checkbox click
        enablingCheckbox.onclick = () => {
            // change the operation enable state to the checkbox checked state
            graphType.enabled = enablingCheckbox.checked;

            // create problem with new edited operations
            //newProblem(); // TODO: EDIT ---------------------------------------------------------------
        }

        // create number input to change the difficulty level
        let difficultyInput = document.createElement("input");
        difficultyInput.type = "number";
        difficultyInput.value = graphType.difficulty;
        difficultyInput.min = 1;
        difficultyInput.max = 5;
        difficultyInput.size = "1";
        difficultyInput.style.maxLength = "1";

        // create a function to handle number changes
        difficultyInput.oninput = () => {
            // set the operation difficulty level to the inputted value
            graphType.difficulty = difficultyInput.value;

            // create problem with new edited operations
           // newProblem();
        }

        // create label with name of the operation
        let operationLabel = document.createElement("label");
        operationLabel.htmlFor = graphType.name;
        operationLabel.innerText = graphType.name;

        // add checkbox and label to list item
        li.appendChild(enablingCheckbox);
        li.appendChild(operationLabel);
        li.appendChild(difficultyInput);
    });
    problemTypesEl.querySelectorAll("li")[0].classList.toggle("hide");
}

/**
 * Get a random equation.
 * @param {String} type 
 * @returns {String} equation
 */
function getRandomEquation(type) {
    let equation = "";

    // immediately convert difficulty to a number to properly perform calculations with it
    type.difficulty = Number(type.difficulty);

    // the max and min multipliers for acceptable random number ranges (difficulty * multiplier)
    let maxMult = 4, minMult = -4;

    // protect against incorrect difficulty input if possible
    if (type.difficulty < 1 || type.difficulty > 5) type.difficulty = 1; // add alerts or error msgs later

    // if linear
    if (type.name == graphTypes[0].name) {
        let a = getNonZeroRandom(0, maxMult * type.difficulty);
        let b = getRandomNumber(minMult * type.difficulty, maxMult * type.difficulty);

        // introduce negative values at different difficulties
        if (type.difficulty >= 2) a = getNonZeroRandom(minMult * type.difficulty, maxMult * type.difficulty);

        equation = `${a}x + ${b}`;
    }
    // if quadratic
    else if (type.name == graphTypes[1].name) {
        let a = getNonZeroRandom(0, maxMult * type.difficulty);
        let b = 0;
        let c = getRandomNumber(minMult * type.difficulty, maxMult * type.difficulty);

        // introduce negative values at different difficulties
        if (type.difficulty >= 2) a = getNonZeroRandom(minMult * type.difficulty, maxMult * type.difficulty);
        if (type.difficulty >= 3) b = getNonZeroRandom(minMult * type.difficulty, maxMult * type.difficulty);

        equation = `${a}x^2 + ${b}x + ${c}`;
    }
    // if cubic
    else if (type.name == graphTypes[2].name) {
        let a = getNonZeroRandom(0, maxMult * type.difficulty);
        let b = 0;
        let c = 0;
        let d = getRandomNumber(minMult * type.difficulty, maxMult * type.difficulty);

        // introduce negative values at different difficulties
        if (type.difficulty >= 2) a = getNonZeroRandom(minMult * type.difficulty, maxMult * type.difficulty);
        if (type.difficulty >= 3) c = getNonZeroRandom(minMult * type.difficulty, maxMult * type.difficulty);
        if (type.difficulty >= 4) b = getNonZeroRandom(minMult * type.difficulty, maxMult * type.difficulty);

        equation = `${a}x^3 + ${b}x^2 + ${c}x + ${d}`;
    }
    // if quartic
    else if (type.name == graphTypes[3].name) {
        let a = getNonZeroRandom(0, maxMult * type.difficulty);
        let b = 0;
        let c = 0;
        let d = 0;
        let e = getRandomNumber(minMult * type.difficulty, maxMult * type.difficulty);

        // introduce negative values at different difficulties
        if (type.difficulty >= 2) a = getNonZeroRandom(minMult * type.difficulty, maxMult * type.difficulty);
        if (type.difficulty >= 3) d = getNonZeroRandom(minMult * type.difficulty, maxMult * type.difficulty);
        if (type.difficulty >= 4) c = getNonZeroRandom(minMult * type.difficulty, maxMult * type.difficulty);
        if (type.difficulty >= 5) b = getNonZeroRandom(minMult * type.difficulty, maxMult * type.difficulty);

        equation = `${a}x^4 + ${b}x^3 + ${c}x^2 + ${d}x + ${e}`;
    }
    // if exponential
    else if (type.name == graphTypes[4].name) {
        let a = getRandomNumber(2, type.difficulty + 2);
        let b = 1;
        let c = 0;
        let d = getRandomNumber(minMult * type.difficulty, maxMult * type.difficulty);

        // introduce negative values at different difficulties
        if (type.difficulty >= 2) a = (Math.random() >= 0.5 ? getRandomNumber(2, type.difficulty + 2) : getRandomNumber((type.difficulty * -1) - 2, -2));
        if (type.difficulty >= 3) c = getNonZeroRandom(type.difficulty * -1, type.difficulty);
        if (type.difficulty >= 4) b = getNonZeroRandom(type.difficulty * -1, type.difficulty);

        equation = `(${a})^(${b}x + ${c}) + ${d}`;
    }
    // if logarithmic
    else if (type.name == graphTypes[5].name) {
        let a = getNonZeroRandom(0, (maxMult / 2) * type.difficulty);
        let b = 1;
        let c = 0;
        let d = getRandomNumber(minMult * type.difficulty, maxMult * type.difficulty);

        // introduce negative values at different difficulties
        if (type.difficulty >= 2) a = getNonZeroRandom((minMult / 2) * type.difficulty, (maxMult / 2) * type.difficulty);
        if (type.difficulty >= 3) c = getNonZeroRandom((minMult / 2) * type.difficulty, (maxMult / 2) * type.difficulty);
        if (type.difficulty >= 4) b = getNonZeroRandom((minMult / 2) * type.difficulty, (maxMult / 2) * type.difficulty);

        equation = `${a}log(${b}x + ${c}) + ${d}`;
    }

    // testing
    //console.log(equation.trim());

    return equation.trim();
}

/**
 * Gets a random number between min and max not including 0
 * @param {Number} min 
 * @param {Number} max 
 * @returns {Number} nonZeroRandom
 */
function getNonZeroRandom(min, max) {
    if (min < 0 && max > 0) {
        let a = getRandomNumber(min, -1), b = getRandomNumber(1, max);
        return Math.random() >= 0.5 ? a : b;
    }
    else if (min == 0) return getRandomNumber(1, max);
    else if (max == 0) return getRandomNumber(min, -1);
    else return getRandomNumber(min, max);
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