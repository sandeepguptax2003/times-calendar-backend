const express = require("express");
const { EventModel } = require("../models/event.model");

const eventRouter = express.Router();

// Create a new event

eventRouter.post("/", async (req, res) => {
    try {
        const eventData = req.body;
        const newEvent = new EventModel(eventData);
        await newEvent.save();
        res.status(201).json({ status: "ok", data: newEvent });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Failed to create event" });
    }
});



// Get all events
eventRouter.get("/", async (req, res) => {
    try {
        const events = await EventModel.find();
        res.status(200).json({ status: "ok", data: events });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Failed to fetch events" });
    }
});


// Get events for a specific date
eventRouter.get("/date/:date", async (req, res) => {
    try {
        const date = req.params.date;
        const events = await EventModel.find({
            startTime: { $gte: new Date(date), $lt: new Date(date + "T23:59:59.999Z") }
        });
        res.status(200).json({ status: "ok", data: events });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Failed to fetch events for the specified date" });
    }
});


// Get events for a specific month
eventRouter.get("/month/:year/:month", async (req, res) => {
    try {
        const year = parseInt(req.params.year);
        const month = parseInt(req.params.month) - 1; // Months are zero-indexed in JavaScript
        const startOfMonth = new Date(year, month, 1);
        const endOfMonth = new Date(year, month + 1, 0);
        const events = await EventModel.find({
            startTime: { $gte: startOfMonth, $lt: endOfMonth }
        });
        res.status(200).json({ status: "ok", data: events });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Failed to fetch events for the specified month" });
    }
});

// Get events for a specific day of the week
eventRouter.get("/day/:dayOfWeek", async (req, res) => {
    try {
        const dayOfWeek = parseInt(req.params.dayOfWeek);
        const events = await EventModel.find({
            "recurrence.daysOfWeek": dayOfWeek
        });
        res.status(200).json({ status: "ok", data: events });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Failed to fetch events for the specified day of the week" });
    }
});


// Update an existing event
eventRouter.put("/:id", async (req, res) => {
    try {
        const eventId = req.params.id;
        const eventData = req.body;

        // Validate event ID
        if (!eventId) {
            return res.status(400).json({ status: "error", message: "Event ID is required" });
        }

        // Find the event by ID and update its details
        const updatedEvent = await EventModel.findByIdAndUpdate(eventId, eventData, { new: true });

        if (!updatedEvent) {
            return res.status(404).json({ status: "error", message: "Event not found" });
        }

        res.status(200).json({ status: "ok", data: updatedEvent });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Failed to update event" });
    }
});

// Delete an event by ID
eventRouter.delete("/:id", async (req, res) => {
    try {
        const eventId = req.params.id;

        // Validate event ID
        if (!eventId) {
            return res.status(400).json({ status: "error", message: "Event ID is required" });
        }

        // Find the event by ID and delete it
        const deletedEvent = await EventModel.findByIdAndDelete(eventId);

        if (!deletedEvent) {
            return res.status(404).json({ status: "error", message: "Event not found" });
        }

        res.status(200).json({ status: "ok", message: "Event deleted successfully" });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Failed to delete event" });
    }
});

module.exports = { eventRouter };