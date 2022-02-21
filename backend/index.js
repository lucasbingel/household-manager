const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");

//Load .env File with Variable
dotenv.config();

//Connect MongoDB
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("DB Connected"))
.catch((err) => console.log(err))


//Server Listen on Port
app.listen(8001, () => {
    console.log("Backend-Server");
});