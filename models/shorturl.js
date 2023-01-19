const mongoose = require('mongoose');

mongoose.set("strictQuery",false);

const shortUrlSchema = new mongoose.Schema({
    original_url:{
        type:String,
        required:true,
        unique:true
    },
    short_url:{
        type:Number,
    }
});

module.exports = mongoose.model('ShortUrl',shortUrlSchema);