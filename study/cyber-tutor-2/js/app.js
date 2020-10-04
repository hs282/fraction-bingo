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
  {
    question: "Johnny uses his binoculars to see Sally's screen and write down her information. What is this called?",
    correctAnswer: "Shoulder Surfing",
    responseVal: false
  },
  {
    question: "An attacker takes over Kyle's computer and says they won't let him access it until he pays 384395843984 dollars. This attack is called:",
    correctAnswer: "Ransomware",
    responseVal: false
  },
  {
    question: "A hacker targets the CEO of a hospital. They plan to conduct a phishing attack against the CEO. This can be considered what kind of attack?",
    correctAnswer: "Whaling",
    responseVal: false
  },
  {
    question: "A group of hackers sent a large amount of data to crash a web application. What is this type of attack called?",
    correctAnswer: "DoS",
    responseVal: false
  },
  {
    question: "A fake Apple customer service representative tries to trick Lillian into revealing her personal information over a phone call. This is called:",
    correctAnswer: "Vishing",
    responseVal: false
  },
];
myQuestions = randomize(myQuestions);
// globals
let score = 0;

let problem, answer;
let number = 0;
// initialize UI components
document.getElementById("retry").onclick = retry;
showProblem();

setAnswer();
//createProblemTypeCheckboxes();
wordBank();
// bind onclick functions to the buttons
setScore(0);
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
function isCheckboxChecked() {
  // Get the checkbox
  let checkBox = document.getElementById("checkWordBank");
  // Get the output text
  let text = document.getElementById("text");

  // If the checkbox is checked, display the output text
  if (checkBox.checked == true){
    text.style.display = "block";
  } else {
    text.style.display = "none";
  }
}

function retry(){
    document.getElementById("complete").innerText = "";
    document.getElementById("results").innerText = "";
    number = 0;
    showProblem();
    setAnswer();
    setScore(0);
}

function wordBank(){
    let words = myQuestions.map(question => question.correctAnswer);
    words = randomize(words);
    let checkBox = document.getElementById("checkWordBank");
    let text = document.getElementById("text");
    if (checkBox.checked == true){
        text.style.display = "block";
        document.getElementById("wordbank").innerText= " ";
   } else {
        document.getElementById("wordbank").innerText= words.join(" * ");
        text.style.display = "block";
  }
   
}

/**
 * Change the score UI element.
 * @param {Number} delta 
 */
function setScore(delta) {
    // change score by delta value
    score += delta;
    if(delta == 0){
        score = 0;
    }
    // update score UI element
    document.getElementById("score").innerText = "Score: " + score+"/"+ (myQuestions.length)*10;
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
    if (val.toLowerCase() == answer.toLowerCase()) {
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
    if (number == (myQuestions.length)-1){
        endQuiz();
        number = 0;
    }
    else {
        number++;
        
        showProblem();
        setAnswer();
        // hide the notification alert after 1 second
        setTimeout(() => notif.style.display = "none", 3000);
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
	document.getElementById("complete").innerText = "QUIZ COMPLETED!";
	if(score!=(myQuestions.length)*10){
    let incorrect = "What you got wrong: \n";
    for(let i = 0;i<myQuestions.length;i++){
        if(myQuestions[i].responseVal==false){
            incorrect = incorrect + myQuestions[i].question + " --> " + myQuestions[i].correctAnswer + "\n\n";
        }
    }
	 document.getElementById("results").innerText = incorrect;
	}
    
   
}

