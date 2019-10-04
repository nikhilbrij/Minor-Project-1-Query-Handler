const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.objectId, //picking the anchor point based on Object Id
        ref: 'User'
    },
    username: {
        type: String,
        required: true,
        max: 50
    },
    website: {
        type: String
    },
    country: {
        type: String
    },
    languages: {
        type: [String],
        required: true
    },

    workrole: {
        type: String,
        required: true
        
    }
});

module.exports = mongoose.model('Profile', profileSchema);

module.exports = Profile;