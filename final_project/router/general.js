//This contains the skeletal implementations for the routes which a general user can access.

const express = require('express');
let books = require("./booksdb.js");
const axios = require('axios');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// Get the book list available in the shop (with async/await)
public_users.get('/', async (req, res) => {
    try {
        // Fetch books
        const response = await axios.get('https://juliafragale-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/books');
        const books = response.data;
        res.json({ books }); // Send the books list as JSON response
    } catch (error) {
        res.status(500).json({ message: "Error fetching book list" });
    }
});

// Get book details based on ISBN (with async/await)
public_users.get('/isbn/:isbn', async (req, res) => {
    try {
        const isbn = req.params.isbn;

        // Fetch to a remote AP
        const response = await axios.get(`https://juliafragale-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/${isbn}`);
        const book = response.data;

        if (book) {
            res.json(book); // Send the book details as JSON
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching book details" });
    }
});

// Get book details based on author (with async/await)
public_users.get('/author/:author', async (req, res) => {
    try {
        const author = req.params.author.toLowerCase();

        // Fetching data from an external source or local db
        const response = await axios.get('https://juliafragale-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai');
        const books = response.data;
        const filteredBooks = books.filter(book => book.author.toLowerCase().includes(author));
        
        if (filteredBooks.length > 0) {
            res.json(filteredBooks); // Send filtered books as JSON
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching books by author" });
    }
});

// Get all books based on title (with async/await)
public_users.get('/title/:title', async (req, res) => {
    try {
        const title = req.params.title.toLowerCase();

        // Fetching books list from external source or local db
        const response = await axios.get('https://juliafragale-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai');
        const books = response.data;
        const filteredBooks = books.filter(book => book.title.toLowerCase().includes(title));
        
        if (filteredBooks.length > 0) {
            res.json(filteredBooks); // Send filtered books by title as JSON
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching books by title" });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    // Extract the isbn parameter from the request URL
    let isbn = req.params.isbn;
    // Find the book by ISBN
    let book = Object.values(books).find(book => book.isbn === isbn);
    res.send(JSON.stringify({ title: book.title, review: book.reviews }));
});

module.exports.general = public_users;
