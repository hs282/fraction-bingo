/**
 * Initialize the UI components on load.
 */
(function initUI() {
    addRow();
    generateLetter();
})();

/**
 * Add a binary string row that can be translated into an ASCII character.
 */
function addRow() {
    // create a letter div
    let div = document.createElement("div");
    div.className = "binary-letter";
    document.getElementById("binary-container").appendChild(div);

    // create 7 bit toggle elements
    for (let i = 0; i < 7; i++) {
        // create bit element
        let span = document.createElement("span");
        span.className = "num";
        span.innerText = "0";
        span.onclick = translateBinaryString;

        // add bit element to row
        div.appendChild(span);
    }

    // add the result display element
    let resultSpan = document.createElement("span");
    resultSpan.className = "result";
    div.appendChild(resultSpan);
}

/**
 * Remove a binary string row.
 * @param {HTMLElement} el
 */
function deleteRow(el) {
    document.querySelector("#binary-container").removeChild(el);
}

/**
 * Translate a binary string into its ASCII equivalent.
 */
function translateBinaryString() {
    // flip the cell contents
    this.innerHTML === "1" ? this.innerHTML = "0" : this.innerHTML = "1";

    // Get the cells in the line
    let cells = this.parentNode.querySelectorAll(".num");

    // create binary string by reading states from cells
    let binaryString = Array.from(cells).map(x => x.innerHTML).join("");
				
    // Show conversion from binary to ASCII character
    let resultEl = this.parentNode.querySelector(".result");

    // convert binary string to decimal number (ASCII code)
    let asciiCode = parseInt(binaryString, 2);

    // convert ASCII code to a character and show in result element
    resultEl.innerHTML = String.fromCharCode(asciiCode);
}

/**
 * Generate and display random number.
 */
function generateLetter() {
    // generate and convert random number between 65 and 90 to letter
    let letter = Math.floor(Math.random() * 26) + 65;
    letter = String.fromCharCode(letter);

    // create div to hold the random number
    let div = document.createElement("div");
    div.className = "quiz-letter";
    document.getElementById("quiz-container").appendChild(div);

    // create span to display random letter
    let span = document.createElement("span");
    span.className = "num";
    span.id = "rand-letter";
    span.innerText = letter;
    div.appendChild(span);
}

/**
 * Compare the randomly generated letter with user generated letter.
 */
function check() {
    let userLetter = document.querySelector(".result").innerHTML;
    let quizLetter = document.getElementById("rand-letter").innerHTML;

    // displays green and generates new letter if correct, displays red if incorrect
    if (userLetter === quizLetter) {
        document.getElementById("binary-container").style.color = "green";
        setTimeout(resetQuiz, 500);
    } else {
        document.getElementById("binary-container").style.color = "red";
        setTimeout(changeColorBlack, 500);
    }
}

/**
 * Reset quiz to display new random letter.
 */
function resetQuiz() {
    let div = document.querySelector(".quiz-letter");
    document.getElementById("quiz-container").removeChild(div);
    generateLetter();
    deleteRow(document.querySelector(".binary-letter"));
    addRow();
    changeColorBlack();
}

/**
 * Changes text color in binary-container to black.
 */
function changeColorBlack() {
    document.getElementById("binary-container").style.color = "black";
}