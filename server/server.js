const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const port = 3001;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json)

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'url_db'
});

db.connect((err) => {
    if (err) {
        console.error('Error connection to database');
    } else {
        console.log('Connected to database');
    }
});

const createTableQuery = `
CREATE TABLE IF NOT EXISTS urls (
  id INT AUTO_INCREMENT PRIMARY KEY,
  originalUrl VARCHAR(255) NOT NULL,
  shortUrl VARCHAR(10) NOT NULL
)
`;

db.query(createTableQuery, (err) => {
    if (err) {
      console.error('Error creating table:', err);
    } else {
      console.log('Table created successfully');
    }
});

app.post('/api/shorten', (req, res) => {
    const { originalUrl } = req.body;
    const checkUrlQuery = 'SELECT * FROM urls WHERE originalUrl = ?';
    db.query(checkUrlQuery, [originalUrl], (err, results) => {
      if (err) {
        console.error('Error checking URL in database:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
  
      if (results.length > 0) {
        return res.json(results[0]);
      }

      const shortUrl = generateShortUrl();
      const createUrlQuery = 'INSERT INTO urls (originalUrl, shortUrl) VALUES (?, ?)';
      db.query(createUrlQuery, [originalUrl, shortUrl], (err) => {
        if (err) {
          console.error('Error creating short URL:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
  
        const newUrl = { originalUrl, shortUrl };
        res.json(newUrl);
      });
    });
});

  app.get('/:shortUrl', (req, res) => {
    const { shortUrl } = req.params;

    const findUrlQuery = 'SELECT * FROM urls WHERE shortUrl = ?';
    db.query(findUrlQuery, [shortUrl], (err, results) => {
      if (err) {
        console.error('Error finding URL in database:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
  
      if (results.length > 0) {
        const url = results[0];
        res.redirect(url.originalUrl);
      } else {
        res.status(404).json({ error: 'URL not found' });
      }
    });
});

function generateShortUrl() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const shortUrlLength = 6;

  let shortUrl = '';
  for (let i = 0; i < shortUrlLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    shortUrl += characters.charAt(randomIndex);
  }

  return shortUrl;
}

app.listen(port, () => {
    console.log('Server is running');
});