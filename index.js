// To load .env variables
require("dotenv").config();

const express = require("express");
// To cross-origin resource share
const cors = require("cors");
// To read and write json file
const fs = require("fs");
// To create new event id
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3031;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

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
app.get("/events/:id", (req, res) => {
    const eventsData = fs.readFileSync("./data/events.json");
    const parsedEvents = JSON.parse(eventsData);
    const eventById = parsedEvents.find((event) => event.id === req.params.id);
    res.send(eventById);
});

// POST a new event
app.post("/dashboard", (req, res) => {
    try {    
        const eventsData = fs.readFileSync("./data/events.json");
        const parsedEvents = JSON.parse(eventsData);

        const newEvent = {
            id: uuidv4(),
            // from react form field
            eventName: req.body.eventName, 
            eventDate: req.body.eventDate,
            eventTime: req.body.eventTime,
            eventLocation: req.body.eventLocation,
            guestsCount: req.body.guestsNumber,
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


app.listen(PORT, () => console.log(`App is listening on port ${PORT}`));