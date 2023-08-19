require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3031;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.listen(PORT, () => console.log(`App is listening on port ${PORT}`));