const mongoose = require('mongoose');

const PluginSchema = new mongoose.Schema({
    title: { type: String, required: true },
    plugin_id : { type : Number, required:true },
    plugin_name: { type: String, unique: true, required: true },
    config_path: { type: String, default: null },
    configs: { type: Array, default: [] },
    user_id: { type: String, default: null },
    is_full_screen: { type: Boolean, default: false }
}, { timestamps: true, collection: 'plugins' });

const Plugin = mongoose.model('Plugin', PluginSchema);

module.exports = Plugin;
