const mongoose = require('mongoose');

const routeAccessLogSchema = new mongoose.Schema({
    endpoint: String, 
    date: {
        type: Date, 
        default: Date.now
    },
    status: Number, 
    method: String
});

module.exports = mongoose.model('routeAccesLog', routeAccessLogSchema);