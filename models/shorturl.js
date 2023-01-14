const mongoose = require('mongoose');

const shortUrlSchema = new mongoose.Schema({
    original_url:{
        type:String,
    },
    short_url:{
        type:Number,
    }
});

module.exports = mongoose.model('ShortUrl',shortUrlSchema);