const { model, Schema } = require("mongoose");

const SummarySchema = new Schema({
    user : { type: String, required: true },
    total_apps: { type: Number, default: 0 },
    total_schedules: { type: Number, default: 0 },
    total_players: { type: Number, default: 0 },
    total_plugins: { type: Number, default: 0 },
    total_playlists: { type: Number, default: 0 },
    total_playlist_items: { type: Number, default: 0 },
});

const Summary = model("Summary", SummarySchema);
module.exports = Summary;