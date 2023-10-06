const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const episodeSchema = new Schema({
    season:{
        type: Number,
        required: true
    },
    episode:{
        type: Number,
        required: true
    },
    tag:{
        type: String,
        required: true
    }
});

const episode = mongoose.model("episode", episodeSchema);
module.exports = episode;