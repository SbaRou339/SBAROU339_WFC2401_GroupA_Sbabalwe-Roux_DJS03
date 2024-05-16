// utils.js

/**
 * Creates a book element with specified author, id, image, and title.
 *
 * @param {Object} author - The author of the book.
 * @param {string} id - The unique identifier of the book.
 * @param {string} image - The URL of the book image.
 * @param {string} title - The title of the book.
 * @param {Object} authors - The list of authors for reference.
 * @return {HTMLElement} The created book element.
 */
export function createBookElement({ author, id, image, title }, authors) {
    const element = document.createElement('button');
    element.classList = 'preview';
    element.setAttribute('data-preview', id);
    element.innerHTML = `
        <img class="preview__image" src="${image}" />
        <div class="preview__info">
            <h3 class="preview__title">${title}</h3>
            <div class="preview__author">${authors[author]}</div>
        </div>
    `;
    return element;
}

/**
 * Populates a dropdown container with items and a default option text.
 *
 * @param {HTMLElement} container - The container element to populate.
 * @param {Object} items - The items to populate the dropdown with.
 * @param {string} defaultOptionText - The text for the default option.
 */
export function populateDropdown(container, items, defaultOptionText) {
    const fragment = document.createDocumentFragment();
    const defaultOption = document.createElement('option');
    defaultOption.value = 'any';
    defaultOption.innerText = defaultOptionText;
    fragment.appendChild(defaultOption);

    for (const [id, name] of Object.entries(items)) {
        const element = document.createElement('option');
        element.value = id;
        element.innerText = name;
        fragment.appendChild(element);
    }

    container.appendChild(fragment);
}

/**
 * Updates the 'Show More' button based on the remaining books to display.
 *
 * @param {Element} button - The button element to update.
 * @param {number} matchesLength - The total number of matches.
 * @param {number} page - The current page number.
 * @param {number} booksPerPage - The number of books per page.
 */
export function updateShowMoreButton(button, matchesLength, page, booksPerPage) {
    const remainingBooks = matchesLength - page * booksPerPage;
    button.disabled = remainingBooks <= 0;
    button.innerHTML = `
        <span>Show more</span>
        <span class="list__remaining"> (${remainingBooks > 0 ? remainingBooks : 0})</span>
    `;
}

/**
 * Filters the list of books based on the provided filters.
 *
 * @param {Array} books - The array of books to filter.
 * @param {Object} filters - The filters to apply to the books.
 * @return {Array} The filtered list of books.
 */
export function filterBooks(books, filters) {
    return books.filter(book => {
        const genreMatch = filters.genre === 'any' || book.genres.includes(filters.genre);
        const titleMatch = filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase());
        const authorMatch = filters.author === 'any' || book.author === filters.author;
        return genreMatch && titleMatch && authorMatch;
    });
}

/**
 * Finds a book by its ID in the given array of books.
 *
 * @param {Array} books - The array of books to search.
 * @param {string} id - The ID of the book to find.
 * @return {Object|undefined} The book with the specified ID, or undefined if not found.
 */
export function findBookById(books, id) {
    return books.find(book => book.id === id);
}
