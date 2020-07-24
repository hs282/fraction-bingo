/**
 * Initialize the UI components on load.
 */
(function initUI() {
    addRow();
})();

/**
 * Add a binary string row that can be translated into an ASCII character.
 */
function addRow() {
    if (!document.getElementById("binary-container")) return;
    // create a letter div
    let div = document.createElement("div");
    div.className = "letter";
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
 * Translate the binary story text into ASCII.
 */
function translateStory() {
    stop = true;
    let story = document.getElementById("story");
    let text = document.getElementById("hiddenText").innerHTML;
    story.innerHTML = text;
    document.getElementById("translateButton").disabled = true;
}

/**
 * Remove a binary string row.
 */
function deleteRow() {
    div = document.querySelector(".letter");
    document.querySelector("#binary-container").removeChild(div);
}

/**
 * Displays text using a typewriter effect.
 * @type {number}
 */
let stop = false;

function typeWriter() {
    let hidden = document.getElementById("hiddenText");
    let text = hidden.innerHTML;
    let i = 0;
    let speed = 25;
    if (hidden.className == "translate") text = convertToBinary(text);
    type(speed, i, text);
}

/**
 * Recursive function to type all letters for typewriter effect
 * @param speed
 * @param i index variable
 * @param binaryText
 */
function type(speed, i, text) {
    if (stop) return;
    if (i < text.length) {
        document.getElementById("story").innerHTML += text.charAt(i);
        i++;
        setTimeout(type, speed, speed, i, text);
    }
}

/**
 * Displays text and skips the typewriter effect.
 */
function skip() {
    let hidden = document.getElementById("hiddenText");
    let text = hidden.innerHTML;
    stop = true;
    if (hidden.className == "translate") text = convertToBinary(text);
    document.getElementById("story").innerHTML = text;
    document.body.onclick = null;
}

/**
 * Compares message with desired answer.
 */
function check(string) {
    let message = "";
    let letters = document.querySelectorAll(".result");
    for (let i = 0; i < letters.length; i++) {
        message += letters[i].innerHTML;
    }
    if (message === string) {
        // displays text for user if correct
        document.getElementById("sent").innerHTML = "MESSAGE SENT";
        setTimeout(function() {
            document.getElementById("sent").innerHTML = "DOWNLOADING NEW MESSAGE";
        }, 1750);

        // follows link to next level
        setTimeout(function () {
            link = document.getElementById("hiddenText").getAttribute("href");
            window.location.href = link;
            }, 3500);
    } else {
        // displays red briefly if wrong
        document.getElementById("binary-container").style.color = "red";
        setTimeout(function() {
            document.getElementById("binary-container").style.color = "#20C20E";
        }, 500)
    }
}

/**
 * Convert text into binary.
 * @param text
 */
function convertToBinary(text) {
    let binaryText = "";
    for (let i = 0; i < text.length; i++) {
        binaryText += text[i].charCodeAt(0).toString(2) + " ";
    }
    document.getElementById("translateButton").disabled = false;
    text = binaryText;
    return text;
}