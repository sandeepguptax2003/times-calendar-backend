const express = require('express');
const cors=require("cors");
const { connection } = require('./config/db');
const {userRouter} = require("./routes/user.route")
const {eventRouter} = require("./routes/event.route")

require("dotenv").config()

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json()); 
app.use(cors())

app.use("/users",userRouter)
app.use("/events",eventRouter)

app.get('/', async (req, res) => {
    try {
      res.json('Welcome to the Times-Calendar');
    } catch (error) {
      console.log(error);
    }
  });

app.listen(PORT, async() => {
    try {
        await connection
        console.log("Connected to DB")
    } catch (error) {
        console.log("Failed to connect to DB")
    }
    console.log(`Server running ${PORT}`);
});