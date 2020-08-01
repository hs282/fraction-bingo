let diffLevel = "",
    boardType = "",
    numCells = 0,
    width = 0,
    multipliers = [],
    boardFractions = [],
    problemFractions = [],
    fraction = "",
    problem = "",
    ans = "",
    table,
    noSolBtn,
    score = 0,
    numSolved = 0,
    numWhite = 0,
    boardMin = 0,
    boardMax = 0,
    probMin = 0,
    probMax = 0;

const EASY_BOARD_MIN = 0;
const EASY_BOARD_MAX = 4;
const EASY_PROB_MIN = 0;
const EASY_PROB_MAX = 16;
const MED_BOARD_MIN = 5;
const MED_BOARD_MAX = 8;
const MED_PROB_MIN = 25;
const MED_PROB_MAX = 64;
const HARD_BOARD_MIN = 9;
const HARD_BOARD_MAX = 12;
const HARD_PROB_MIN = 81;
const HARD_PROB_MAX = 144;
const POINTS = 10;
const BOARD_THREE_CELLS = 9;
const BOARD_FOUR_CELLS = 16;
const BOARD_FIVE_CELLS = 25;
const BOARD_THREE_WIDTH = 3;
const BOARD_FOUR_WIDTH = 4;
const BOARD_FIVE_WIDTH = 5;

function startGame() {
    // Get selected difficulty level
    diffLevel = $("input[name='difficulty']:checked").val();
    
    // If no difficulty level is selected, do not advance
    if (!diffLevel) {
	return;
    }

    // Get selected board size
    if (document.getElementById("three").checked) {
        document.getElementsByName("board3")[0].style.display = ""; 
	boardType = "board3";
	numCells = BOARD_THREE_CELLS;
	width = BOARD_THREE_WIDTH;
    } else if (document.getElementById("four").checked) {
	document.getElementsByName("board4")[0].style.display = "";
	boardType = "board4";
	numCells = BOARD_FOUR_CELLS;
	width = BOARD_FOUR_WIDTH;
    } else if (document.getElementById("five").checked) {
	document.getElementsByName("board5")[0].style.display = "";
	boardType = "board5";
	numCells = BOARD_FIVE_CELLS;
	width = BOARD_FIVE_WIDTH;
    } else {
	return;
    }

    setMinMax();
    generateFracts();
    generateProblem();
    fillBoard();

    document.getElementById("start").style.display = "none";
    document.getElementById("game").style.display = "";
}

function setMinMax() {
    if (diffLevel == "easy") {
        boardMin = EASY_BOARD_MIN;
        boardMax = EASY_BOARD_MAX;
	probMin = EASY_PROB_MIN;
	probMax = EASY_PROB_MAX;
        multipliers = [1, 2, 3, 4];
    } else if (diffLevel == "medium") {
        boardMin = MED_BOARD_MIN;
        boardMax = MED_BOARD_MAX;
	probMin = MED_PROB_MIN;
	probMax = MED_PROB_MAX;
        multipliers = [5, 6, 7, 8];
    } else {
        boardMin = HARD_BOARD_MIN;
        boardMax = HARD_BOARD_MAX;
	probMin = HARD_PROB_MIN;
	probMax = HARD_PROB_MAX;
        multipliers = [9, 10, 11, 12];
    }
}

function generateFracts() {
    let fract, mult, newFract, numerStr, denomStr, numer, denom;
    
    for (let i = 0; i < numCells; i++) {
	fract = getRandomFraction(boardMin, boardMax, "do not simplify");
        mult = multipliers[Math.floor(Math.random() * multipliers.length)];
	numerStr = fract.substr(0, fract.indexOf('/'));
	denomStr = fract.substr(fract.indexOf('/') + 1);
	numer = parseInt(numerStr) * mult;
	denom = parseInt(denomStr) * mult;                                                                                                                     
	newFract = numer + "/" + denom;

	// Add problem that must be simplified to array of problem fractions
	problemFractions.push(newFract);

	// Add simplified solution to array of board fractions
	boardFractions.push(simplifyFract(parseInt(numerStr), parseInt(denomStr)));

	// Extra problems 
	newFract = getRandomFraction(probMin, probMax, "do not simplify");
        problemFractions.push(newFract);
    }
}
    
function getRandomFraction(min, max, simplify) {
    let num;
    let numerator = Math.floor(Math.random() * (max - min + 1)) + min;

    if (min == 0) {
	min = 1;
    }

    let denominator = Math.floor(Math.random() * (max - min + 1)) + min;

    if (simplify == "simplify") {
	num = simplifyFract(numerator, denominator);
    } else {
	num = numerator + "/" + denominator;
    }

    return num;
}

function simplifyFract(numerator, denominator) {
    let gcd = function gcd(x, y) {
	return y ? gcd(y, x%y) : x;
    };
    gcd = gcd(numerator, denominator);
    return numerator/gcd + "/" + denominator/gcd;
}

// Fill board table cells with simplified fractions
function fillBoard() {
    table = document.getElementsByName(boardType)[0];
    let k = 0;

    for (let i = 0, row; row = table.rows[i]; i++) {
	for (let j = 0, col; col = row.cells[j]; j++) {
	    col.innerHTML = boardFractions[k];
	    col.className = "white";
	    col.onclick = function(){checkAnswer(this)};
	    k++;
	}
    }
}

function checkAnswer(cell) {
    if (cell.className != "green") {
        if (ans == cell.innerHTML) {
            score += POINTS;
	    numSolved++;
	    cell.className = "green";
	    let b = checkBingo();
	    if (!b) {
		setTimeout(generateProblem, 1000);
	    }
        }
        else {
	    if (score != 0) {
	        score -= POINTS;
	    }
	    document.getElementById("wrongProblem").innerHTML += "<li class='list-group-item'><h5 class='list-group-item-heading'>" + problem + "</h5> <p class='list-group-item-text'><b>Your Answer: </b>" + cell.innerHTML + "<br> <b>Correct: </b>" + ans + "</p> </li>";
	    cell.className = "red";
            setTimeout(() => cell.className = "white", 1000);
        }
	document.getElementById("score").innerHTML = "Score: " + score;
    }
}

function generateProblem() {
    let index = Math.floor(Math.random() * problemFractions.length);
    fraction = problemFractions[index];
    problem = fraction + " = ?";
    let arr  = fraction.split("/");
    let n = parseInt(arr[0]);
    let d = parseInt(arr[1]); 
    ans = simplifyFract(n, d);
    problemFractions.splice(index, 1);
    document.getElementById("problem").innerHTML = problem;
}

function solNotFound() {
    noSolBtn = document.getElementById("noSolution");

    for (let i = 0, row; row = table.rows[i]; i++) {
        for (let j = 0, col; col = row.cells[j]; j++) {
	    if (col.className == "white") {
	        if (ans == col.innerHTML) {
		    if (score != 0) {
		        score -= POINTS;
		    }
		    document.getElementById("score").innerHTML = "Score: " + score;
		    document.getElementById("wrongProblem").innerHTML += "<li class='list-group-item'><h5 class='list-group-item-heading'>" + problem + "</h5> <p class='list-group-item-text'><b>Your Answer: </b> Solution not on board <br> <b>Correct: </b>" + ans + "</p> </li>";
		    noSolBtn.style.backgroundColor = "red";
		    setTimeout(() => noSolBtn.style.backgroundColor = "", 1000);
		    return;
	        }
	    }
        }
    }
   
    score += POINTS;
    numSolved++;
    document.getElementById("score").innerHTML = "Score: " + score;
    noSolBtn.style.backgroundColor = "green";
    setTimeout(function() {
        noSolBtn.style.backgroundColor = "";
	generateProblem();
    }, 1000);
}

function checkBingo() {
    return checkRows() || checkColumns() || checkDiagonals();
}

function checkRows() {
    for (let i = 0, row; row = table.rows[i]; i++) {
        for (let j = 0, col; col = row.cells[j]; j++) {
            if (col.className != "green") {
                numWhite++;
            }
        }

        if (numWhite == 0) {
            bingo();
            return true;
        }

        numWhite = 0;
    }

    return false;
}

function checkColumns() {
    for (i = 0; i < width; i++) {
        for (let j = 0; row = table.rows[j]; j++) {
            if (row.cells[i].className != "green") {
                numWhite++;
            }
        }

        if (numWhite == 0) {
            bingo();
            return true;
        }

        numWhite = 0;
    }

    return false;
}

function checkDiagonals() {
    let diag = true;

    for (let i = 0, row; row = table.rows[i]; i++) {
	if (row.cells[i].className != "green") {
	    diag = false;
	    break;
	}
    }

    if (diag) {
        bingo();
	return true;
    }

    for (let j = 0, row; row = table.rows[j]; j++) {
	if (row.cells[width - j - 1].className != "green") {
	    return false;
	}
    }

    bingo();
    return true;
}

function bingo() {
    document.getElementById("problem").innerHTML = "BINGO!!! On to the next board!";
    setTimeout(function() {
        boardFractions = [];
	problemFractions = [];
	generateFracts();
	generateProblem();
	fillBoard();
    }, 2000);
}

function endGame() {
    document.getElementById("game").style.display = "none";
    document.getElementById("end").style.display = "";
    document.getElementById("totalScore").innerHTML = score;
    document.getElementById("numSolved").innerHTML = numSolved;
    
    if (document.getElementById("wrongProblem").innerHTML == "") {
	document.getElementById("wrong").style.display = "none";
	document.getElementById("allCorrect").style.display = "";
    }
}