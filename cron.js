const cron = require("node-cron");
const { Schedule, ScheduleContent } = require("./models/schedule");
const { Playlist, PlaylistItem } = require("./models/playlist");
const Player = require("./models/player");
const App = require("./models/app");

// Function to delete all but the 4 most recent records for each model
const cleanupOldRecords = async () => {
  try {
    // Define models and their names
    const models = [
      { model: Schedule, name: "Schedule" },
      { model: ScheduleContent, name: "ScheduleContent" },
      { model: Playlist, name: "Playlist" },
      { model: PlaylistItem, name: "PlaylistItem" },
      { model: Player, name: "Player" },
      { model: App, name: "App" },
    ];

    // Process each model
    for (const { model, name } of models) {
      // Get all records sorted by creation date (newest first)
      const records = await model.find().sort({ createdAt: -1 });

      // If more than 4 records exist, delete all but the 4 most recent
      if (records.length > 4) {
        const recordsToDelete = records.slice(4); // Get records after the 4th
        const idsToDelete = recordsToDelete.map(record => record._id);

        await model.deleteMany({ _id: { $in: idsToDelete } });
        console.log(`Deleted ${idsToDelete.length} old ${name} records, kept 4 most recent`);
      } else {
        console.log(`No ${name} records deleted (less than or equal to 4 records exist)`);
      }
    }
  } catch (error) {
    console.error("Error during cleanup:", error);
  }
};

// Schedule the cleanup to run every day at 00:00
cron.schedule("0 0 * * *", cleanupOldRecords);

module.exports = { cleanupOldRecords };