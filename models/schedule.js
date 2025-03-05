const mongoose = require('mongoose');

const ScheduleSchema = new mongoose.Schema({
    schedule_name: { type: String, required: true },
    schedule_id : { type : Number, required:true },
    user_id: { type: String, required: true },
    status: { type: String, enum: ['DRAFT', 'RUNNING'], default: 'DRAFT' },
    other1: { type: String, default: null },
    other2: { type: String, default: null }
}, { timestamps: true, collection: 'schedules' });

const ScheduleContentSchema = new mongoose.Schema({
    schedule: { type: mongoose.Schema.Types.ObjectId, ref: 'Schedule', required: true },
    content: { type: String, required: true },
    start: { type: String, default: null },
    end: { type: String, default: null },
    movable: { type: String, default: null },
    bg_color: { type: String, default: null },
    rrule: { type: String, default: null },
    is_recurring: { type: Boolean, default: false },
    status: { type: String, enum: ['DRAFT', 'RUNNING'], default: 'DRAFT' },
    other1: { type: String, default: null },
    other2: { type: String, default: null }
}, { timestamps: true, collection: 'schedule_contents' });


const Schedule = mongoose.model('Schedule', ScheduleSchema);
const ScheduleContent = mongoose.model('ScheduleContent', ScheduleContentSchema);

module.exports = {Schedule , ScheduleContent};
