require('dotenv').config()
const mongoose = require('mongoose');
const config = require('config');
const debug = require('debug')('app:db');

mongoose.connect(process.env.MONGO_DB).then(() => {
    debug('Connected to MongoDB');
}).catch((err) => {
    debug(err.message)
})

module.exports = mongoose;