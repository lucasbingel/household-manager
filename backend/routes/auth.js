const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

//REGISTER
router.post("/register", async (req,res) => {
    
    //console.log("req.body.user: " + req.body.user);
    console.log("\nreq.body.username: " + req.body.username);
    console.log("req.body.email: " + req.body.email);
    console.log("req.body.password: " + req.body.password + "\n");

    const newUser = new User({
        username:req.body.username,
        email:req.body.email,
        password:CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_KEY)
    });
    try {
        const user = await newUser.save();
        res.status(201).json(user);        
    } catch (err) {
        //console.log("backend post error")
        res.status(500).json(err);
    }
});

//LOGIN
router.post("/login", async (req,res) => {
    try {
        const user = await User.findOne({ email: req.body.email});
        if (!user && res.status(401).json({error:"Wrong Password or Username"})) {
            return;
        }            
        //If no user with this Email, else continiue
            const decrypted = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY).toString(CryptoJS.enc.Utf8);
            decrypted !== req.body.password && res.status(401).json("Wrong Password or Username");
            
            //Token
            const accessToken = jwt.sign({id: user._id, isAdmin: user.isAdmin},
                process.env.SECRET_KEY,{expiresIn: "5d"}
            );

            //
            const {password, ...info} = user._doc;
            
            res.status(200).json({...info, accessToken});       
    } catch (err) {
        console.log("backend post error")
        res.status(500).json(err);
    }
});

//Export
module.exports = router;

