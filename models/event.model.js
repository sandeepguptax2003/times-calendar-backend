const mongoose = require("mongoose");

const eventSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    private: { type: Boolean, default: false }, // Indicates if the event is private
    eventType: { type: String, enum: ["normal", "stretching", "allDay"], default: "normal" }, // Type of event
    // Recurrence options
    recurrence: {
        type: {
            type: String, // "daily", "weekly", "monthly", "yearly", "custom"
            enum: ["daily", "weekly", "monthly", "yearly"]
        },
        frequency: { type: Number }, // Frequency of recurrence (e.g., every 2 weeks)
        daysOfWeek: [{ type: Number }], // For weekly recurrence (0 for Sunday, 1 for Monday, ..., 6 for Saturday)
        dayOfMonth: { type: Number }, // For monthly recurrence (1-31)
        monthOfYear: { type: Number }, // For yearly recurrence (0 for January, 1 for February, ..., 11 for December)
    },
   
});

const EventModel = mongoose.model("Event", eventSchema);

module.exports = { EventModel };
