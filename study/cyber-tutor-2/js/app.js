let myQuestions = [
  {
    question: "What does cybersecurity protect?",
    correctAnswer: "Information systems, programs, and data",
	responseVal: false
  },
  {
    question: "What does a hacker use to gain access to an information system?",
    correctAnswer: "Computer",
	responseVal: false
  },
  {
    question: "A user downloaded and opened a program to help them with their taxes. Their computer froze and their documents were being deleted. What kind of malware is this?",
    correctAnswer: "Trojan",
	responseVal: false
  },
];

/*const ALL_PROBLEM_TYPES = [
    "forLoop",
    "nestedForLoop",
    "whileLoop"
];*/

// globals
let score = 0;
//let selectedProblemTypes = JSON.parse(JSON.stringify(ALL_PROBLEM_TYPES));
let problem, answer;
let number = 0;
// initialize UI components

showProblem();

setAnswer();
//createProblemTypeCheckboxes();
wordBank();
// bind onclick functions to the buttons
document.getElementById("submit").onclick = checkAnswer;

function showProblem(){
	problem = myQuestions[number].question;
 // show problem text to user
    updatePrompt(problem);

}
function setAnswer(){
	answer = myQuestions[number].correctAnswer;
}


/*function createProblemTypeCheckboxes() {
    // create checkboxes for the user to be able to customize problem types that they practice
    ALL_PROBLEM_TYPES.forEach(problemType => {
        // create list item element
        const li = document.createElement("li");

        // create a checkbox element
        const input = document.createElement("input");
        input.type = "checkbox";
        input.id = problemType;
        input.name = problemType;
        input.value = problemType;
        input.checked = true;

        // define click action to add/remove problem type from selected problem types
        input.onclick = () => {
            // get the value of the input element
            const val = input.value;

            // if the input is checked, add to list of selected problem types
            if (input.checked) {
                selectedProblemTypes.push(val);
            }
            // if input is unchecked, remove it from the list of selected problem types
            else {
              //  selectedProblemTypes.splice(selectedProblemTypes.indexOf(val), 1);
            }

            // update prompt
            promptText = showProblem();//generateProblem();
            updatePrompt(promptText);
        }

        // create label for checkbox input
        const label = document.createElement("label");
       // label.htmlFor = problemType;
       // label.innerText = problemType;

        // add checkbox and label to list item
        li.appendChild(input);
        li.appendChild(label);

        // add list item to the problem types list element
        //document.getElementById("problemTypes").appendChild(li);
    });
}
*/


function updatePrompt(code) {
    const codeEl = document.getElementById("code");

    // clear out anything that could still be in the code prompt element
    codeEl.innerHTML = "";

    // add code mirror className so syntax highlighting works
    codeEl.className = "cm-s-default";

    // run CodeMirror syntax highlighting on the code
    CodeMirror.runMode(code, { name: "text/x-java" }, codeEl);
}


function wordBank(){
	let word = "";
	for(let i=0;i<myQuestions.length;i++){
		 word= word + myQuestions[i].correctAnswer +" | ";
	}
	document.getElementById("wordbank").innerText = word;
}

/**
 * Change the score UI element.
 * @param {Number} delta 
 */
function setScore(delta) {
    // change score by delta value
    score += delta;

    // update score UI element
    document.getElementById("score").innerText = "Score: " + score;
}

/**
 * Check the answer that the user gives.
 */
function checkAnswer() {
    // show the notification alert
    const notif = document.getElementById("notification");
    notif.style.display = "";

    // get the user's answer
    const val = document.getElementById("answer").value.trim();
	console.log("QUESTION =",myQuestions[number]);
	console.log("VAL=",val);
	console.log("ANSWER=",answer);
	console.log("NUMBER=",number);
    // if the user's answer is correct
    if (val == answer) {
        // give the user feedback that they're right
        notif.innerHTML = "That's right!";
        notif.className = "success";

        // add points to the user's score
        setScore(10);
		myQuestions[number].responseVal = true;
        // clear the user's answer
        document.getElementById("answer").value = "";
	}
    else {
        // give the user feedback that they're right
        notif.innerHTML = "That's incorrect.";
        notif.className = "failure";     
       
    }
	if(number==myQuestions.length-1){
		endQuiz();
	}
	else{
	number = number + 1;
	
	showProblem();
	setAnswer();
    // hide the notification alert after 1 second
    setTimeout(() => notif.style.display = "none", 1000);
	}
}
function endQuiz(){
	console.log("Quiz Completed!");
	var incorrect = "What you got wrong: \n";
	for(let i = 0;i<myQuestions.length;i++){
		if(myQuestions[i].responseVal==false){
			incorrect = incorrect + myQuestions[i].question + " " + myQuestions[i].correctAnswer + "\n";
		}
	}
	document.getElementById("complete").innerText = "QUIZ COMPLETED!";
	document.getElementById("results").innerText = incorrect;
}

