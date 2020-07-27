var diffLevel = "",
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
    numSolved = 0;

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
	numCells = 9;
	width = 3;
	multipliers = [1, 2, 3, 4]
    } else if (document.getElementById("four").checked) {
	document.getElementsByName("board4")[0].style.display = "";
	boardType = "board4";
	numCells = 16;
	width = 4;
	multipliers = [5, 6, 7, 8];
    } else if (document.getElementById("five").checked) {
	document.getElementsByName("board5")[0].style.display = "";
	boardType = "board5";
	numCells = 25;
	width = 5;
	multipliers = [9, 10, 11, 12];
    } else {
	return;
    }

    generateBoardFracts();
    generateProblemFracts();
    generateProblem();
    fillBoard();

    document.getElementById("start").style.display = "none";
    document.getElementById("game").style.display = "";
}

// Generate simplified fractions to display on board cells
function generateBoardFracts() {
    let fract;
    for (var i = 0; i < numCells; i++) {
	fract = getRandomFraction(0, 15, "simplify");
	boardFractions.push(fract);
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
	//num = `${numerator}&frasl;${denominator}`;
	num = numerator + "/" + denominator;
    }
    return num;
}

function simplifyFract(numerator, denominator) {
    //let freq = 0;
    let gcd = function gcd(x, y) {
	return y ? gcd(y, x%y) : x;
    };
    gcd = gcd(numerator, denominator);
    //return `${numerator/gcd}&frasl;${denominator/gcd}`;
    return numerator/gcd + "/" + denominator/gcd;
}

// Fill board table cells with simplified fractions
function fillBoard() {
    table = document.getElementsByName(boardType)[0];
    var k = 0;
    for (var i = 0, row; row = table.rows[i]; i++) {
	for (var j = 0, col; col = row.cells[j]; j++) {
	    col.innerHTML = boardFractions[k];
	    col.className = "white";
	    col.onclick = function () {
		checkAnswer(this);
	    };
	    k++;
	}
    }
}

function checkAnswer(cell) {
    if (cell.className != "green") {
        if (ans == cell.innerHTML) {
            score += 10;
	    numSolved++;
	    cell.className = "green";
	    let b = checkBingo();
	    if (!b) {
		setTimeout(function() {
		    generateProblem();
		    }, 1000);
	    }
        }
        else {
	    if (score != 0) {
	        score -= 10;
	    }
	    $('.list-group').append("<li class='list-group-item'><h5 class='list-group-item-heading'>" + problem + "</h5> <p class='list-group-item-text'><b>Your Answer: </b>" + cell.innerHTML + "<br> <b>Correct: </b>" + ans + "</p> </li>");
	    cell.className = "red";
            setTimeout(function() {
                cell.className = "white";
            }, 1000);
        }
	document.getElementById("score").innerHTML = "Score: " + score;
    }
}

// Generate fractions to display as the prompt
function generateProblemFracts() {
    let mult;
    let newFract;
    let numerStr;
    let denomStr;
    let numer;
    let denom;
    boardFractions.forEach(function(fract) {
	    mult = multipliers[Math.floor(Math.random() * 4)];
	    numerStr = fract.substr(0, fract.indexOf('/'));
	    denomStr = fract.substr(fract.indexOf('/') + 1);
	    numer = parseInt(numerStr) * mult;
	    denom = parseInt(denomStr) * mult;
	    //newFract = `${numer}&frasl;${denom}`
	    newFract = numer + "/" + denom;
	    
	    problemFractions.push(newFract);
	});

    for (var i = 0; i < 2 * numCells; i++) {
	newFract = getRandomFraction(0, 45, "do not simplify");
	problemFractions.push(newFract);
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
    for (var i = 0, row; row = table.rows[i]; i++) {
        for (var j = 0, col; col = row.cells[j]; j++) {
	    if (col.className == "white") {
	        if (ans == col.innerHTML) {
		    if (score != 0) {
		        score -= 10;
		    }
		    document.getElementById("score").innerHTML = "Score: " + score;
		    $('.list-group').append("<li class='list-group-item'><h5 class='list-group-item-heading'>" + problem + "</h5> <p class='list-group-item-text'><b>Your Answer: </b> Solution not on board <br> <b>Correct: </b>" + ans + "</p> </li>");
		    noSolBtn.style.backgroundColor = "red";
		    setTimeout(function() {
		        noSolBtn.style.backgroundColor = "";
		    }, 1000);
		    return;
	        }
	    }
        }
    }
   
    score += 10;
    numSolved++;
    document.getElementById("score").innerHTML = "Score: " + score;
    noSolBtn.style.backgroundColor = "green";
    setTimeout(function() {
        noSolBtn.style.backgroundColor = "";
	generateProblem();
    }, 1000);
}

function checkBingo() {
    let result;
    result = checkRows();
    if (result) {
       	return true;
    } 
    result = checkColumns();
    if (result) {
	return true;
    }
    result = checkDiagonals();
    if (result) {
        return true;
    }
    return false;
}

function checkRows() {
    rows: for (var i = 0, row; row = table.rows[i]; i++) {
        cols: for (var j = 0, col; col = row.cells[j]; j++) {
	    if (col.className != "green") {
		continue rows;
	    }
	}
	bingo();
	return true;
    }
    return false;
}

function checkColumns() {
    var row = table.rows[0];
    cols: for (var i = 0, col; col = row.cells[i]; i++) {
	rows: for (var j = 0; row = table.rows[j]; j++) {
	    if (row.cells[i].className != "green") {
		continue cols;
	    }
	}
	bingo();
	return true;
    }
    return false;
}

function checkDiagonals() {
    let diag = true;
    let cell = 0;
    for (var i = 0, row; row = table.rows[i]; i++) {
	if (row.cells[cell].className != "green") {
	    diag = false;
	    break;
	}
	cell++;
    }
    if (diag) {
        bingo();
	return true;
    }

    cell = width - 1;
    for (var j = 0, row; row = table.rows[j]; j++) {
	if (row.cells[cell].className != "green") {
	    return false;
	}
	cell--;
    }
    bingo();
    return true;
}

function bingo() {
    document.getElementById("bingo").style.display = "";
    setTimeout(function() {
	document.getElementById("bingo").style.display = "none";
        boardFractions = [];
	problemFractions = [];
	generateBoardFracts();
	generateProblemFracts();
	generateProblem();
	fillBoard();
    }, 2000);
}

function endGame() {
    document.getElementById("game").style.display = "none";
    document.getElementById("end").style.display = "";
    document.getElementById("totalScore").innerHTML = score;
    document.getElementById("numSolved").innerHTML = numSolved;
    if (document.getElementById("wrongProblem").innerHTML != "") {
	document.getElementById("wrong").style.display = "";	
    }
}