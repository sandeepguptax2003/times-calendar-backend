const mongoose = require("mongoose");

const eventSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    private: { type: Boolean, default: false },
    eventType: { type: String, enum: ["normal", "stretching", "allDay"], default: "normal" }, 
    recurrence: {
        type: {
            type: String,
            enum: ["daily", "weekly", "monthly", "yearly"]
        },
        frequency: { type: Number },
        daysOfWeek: [{ type: Number }], 
        dayOfMonth: { type: Number }, 
        monthOfYear: { type: Number }, 
    },
   
});

const EventModel = mongoose.model("Event", eventSchema);

module.exports = { EventModel };