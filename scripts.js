// main.js

import { books, authors, genres, BOOKS_PER_PAGE } from './data.js';
import { createBookElement, populateDropdown, updateShowMoreButton, filterBooks, findBookById } from './utils.js';

class BookApp {

    /**
     * Constructor for initializing the BookApp class with provided data.
     *
     * @param {Object} books - The list of books.
     * @param {Object} authors - The list of authors.
     * @param {Object} genres - The list of genres.
     * @param {number} booksPerPage - The number of books per page.
     */

    constructor({ books, authors, genres, booksPerPage }) {
        this.books = books;
        this.authors = authors;
        this.genres = genres;
        this.booksPerPage = booksPerPage;
        this.page = 1;
        this.matches = books;

        this.init();
    }

    /**
     * Initializes the BookApp by rendering books, populating genres and authors, setting up the theme, and adding event listeners.
     */
    init() {
        this.renderBooks();
        this.populateGenres();
        this.populateAuthors();
        this.setupTheme();
        this.setupEventListeners();
    }

    /**
     * Renders a list of books based on the matches and books per page.
     */
    renderBooks() {
        const starting = document.createDocumentFragment();
        for (const { author, id, image, title } of this.matches.slice(0, this.booksPerPage)) {
            const element = createBookElement({ author, id, image, title }, this.authors);
            starting.appendChild(element);
        }
        document.querySelector('[data-list-items]').appendChild(starting);
    }

    populateGenres() {
        populateDropdown(document.querySelector('[data-search-genres]'), this.genres, 'All Genres');
    }

    populateAuthors() {
        populateDropdown(document.querySelector('[data-search-authors]'), this.authors, 'All Authors');
    }

    /**
     * Sets up the theme based on the user's preferred color scheme.
     *
     */
    setupTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.querySelector('[data-settings-theme]').value = 'night';
            document.documentElement.style.setProperty('--color-dark', '255, 255, 255');
            document.documentElement.style.setProperty('--color-light', '10, 10, 20');
        } else {
            document.querySelector('[data-settings-theme]').value = 'day';
            document.documentElement.style.setProperty('--color-dark', '10, 10, 20');
            document.documentElement.style.setProperty('--color-light', '255, 255, 255');
        }
    }

    /**
     * Sets up event listeners for various elements in the page.
     */
    setupEventListeners() {
        document.querySelector('[data-search-cancel]').addEventListener('click', () => {
            document.querySelector('[data-search-overlay]').open = false;
        });

        document.querySelector('[data-settings-cancel]').addEventListener('click', () => {
            document.querySelector('[data-settings-overlay]').open = false;
        });

        document.querySelector('[data-header-search]').addEventListener('click', () => {
            document.querySelector('[data-search-overlay]').open = true;
            document.querySelector('[data-search-title]').focus();
        });

        document.querySelector('[data-header-settings]').addEventListener('click', () => {
            document.querySelector('[data-settings-overlay]').open = true;
        });

        document.querySelector('[data-list-close]').addEventListener('click', () => {
            document.querySelector('[data-list-active]').open = false;
        });

        document.querySelector('[data-settings-form]').addEventListener('submit', this.handleThemeChange.bind(this));
        document.querySelector('[data-search-form]').addEventListener('submit', this.handleSearch.bind(this));
        document.querySelector('[data-list-button]').addEventListener('click', this.showMoreBooks.bind(this));
        document.querySelector('[data-list-items]').addEventListener('click', this.showBookPreview.bind(this));

        this.updateShowMoreButton();
    }

    /**
     * Handles the theme change based on user input.
     *
     * @param {Event} event - The event triggering the theme change.
     */
    handleThemeChange(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const { theme } = Object.fromEntries(formData);

        if (theme === 'night') {
            document.documentElement.style.setProperty('--color-dark', '255, 255, 255');
            document.documentElement.style.setProperty('--color-light', '10, 10, 20');
        } else {
            document.documentElement.style.setProperty('--color-dark', '10, 10, 20');
            document.documentElement.style.setProperty('--color-light', '255, 255, 255');
        }

        document.querySelector('[data-settings-overlay]').open = false;
    }

    /**
     * Handles the search functionality based on user input.
     *
     * @param {Event} event - The event triggering the search action.
     * 
     */
    handleSearch(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const filters = Object.fromEntries(formData);

        this.page = 1;
        this.matches = filterBooks(this.books, filters);

        document.querySelector('[data-list-message]').classList.toggle('list__message_show', this.matches.length < 1);

        this.renderBookList(this.matches);
        this.updateShowMoreButton();
        document.querySelector('[data-search-overlay]').open = false;
    }

    /**
     * Renders a list of books based on the provided array of books.
     *
     * @param {Array} books - The array of books to render.
     */
    renderBookList(books) {
        document.querySelector('[data-list-items]').innerHTML = '';
        const fragment = document.createDocumentFragment();
        for (const { author, id, image, title } of books.slice(0, this.booksPerPage)) {
            const element = createBookElement({ author, id, image, title }, this.authors);
            fragment.appendChild(element);
        }
        document.querySelector('[data-list-items]').appendChild(fragment);
    }

    updateShowMoreButton() {
        updateShowMoreButton(document.querySelector('[data-list-button]'), this.matches.length, this.page, this.booksPerPage);
    }

    /**
     * Renders additional books based on the current page and books per page settings.
     *
     */
    showMoreBooks() {
        const fragment = document.createDocumentFragment();
        for (const { author, id, image, title } of this.matches.slice(this.page * this.booksPerPage, (this.page + 1) * this.booksPerPage)) {
            const element = createBookElement({ author, id, image, title }, this.authors);
            fragment.appendChild(element);
        }
        document.querySelector('[data-list-items]').appendChild(fragment);
        this.page += 1;
        this.updateShowMoreButton();
    }

    /**
     * Handles showing a preview of a book based on user interaction.
     *
     * @param {Event} event - The event triggering the preview action.
     */
    showBookPreview(event) {
        const pathArray = Array.from(event.path || event.composedPath());
        let active = null;

        for (const node of pathArray) {
            if (active) break;

            if (node?.dataset?.preview) {
                active = findBookById(this.books, node.dataset.preview);
            }
        }

        if (active) {
            document.querySelector('[data-list-active]').open = true;
            document.querySelector('[data-list-blur]').src = active.image;
            document.querySelector('[data-list-image]').src = active.image;
            document.querySelector('[data-list-title]').innerText = active.title;
            document.querySelector('[data-list-subtitle]').innerText = `${this.authors[active.author]} (${new Date(active.published).getFullYear()})`;
            document.querySelector('[data-list-description]').innerText = active.description;
        }
    }
}

// Initialize the BookApp with data
const bookApp = new BookApp({ books, authors, genres, booksPerPage: BOOKS_PER_PAGE });
bookApp.init();