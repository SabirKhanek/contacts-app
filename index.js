require('dotenv').config();
const config = require('config');
const debug = require('debug')('app:startup');
const morgan = require('morgan');
const express = require('express');
const contacts = require('./routes/contacts');
const cors = require('cors');
const app = express();

// Configurations
console.log('Build name: ' + config.get('name'));
const environment = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';
if (environment === 'development') {
    app.use(morgan('dev'));
}


app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/api/contacts', contacts);




const PORT = process.env.PORT ? process.env.PORT : 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})