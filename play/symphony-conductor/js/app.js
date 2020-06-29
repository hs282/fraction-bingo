const APP_NAME = "symphony-conductor";
const hasLocalStorage = checkForLocalStorage();

const INSTRUMENTS = [
    {
        name: "snare",
        description: "Snare: Plays a snare drum sound.",
        img: "img/snare.png",
        sound: "sounds/snare.wav",
        code: `play("snare");`
    },
    {
        name: "rest",
        description: "Rest: Waits X amounts of seconds.",
        img: "img/rest.png",
        code: "await rest(1);"
    }
];

// create CodeMirror editor
const editor = CodeMirror(document.getElementById("editor"), {
    mode: "javascript",
    lineNumbers: true,
    indentWithTabs: true,
    indentUnit: 4,
    lineWrapping: true,
    styleActiveLine: { nonEmpty: true },
    value: "",
    extraKeys: {
        "Ctrl-/": instance => commentSelection(),
        "Cmd-/": instance => commentSelection()
    }
});

/**
 * Pause execution for a specific amount of seconds.
 * @param {Number} seconds 
 * @returns {Promise} timeout
 */
function rest(seconds) {
    let milliseconds = seconds * 1000;

    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

/**
 * Play an instrument's sound.
 * @param {String} instrument 
 */
function play(instrument) {
    let file = INSTRUMENTS.find(x => x.name == instrument).sound;

    let sound = new Audio(file);
    sound.play();
}

/**
 * Initialize the UI components on script load.
 */
(function initUI() {
    // create splitter panel
    $(".panel-left").resizable({
        handleSelector: ".splitter",
        resizeHeight: false
    });

    enableEditorDropDetection();

    createInstrumentElements();

    // bind bootstrap popper.js to the tooltips 
    $(`[data-toggle="tooltip"]`).tooltip();

    document.querySelector("#runCode").onclick = executeCode;
    document.querySelector("#options").onclick = openModal;

    // if has something stored
    if (hasLocalStorage) {
        if (localStorage.getItem(APP_NAME)) {
            editor.setValue(localStorage.getItem(APP_NAME));
        }
    }

    // save data on change
    editor.on("change", () => {
        if (hasLocalStorage) {
            localStorage.setItem(APP_NAME, editor.getValue());
        }
    });
})();

/**
 * Show the modal.
 */
function openModal() {
    const modal = document.getElementById("myModal");

    // show modal
    modal.style.display = "block";
}

/**
 * Hide the modal.
 */
function closeModal() { 
    const modal = document.getElementById("myModal");
    modal.style.display = "none";
}

/**
 * Execute user code.
 */
let firstRun;
function executeCode() {
    let code = `(async () => { ${editor.getValue()}\n })().catch(e => console.error(e))`;

    // add code as a script to page + execute
    let script = document.createElement("script");
    try {
        // If its first time executing something
        if (firstRun) {
            // Add script tag
            script.appendChild(document.createTextNode(code));
            document.body.appendChild(script);
        }
        else {
            // Remove old code
            document.body.removeChild(document.body.lastChild);

            // Add new code
            script.appendChild(document.createTextNode(code));
            document.body.appendChild(script);
        }
                        
        firstRun = false;
    } 
    catch (e) {
        script.text = code;
        document.body.appendChild(script);
    }
}   

/**
 * Enable the editor to have draggable elements dropped on it.
 */
function enableEditorDropDetection() {
    const editorEl = document.querySelector("#editor");

    editorEl.ondragover = e => e.preventDefault();

    editorEl.ondrop = e => {
        // prevent default drop behavior
        e.preventDefault();

        // get the attached instrument code snippet
        let instrumentCode = e.dataTransfer.getData("code");

        // if this is first line of code, do not append
        if (editor.getValue() === "") {
            editor.setValue(instrumentCode);
        }
        // otherwise append to editor
        else {
            editor.setValue(`${editor.getValue()}\n${instrumentCode}`);
        }
    }
}

/**
 * Give the instrument draggables have code snippets attached to their drag and drop
 * events.
 */
function createInstrumentElements() {
    const instrumentsEl = document.querySelector("#instruments");

    INSTRUMENTS.forEach(instrument => {
        // create an image element
        let el = document.createElement("img");
        el.src = instrument.img;

        // have tooltip show name on hover
        el.setAttribute("data-toggle", "tooltip");
        el.setAttribute("title", instrument.description);

        // bind click action to instrument
        let AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
        el.onclick = new AsyncFunction(instrument.code);

        // bind drag action with code snippet transfer to instrument
        el.ondragstart = e => e.dataTransfer.setData("code", instrument.code);

        // add the instrument to the instruments element
        instrumentsEl.appendChild(el);
    });
}

/**
 * Checks if a browser has support for localStorage to save things.
 * @returns {Boolean} hasLocalStorage
 */
function checkForLocalStorage() {
    let hasLocalStorage = true;

    try {
        let test = "test";

        localStorage.setItem(test, test);
        localStorage.removeItem(test);

        hasLocalStorage = true;
    } 
    catch (e) {
        hasLocalStorage = false;
    }
    finally {
        return hasLocalStorage;
    }
}

/**
 * Comment a selected range of lines within the CodeMirror editor.
 */
function commentSelection() {
    // iterate through lines within selected range
    const range ={ from: editor.getCursor(true), to: editor.getCursor(false) };
    for (let i = range.from.line; i <= range.to.line; i++) {
        const line = editor.getLine(i);

        // if line is already commented
        if (line.substring(0, 2) == "//") {
            let uncommentedLine;

            // if comment has trailing space
            if (line.substring(0, 3) == "// ") {
                uncommentedLine = line.replace("// ", "");
            }
            else {
                uncommentedLine = line.replace("//", "");
            }

            const from = { line: i, ch: 0 };
            const to   = { line: i, ch: line.length };

            editor.replaceRange(uncommentedLine, from, to);
        }
        // if non-blank line that is not commented
        else if (line.length) {
            const commentedLine = "// " + line;

            const from = { line: i, ch: 0 };
            const to   = { line: i, ch: line.length };

            editor.replaceRange(commentedLine, from, to);
        }
    }
}