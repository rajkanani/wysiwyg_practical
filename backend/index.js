require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

async function checkAndCreateDatabase() {
    const connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS
    });
    const databaseName = process.env.DB_SCMA;
    try {
        const [rows] = connection.query(`SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?`, [databaseName]
        );
        if (rows.length === 0) {
            connection.query(`CREATE DATABASE ??`, [databaseName]);
            console.log(`Database "${databaseName}" created successfully.`);
        }
        else console.log(`Database "${databaseName}" already exists.`);
    } catch (error) {
        console.error('Error checking/creating database:', error);
    } finally {
        connection.end();
    }
}
checkAndCreateDatabase();

// Database Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_SCMA,
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});

// Create Table if not exists
db.query(`
  CREATE TABLE IF NOT EXISTS posts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    content LONGTEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`, (err) => {
    if (err) console.error('Error creating table:', err);
});

// Routes

// Get all posts
app.get('/posts', (req, res) => {
    db.query('SELECT * FROM posts ORDER BY created_at DESC', (err, results) => {
        if (err) {
            console.error('Error fetching posts:', err);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.json(results);
        }
    });
});

// Get a single post by ID
app.get('/posts/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM posts WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Error fetching post:', err);
            res.status(500).json({ error: 'Internal server error' });
        } else if (results.length === 0) {
            res.status(404).json({ error: 'Post not found' });
        } else {
            res.json(results[0]);
        }
    });
});

// Create a new post
app.post('/posts/create', (req, res) => {
    const { title, content } = req.body;
    const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    db.query('INSERT INTO posts (title, slug, content) VALUES (?, ?, ?)', [title, slug, content], (err, results) => {
        if (err) {
            console.error('Error creating post:', err);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.status(201).json({ message: 'Post created successfully', postId: results.insertId });
        }
    });
});

// Update a post by ID
app.post('/posts', (req, res) => {
    const { id, title, content } = req.body;
    const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    db.query('UPDATE posts SET title = ?, slug = ?, content = ? WHERE id = ?', [title, slug, content, id], (err) => {
        if (err) {
            console.error('Error updating post:', err);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.json({ message: 'Post updated successfully' });
        }
    });
});

// Delete a post by ID
app.post('/posts/delete', (req, res) => {
    const { id } = req.body;
    db.query('DELETE FROM posts WHERE id = ?', [id], (err) => {
        if (err) {
            console.error('Error deleting post:', err);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.json({ message: 'Post deleted successfully' });
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
