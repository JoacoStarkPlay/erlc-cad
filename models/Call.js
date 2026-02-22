const mongoose = require("mongoose");

const CallSchema = new mongoose.Schema({
    callId: String,
    type: String,
    department: String,
    location: {
        lat: Number,
        lng: Number
    },
    status: {
        type: String,
        default: "active"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Call", CallSchema);