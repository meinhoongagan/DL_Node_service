const mongoose = require('mongoose');

const AppSchema = new mongoose.Schema({
    app_id: { type: String, required: true, unique: true },  // Added app_id field
    app_name: { type: String, required: true },
    user: { type: String, required: true },
    shared_with_users: { type: [String], default: [] },
    is_template: { type: Boolean, default: false },
    orientation: { type: String },
    app_location: { type: String },
    app_size: { type: String },
    status: { type: String, enum: ['DRAFT', 'RUNNING'], default: 'DRAFT' },
    domain: { type: String },
    layout: { type: String },
    thumbnail_path: { type: String },
    thumb: { type: String },
    pages_count: { type: Number },
    width: { type: Number },
    height: { type: Number },
    app_media: { type: String },
    more_contents: { 
        type: [{ type: Object }], // ✅ Fix: Store `more_contents` as an array of objects
        default: [] 
    }
}, { timestamps: true });

const App = mongoose.model('App', AppSchema);
module.exports = App;
