// To load .env variables
require("dotenv").config();

const express = require("express");
// To cross-origin resource share
const cors = require("cors");
// To read and write json file
const fs = require("fs");
// To create new event id
const { v4: uuidv4 } = require('uuid');
const { parse } = require("path");

const app = express();
const PORT = process.env.PORT || 3031;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// GET homepage
app.get('/', (req, res) => {
    res.send('homepage!');
});

// GET array of all events
app.get("/dashboard", (req, res) => {
    try {
        const eventsData = fs.readFileSync("./data/events.json");
        const parsedEvents = JSON.parse(eventsData);
        res.send(parsedEvents);
    } catch (error) {
        console.error('Error reading data', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

// GET event details with an id of :id
app.get("/dashboard/:id", (req, res) => {
    const eventsData = fs.readFileSync("./data/events.json");
    const parsedEvents = JSON.parse(eventsData);
    const eventById = parsedEvents.find((event) => event.id === req.params.id.toString());
    res.send(eventById);
});

// POST a new event
app.post("/dashboard", (req, res) => {
    try {    
        const eventsData = fs.readFileSync("./data/events.json");
        const parsedEvents = JSON.parse(eventsData);

        const newEvent = {
            id: uuidv4().toString(),
            // from react form field
            eventName: req.body.eventName, 
            eventDate: req.body.eventDate,
            eventTime: req.body.eventTime,
            eventLocation: req.body.eventLocation,
            guestsCount: req.body.guestsCount,
            eventTheme: req.body.eventTheme,
        };

        // To add the new event in my events array
        parsedEvents.push(newEvent);

        // To update the new event within the JSON file
        fs.writeFileSync("./data/events.json", JSON.stringify(parsedEvents));
        res.send(parsedEvents); 
    } catch (error) {
            console.error('Error posting a new event', error);
            res.status(500).send({ error: 'Internal Server Error'});
    }       
});

// PUT updated event details with an id of :id
app.put("/dashboard/:id", (req, res) => {
    try {
        const eventsData = fs.readFileSync("./data/events.json");
        const parsedEvents = JSON.parse(eventsData);

        const eventIndex = parsedEvents.findIndex((event) => event.id === req.params.id);

        if (eventIndex === -1) {
            return res.status(404).send({ error: 'Event not found' });
        }
 
        const updatedEvent = {
            ...parsedEvents[eventIndex],
            eventName: req.body.eventName, 
            eventDate: req.body.eventDate,
            eventTime: req.body.eventTime,
            eventLocation: req.body.eventLocation,
            guestsCount: req.body.guestsCount,
            eventTheme: req.body.eventTheme,
        }

        parsedEvents[eventIndex] = updatedEvent;

        fs.writeFileSync('./data/events.json', JSON.stringify(parsedEvents));
        res.send(updatedEvent);
    } catch (error) {
        console.error('Error updating event', error);
        res.status(500).send({ error: 'Internal Server Error'});
    }
});

// DELETE an event
app.delete("/dashboard/:id", (req, res) => {
    const eventsData = fs.readFileSync("./data/events.json");
    const parsedEvents = JSON.parse(eventsData);

    const eventIdToDelete = req.params.id;
    const eventToDeleteIndex = parsedEvents.findIndex(event => event.id === eventIdToDelete);

    if (eventToDeleteIndex === -1) {
        return res.status(404).json({ message: 'Event not found' });
    }

    parsedEvents.splice(eventToDeleteIndex, 1);
    // To update the events array within the JSON file
    fs.writeFileSync("./data/events.json", JSON.stringify(parsedEvents, null, 2));
    res.json({ message: 'Event deleted successfully' }); 
});

app.listen(PORT, () => console.log(`App is listening on port ${PORT}`));