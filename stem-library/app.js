fetch("data.json")
.then(response => response.json())
.then(data => {
    let bookData = data.books.map(book => {
        return [
            book.title,
            book.author,
            book.description,
            Object.values(book.download_links)
        ];
    });

    new gridjs.Grid({
        columns: [
            "Title",
            "Author",
            "Description",
            "Download Links"
        ],
        sort: true,
        data: bookData,
        search: {
            enabled: true,
            placeholder: 'Search...'
        }
    })
    .render(document.getElementById("table"));
});