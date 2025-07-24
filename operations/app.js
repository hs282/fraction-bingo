let addLevel = "",
    subLevel = "",
    multLevel = "",
    divLevel = "",
    operations = [],
    operands = [],
    boardFractions= [],
    boardType = "",
    numOperandPairs = 0,
    problems = [],
    ans = "",
    problem = "",
    width = 0,
    table,
    noSolBtn,
    score = 0,
    numSolved = 0,
    numWhite = 0,
    min = 0,
    max = 0,
    addMin = 0,
    addMax= 0,
    subMin = 0,
    subMax = 0,
    divMin = 0,
    divMax = 0,
    multMin = 0,
    multMax = 0;

const EASY_MIN = 0;
const EASY_MAX = 9;
const MED_MIN = 10;
const MED_MAX = 30;
const HARD_MIN = 31;
const HARD_MAX = 60;
const POINTS = 10;
const BOARD_THREE_WIDTH = 3;
const BOARD_FOUR_WIDTH = 4;
const BOARD_FIVE_WIDTH = 5;
const BOARD_THREE_OPERAND_PAIRS = 18;
const BOARD_FOUR_OPERAND_PAIRS = 32;
const BOARD_FIVE_OPERAND_PAIRS = 50;

function operationDiffDisplay(operationId, difficultyId) {
    let checkBox = document.getElementById(operationId);

    if (checkBox.checked == true) {
        document.getElementById(difficultyId).style.display = "";
    } else {
        document.getElementById(difficultyId).style.display = "none"; 
    }
}

function startGame() {
    // If there are no operations selected, do not advance
    if ($("input[type='checkbox']:checked").length == 0) {
        return;
    }

    // Get operation difficulty levels
    addLevel = parseInt($("input[name='addLevel']:checked").val());
    subLevel = parseInt($("input[name='subLevel']:checked").val());
    multLevel = parseInt($("input[name='multLevel']:checked").val());
    divLevel = parseInt($("input[name='divLevel']:checked").val());

    // Get selected board size
    if (document.getElementById("three").checked) {
        document.getElementsByName("board3")[0].style.display = ""; 
	boardType = "board3";
	numOperandPairs = BOARD_THREE_OPERAND_PAIRS;
	width = BOARD_THREE_WIDTH;
    } else if (document.getElementById("four").checked) {
	document.getElementsByName("board4")[0].style.display = "";
	boardType = "board4";
	numOperandPairs = BOARD_FOUR_OPERAND_PAIRS;
	width = BOARD_FOUR_WIDTH;
    } else if (document.getElementById("five").checked) {
	document.getElementsByName("board5")[0].style.display = "";
	boardType = "board5";
	numOperandPairs = BOARD_FIVE_OPERAND_PAIRS;
	width = BOARD_FIVE_WIDTH;
    } else {
	return;
    }

    getOperations();
    generateFractions();
    generateProblem();
    fillBoard();

    document.getElementById("start").style.display = "none";
    document.getElementById("game").style.display = "";
}

function getOperations() {
    if (document.getElementById("fractAdd").checked) {
	operations.push("+");
	if (addLevel == "1") { 
	    addMin = 0;
	    addMax = 9;
	} else if (addLevel == "2") {
	    addMin = 10;
	    addMax = 30;
	} else {
	    addMin = 31;
	    addMax = 60;
	}
    }

    if (document.getElementById("fractSub").checked) {
	operations.push("-");
        if (subLevel == "1") {
	    subMin = 0;
	    subMax = 9;
        } else if (subLevel == "2") {
	    subMin = 10;
	    subMax = 30;
	} else {
	    subMin = 31;
	    subMax = 60;
	}
    }

    if (document.getElementById("fractDiv").checked) {
	operations.push("/");
        if (divLevel == "1") {
	    divMin = 0;
	    divMax = 9;
        } else if (divLevel == "2") {
	    divMin = 10;
	    divMax = 30;
	} else {
	    divMin = 31;
	    divMax = 60;
	}
    }

    if (document.getElementById("fractMult").checked) {
	operations.push("*");
        if (multLevel == "1") {
	    multMin = 0;
	    multMax = 9;
        } else if (multLevel == "2") {
	    multMin = 10;
	    multMax = 30;
	} else {
	    multMin = 31;
	    multMax = 60;
	}
    }
}

function generateFractions() {
    let op, numer1, denom1, fract1, numer2, denom2, fract2, solution;
    for (let i = 0; i < numOperandPairs; i++) {
	op = operations[Math.floor(Math.random() * operations.length)];

	if (op == "+") {
	    min = addMin;
	    max = addMax;
	} else if (op == "-") {
	    min = subMin;
	    max = subMax;
	} else if (op == "/") {
	    min = divMin;
	    max = divMax;
	} else {
	    min = multMin;
	    max = multMax;
	}

	do {
	    numer1 = Math.floor(Math.random() * (max - min + 1)) + min;
	    min = 1;
	    denom1 = Math.floor(Math.random() * (max - min + 1)) + min;
	    min = 0;
	    numer2 = Math.floor(Math.random() * (max - min + 1)) + min;
	    min = 1;

	    if ((op == "+" && addLevel == "1") || (op == "-" && subLevel == "1")) {
		denom2 = denom1;
	    } else {
		denom2 = Math.floor(Math.random() * (max - min + 1)) + min;
	    }
	}
	while (op == "-" && numer1/denom1 < numer2/denom2);

	fract1 = numer1 + "/" + denom1;
	fract2 = numer2 + "/" + denom2;	
	solution = getSolution(numer1, numer2, denom1, denom2, op);
	
	if (op == "/") {
	    op = "÷";
	} else if (op == "*") {
	    op = "x";
	}

	let probObj = {
	    operandOne: fract1,
	    operandTwo: fract2,
	    operation: op,
	    answer: solution
	};  
	problems.push(probObj);
    }
}

function gcd(x, y) {
    return y ? gcd(y, x%y) : x;
}

function getSolution(n1, n2, d1, d2, op) {
    let n, d, div, lcm;

    if (op == "*") {
	n = n1 * n2;
	d = d1 * d2;
    } else if (op == "/") {
	n = n1 * d2;
	d = d1 * n2;
	if (d == 0) {
	    return "Undefined";
	}
    } else if (op == "+") {
        if (d1 == d2) {
	    n = n1 + n2;
	    d = d1;
	} else {
	    div = gcd(d1, d2);
	    lcm = (d1 * d2) / div;
	    n = n1 * lcm/d1 + n2 * lcm/d2;
	    d = lcm;
	}
    } else {
	if (d1 == d2) {
	    n = n1 - n2;
	    d = d1;
	} else {
	    div = gcd(d1, d2);
	    lcm = (d1 * d2) / div;
	    n = n1 * lcm/d1 - n2 * lcm/d2;
	    d = lcm;
	}
    }

    let divisor = gcd(n, d);
    return n/divisor + "/" + d/divisor;
}


function fillBoard() {
    table = document.getElementsByName(boardType)[0];
    let k = 0;

    for (let i = 0, row; row = table.rows[i]; i++) {
	for (let j = 0, col; col = row.cells[j]; j++) {
	    col.innerHTML = problems[k].answer;
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
            document.getElementById("wrongProblem").innerHTML += "<li class='list-group-item'><h5 class='list-group-item-heading'>" + problem + "</h5> <p class='list-group-item-text'><b>Your Answer: </b>" + cell.innerText + "<br> <b>Correct: </b>" + ans + "</p> </li>";
	    cell.className = "red";
	    setTimeout(() => cell.className = "white", 1000);
        }
	document.getElementById("score").innerHTML = "Score: " + score;
    }
}

function generateProblem() {
    let index = Math.floor(Math.random() * problems.length);
    let randomProb = problems[index];
    ans = randomProb.answer;
    problems.splice(index, 1);
    problem = randomProb.operandOne + " " + randomProb.operation + " " +  randomProb.operandTwo + " = ?";
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
	    operands = [];
	    boardFractions = [];
	    problems = [];
	    generateFractions();
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