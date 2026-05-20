const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios').default;

const doesExist = (username) => {
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!doesExist(username)) {
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User Successfully Registered✅! You can now login."});
        } else {
            return res.status(404).json({message: "User already exists."});
        }
    }
    return res.status(404).json({message: "Unable to register user❎. Username and password required."});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    try {
        const getBooks = () => {
            return new Promise((resolve) => {
                resolve(books);
            });
        };
        const allBooks = await getBooks();
        res.send(JSON.stringify(allBooks, null, 4));
    } catch (err) {
        res.status(500).json({ message: "Error fetching books." });
    }
});

// OR
//public_users.get('/',function (req, res) {
  //  res.send (JSON.stringify(books, null, 4))
//});

// Get book details based on ISBN

public_users.get('/isbn/:isbn', async function (req, res) {
    try {
            const isbn = req.params.isbn;
            const getBooks = () => {
                return new Promise((resolve) => {
                    resolve(books[isbn]);
        });
        };
        const allBooks = await getBooks();
        res.send(books[isbn]);
    } catch (err) {
        res.status(500).json({ message: "Error fetching book details." });
    }
});

//public_users.get('/isbn/:isbn',function (req, res) { 
  //  const isbn = req.params.isbn;
  //  res.send(books[isbn]);
//}); // the book is keyed by ISBN, so we can directly access it without filtering
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    try {
        const author = req.params.author;
        const getBooks = () => {
            return new Promise((resolve) => {
                resolve(Object.values(books).filter(book => book.author === author));
            });
        };
        const allBooks = await getBooks();
        res.send(allBooks);
    } catch (err) {
        res.status(500).json({ message: "Error fetching book details." });
    }
});

//public_users.get('/author/:author',function (req, res) {
  //  const author = req.params.author;
  //  let result = Object.values(books).filter(
    //    book => book.author === author
  //  );
  //  res.json(result);
//}); // the book is not keyed by author, but by ISBN

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    try {
        const title = req.params.title;
        const getBooks = () => {
            return new Promise((resolve) => {
                resolve(Object.values(books).filter(book => book.title === title));
            });
        };
        const allBooks = await getBooks();
        res.send(allBooks);
    } catch (err) {
        res.status(500).json({ message: "Error fetching book details." });
    }
});

//public_users.get('/title/:title',function (req, res) {
  //const title = req.params.title;
  //let result = Object.values(books).filter(
    //book => book.title === title
  //);
  //res.json(result);
//}); // same with the title

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const bookReviews = books[isbn]?.reviews;

    if (bookReviews) {
        res.status(200).json(bookReviews);
    } else {
        res.status(404).json({ message: `No reviews found for ISBN: ${isbn}` });
    }
});

module.exports.general = public_users;
