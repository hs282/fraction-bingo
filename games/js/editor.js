const my_lzma = new LZMA("../js/lzma_worker.js");
let hasLocalStorage = false;

let appName = "";

// store the html and css that will be edited by the user
let html, css;

/**
 * Set the initial HTML value that will be shown in the editor.
 * @param {String} _html 
 */
function setInitialHTML(_html) {
    html = _html;
}

/**
 * Set the initial CSS value that will be shown in the editor.
 * @param {String} _css 
 */
function setInitialCSS(_css) {
    css = _css;
}

/**
 * Set the app name that will be used to store things in localStorage.
 * @param {String} _appName 
 */
function setAppName(_appName) {
    appName = _appName;
}

window.onload = function() {
    // create splitter panel
    $(".panel-left").resizable({
        handleSelector: ".splitter",
        resizeHeight: false
    });
    
    // create CodeMirror editor
    const editor = CodeMirror(document.getElementById("editor"), {
        mode: "text/html",
        lineNumbers: true,
        indentWithTabs: true,
        indentUnit: 4,
        lineWrapping: true,
        styleActiveLine: { nonEmpty: true },
        value: html
    });

    if (window.location.hash && window.location.hash.indexOf("?") != -1) {
        const hash = window.location.hash;
        const encodedData = hash.substring(2);

        const rawData = atob(encodedData);

        const rawLength = rawData.length;
        let array = new Uint8Array(new ArrayBuffer(rawLength));

        for (let i = 0; i < rawLength; i++) {
            array[i] = rawData.charCodeAt(i);
        }

        my_lzma.decompress(array, result => {
            // convert decode string into JSON object
            const code = JSON.parse(result);

            // get HTML and CSS
            html = code.html;
            css = code.css;

            // update the HTML
            editor.setValue(html);
        });
    }

    // test for localStorage capabilities
    try {
        let test = 'test';

        localStorage.setItem(test, test);
        localStorage.removeItem(test);

        hasLocalStorage = true;
    } 
    catch(e) {
        hasLocalStorage = false;
    }

    // if the browser supports localStorage
    if (hasLocalStorage) {
        // check if the user has html saved before
        if (localStorage.getItem(`${appName}-html`)) {
            html = localStorage.getItem(`${appName}-html`);

            editor.setValue(html);
        }
        
        // check if the user has css saved before
        if (localStorage.getItem(`${appName}-css`)) {
            css = localStorage.getItem(`${appName}-css`);
        }
    }

    let currentTab = "index.html";
    function updatePreview() {
        if (currentTab == "index.html") {
            // get current HTML content from editor
            html = editor.getValue();

            // update HTML preview
            document.getElementById("preview").innerHTML = html;
        }
        else if (currentTab == "style.css") {
            // get current CSS content from editor
            css = editor.getValue();

            // update CSS style
            document.getElementById("userStyle").innerHTML = css;
        }

        // if localStorage available, save code
        if (hasLocalStorage) {
            localStorage.setItem(`${appName}-html`, html);
            localStorage.setItem(`${appName}-css`, css);
        }
    }

    // when the editor is updated handler
    let delay;
    editor.on("change", () => {
        // reset delay and add delay again
        clearTimeout(delay);
        delay = setTimeout(updatePreview, 300);
    });

    // show initial preview
    updatePreview();

    // Add click listener to the menu file tabs
    for (const li of document.querySelectorAll("#fileMenu ul li")) {
        li.addEventListener("click", e => {
            // do not modify content if clicking on already active tab
            if (e.srcElement.className == "active") return;

            // get rid of previously active element
            document.querySelector("#fileMenu ul li.active").className = "";

            // make the clicked tab active and change the current tab
            e.srcElement.className = "active";
            currentTab = e.srcElement.innerHTML;

            // if just clicked on index.html tab
            if (currentTab == "index.html") {
                // save css content
                css = editor.getValue();

                // show html content
                editor.setValue(html);
                editor.setOption("mode", "text/html");
            }
            // if just clicked on style.css tab
            else if (currentTab == "style.css") {
                // save html content
                html = editor.getValue();

                // show css content
                editor.setValue(css);
                editor.setOption("mode", "css");
            }
        });
    }

    // set mobile button click listeners
    document.getElementById("edit").onclick = editMobile;
    document.getElementById("execute").onclick = runMobile;

    function runMobile() {
        // hide code editor
        document.getElementsByClassName("panel-left")[0].style.display = "none";

        updatePreview();

        // show preview
        document.getElementById("preview").style.display = "block";
    }

    function editMobile() {
        // hide preview
        document.getElementById("preview").style.display = "none";

        // show code editor
        document.getElementsByClassName("panel-left")[0].style.display = "";
    }
}

// listen for escape key press
document.onkeyup = e => {
    if (e.key == "Escape") closeModal();
}

// when the user clicks anywhere outside of the modal, close it
window.onclick = e => {
    // if clicking outside of modal
    if (e.target == document.getElementById("myModal")) closeModal();
}

/**
 * Generate a standalone HTML page and download it for offline use.
 */
function exportPage() {
    // generate html page
    const page = `<html><head><style>${css}</style></head><body>${html}</body></html>`;
    
    // create html blob with html we created
    const blob = new Blob([ page ], { type: "text/html" });

    // create a download link
    const el = window.document.createElement("a");
    el.href = window.URL.createObjectURL(blob);
    el.download = "htmlearn_export.html";    

    // add link to document so we can click, then remove it
    document.body.appendChild(el);
    el.click();     
    document.body.removeChild(el);
}

/**
 * Create a URL that can be used to share code.
 */
function shareCode() {
    // get user code and stringify
    const code = JSON.stringify({ "html": html, "css": css });

    // compress code with LZMA
    my_lzma.compress(code, 9, result => {
        // convert ByteArray into string and base64 encode it
        const base64String = btoa(String.fromCharCode.apply(null, new Uint8Array(result)));

        // get current URL without any hash
        const url = location.href.replace(location.hash, "");

        // create a textarea element with the share URL
        const textArea = document.createElement("textarea");
        textArea.value = url + "#?" + base64String;

        // add to body
        document.body.appendChild(textArea);

        // focus and select text to and copy to clipboard
        textArea.focus();
        textArea.select();
        document.execCommand("copy");

        // cleanup and remove textarea element
        document.body.removeChild(textArea);

        // let the user know that the text was copied
        alert("URL copied to clipboard");
    });
}

/**
 * Open the modal.
 */
function openModal() {
    const modal = document.getElementById("myModal");

    // show modal
    modal.style.display = "block";
}

/**
 * Close the modal.
 */
function closeModal() { 
    const modal = document.getElementById("myModal");
    modal.style.display = "none";
}