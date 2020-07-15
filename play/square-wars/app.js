const APP_NAME = "square-wars";
const DM = new DataManager(APP_NAME);
//global objects for the game
let player, enemy, enemys, bullet, bullets, boss, gameHandler, mathHandler, myGameArea;
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
  document.getElementById('gameMenu').style.display = 'none';
  startGame();
}

/**
* Fucntion to validate the numbers only in the input text box
* @param (Event) evt
**/
function isNumber(evt) {
  var iKeyCode = (evt.which) ? evt.which : evt.keyCode
  if ((iKeyCode != 46 && iKeyCode != 45) && iKeyCode > 31 && (iKeyCode < 48 || iKeyCode > 57)) {
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
    //this.x is set to center of the player
    this.x = (player.x + player.width - this.width + 2) - (player.width/2);
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
    let randomX2 = Math.floor(Math.random() * 240);
    if (myGameArea.framNo === 1 || myGameArea.everyInterval(120- player.roundCount)) {
      if(this.round > 20) {
        enemys.push(new Npc(30, 30, randomX, -5, 'blue'));
        enemys.push(new Npc(30, 30, randomX2, -12, 'blue'));
      } else {
        enemys.push(new Npc(30, 30, randomX, -5, 'blue'));
      }

      //spawn boss fomula round % 3 == 0 count is to hold how many are spawn
      if (this.round % 3 == 0 && this.round != 0) {
        this.spawnBoss();
      }

    }
  }


  //update enemies method to manage enemies speed on canvas
  updateEnemies() {
    //loop threw enemys and update
    for (let i = 0; i < enemys.length; i++) {
      if(this.round < 5) {
        enemys[i].y += 1.25;
      } else if(this.round < 10) {
        enemys[i].y += 1.30;
      } else if(this.round < 15) {
        enemys[i].y += 1.40;
      } else if(this.round < 20) {
        enemys[i].y += 1.50;
      } else {
        enemys[i].y += 2;
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
  spawnBoss() {
    let randomX = Math.floor(Math.random() * 240);
      //moved enmy back 500 thats why its 600 + 500 aka 11000
      boss.push(new Npc(30, 30, randomX, -10, "green"));
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
    if(myGameArea.key === 37 && myGameArea.spaceBar == true) {
      this.spawnBullet();
      player.speedX = -5;
    } else if (myGameArea.key === 39 && myGameArea.spaceBar == true) {
      this.spawnBullet();
      player.speedX = 5;
    } else if(myGameArea.key === 38 && myGameArea.spaceBar == true) {
      this.spawnBullet();
      player.speedY = -5;
    } else if(myGameArea.key === 40 && myGameArea.spaceBar == true) {
      this.spawnBullet();
      player.speedY = 5;
    } else if (myGameArea.key === 37) {
      player.speedX = -5;
    } else if (myGameArea.key === 39) {
      player.speedX = 5;
    }else if (myGameArea.key === 38) {
      player.speedY = -5;
    }else if (myGameArea.key === 40) {
      player.speedY = 5;
    }else if (myGameArea.spaceBar == true) {
      this.spawnBullet();
    }
  }

  //write the score to the html
  updateScoreMenu() {
    //show player killCount
    document.getElementById('killCount').textContent = `Enemies Defeated: ${player.killCount}`;
    document.getElementById('roundCounter').textContent = `Round: ${gameHandler.getRound()}`;
  }
}

/**
* MathClassHandler is used to display and control the math equations presented to the user
* roundHandler is what calls these methods this is simply to keep all the equations and methods together
**/
class MathClassHandler {
  constructor(level) {
    this.level = level;
    this.kindergarten = ["+", "-"];
    this.gradeSchoolAndUp = ["+", "-", "*", "/"];
    this.kindergartenMax = 10;
    this.gradeSchoolMax = 100;
    this.middleSchoolAndUpMax = 1000;
    this.isAlgebra = false;
    this.displayEquation = "";
    this.answer = "";
    //a counter for displaying equations
    this.problemCount = 0;
  }

  //a method for displaying the popup window that shows the equation
  displayPopUp() {
    const equationArea = document.getElementById("equation");
    const input = document.getElementById("answerInput");
    const answerBtn = document.getElementById("checkAnswer");
    const mainDiv = document.querySelector("main");
    mainDiv.style.opacity = "0.2";
    this.displayEquation = this.getEquation();

    if(this.isAlgebra) {
      document.getElementById("answerSpan").textContent = "x = ";
      equationArea.textContent = this.displayEquation;
    } else {
      document.getElementById("answerSpan").textContent = "Answer:"
      equationArea.textContent = this.displayEquation + " =";
    }
    document.getElementById("popUpWindow").style.display = "block";
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

      //middle school add subract, divide  and multiply big numbers
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
        //30 percent chance of getting an algebra equation (change to 99 for algebra testing)
        if(randomNumber <= .30) {
          this.isAlgebra = true;
          equation = this.generateAlgebraEquation();
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
  * @param {String} answer
  **/
  checkAnswer() {
    if(eval(this.displayEquation).toFixed(2) == parseFloat(this.answer).toFixed(2)) {
      this.rightAnswer();
    } else {
      this.wrongAnswer();
    }
  }

  //method used to generate single varibale algebra equations in format ax(+/-)b=c
  generateAlgebraEquation() {
    let equation;
    let randomSign = Math.floor(Math.random() * this.kindergarten.length);
    let sign = this.kindergarten[randomSign];
    let num1 = Math.floor(Math.random() * this.kindergartenMax);
    let num2 = Math.floor(Math.random() * this.kindergartenMax);
    let num3 = Math.floor(Math.random() * this.kindergartenMax);

    //so each equation has a complete answer
    if(num1 == 0 || num1 == 1) {
      num1 = 2;
    }
    if(num2 == 0) {
      num2 = 1;
    }

    equation = `${num1}x ${sign} ${num2} = ${num3}`;
    return equation;

  }

  /**
  * method used to check algebra equations in format ax(+/-)b=c
  **/
  checkAlgebraAnswer() {
    let compAnswer;
    let arr = this.displayEquation.split(" ");
    let a = parseInt(arr[0].charAt(0));
    let sign = arr[1];
    let b = parseInt(arr[2]);
    let c = parseInt(arr[4]);

    switch(sign) {
      case '+':
        compAnswer = (c - b) / a;
        break;
      case '-':
        compAnswer = (b + c) / a;
        break;
    }

    if(parseFloat(compAnswer).toFixed(2) == parseFloat(this.answer).toFixed(2)) {
      this.rightAnswer()
    } else {
      this.wrongAnswer();
    }
  }

  //a method used continue the game if the answer is right!
  rightAnswer() {
    if(this.problemCount > 3) {
      document.getElementById("popUpWindow").style.border = ".1em solid black";
      document.getElementById("popUpWindow").style.display = "none";
      document.getElementById("answerInput").style.border = ".1em solid black";
      document.getElementById("answerInput").value = "";
      document.querySelector("main").style.opacity = "1.0";
      this.isAlgebra = false;
      gamePlaying = true;
      this.problemCount = 0;
    } else {
      document.getElementById("popUpWindow").style.border = ".1em solid black";
      document.getElementById("popUpWindow").style.display = "none";
      document.getElementById("answerInput").style.border = ".1em solid black";
      document.getElementById("answerInput").value = "";
      this.isAlgebra = false;
      this.problemCount += 1;
      this.displayPopUp();
    }
    console.log(this.problemCount);
  }

  //method to display a redbox when a wrong answer is entered
  wrongAnswer() {
    document.getElementById("popUpWindow").style.border = ".1em solid red";
    document.getElementById("answerInput").style.border = ".1em solid red";
    document.getElementById("answerInput").value = "";
  }
}

/**
* The high score handler class handles alll the saving and checking of the players score / highscore
**/
class HighScoreHandler {
  //constructor to get the current high score and if undefined make 0
  constructor(){
    this.highScore = parseInt((DM.getItem("score") != undefined) ? DM.getItem("score") : 0);
  }

  //boolean method for determing highscore
  ifNewHighScore() {
    let result = false;
    if(player.killCount > this.highScore) {
      result = true;
    }
    return result;
  }

  //save the score if its a highscore
  saveNewScore() {
    if(this.ifNewHighScore()) {
      DM.saveItem("score", player.killCount);
      this.highScore = player.killCount;
    }
    //player logged in but score was not saved
    else if (DM.saveItem("score", player.killCount) ==  false) {
      alert("Error: could not save your score. Please login to save your score.");
    }
  }
}

/**
* Class for handling the Game Area aka the canvas and buttons of the game
**/
class MyGameArea {
  constructor() {
    this.canvas = document.createElement('canvas'); //canvas object
    this.arrowLeftButton = document.createElement("button");
    this.arrowRightButton = document.createElement("button");
    this.shootButton = document.createElement("button");
    this.arrowRightButton.className = "gameControlBtn";
    this.arrowLeftButton.className = "gameControlBtn";
    this.shootButton.className = "shootBtn";
    this.spaceBar = false;
    this.highScoreHandler = new HighScoreHandler();
  }

  //function for creating the canavs element and adding event listeners to the canvas element
  start() {
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
  }

  //clear the canvas and update
  clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  //the display function for game over
  gameOver() {
    this.canvas.style.display = "none";
    this.canvas.style.visibility = "hidden";
    document.getElementById("scores").style.display = "none";
    document.getElementById("scores").style.visibility = "hidden";
    this.shootButton.style.display = "none";
    this.arrowLeftButton.style.display = "none";
    this.arrowRightButton.style.display = "none";

    document.getElementById("scoreMenu").style.display = "block";
    document.getElementById("scoreMenu").style.visibility = "visible";
    if(this.highScoreHandler.ifNewHighScore()) {
      document.getElementById("highScoreTextArea").innerHTML = `Your new high score is: ${player.killCount}`;
      document.getElementById("highScorePopUp").style.display = "block";
      this.highScoreHandler.saveNewScore();
    }
    document.getElementById('yourScore').textContent = " " + player.killCount;
    document.getElementById('displayHighScore').textContent = " " + this.highScoreHandler.highScore;
  }

  /**
  * @param {Number} n
  * @returns {boolean}
  **/
  everyInterval(n) {
    if ((myGameArea.framNo / n) % 1 === 0) {
      return true;
    }
    return false;
  }

  //score menu handler
  scoreMenu() {
    this.canvas.display = "hidden";
    document.getElementById('scoreMenu').style.display = 'hidden';
    document.getElementById('gameMenu').style.display = "none";
  }

  //check if the user is on a mobile device
  isMobile() {
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
      return true;
    } else {
      return false;
    }
  }

  //mobile display for the game interface
  displayMobile() {
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
  }

  //desktop and laptop game interface display
  displayComputer() {
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
      if(e.keyCode == 32) {
        this.spaceBar = false;
      }
      if(e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40) {
        myGameArea.key = null;
      }
    });
    window.addEventListener("keydown", (e) => {
      if(e.keyCode == 32) {
        e.preventDefault();
        this.spaceBar = true;
      }
      if(e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40) {
        e.preventDefault();
        myGameArea.key = e.keyCode;
      }
    });
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
  myGameArea = new MyGameArea();
  //for restart game
  document.getElementById("scoreMenu").style.display = "none";

  myGameArea.start();
};

//reload the whole document - easier for resetting objects and keeps canvas element created in JS and not HTML
let resetGame = () => {
  location.reload();
};



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
    if(myGameArea.spaceBar == true) {
      myGameArea.spaceBar = false;
    }
  }
}
//-----------------------------------------------------------------------------------------------------

//event listener pop-up gameMenu
const inputPopUp = document.getElementById("answerInput");
const answerBtnPopUp = document.getElementById("checkAnswer");

inputPopUp.addEventListener("keyup", (e) => {
  if(e.keyCode === 13) {
    mathHandler.answer = inputPopUp.value;
    if(mathHandler.isAlgebra) {
      mathHandler.checkAlgebraAnswer();
    } else {
      mathHandler.checkAnswer();
    }
  }
});

answerBtnPopUp.addEventListener('click',(e) => {
  mathHandler.answer = inputPopUp.value;
  if(mathHandler.isAlgebra) {
    mathHandler.checkAlgebraAnswer();
  } else {
    mathHandler.checkAnswer();
  }
});

document.getElementById("closeHighScoreBtn").addEventListener("click", () => {
  document.getElementById("highScorePopUp").style.display = "none";
});

document.getElementById("playAgainBtn").addEventListener("click", () => { resetGame() })
