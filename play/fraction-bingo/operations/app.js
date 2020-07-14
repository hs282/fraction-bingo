var addLevel = "",
    subLevel = "",
    multLevel = "",
    divLevel = "",
    operations = [],
    operands = [],
    boardFractions= [],
    boardType = "",
    numOperandPairs = 0,
    problems = [],
    problem = "";

function operationDiffDisplay(operationId, difficultyId) {
    var checkBox = document.getElementById(operationId);
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
	numOperandPairs = 18;
    } else if (document.getElementById("four").checked) {
	document.getElementsByName("board4")[0].style.display = "";
	boardType = "board4";
	numOperandPairs = 32;
    } else if (document.getElementById("five").checked) {
	document.getElementsByName("board5")[0].style.display = "";
	boardType = "board5";
	numOperandPairs = 50;
    } else {
	return;
    }
    getOperations();
    generateFractions();
    fillBoard();
    generateProblem();

    document.getElementById("start").style.display = "none";
    document.getElementById("game").style.display = "";
}

function getOperations() {
    if (document.getElementById("fractAdd").checked) {
	operations.push("+");
    }
    if (document.getElementById("fractSub").checked) {
	operations.push("-");
    }
    if (document.getElementById("fractDiv").checked) {
	operations.push("/");
    }
    if (document.getElementById("fractMult").checked) {
	operations.push("*");
    }
}

function generateFractions() {
    for (var i = 0; i < numOperandPairs; i++) {
	let min = 0, max = 20;
	let op = operations[Math.floor(Math.random() * operations.length)];
	if (op == "+") {
	    max *= addLevel;
	} else if (op == "-") {
	    max *= subLevel;
	} else if (op == "/") {
	    max *= divLevel;
	} else {
	    max *= multLevel;
	}
	let fract1;
	let fract2;
 	let numer1 = Math.floor(Math.random() * (max - min + 1)) + min;
	min = 1;
	let denom1 = Math.floor(Math.random() * (max - min + 1)) + min;
	fract1 = numer1 + "/" + denom1;
	min = 0;
	let numer2 = Math.floor(Math.random() * (max - min + 1)) + min;
	min = 1;
	let denom2 = Math.floor(Math.random() * (max - min + 1)) + min;
	fract2 = numer2 + "/" + denom2;
	let solution = getSolution(numer1, numer2, denom1, denom2, op);
	let probObj = {
	    "operandOne": fract1,
	    "operandTwo": fract2,
	    "operation": op,
	    "answer": solution
	}  
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

// Fill board table cells with answers to problems
function fillBoard() {
    let table = document.getElementsByName(boardType)[0];
    var k = 0;
    for (var i = 0, row; row = table.rows[i]; i++) {
	for (var j = 0, col; col = row.cells[j]; j++) {
	    col.innerHTML = problems[k].answer;
	    k++;
	}
    }
}

function generateProblem() {
    let index = Math.floor(Math.random() * problems.length);
    let randomProb = problems[index];
    problem = randomProb.operandOne + " " + randomProb.operation + " " +  randomProb.operandTwo + " = ?";
    document.getElementById("problem").innerHTML = problem;
}