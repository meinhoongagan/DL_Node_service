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
const jwt = require('jsonwebtoken');
const { jwtDecode } = require("jwt-decode");


const cors = require('cors');

require('dotenv').config();

const app = express();
app.use(express.json()); // Middleware for JSON parsing
app.use(cors());

// Database connection
mongoose.connect(process.env.MONGOURL, {
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

app.get('/api/dashboard-details/', async (req, res) => {
  try {
       const token = req.headers.authorization;

       if (!token) {
          return res.status(401).json({ message: 'Unauthorized' });
       }
       
       const decodedToken = jwtDecode(token);
       const id = decodedToken.sub;

       console.log("Decoded Token:", decodedToken);
       
       const recentPlayers = await Player.find({ user: id }).sort({ createdAt: -1 }).limit(4);
       const recentPlugins = await Plugin.find({ user_id: id }).sort({ createdAt: -1 }).limit(4);
       const recentPlaylists = await Playlist.find({ user_id: id }).sort({ createdAt: -1 }).limit(4);
       const recentSchedules = await Schedule.find({ user_id: id }).sort({ createdAt: -1 }).limit(4);
       const recentApps = await App.find({ user: id }).sort({ createdAt: -1 }).limit(4);
       
       res.json({
          players: { recent: recentPlayers },
          plugins: { recent: recentPlugins },
          playlists: { recent: recentPlaylists },
          schedules: { recent: recentSchedules },
          apps: { recent: recentApps }
      });
  } catch (error) {
      console.error('Error fetching dashboard details:', error);
      res.status(500).json({ message: 'Error fetching dashboard details', error: error.message });
  }
});


// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
