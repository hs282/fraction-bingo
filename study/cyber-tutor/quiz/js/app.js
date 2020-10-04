let myQuestions = [
  {
    question: "What does cybersecurity protect?",
    answers: [
      " Information systems, programs, and data ",
      " Houses and neighborhoods ",
      " Jobs "
    ],
    correctAnswer: " Information systems, programs, and data "
  },
  {
    question: "What does a hacker use to gain access to an information system?",
    answers: [
      " Paper and pencil ",
      " Computer ",
      " Hammer "
    ],
    correctAnswer: " Computer "
  },
  {
    question: "What is the relationship between a vulnerability and an exploit?",
    answers: [
      " An exploit is needed for a vulnerability to succeed ",
      " A vulnerability enables hackers to utilize an exploit ",
      " Hackers can use an exploit even without a vulnerability in a system "
    ],
    correctAnswer: " A vulnerability enables hackers to utilize an exploit "
  },
  {
    question: "An attacker deploys software that collects keystrokes from a victim's computer; What is this called?",
    answers: [
      " Keylogging ",
      " Watering Hole attack ",
      " Exploit "
    ],
    correctAnswer: " Keylogging "
  },
  {
    question: "What is patching?",
    answers: [
      " Debugging a program ",
      " A type of information system used by hackers ",
      " A computer update that fixes bugs and vulnerabilities "
    ],
    correctAnswer: " A computer update that fixes bugs and vulnerabilities "
  },
  {
    question: "What is NOT a possible effect of social engineering on a victim?",
    answers: [
      " Stolen passwords or other credentials ",
      " System updates ",
      " Loss of money "
    ],
    correctAnswer: " System updates "
  },
  {
    question: "A hacker posed as a bank's customer service representative and sent an email to a victim asking them to provide their account information. What is this type of attack called?",
    answers: [
      " Trojan ",
      " Phishing ",
      " Shoulder Surfing "
    ],
    correctAnswer: " Phishing "
  },
  {
    question: "A term commonly used to describe dangerous software:",
    answers: [
      " Malware ",
      " Vulnerability ",
      " FTP "
    ],
    correctAnswer: " Malware "
  },
  {
    question: "Which of these attack is done to exploit a group of people having common interests?",
    answers: [
      " Malware ",
      " Watering Hole attack ",
      " Shoulder Surfing "
    ],
    correctAnswer: " Watering Hole attack "
  },
  {
    question: "This kind of social engineering is done on leaders of companies",
    answers: [
      " Patching ",
      " Ransomware ",
      " Whaling "
    ],
    correctAnswer: " Whaling "
  },
  {
    question: "What attack makes a computer unavailable by flooding it with information?",
    answers: [
      " DoS ",
      " Phishing ",
      " Whaling "
    ],
    correctAnswer: " DoS "
  },
  
  {
    question: "What do attackers use for a DDoS attack?",
    answers: [
      " Botnet ",
      " DoS ",
      " HTTP "
    ],
    correctAnswer: " Botnet "
  },
  
  {
    question: "Gaining information from a user directly from their keyboard or screen:",
    answers: [
      " Whaling ",
      " Shoulder Surfing ",
      " Phishing "
    ],
    correctAnswer: " Shoulder Surfing "
  },
  {
    question: "What is the difference between a computer virus and a computer worm?",
    answers: [
      " A computer worm attaches itself to a program, while a virus replicates itself ",
      " They are the same thing ",
      " A computer worm replicates itself, while a virus attaches itself to a program "
    ],
    correctAnswer: " A computer worm replicates itself, while a virus attaches itself to a program "
  },
  {
    question: "Which type of malware allows the attacker to take over the user's computer and ask them for money?",
    answers: [
      " Ransomware ",
      " Phishing ",
      " Patching "
    ],
    correctAnswer: " Ransomware "
  },
  {
    question: "A user downloaded and opened a program to help them with their taxes. Their computer froze and their documents were being deleted. What kind of malware is this?",
    answers: [
      " Computer worm ",
      " Trojan ",
      " Exploit "
    ],
    correctAnswer: " Trojan "
  },
  {
    question: "What's the difference between a vulnerability and an exposure?",
    answers: [
      " A vulnerability causes an exposure ",
      " An exposure can lead to a vulnerability ",
      " An exposure makes it harder for hackers to gain unauthorized access "
    ],
    correctAnswer: " An exposure can lead to a vulnerability "
  },
  {
    question: "On what two websites can you find vulnerabilities or exploits?",
    answers: [
      " exploit-db.com and nvd.nist.gov ",
      " exploitdb.org and nist.nvd.gov ",
      " nist.exploit.com and nvd.org "
    ],
    correctAnswer: " exploit-db.com and nvd.nist.gov "
  },
  {
    question: "What network protocol is used to transfer files between a client and server computer?",
    answers: [
      " HTTP ",
      " FTP ",
      " DoS "
    ],
    correctAnswer: " FTP "
  },
  
    {
    question: "What protocol is used to define how messages are formatted and transmitted over the World Wide Web?",
    answers: [
      " HTTP ",
      " DoS ",
      " FTP "
    ],
    correctAnswer: " HTTP "
  },
  
  question: "What is a type of phishing that uses texting as a form of exploitation?",
    answers: [
      " Smishing ",
      " Ransomware ",
      " Vishing "
    ],
    correctAnswer: " Smishing "
  },
  
];

myQuestions = randomize(myQuestions);

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


function createQuiz() {
	
  // variable to store the HTML output
  const output = [];

  // for each question...
  myQuestions.forEach (
  
    (currentQuestion, questionNumber) => {

      // variable to store the list of possible answers
      const answers = [];
	  
	  currentQuestion.answers = randomize(currentQuestion.answers);
	  
      // and for each available answer...
      for (item in currentQuestion.answers) {

        // ...add an HTML radio button
		 answers.push (
		 
          `<label>
            <input type="radio" name="question${questionNumber}" value="${item}">
            ${currentQuestion.answers[item]}
          </label>`
		  
        );
      }

      // add this question and its answers to the output
      output.push (
	  
        `<div class="question"> <b> ${currentQuestion.question} </b> </div>
        <div class="answers"> ${answers.join('<br> ')}  </div>`
		
      );
    }
  );

  // finally combine our output list into one string of HTML and put it on the page
  quizContainer.innerHTML = output.join('');
}

function showAnswers() {

  // gather answer containers from our quiz
  const answerContainers = quizContainer.querySelectorAll('.answers');

  // keep track of user's answers
  let numCorrect = 0;

  // for each question...
  myQuestions.forEach ( (currentQuestion, questionNumber) => {

    // find selected answer
    const answerContainer = answerContainers[questionNumber];
    const selector = `input[name=question${questionNumber}]:checked`;
    const userAnswer = (answerContainer.querySelector(selector) || {}).value;
	
    // if answer is correct
    if (currentQuestion.answers[userAnswer] === currentQuestion.correctAnswer) {
      // add to the number of correct answers
      numCorrect++;

      // color the answers green
      answerContainers[questionNumber].style.color = 'lightgreen';
    }
    // if answer is wrong or blank
    else {
      // color the answers red
      answerContainers[questionNumber].style.color = 'red';
    }
  });

  // show number of correct answers out of total
  resultsContainer.innerHTML = `Results: ${numCorrect} out of ${myQuestions.length}`;
}

function retry(){
	resultsContainer.innerHTML = ` `;
	myQuestions = randomize(myQuestions);
	createQuiz();
	
}
//function refreshPageZ(){
//	<A HREF="javascript:history.go(0)">Click to refresh the page</A>
//}
const quizContainer = document.getElementById('quiz');
const resultsContainer = document.getElementById('results');
const submitButton = document.getElementById('submit');
const retryButton = document.getElementById('retry');

// display quiz right away
createQuiz();

// on submit, show answers
submitButton.addEventListener('click', showAnswers);
retryButton.addEventListener('click', retry);

