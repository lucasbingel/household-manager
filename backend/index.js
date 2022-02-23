const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoute = require("./routes/auth");
const usersRoute = require("./routes/users");

//Video
//https://www.youtube.com/watch?v=tsNswx0nRKM
//Video Stop: 1:16:31

//Load .env File with Variable
dotenv.config();

//Connect MongoDB
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    //useCreatedIndex: true, //vllt noch mit reinnehmen
})
.then(() => console.log("DB Connected"))
.catch((err) => console.log(err))

//Except json Files in Routes for Login
app.use(express.json());
//Routers
app.use("/backend/auth", authRoute);
app.use("/backend/users", usersRoute);


//Server Listen on Port
app.listen(8060, () => {
    console.log("Backend-Server");
});