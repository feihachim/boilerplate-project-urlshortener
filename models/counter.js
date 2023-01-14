const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
    id:{
        type:String,
    },
    sequence:{
        type:Number,
    }
});

module.exports = mongoose.model('Counter',counterSchema);