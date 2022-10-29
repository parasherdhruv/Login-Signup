const express = require("express");
const app = express();
const userRoute = require("./api/routes/user");
require("dotenv").config();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const {
    MongoTopologyClosedError
} = require("mongodb");



mongoose.connect(process.env.DB_CONNECTION_URL)

mongoose.connection.on("error", err => {
    console.log("connection failed");
});

mongoose.connection.on("connected", connected => {
    console.log("connected with database");
});

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json({}));
app.use(cors());
app.use("/user", userRoute);

app.use((req, res, next) => {

    res.status(404).json({
        error: "Can't find Page"
    })

});



module.exports = app;
