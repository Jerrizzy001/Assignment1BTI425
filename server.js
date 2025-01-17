/******************************************************************************** 
*  BTI425 – Assignment 1 
*  
*  I declare that this assignment is my own work in accordance with Seneca's 
*  Academic Integrity Policy: 
*  
*  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html 
*  
*  Name: Jerry Nwachi Student ID: 188159214 Date: 17/01/2025 
* 
*  Published URL: https://assignment1-bti-425.vercel.app/ 
* 
********************************************************************************/ 


const express = require('express');
const app = express();
const ListingsDB = require("./modules/listingsDB.js");
const db = new ListingsDB();

const cors = require('cors');
require('dotenv').config();
app.use(cors());
app.use(express.json());

// Define the GET route for the home page
app.get('/', (req, res) => {
    res.json({ message: "API Listening" });
});

// POST /api/listings - Add a new listing
app.post('/api/listings', async (req, res) => {
    try {
        const newListing = await db.addNewListing(req.body);
        res.status(201).json(newListing);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/listings - Get paginated listings with optional name filter
app.get('/api/listings', async (req, res) => {
    const { page, perPage, name } = req.query;
    try {
        const listings = await db.getAllListings(page, perPage, name);
        res.json(listings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/listings/:id - Get a specific listing by ID
app.get('/api/listings/:id', async (req, res) => {
    try {
        const listing = await db.getListingById(req.params.id);
        if (listing) {
            res.json(listing);
        } else {
            res.status(404).json({ error: 'Listing not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/listings/:id - Update a specific listing by ID
app.put('/api/listings/:id', async (req, res) => {
    try {
        const result = await db.updateListingById(req.body, req.params.id);
        if (result.modifiedCount > 0) {
            res.status(204).send(); // No content
        } else {
            res.status(404).json({ error: 'Listing not found or no changes made' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/listings/:id - Delete a specific listing by ID
app.delete('/api/listings/:id', async (req, res) => {
    try {
        const result = await db.deleteListingById(req.params.id);
        if (result.deletedCount > 0) {
            res.status(204).send(); // No content
        } else {
            res.status(404).json({ error: 'Listing not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start the server
const HTTP_PORT = process.env.PORT || 8080;

db.initialize(process.env.MONGODB_CONN_STRING)
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`Server listening on: ${HTTP_PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error initializing the database:", err);
  });
