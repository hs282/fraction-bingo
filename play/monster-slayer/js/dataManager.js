//jshint esversion: 6

/**
 * This API module exists so that in the future, if we want to switch to an online database, the code within games will not have
 * to change, but rather just the DataManger code will change to provide minimal code rewrites.
 */
// export default
class DataManager {
    /**
     * Initialize class data members and check if the user's browser has localStorage
     * capabilities.
     */
    constructor(appName) {
        // set the app name so we know which app's data is being managed
        this.appName = appName;

        // check if the user's browser can use localStorage
        this.hasLocalStorage = this.checkForLocalStorage();

        // retrieve the currentUser and accountsList from localStorage
        if (this.hasLocalStorage) {
            // get the currentUser from storage
            this.currentUser = this.retrieveCurrentUser();

            // get the users from storage
            this.users = this.retrieveAllUsers();

            this.initUI();
        }
        // if no localStorage, there can be no users
        else {
            this.currentUser = null;
            this.users = null;
        }
    }

    /**
     * Hook into the navbar and add a user selection menu.
     */
    initUI() {
        // get a reference to the navbar, if any
        const navbar = document.querySelector("#collapsibleNavbar");

        // if the navbar exists
        if (navbar) {
            // get the user friend is default of a non-logged in person
            let user = this.currentUser ? this.currentUser.username : "Friend";

            // add a dropdown to the navbar
            navbar.innerHTML += `
            <ul class="navbar-nav ml-auto">
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i class="fa fa-user"></i>
                        Hi, <span id="currentUsername">${user}</span>!
                    </a>

                    <div id="userSelection" class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">

                    </div>
                </li>
            </ul>
            `;

            // create the user selection dropdown items
            const userSelectionEl = document.querySelector("#userSelection");

            // create dropdown item anchor element
            let el = document.createElement("a");
            el.innerText = "Create New User";
            el.className = "dropdown-item";

            // TODO style pseudo element on top of Create new User as a make shift divider

            el.onclick = () => {
                try {
                    let username = prompt("Enter a username, it only contain numbers or letters and must be unique.");

                    if (username) {
                        this.createUser(username);
                    }
                }
                catch (e) {
                    alert(e.message);
                }
            }

            // add the dropdown item to the userSelection element
            userSelectionEl.appendChild(el);

            if (this.users) {
                this.users.forEach(x => this.createUserListElement(x.username));
            }
        }
    }

    /**
     * Create a user account switcher dropdown menu item.
     * @param {String} username
     */
    createUserListElement(username) {
        const userSelectionEl = document.querySelector("#userSelection");

        // create dropdown item anchor element
        let el = document.createElement("a");
        el.innerText = username;

        // add classes to the drop down item
        el.classList.add("dropdown-item");
        username == this.currentUser.username ? el.classList.add("active") : null;

        // set the onclick function to the switchUser functoin
        el.onclick = () => this.switchUser(username);

        // add the dropdown item to the userSelection element
        userSelectionEl.insertBefore(el, userSelectionEl.lastChild);
    }

    /**
     * Make the user account switcher dropdown item active.
     * @param {String} username
     */
    activateUserElement(username) {
        // go through all the dropdown menu items
        const userSelectionEl = document.querySelector("#userSelection");
        Array.from(userSelectionEl.children).forEach(x => {
            // remove the active from the previously selected user
            if (x.classList.contains("active")) {
                x.classList.remove("active");
            }

            // if the dropdown item has the newly selected username
            if (x.innerText == username) {
                // make the username active
                x.classList.add("active");

                // change the text of the currently selected user element
                document.querySelector("#currentUsername").innerText = username;
            }
        });
    }

    /**
     * Switch the currentUser to a given username
     * @param {String} username
     */
    switchUser(username) {
        // try to find the user in the users list
        let user = this.users.find(x => x.username == username);

        // go through all the dropdown menu items
        this.activateUserElement(username);

        // if a user was found, make them the currentUser
        if (user) {
            // swap the currentUser
            this.currentUser = user;

            // save the updated currentUser
            localStorage.setItem("currentUser", JSON.stringify(this.currentUser));
        }
    }

    /**
     * Save any kind of item to localStorage and it will automatically stringify it, so
     * objects and arrays can be saved as well.
     * @param {String} key
     * @param {Any} value
     * @returns {Boolean} saved
     */
    saveItem(key, value) {
        // only access localStorage if present on browser
        if (this.hasLocalStorage && this.currentUser) {
            // find the user in the users list
            let user = this.users.find(x => x.username == this.currentUser.username);

            // if this is the first time in localStorage that this app has been used, define it
            if (this.currentUser && !this.currentUser[this.appName]) {
                this.currentUser[this.appName] = {};
            }

            // save the value to the user
            this.currentUser[this.appName][key] = JSON.stringify(value);

            // save the changes of the current user into the users list
            Object.assign(user, this.currentUser);

            // save the updated currentUser and users list
            localStorage.setItem("currentUser", JSON.stringify(this.currentUser));
            localStorage.setItem("userAccounts", JSON.stringify(this.users));

            return true;
        }

        return false;
    }

    /**
     * Get an value through a key from the current user
     * @param {String} key
     * @returns {Any} item
     */
    getItem(key) {
        let data = undefined;

        // only access localStorage if present on browser
        if (this.hasLocalStorage && this.currentUser) {
            // if the key is in user object
            if (this.currentUser[this.appName] && key in this.currentUser[this.appName]) {
                data = this.currentUser[this.appName][key];
            }
        }

        return data;
    }

    /**
     * Delete a value through a key from the user and save those changes.
     * @param {String} key
     * @returns {Boolean} deleted
     */
    deleteItem(key) {
        // only access localStorage if present on browser
        if (this.hasLocalStorage && this.currentUser) {
            // find the user in the users list
            let user = this.users.find(x => x.username == this.currentUser.username);

            // if the key is in user object
            if (key in user[this.appName]) {
                // delete the key-value from the objects
                delete this.currentUser[this.appName][key];
                delete user[this.appName][key];

                // save the updated currentUser and users list
                localStorage.setItem("currentUser", JSON.stringify(this.currentUser));
                localStorage.setItem("userAccounts", JSON.stringify(this.users));

                return true;
            }
        }

        return false;
    }

    /**
     * Create a user account with a specified username.
     * @param {String} username
     * @throws UsernameValidationError
     */
    createUser(username) {
        // do not try to create a user account if there is no localStorage
        if (!this.hasLocalStorage) {
            return;
        }

        // check if user with that name already exists
        if (this.users && this.users.find(x => x.username == username)) {
            throw new UsernameValidationError("A user account cannot be created with the same name as an existing account.");
        }

        // check if username contains special characters
        if (/[^a-zA-Z0-9/]/.test(username)) {
            throw new UsernameValidationError("There can only be letters and numbers in a username.");
        }

        // set the currentUser
        this.currentUser = { username: username };
        localStorage.setItem("currentUser", JSON.stringify(this.currentUser));

        // add user to account list
        if (this.users) {
            this.users.push(this.currentUser);
        }
        else {
            this.users = [ this.currentUser ];
        }

        // save the updated users list
        localStorage.setItem("userAccounts", JSON.stringify(this.users));

        // add the user to the account switch
        this.createUserListElement(username);
        this.activateUserElement(username);
    }

    /**
     * Get the currentUser that is logged in.
     * @returns {Object} currentUser
     */
    getCurrentUser() {
        return this.currentUser;
    }

    /**
     * Get all the user accounts that exist on this device.
     * @returns {Object[]} accountsList
     */
    getAllUsers() {
        return this.users;
    }

    /**
     * Get the accountsList array from localStorage.
     * @returns {Object[]} accountsList
     */
    retrieveAllUsers() {
        if (this.hasLocalStorage) {
            // get userAccounts from localStorage
            let item = localStorage.getItem("userAccounts");

            // if there was actually an object there
            if (item) {
                try {
                    return JSON.parse(item);
                }
                catch (e) {
                    return null;
                }
            }
        }

        return null;
    }

    /**
     * Get the currentUser object from localStorage.
     * @returns {Object} currentUser
     */
    retrieveCurrentUser() {
        if (this.hasLocalStorage) {
            // get currentUser from localStorage
            let item = localStorage.getItem("currentUser");

            // if there was actually an object there
            if (item) {
                try {
                    return JSON.parse(item);
                }
                catch (e) {
                    return null;
                }
            }
        }

        return null;
    }

    /**
     * Check if the browswer has localStorage to be used.
     * @returns {Boolean} hasLocalStorage
     */
    checkForLocalStorage() {
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

        return hasLocalStorage;
    }
}

/**
 * A custom Error class for Username validation for User creation.
 */
class UsernameValidationError extends Error {
    constructor(message) {
        super(message);

        this.name = "UsernameValidationError";
    }
}
