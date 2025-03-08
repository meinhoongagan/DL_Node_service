const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
    user : { type: String, required: true },
    player_id : { type : String, required:true },
    player_name: { type: String, required: true },
    screen_number: { type: Number, required: true, unique: true },
    mac: { type: String, required: true, unique: true },
    status: { type: String, enum: ['PENDING', 'UPTO'], default: 'PENDING' }
}, { timestamps: true });


const Player = mongoose.model('Player', PlayerSchema);
module.exports = Player;
