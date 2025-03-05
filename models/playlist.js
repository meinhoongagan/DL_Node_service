const mongoose = require('mongoose');

const PlaylistSchema = new mongoose.Schema({
    playlist_name: { type: String, required: true },
    playlist_id : { type : Number, required:true },
    user_id: { type: String, required: true },
    shared_with_users: { type: Array, default: [] },
    orientation: { type: String, default: null },
    thumbnail: { type: String, default: null },
    animation_type: { type: String, default: null },
    status: { type: String, enum: ['DRAFT', 'RUNNING'], default: 'DRAFT' }
}, { timestamps: true });

const PlaylistItemSchema = new mongoose.Schema({
    mediaId: { type: String, required: true },
    contentType: { type: String, required: true },
    playlist_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Playlist', default: null },
    duration: { type: Number, default: null },
    is_included: { type: Boolean, default: true },
    list_index: { type: Number, default: null },
    other_a: { type: String, default: null },
    other_b: { type: String, default: null },
    member: { type: String, default: null },
    is_report_require: { type: Boolean, default: false },
    muted: { type: Boolean, default: false },
    is_scheduled: { type: Boolean, default: false },
    schedule_start: { type: Number, default: null },
    schedule_end: { type: Number, default: null }
}, { timestamps: true, collection: 'playlist_items' });

const Playlist = mongoose.model('Playlist', PlaylistSchema);
const PlaylistItem = mongoose.model('PlaylistItem', PlaylistItemSchema);

module.exports = { Playlist, PlaylistItem };

