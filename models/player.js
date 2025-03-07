const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
    user : { type: String, required: true },
    player_id : { type : Number, required:true },
    player_name: { type: String, required: true },
    screen_number: { type: Number, required: true, unique: true },
    mac: { type: String, required: true, unique: true },
    status: { type: String, enum: ['PENDING', 'UPTO'], default: 'PENDING' }
}, { timestamps: true });

const PlayerSummarySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    total_screens: { type: Number, required: true },
    active_screens: { type: Number, required: true },
    inactive_screens: { type: Number, required: true },
    status_breakdown: { type: [StatusBreakdownSchema], required: true }
}, { timestamps: true });

const Player = mongoose.model('Player', PlayerSchema);
const PlayerSummary = mongoose.model('PlayerSummary', PlayerSummarySchema);
module.exports = {Player,PlayerSummary};
