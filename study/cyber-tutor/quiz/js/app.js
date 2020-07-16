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
    question: "What does a hacker use to gain access to a system?",
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
      " Phishing ",
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
      " Keylogging ",
      " Phishing ",
      " Vulnerability "
    ],
    correctAnswer: " Phishing "
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
  resultsContainer.innerHTML = `${numCorrect} out of ${myQuestions.length}`;
}

const quizContainer = document.getElementById('quiz');
const resultsContainer = document.getElementById('results');
const submitButton = document.getElementById('submit');

// display quiz right away
createQuiz();

// on submit, show answers
submitButton.addEventListener('click', showAnswers);
