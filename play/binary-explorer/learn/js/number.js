/**
 * Initialize the UI components on load.
 */
(function initUI() {
    addRow();
    generateNum();
})();

/**
 * Add a binary string row that can be translated into a decimal number.
 */
function addRow() {
    // create a letter div
    let div = document.createElement("div");
    div.className = "decimal-number";
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
 * Translate a binary string into its decimal equivalent.
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

    // convert binary string to decimal number and show in result element
    resultEl.innerHTML = parseInt(binaryString, 2).toString();
}

/**
 * Generate and display random number.
 */
function generateNum() {
    // generate random number between 0 and 127
    let num = Math.floor(Math.random() * 128);

    // create div to hold the random number
    let div = document.createElement("div");
    div.className = "quiz-num";
    document.getElementById("quiz-container").appendChild(div);

    // create span to display random number
    let span = document.createElement("span");
    span.className = "num";
    span.id = "rand-num";
    span.innerText = num.toString();
    div.appendChild(span);
}

/**
 * Compare the randomly generated number with user generated number.
 */
function check() {
    let userNum = document.querySelector(".result").innerHTML;
    let quizNum = document.getElementById("rand-num").innerHTML;

    // displays green and generates new number if correct, displays red if incorrect
    if (userNum === quizNum) {
        document.getElementById("binary-container").style.color = "green";
        setTimeout(resetQuiz, 500);
    } else {
        document.getElementById("binary-container").style.color = "red";
        setTimeout(changeColorBlack, 500);
    }
}

/**
 * Reset quiz to display new random number.
 */
function resetQuiz() {
    let div = document.querySelector(".quiz-num");
    document.getElementById("quiz-container").removeChild(div);
    generateNum();
    deleteRow(document.querySelector(".decimal-number"));
    addRow();
    changeColorBlack();
}

/**
 * Changes text color in binary-container to black.
 */
function changeColorBlack() {
    document.getElementById("binary-container").style.color = "black";
}