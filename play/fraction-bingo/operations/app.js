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
	var solution = (eval(fract1 + op + fract2)).toString();
	if (solution.includes(".")) {  
	    var decArr = solution.split(".");
	    var left = decArr[0];
	    var right = decArr[1];
	    var numer = left + right;
	    var denom = Math.pow(10, right.length);
	    solution = simplifyFract(numer, denom);
	}
	let probObj = {
	    "operandOne": fract1,
	    "operandTwo": fract2,
	    "operation": op,
	    "answer": solution
	}  
	problems.push(probObj);
    }
}

function simplifyFract(numerator, denominator) {
    let gcd = function gcd(x, y) {
	return y ? gcd(y, x%y) : x;
    };
    gcd = gcd(numerator, denominator);
    return numerator/gcd + "/" + denominator/gcd;
}

// Fill board table cells with answers to problems
function fillBoard() {
    let table = document.getElementsByName(boardType)[0];
    var k = 0;
    for (var i = 0, row; row = table.rows[i]; i++) {
	for (var j = 0, col; col = row.cells[j]; j++) {
	    //col.innerHTML = problems[k].operandOne + " " + problems[k].operation + " " + problems[k].operandTwo + "=" + problems[k].answer;
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