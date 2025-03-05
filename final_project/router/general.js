//This contains the skeletal implementations for the routes which a general user can access.

const express = require('express');
let books = require("./booksdb.js");
const axios = require('axios');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify({books}, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    // Extract the isbn parameter from the request URL
    const isbn = req.params.isbn;
    // Filter the books array to find users whose book matches the extracted isbn parameter
    let filtered_books = books.filter((books) => books.isbn === isbn);
    res.send(JSON.stringify(filtered_books));
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    // Extract the author parameter from the request URL
    let author = req.params.author;
    // Filter the books array to find which book matches the extracted author parameter
    let filtered_author = Object.keys(books).map(key => books[key]).filter(book => book.author.toLowerCase().includes(author.toLowerCase()));
    res.send(JSON.stringify(filtered_author));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    // Extract the title parameter from the request URL
    let title = req.params.title;
    // Filter the books array to find whose book matches the extracted title parameter
    let filtered_title = Object.keys(books).map(key => books[key]).filter(book => book.title.toLowerCase().includes(title.toLowerCase()));
    res.send(JSON.stringify(filtered_title))
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
