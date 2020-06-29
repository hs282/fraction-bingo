(async () => {
    // get books from json data file
    let response = await fetch("data.json");
    let data     = await response.json();
    const books  = shuffle(data.books);

    // build showcase element
    const showcaseEl = document.querySelector("#showcase");
    books.forEach(book => {
        showcaseEl.innerHTML += `
            <div class="card text-center">
                <div class="card-header mb-2">
                    ${book.title}
                </div>

                <img class="card-img-top mx-auto" src="${book.cover}" alt="${book.title} Cover" loading="lazy">

                <div class="card-body text-break">
                    <h5 class="card-title">by ${book.author}</h5>

                    <div class="card-body pt-2">
                        <p class="card-text text-left">${truncate(book.description)}</p>

                        <span class="badge badge-secondary">${book.category}</span>
                        <span class="badge badge-secondary">${book.age_range}</span>
                    </div>
                </div>

                <div class="card-footer text-muted">
                    <a class="btn btn-success" href="${book.download_links.pdf}">Read Book</a>
                </div>
            </div>
        `;
    });
})();

/**
 * Shortens a given string to only 150 characters and adds ellipses if that actually
 * cuts off any characters.
 * @param {String} str 
 * @returns {String} truncatedStr
 */
function truncate(str) {
    let short = str.substring(0, 150);

    if (short != str) {
        short += "...";
    }

    return short;
}

/**
 * Shuffle an array.
 * @param {any[]} array 
 * @returns {any[]} shuffledArray
 */
function shuffle(array) {
    let m = array.length, t, i;
    
    // While there remain elements to shuffle…
    while (m) {
    
        // Pick a remaining element…
        i = Math.floor(Math.random() * m--);
    
        // And swap it with the current element.
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }
    
    return array;
}