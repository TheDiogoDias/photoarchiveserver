const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

const photos = require('./routes/api/photos');
const users = require('./routes/api/users');
const photographer = require('./routes/api/photographers');

const app = express();

connectDB();

// cors
app.use(cors({ origin: true, credentials: true }));

// Init Middleware
app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('Hello world!'));

// use Routes
app.use('/api/photos', photos);
app.use('/api/users', users);
app.use('/api/photographers', photographer);

const port = process.env.PORT || 8082;

app.listen(port, () => console.log(`Server running on port ${port}`));