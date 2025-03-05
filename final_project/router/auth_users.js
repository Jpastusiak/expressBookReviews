const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Check if a user with the given username already exists
const isValid = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}
// Check if the user with the given username and password exists
const authenticatedUser = (username, password) => {
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

// Register a new user
regd_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});


//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });
        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add or Modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    // Get ISBN from the URL params
    const isbn = req.params.isbn;
    // Get review from the request query
    const review = req.query.review;

    // Ensure review and session are valid
    if (!review) {
        return res.status(400).json({ message: "Review is required." });
    }
    if (!req.session.authorization || !req.session.authorization.username) {
        return res.status(403).json({ message: "You must be logged in to post a review." });
    }

    const username = req.session.authorization.username;

    // Find the book by ISBN
    const book = Object.values(books).find(b => b.isbn === isbn);
    if (!book) {
        return res.status(404).json({ message: "Book not found." });
    }

    // If the user already has a review for this ISBN, modify it
    if (book.reviews[username]) {
        book.reviews[username] = review;
        return res.status(200).json({ message: "Review updated successfully." });
    }

    // If the user doesn't have a review, add a new one
    book.reviews[username] = review;
    return res.status(201).json({ message: "Review added successfully." });
});

//Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    // Get ISBN from the URL params
    const isbn = req.params.isbn;
    // Get review from the request query
    const review = req.query.review;

    // Find the book by ISBN
    const book = Object.values(books).find(b => b.isbn === isbn);
    
    if (review) {
        // Delete the review from the 'book' object based on provided isbn
        delete book.reviews[review];
    }
    // Send response confirming deletion of friend
    res.send(`Review of ${book.title} deleted.`);
});





module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
