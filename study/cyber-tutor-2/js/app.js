let myQuestions = [
  {
    question: "A hacker created malware that looks like an adblocker but actually takes over the user's computer. What is this malware called?",
    correctAnswer: "Trojan",
    responseVal: false
  },
  {
    question: "Keylogging occurs when a program captures what from a victim?",
    correctAnswer: "Keystrokes",
    responseVal: false
  },
  {
    question: "Bella receives an email from her insurance company asking her to send them her account information. Little does she know, a hacker is posing as the company so he can get her data. This kind of attack is called: ",
    correctAnswer: "Phishing",
    responseVal: false
  },
  {
    question: "Jacob accidentally installs a malware. But, he updated his software and fixed a vulnerability before the malware was activated, so his computer was not taken over. The process of installing system updates is called: ",
    correctAnswer: "Patching",
    responseVal: false
  },
  {
    question: "A hacker realizes that Julie's system has a vulnerability; he takes advantage of it using a program. What is this program called?",
    correctAnswer: "Exploit",
    responseVal: false
  },
  {
    question: "Henry goes on nvd.nist.gov. What does he find?",
    correctAnswer: "CVEs",
    responseVal: false
  },
];

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

function updatePrompt(code) {
    const codeEl = document.getElementById("code");

    codeEl.innerHTML = code;
}

function wordBank(){
	let words = myQuestions.map(question => question.correctAnswer);
	words = randomize(words);
   document.getElementById("wordbank").innerText = words.join(" * ");
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
function randomize (obj) {
	let index;
	let temp;
	for (let i = obj.length - 1; i > 0; i--) {
		//get random number
		index = Math.floor((Math.random() * i));
		//swapping
		temp = obj[index];
		obj[index] = obj[i];
		obj[i] = temp;
	}
	return obj;
}
function endQuiz(){
    var incorrect = "What you got wrong: \n";
    for(let i = 0;i<myQuestions.length;i++){
        if(myQuestions[i].responseVal==false){
            incorrect = incorrect + myQuestions[i].question + " --> " + myQuestions[i].correctAnswer + "\n\n";
        }
    }
    document.getElementById("complete").innerText = "QUIZ COMPLETED!";
    document.getElementById("results").innerText = incorrect;
}

