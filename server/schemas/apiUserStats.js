const mongoose = require("mongoose")

const apiUserStats = new mongoose.Schema({
    date: {
        type: String,
        default: new Date().toISOString().substring(0, 10)
    }, 
    stats: [{
        user: String,
        apiAccessCount: {
            type: Number, 
            default: 1
        }
    }]
});

module.exports = mongoose.model('apiUserStats', apiUserStats);