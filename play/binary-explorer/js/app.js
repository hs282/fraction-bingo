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
    // create a letter div
    let div = document.createElement("div");
    div.className = "letter";
    document.getElementById("binary-container").appendChild(div);

    // add a letter delete button
    let button = document.createElement("button");
    button.className = "removeButton";
    button.innerHTML = "&times;";
    button.onclick = () => deleteRow(div);
    div.appendChild(button);

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
 * Add letters translated from binary string rows to the message.
 */
function addToMessage() {
    // create message span if not created before
    let messageContainer = document.getElementById("message-container");
    if (document.getElementById("message") == null) {
        let span = document.createElement("span");
        span.id = "message";
        messageContainer.appendChild(span);
    }

    // insert message to span
    let message = [""];
    let span = document.getElementById("message");
    let letters = document.querySelectorAll(".result");
    for (let i = 0; i < letters.length; i++) {
        message.push(letters[i].innerHTML);
    }
    span.innerText += message.join("");

    // reset binary rows
    let div = document.getElementById("binary-container");
    while (div.firstChild) {
        //div.removeChild(div.lastChild);
        deleteRow(div.querySelector(".letter"));
    }
    addRow();
}

function deleteMessage() {
    let span = document.getElementById("message");
    document.getElementById("message-container").removeChild(span);
}