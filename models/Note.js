const mongoose = require('mongoose');



const NoteSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    title: {
        type: String,
        required: true
    },
    body: {
        type: String
    }
});


module.exports = mongoose.model('note', NoteSchema);