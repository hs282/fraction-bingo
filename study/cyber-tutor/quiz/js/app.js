var myQuestions = [

  {
    question: "What does cybersecurity protect?",
    answers: {
      a: " Information systems, programs, and data ",
      b: " Houses and neighborhoods ",
      c: " Jobs "
    },
    correctAnswer: " Information systems, programs, and data "
  },
  {
    question: "What does a hacker use to gain access to a system?",
    answers: {
      a: " Paper and pencil ",
      b: " Computer ",
      c: " Hammer "
    },
    correctAnswer: " Computer "
  },
  {
    question: "What is the relationship between a vulnerability and an exploit?",
    answers: {
      a: " An exploit is needed for a vulnerability to succeed ",
      b: " A vulnerability enables hackers to utilize an exploit ",
      c: " Hackers can use an exploit even without a vulnerability in a system "
    },
    correctAnswer: " A vulnerability enables hackers to utilize an exploit "
  },
  {
    question: "An attacker deploys software that collects keystrokes from a victim's computer; What is this called?",
    answers: {
      a: " Keylogging ",
      b: " Phishing ",
      c: " Exploit "
    },
    correctAnswer: " Keylogging "
  },
  {
    question: "What is patching?",
    answers: {
      a: " Debugging a program ",
      b: " A type of information system used by hackers ",
      c: " A computer update that fixes bugs and vulnerabilities "
    },
    correctAnswer: " A computer update that fixes bugs and vulnerabilities "
  },
  {
    question: "What is NOT a possible effect of social engineering on a victim?",
    answers: {
      a: " Stolen passwords or other credentials ",
      b: " System updates ",
      c: " Loss of money "
    },
    correctAnswer: " System updates "
  },
  {
    question: "A hacker posed as a bank's customer service representative and sent an email to a victim asking them to provide their account information. What is this type of attack called?",
    answers: {
      a: " Keylogging ",
      b: " Phishing ",
      c: " Vulnerability "
    },
    correctAnswer: " Phishing "
  },
];

myQuestions = randomize(myQuestions);

function randomize (obj) {
	var index;
	var temp;
	for (var i = obj.length - 1; i > 0; i--) {
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
	  var arr = [];
	  var k = 0;
	  for (letter in currentQuestion.answers) {
	  arr[k] = currentQuestion.answers[letter];
	  k = k+1;
	  }
	  
	  arr = randomize(arr);
	  
	  var k = 0;
	  for (letter in currentQuestion.answers) {
		currentQuestion.answers[letter] = arr[k];
		k = k+1;
	  }
	 
      // and for each available answer...
      for (letter in currentQuestion.answers) {

        // ...add an HTML radio button
		 answers.push (
		 
          `<label>
            <input type="radio" name="question${questionNumber}" value="${letter}">
            ${currentQuestion.answers[letter]}
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
