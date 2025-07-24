let diffLevel = "",
    fract1 = "",
    fract2 = "",
    problem = "",
    correctOp = "",
    boardType = "",
    width = 0,
    ans = "",
    table,
    noSolBtn,
    score = 0,
    numSolved = 0,
    numWhite = 0;

const EASY_MIN = 0;
const EASY_MAX = 9;
const MED_MIN = 10;
const MED_MAX = 40;
const HARD_MIN = 41;
const HARD_MAX = 80;
const POINTS = 10;
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
	width = BOARD_THREE_WIDTH;
    } else if (document.getElementById("four").checked) {
        document.getElementsByName("board4")[0].style.display = "";
	boardType = "board4";
	width = BOARD_FOUR_WIDTH;
    } else if (document.getElementById("five").checked) {
        document.getElementsByName("board5")[0].style.display = "";
	boardType = "board5";
	width = BOARD_FIVE_WIDTH;
    } else {
        return;
    }

    generateProblem();
    fillBoard();

    document.getElementById("start").style.display = "none";
    document.getElementById("game").style.display = "";
}

function generateProblem() {
    // Easy level compares fractions with same denominators
    if (diffLevel == "easy") {
	fract1 = getRandomFraction(EASY_MIN, EASY_MAX);
	let numer2 = Math.floor(Math.random() * (EASY_MAX - EASY_MIN + 1)) + EASY_MIN;
       	let denom2 = fract1.substr(fract1.indexOf('/') + 1);
	fract2 = numer2 + "/" + denom2;
    } else if (diffLevel == "medium") {
	fract1 = getRandomFraction(MED_MIN, MED_MAX);
	fract2 = getRandomFraction(MED_MIN, MED_MAX); 
    } else {
	fract1 = getRandomFraction(HARD_MIN, HARD_MAX);
	fract2 = getRandomFraction(HARD_MIN, HARD_MAX);
    }

    problem = fract1 + " ? " + fract2;
    let n1 = 0, n2 = 0, d1 = 0, d2 = 0;
    let arr1 = fract1.split("/");
    n1 = parseInt(arr1[0]);
    d1 = parseInt(arr1[1]);
    let arr2 = fract2.split("/");
    n2 = parseInt(arr2[0]);
    d2 = parseInt(arr2[1]);
    let f1 = n1/d1;
    let f2 = n2/d2;

    if (f1 > f2) {
        correctOp = ">";
    } else if (f1 < f2) {
        correctOp = "<";
    } else {
        correctOp = "=";
    }

    document.getElementById("problem").innerHTML = problem;
}

function getRandomFraction(min, max) {
    let numerator = Math.floor(Math.random() * (max - min + 1)) + min;

    if (min == 0) {
	min = 1;
    }

    let denominator = Math.floor(Math.random() * (max - min + 1)) + min;
    let num = numerator + "/" + denominator;
    return num;
}

// Randomly fill board with <, >, and = 
function fillBoard() {
    table = document.getElementsByName(boardType)[0];
    let operators = ["<", ">", "="];
    let op = "";

    for (let i = 0, row; row = table.rows[i]; i++) {
	for (let j = 0, col; col = row.cells[j]; j++) {
	    op = operators[Math.floor(Math.random() * operators.length)];                                 
            col.className = "white";
	    col.innerText = op;
            col.onclick = function(){checkAnswer(this)};
	}
    }
}

function checkAnswer(cell) {
    if (cell.className != "green") {
        if (correctOp == cell.innerText) {
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
	    document.getElementById("wrongProblem").innerHTML += "<li class='list-group-item'><h5 class='list-group-item-heading'>" + problem + "</h5> <p class='list-group-item-text'><b>Your Answer: </b>" + cell.innerText + "<br> <b\
>Correct: </b>" + correctOp + "</p> </li>";
       	    cell.className = "red";
	    setTimeout(() => cell.className = "white", 1000);
        }
	document.getElementById("score").innerHTML = "Score: " + score;
    }
}

function solNotFound() {
    noSolBtn = document.getElementById("noSolution");

    for (let i = 0, row; row = table.rows[i]; i++) {
        for (let j = 0, col; col = row.cells[j]; j++) {
	    if (col.className == "white") { 
	        if (correctOp == col.innerText) {
		    if (score != 0) {
			score -= POINTS;
		    }
		    document.getElementById("score").innerHTML = "Score: " + score;
		    document.getElementById("wrongProblem").innerHTML += "<li class='list-group-item'><h5 class='list-group-item-heading'>" + problem + "</h5> <p class='list-group-item-text'><b>Your Answer: </b> Solution not on boar\
d <br> <b>Correct: </b>" + correctOp + "</p> </li>";
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
    for (let i = 0; i < width; i++) {
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