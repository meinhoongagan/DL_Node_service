const express = require('express');
const mongoose = require('mongoose');
const playerRoutes = require('./routes/player');
const pluginRoutes = require('./routes/plugin');
const playlistRoutes = require('./routes/playlist');
const scheduleRoutes = require('./routes/schedule');
const appRoutes = require('./routes/app');

const Player = require('./models/player');
const Plugin = require('./models/plugin');
const {Playlist} = require('./models/playlist');
const {Schedule} = require('./models/schedule');
const App = require('./models/app');

const app = express();
app.use(express.json()); // Middleware for JSON parsing

// Database connection
mongoose.connect('mongodb://localhost:27017/dl_signage_node', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Register Routes
app.use('/api/players', playerRoutes);
app.use('/api/plugins', pluginRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/apps', appRoutes)

app.get('/dashboard-details', async (req, res) => {
  try {
      const allPlayers = await Player.find();
      const recentPlayers = await Player.find().sort({ createdAt: -1 }).limit(4);

      const allPlugins = await Plugin.find();
      const recentPlugins = await Plugin.find().sort({ createdAt: -1 }).limit(4);

      const allPlaylists = await Playlist.find();
      const recentPlaylists = await Playlist.find().sort({ createdAt: -1 }).limit(4);

      const allSchedules = await Schedule.find();
      const recentSchedules = await Schedule.find().sort({ createdAt: -1 }).limit(4);

      const allApps = await App.find();
      const recentApps = await App.find().sort({ createdAt: -1 }).limit(4);

      res.json({
          players: { all: allPlayers, recent: recentPlayers },
          plugins: { all: allPlugins, recent: recentPlugins },
          playlists: { all: allPlaylists, recent: recentPlaylists },
          schedules: { all: allSchedules, recent: recentSchedules },
          apps: { all: allApps, recent: recentApps }
      });
  } catch (error) {
      console.error('Error fetching dashboard details:', error);
      res.status(500).json({ message: 'Error fetching dashboard details', error: error.message });
  }
});


// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
