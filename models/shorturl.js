const mongoose = require('mongoose');

mongoose.set("strictQuery",false);

const shortUrlSchema = new mongoose.Schema({
    original_url:{
        type:String,
        required:true,
        unique:true,
        match:/^(https?:\/\/)?[a-zA-Z0-9-_\.]+\.[a-z]{2,4}/
    },
    short_url:{
        type:Number,
        unique:true
    }
});

module.exports = mongoose.model('ShortUrl',shortUrlSchema);