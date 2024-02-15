// event.route.js
const express = require("express");
const { EventModel } = require("../models/event.model");

const eventRouter = express.Router();


// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        return res.status(401).json({ status: "error", message: "Unauthorized: JWT token not provided" });
    }
    jwt.verify(token, "omdb", (err, user) => {
        if (err) {
            return res.status(403).json({ status: "error", message: "Forbidden: Invalid JWT token" });
        }
        req.user = user;
        next();
    });
}

// Create a new event
eventRouter.post("/", authenticateToken, async (req, res) => {
    try {
        const eventData = req.body;
        eventData.userId = req.user.userId;
        const newEvent = new EventModel(eventData);
        await newEvent.save();
        res.status(201).json({ status: "ok", data: newEvent });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Failed to create event" });
    }
});



// Get all events for the authenticated user
eventRouter.get("/", authenticateToken, async (req, res) => {
    try {
        const events = await EventModel.find({ userId: req.user.userId });
        res.status(200).json({ status: "ok", data: events });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Failed to fetch events" });
    }
});


// Get events for a specific date for the authenticated user
eventRouter.get("/date/:date", authenticateToken, async (req, res) => {
    try {
        const date = req.params.date;
        const events = await EventModel.find({
            userId: req.user.userId,
            startTime: { $gte: new Date(date), $lt: new Date(date + "T23:59:59.999Z") }
        });
        res.status(200).json({ status: "ok", data: events });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Failed to fetch events for the specified date" });
    }
});


// Get events for a specific month for the authenticated user
eventRouter.get("/month/:year/:month", authenticateToken, async (req, res) => {
    try {
        const year = parseInt(req.params.year);
        const month = parseInt(req.params.month) - 1; // Months are zero-indexed in JavaScript
        const startOfMonth = new Date(year, month, 1);
        const endOfMonth = new Date(year, month + 1, 0);
        const events = await EventModel.find({
            userId: req.user.userId,
            startTime: { $gte: startOfMonth, $lt: endOfMonth }
        });
        res.status(200).json({ status: "ok", data: events });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Failed to fetch events for the specified month" });
    }
});

// Get events for a specific day of the week for the authenticated user
eventRouter.get("/day/:dayOfWeek", authenticateToken, async (req, res) => {
    try {
        const dayOfWeek = parseInt(req.params.dayOfWeek);
        const events = await EventModel.find({
            userId: req.user.userId,
            "recurrence.daysOfWeek": dayOfWeek
        });
        res.status(200).json({ status: "ok", data: events });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Failed to fetch events for the specified day of the week" });
    }
});


// Update an existing event for the authenticated user
eventRouter.put("/:id", authenticateToken, async (req, res) => {
    try {
        const eventId = req.params.id;
        const eventData = req.body;

        // Validate event ID
        if (!eventId) {
            return res.status(400).json({ status: "error", message: "Event ID is required" });
        }

        // Find the event by ID and user ID and update its details
        const updatedEvent = await EventModel.findOneAndUpdate({ _id: eventId, userId: req.user.userId }, eventData, { new: true });

        if (!updatedEvent) {
            return res.status(404).json({ status: "error", message: "Event not found or unauthorized" });
        }

        res.status(200).json({ status: "ok", data: updatedEvent });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Failed to update event" });
    }
});

// Delete an event by ID for the authenticated user
eventRouter.delete("/:id", authenticateToken, async (req, res) => {
    try {
        const eventId = req.params.id;

        // Validate event ID
        if (!eventId) {
            return res.status(400).json({ status: "error", message: "Event ID is required" });
        }

        // Find the event by ID and user ID and delete it
        const deletedEvent = await EventModel.findOneAndDelete({ _id: eventId, userId: req.user.userId });

        if (!deletedEvent) {
            return res.status(404).json({ status: "error", message: "Event not found or unauthorized" });
        }

        res.status(200).json({ status: "ok", message: "Event deleted successfully" });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Failed to delete event" });
    }
});

module.exports = { eventRouter };
