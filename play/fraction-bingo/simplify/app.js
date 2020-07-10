var diffLevel = "",
    boardType = "",
    numCells = 0,
    multipliers = [],
    boardFractions = [],
    problemFractions = [],
    problem = "";

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
	multipliers = [1, 2, 3, 4]
    } else if (document.getElementById("four").checked) {
	document.getElementsByName("board4")[0].style.display = "";
	boardType = "board4";
	numCells = 16;
	multipliers = [5, 6, 7, 8];
    } else if (document.getElementById("five").checked) {
	document.getElementsByName("board5")[0].style.display = "";
	boardType = "board5";
	numCells = 25;
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
    let gcd = function gcd(x, y) {
	return y ? gcd(y, x%y) : x;
    };
    gcd = gcd(numerator, denominator);
    //return `${numerator/gcd}&frasl;${denominator/gcd}`;
    return numerator/gcd + "/" + denominator/gcd;
}

// Fill board table cells with simplified fractions
function fillBoard() {
    let table = document.getElementsByName(boardType)[0];
    var k = 0;
    for (var i = 0, row; row = table.rows[i]; i++) {
	for (var j = 0, col; col = row.cells[j]; j++) {
	    col.innerHTML = boardFractions[k];
	    k++;
	}
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
    problem = problemFractions[Math.floor(Math.random() * problemFractions.length)] + " = ?";
    document.getElementById("problem").innerHTML = problem;
}