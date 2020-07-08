//global objects for the game
let player, enemy, enemys, bullet, bullets, boss, gameHandler, mathHandler;
//global boolean for the game engine
let gamePlaying;

//difficulty level for game preset to 1
let difficultyLevel = 1

/**
* used to set the difficulty level from the html main menu buttons
* difficultyLevel is used to set up the MathClassHandler
* @param {String} Level
**/
function setLevel(level) {
  intLevel = parseInt(level)
  difficultyLevel = intLevel;
  document.getElementById("gameBtn").style.display = "inline";
}

/**
* Fucntion to validate the numbers only in the input text box
* @param (Event) evt
**/
function isNumber(evt) {
  var iKeyCode = (evt.which) ? evt.which : evt.keyCode
  if (iKeyCode != 46 && iKeyCode > 31 && (iKeyCode < 48 || iKeyCode > 57)) {
    return false;
  }
  return true;
 }


/**
  MoveableCanvasObject class is all objects that are moveable on the canavs
**/
class MoveableCanvasObject {
  constructor(width, height, x, y, color) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.color = color;
  }
  update() {
    let ctx = myGameArea.context;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
  newPos() {
    this.x += this.speedX;
    this.y += this.speedY;
  }

}

/**
* player class used used to update play speed and postion on canvas/map clipping
**/
class Player extends MoveableCanvasObject {
  constructor(width, height, x, y, color, killCount, roundCount) {
    super(width, height, x, y, color);
    this.speedX = 0;
    this.speedY = 0;
    this.killCount = killCount;
    this.roundCount = roundCount;
    this.ArrowButtons = false;
    this.booleanEquation = true;
  }
  /**
  * if a arrow button is pressed arrowButton is true this runs the code only once
  * otherwise an arrow key is pressed and arrowButtons = false so the code runs every 20mill
  * because the game engine is calling it for constant updates this give mobile users better control of the player
  **/
  resetSpeed() {
    if(!this.ArrowButtons) {
      player.speedX = 0;
      player.speedY = 0;
    }
    this.ArrowButtons = false;
  }
  //map clipping - check if the player is inside the map
  checkPosition() {
    if (this.y <= 0) {
      this.y = 0;
    }
    if (this.y >= 568) {
      this.y = 568;
    }
    if (this.x <= 0) {
      this.x = 0;
    }
    if(this.x >= 295) {
      this.x = 295;
    }
  }
}


//npc/ enemy constructor
class Npc extends MoveableCanvasObject {
  constructor(width, height, x, y, color) {
    super(width, height, x, y, color);
    this.speedX = 0;
  }
  //Override MoveableCanvasObject
  newPos() {
    this.x += this.speedX;
  }
}


//bullet class
class Bullet extends MoveableCanvasObject {
  constructor(width, height, x, y, color) {
    super(width, height, x, y, color);
    this.speedY = 0;
  }
  //override MoveableCanvasObject
  newPos() {
    this.y += this.speedY;
  }
  shoot() {
    this.x = player.x+8;
    this.y = player.y;
    this.speedY = -10;
  }

  /**
  * @param {Object} otherobj
  * @returns {boolean} crash
  * The method for checking whether the bullet has hit any object on the canvas
  **/
  crashWith(otherobj) {
    let crash = true;
    if(otherobj != undefined) {
      let myleft = this.x;
      let myright = this.x + (this.width);
      let mytop = this.y;
      let mybottom = this.y + (this.height);
      let otherleft = otherobj.x;
      let otherright = otherobj.x + (otherobj.width);
      let othertop = otherobj.y;
      let otherbottom = otherobj.y + (otherobj.height);
      if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
        crash = false;
      }
    }
    return crash;
  }
}





//game handlers handles all game related specs
class Game_Handler {
  constructor(round) {
    this.round = round;
  }

  /**
  * If enemies or boss pass the player and touch the bottom of canavs then game over
  **/
  checkWin() {
    //for enemies
    for (let i = 0; i < enemys.length; i++) {
      if (enemys[i].y > 590 && enemys[i].x != undefined && enemys[i].y != undefined) {
        gamePlaying = false;
        myGameArea.gameOver();
        myGameArea.scoreMenu();
      }
    }
    //for bosses
    for (let i = 0; i < boss.length; i++) {
      if (boss[i].y > 590 && boss[i].x != undefined && boss[i].y != undefined) {
        gamePlaying = false;
        myGameArea.gameOver();
        myGameArea.scoreMenu();
      }
    }
  }

  /**
  * Method for handling crashes with enemies
  * if the bullet hits the enemy slice the enemy from the array and add a kill count
  **/
  checkCrashHandle() {
    for (let i = 0; i < enemys.length; i++) {
      for (let j = 0; j < bullets.length; j++) {
        if (bullets[j].crashWith(enemys[i]) && enemys[i] != undefined) {
          enemys.splice(enemys.indexOf(enemys[i]), 1);
          bullets.splice(bullets.indexOf(bullets[j]), 1);
          this.roundHandler();
          player.killCount += 1;
          this.updateScoreMenu();

        }
      }
    }
  }

  /**
  * subroutine for handling rounds
  * rounds fomula is killCount % 10 == 0 then add a round
  * round 80 is max round
  * eqution round is every 3 rounds
  **/
  roundHandler() {
    let maxRound = 80;
    if (player.roundCount < maxRound) {
      player.roundCount += 1;
    }

    if (player.killCount % 10 === 0) {
      this.round += 1;
    }

    //this is to launch the eqution before boss rounds every three rounds
    if(this.round % 3 == 0 && player.booleanEquation) {
      gamePlaying = false;
      player.booleanEquation = false;
      mathHandler.displayPopUp();
    }
    //set the other rounds to true
    if(this.round % 3 != 0) {
      player.booleanEquation = true;
    }
  }

  /**
    * Method for handling crashes with bosses
    * if the bullet hits the boss slice the enemy from the array and add a kill count
    * does not give points
    **/
  checkCrashHandleBoss() {
    for (let i = 0; i < bullets.length; i++) {
      for (let j = 0; j < boss.length; j++) {
        if (bullets[i].crashWith(boss[j]) && boss[j] != undefined) {
          boss.splice(boss.indexOf(boss[j]), 1);
        }
      }
    }
  }

  //spawn bullet from player shooting
  spawnBullet() {
    let bullet = new Bullet(5, 10, -2, -2, 'black');
    bullet.shoot();
    bullets.push(bullet);
  }

  /**
  * spawn enemies method spawns enemies based on the round and interval
  * fromula interval 120 (constant) - round % 1 == 0
  * This allows for enemies to spawn based off of current round
  **/
  spawnEnemies() {
    let randomX = Math.floor(Math.random() * 240);
    if (myGameArea.framNo === 1 || myGameArea.everyInterval(120 - player.roundCount)) {
      enemys.push(new Npc(30, 30, randomX, -5, 'blue'));

      //spawn boss fomula round % 3 == 0 count is to hold how many are spawn
      if (this.round % 3 == 0 && this.round != 0) {
        //turn killcount to string to send data to compare
        let holdData = player.roundCount.toString();
        holdData = holdData.split('');
        holdData = holdData.slice(0, 1);
        parseInt(holdData);
        this.spawnBoss(holdData)
      }

    }
  }


  //update enemies method to manage enemies speed on canvas
  updateEnemies() {
    //loop threw enemys and update
    for (let i = 0; i < enemys.length; i++) {
      //if player has killCount of 100 enemys move faster
      if (player.killCount >= 100) {
        enemys[i].y += 1.30;
      } else {
        enemys[i].y += 1.25;
      }
      enemys[i].update();
    }
  }

  //update bullets to maintain speed and position on canvas
  updateBullets() {
    //update bullet
    for (let j = 0; j < bullets.length; j++) {
      if (bullets[j].y <= 0) {
        bullets.splice(bullets.indexOf(bullets[j]), 1);
      }
      if(bullets[j] != undefined) {
        bullets[j].newPos();
        bullets[j].update();
      }
    }
  }

  //update boss to maintain speed and position on canvas
  updateBoss() {
    if(boss.length != 0) {
      boss.forEach((el) => {
        el.y += 1;
        el.newPos();
        el.update();
      });
    }
  }

  /**
  * This is called from the game engine every 20millsec so having a count variable limits the amout of
  * bosses. equation is: time(millsec), count(int) round(int) spawn(int):
  * equation = while(round is a boss round aka round % 3 == 0 and count  < round) spawn = time*count
  * this equation and method is only run depending on spawn enemies equation 120-playerkillCount % 1 === 0
  * @param {number} count
  **/
  spawnBoss(count) {
    let randomX = Math.floor(Math.random() * 240);
    if (count <= this.round) {
      //moved enmy back 500 thats why its 600 + 500 aka 11000
      boss.push(new Npc(30, 30, randomX, -10, "green"));
      count++;
    }
  }

  /**
  * @returns {number} this.round
  **/
  getRound() {
    return this.round;
  }

  /**
  * A method for checking the event key pressed on the window
  * If arrow keys are selected move the player
  * If space is selected fire bulelt
  * use javascript e keycodes to find the key codes online
  **/
  checkKeyCode() {
    if (myGameArea.key === 37) {
      player.speedX = -5;
    }
    if (myGameArea.key === 39) {
      player.speedX = 5;
    }
    if (myGameArea.key === 38) {
      player.speedY = -5;
    }
    if (myGameArea.key === 40) {
      player.speedY = 5;
    }
    if (myGameArea.key === 32) {
      gameHandler.spawnBullet();
    }
  }

  //write the score to the html
  updateScoreMenu() {
    //show player killCount
    document.getElementById('killCount').textContent = `Player kill-count: ${player.killCount}`;
    document.getElementById('roundCounter').textContent = `This Round: ${gameHandler.getRound()}`;
  }
}

/**
* MathClassHandler is used to display and control the math equations presented to the user
* roundHandler is what calls these methods this is simply to keep all the equations and methods together
**/
class MathClassHandler {
  constructor(level) {
    this.level = level;
    //all the equations used depending on level
    //basic equations right now just for testing use
    this.kindergarten = ["+", "-"];
    this.gradeSchoolAndUp = ["+", "-", "x", "/"];
    this.kindergartenMax = 10;
    this.gradeSchoolMax = 100;
    this.middleSchoolAndUpMax = 1000;
    this.isAlgebra = false;
    //JUST FOR TESTING ALGEBRA DECISION TREE
    this.algebraEquations = ["2x = 2", "2x + 4 = 2", "4x -2 = 6"];
    this.algebraEquationsAnswers = ["1", "-1", "2"];
  }

  //a method for displaying the popup window that shows the equation
  displayPopUp() {
    const equationArea = document.getElementById("equation");
    const input = document.getElementById("answerInput");
    const answerBtn = document.getElementById("checkAnswer");
    let equation = this.getEquation();
    equationArea.textContent = equation + " =";
    document.getElementById("popUpWindow").style.display = "block";

    input.addEventListener("keyup", (e) => {
      if(e.keyCode === 13) {
        let answer = input.value;
        if(this.isAlgebra) {
          this.checkAlgebraAnswer(equation, answer);
        } else {
          this.checkAnswer(equation, answer);
        }
      }
    });

    answerBtn.addEventListener('click',(e) => {
      let answer = input.value;
      if(this.isAlgebra) {
        this.checkAlgebraAnswer(equation, answer);
      } else {
        this.checkAnswer(equation, answer);
      }
    });
  }

  /**
  * a method used to generate math equations depending upton the difficulty level
  * @returns {String} equation - a Sting containing the generated equation
  **/
  getEquation() {
    let num1, num2, randomSign, sign, equation;

    switch(this.level) {

      //kindergargen single and digit add and subtract no negatives
      case 1:
        num1 = Math.floor(Math.random() * this.kindergartenMax);
        num2 = Math.floor(Math.random() * this.kindergartenMax);
        randomSign = Math.floor(Math.random() * this.kindergarten.length);
        sign = this.kindergarten[randomSign];

        //if the first number is smaller swtich the two numbers so subtracting is easier
        if(num1 < num2) {
          let hold = num1;
          num1 = num2;
          num2 = hold;
        }
        equation = `${num1} ${sign} ${num2}`;
      break;


      //grade school add subtract divide and multiply small numbers
      case 2:
         randomSign = Math.floor(Math.random() * this.gradeSchoolAndUp.length);
         sign = this.gradeSchoolAndUp[randomSign];
        //if multiply or dividing keep one number small
        if(sign == "x" || sign == "/") {
          num1 = Math.floor(Math.random() * this.kindergartenMax);
        } else {
          num1 = Math.floor(Math.random() * this.gradeSchoolMax);
        }

        num2 = Math.floor(Math.random() * this.gradeSchoolMax);
        equation = `${num1} ${sign} ${num2}`;
      break;

      //middle school add subract and multiply big numbers
      case 3:
        randomSign = Math.floor(Math.random() * this.gradeSchoolAndUp.length);
        sign = this.gradeSchoolAndUp[randomSign];
        num1 = Math.floor(Math.random() * this.gradeSchoolMax);
        num2 = Math.floor(Math.random() * this.gradeSchoolMax);
        equation = `${num1} ${sign} ${num2}`;
      break;

      //highschool is the same as middle school but has a change of algebra problem

      case 4:
        let randomNumber = Math.random();
        //30 percent chance of getting an algebra equation
        if(randomNumber <= .30) {
          this.isAlgebra = true;
          let randomEquation = Math.floor(Math.random() * this.algebraEquations.length);
          equation = this.algebraEquations[randomEquation];
        } else {
          randomSign = Math.floor(Math.random() * this.gradeSchoolAndUp.length);
          sign = this.gradeSchoolAndUp[randomSign];
          num1 = Math.floor(Math.random() * this.gradeSchoolMax);
          num2 = Math.floor(Math.random() * this.gradeSchoolMax);
          equation = `${num1} ${sign} ${num2}`;
        }
      break;
    }
    //to make sure you dont divide by 0
    if(sign == "/" && num2 == 0) {
      num2 = 1;
    }

    return equation;
  }

  /**
  * Method used to find the answer to an equation
  * @param {String} equation
  * @param {number} answer
  **/
  checkAnswer(equation, answer) {
    if(eval(equation).toFixed(2) == parseFloat(answer).toFixed(2)) {
      this.rightAnswer();
    } else {
      this.wrongAnswer();
    }
  }

  checkAlgebraAnswer(equation, answer) {
    let i = this.algebraEquations.indexOf(equation);
    if(answer == this.algebraEquationsAnswers[i]) {
      this.rightAnswer()
    } else {
      this.wrongAnswer();
    }
  }

  //a method used continue the game if the answer is right!
  rightAnswer() {
    document.getElementById("popUpWindow").style.borderStyle = "none";
    document.getElementById("popUpWindow").style.display = "none";
    document.getElementById("answerInput").style.borderStyle = "none";
    document.getElementById("answerInput").value = "";
    gamePlaying = true;
    this.isAlgebra = false;
  }

  wrongAnswer() {
    document.getElementById("popUpWindow").style.border = ".1em solid red";
    document.getElementById("answerInput").style.border = ".1em solid red";
  }
}





//The starting function for the game
let startGame = () => {
  document.getElementById("scores").style.display = "inline";
  document.getElementById("scores").style.visibility = "visible";
  enemys = [];
  boss = [];
  bullets = [];
  gamePlaying = true;
  player = new Player(30, 30, 150, 550, 'red', 0, 0);
  gameHandler = new Game_Handler(0);
  mathHandler = new MathClassHandler(difficultyLevel);

  myGameArea.start();
}


//This is for the creating and maintaining of canvas object and other html elements STATIC CLASS
let myGameArea = {
  //game interface objects
  canvas: document.createElement('canvas'), //canvas object
  arrowLeftButton: document.createElement("button"),
  arrowRightButton: document.createElement("button"),
  shootButton: document.createElement("button"),

  //function for creating the canavs element and adding event listeners to the canvas element
  start: function() {

    /**
    * css handles canvas size for mobile but this handles the pixel size
    * If need to chnage the pixels do so here CSS is only for phone display
    * This controls the width and height for the game functions not the CSS
    **/
    let width = window.screen.width;
    let height = window.screen.height;

    if(width > 320) {
      this.canvas.width = 320;
    } else {
      this.canvas.width = width;
    }

    if(height > 600) {
      this.canvas.height = 600;
    } else {
      this.canvas.height = height;
    }

    //if its a mobile devise display the mobile buttons otherwise just let player use arrow keys
    if(this.isMobile()) {
      this.displayMobile();
    } else {
      this.displayComputer()
    }

    this.framNo = 0;

    //this calls the game engine
    this.interval = setInterval(updateGameArea, 20);

  },

  //clear the canvas and update
  clear: function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },

  //the display function for game over
  gameOver: function() {
    this.canvas.style.display = "none";
    this.canvas.style.visibility = "hidden";
    document.getElementById("scores").style.display = "none";
    document.getElementById("scores").style.visibility = "hidden";
    document.getElementById("scoreMenu").style.display = "block";
    document.getElementById("scoreMenu").style.visibility = "visible";
    this.shootButton.style.display = "none";
    this.arrowLeftButton.style.display = "none";
    this.arrowRightButton.style.display = "none";
    document.getElementById('yourScore').textContent = " " + player.killCount;
  },

  /**
  * @param {Number} n
  * @returns {boolean}
  **/
  everyInterval: function(n) {
    if ((myGameArea.framNo / n) % 1 === 0) {
      return true;
    }
    return false;
  },

  //score menu handler
  scoreMenu: function() {
    myGameArea.canvas.display = "hidden";
    document.getElementById('scoreMenu').style.display = 'hidden';
    document.getElementById('gameMenu').style.display = "none";
  },

  //check if the user is on a mobile device
  isMobile: function() {
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
      return true;
    } else {
      return false;
    }

  },

  //mobile display for the game interface
  displayMobile: function() {
    //appending canavs and shooting buttons !needs to be this order for mobile!
    this.shootButton.innerHTML = "Shoot";
    document.querySelector("main").appendChild(this.shootButton);
    this.context = this.canvas.getContext('2d');
    document.querySelector("main").appendChild(this.canvas);
    this.canvas.display = 'inline-block';
    this.canvas.float = 'right';

    //arrow buttons
    this.arrowLeftButton.innerHTML = "Left";
    this.arrowRightButton.innerHTML = "Right";
    this.arrowLeftButton.style.padding = '4%';
    this.arrowRightButton.style.padding = '4%';
    this.shootButton.style.padding = '6%';
    document.querySelector("main").appendChild(this.arrowLeftButton);
    document.querySelector("main").appendChild(this.arrowRightButton);

    /***
    * Because the game engine constantly keep reseting the player speed for the arrow key
    * There need to be a boolean varaible to determin weather or not the movement came from the button or arrow
    * put into a player method
    **/
    this.shootButton.addEventListener("click", (e) => { gameHandler.spawnBullet() });
    this.arrowLeftButton.addEventListener("click", (e) => {
      player.ArrowButtons = true;
      player.speedX = -30
    });
    this.arrowRightButton.addEventListener("click", (e) => {
      player.ArrowButtons = true;
      player.speedX = 30
    });
  },

  //desktop and laptop game interface display
  displayComputer: function() {
    //appending canavs
    this.context = this.canvas.getContext('2d');
    document.querySelector("main").appendChild(this.canvas);
    this.canvas.display = 'inline-block';
    this.canvas.float = 'right';


    /**
    * @param {Event} e
    * create event listeners for the game disable the arrow keys and space bar for scrolling use
    * keyup is to disable the players movement on lift aka stop the player from moving when the arrow is not pressed
    **/
    window.addEventListener("keyup", (e) => {
      if(e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40) {
        myGameArea.key = null;
      }
    });
    window.addEventListener("keydown", (e) => {
      if(e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40 || e.keyCode == 32) {
        e.preventDefault();
        myGameArea.key = e.keyCode;
      }
    });

  }

}

//----------------------------------------------------------------------------------------------------
//  GAME ENGINE CONSTANTLY RUNNING !!

//game area always updating every 20mill sec ...
let updateGameArea = () => {
  //if gamePlaying = true
  if (gamePlaying) {
    gameHandler.checkWin();
    gameHandler.checkCrashHandle();
    gameHandler.checkCrashHandleBoss();
    myGameArea.clear();
    //must reset player speed
    player.resetSpeed();
    gameHandler.checkKeyCode();

    gameHandler.spawnEnemies();
    gameHandler.updateEnemies();
    //update player
    player.checkPosition();
    player.newPos();
    player.update();
    gameHandler.updateBullets();
    gameHandler.updateBoss();


    //add a gameframe if the shoot key is enabled then disable the shoot key this prevents lined bullets!
    myGameArea.framNo += 1;
    if (myGameArea.key == 32) {
      myGameArea.key = null;
    }
  }
}
//-----------------------------------------------------------------------------------------------------

//Event listener for main menu
document.getElementById('gameBtn').addEventListener("click", () => {
    document.getElementById('gameMenu').style.display = 'none';
    startGame();
});
