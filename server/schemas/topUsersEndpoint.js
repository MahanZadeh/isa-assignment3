const mongoose = require("mongoose")

const topUsersEndpointSchema = new mongoose.Schema({
    endpoint: String, 
    access: [
        {
            user: String,
            count: {
                type: Number, 
                default: 1
            }
        }
    ]
})

module.exports = mongoose.model('topUserEndPoints', topUsersEndpointSchema);