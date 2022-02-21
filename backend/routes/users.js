const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const verify = require("../verifyToken");

//UPDATE
router.route("/:id", verify, async (req,res)=>{
    if(req.user.id === req.params.id || req.user.isAdmin){
        if(req.body.password){
            req.body.password = CryptoJS.AES.decrypt(req.body.password, process.env.SECRET_KEY).toString(CryptoJS.enc.Utf8);
        }
        try {
            const updatedUser = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            },{new:true});
            res.status(200).json(updatedUser);
        } catch (err) {
            res.status(500).json(err);
        }
    }else{
        res.status(403).json("You can update only your Account");
    }
});
//DELETE
router.delete("/:id", verify, async (req,res)=>{
    if(req.user.id === req.params.id || req.user.isAdmin){
        try {
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json("USer have been deletet");
        } catch (err) {
            res.status(500).json(err);
        }
    }else{
        res.status(403).json("You can delete only your Account");
    }
});
//GET ONE USER
router.get("/find/:id", async (req,res)=>{
    if(req.user.id === req.params.id || req.user.isAdmin){
        try {
            const user = await User.findById(req.params.id);
            const {password, ...info} = user._doc;
            res.status(200).json(info);
        } catch (err) {
            res.status(500).json(err);
        }
    }else{
        res.status(403).json("You can delete only your Account");
    }
});
//GET ALL USERS
router.get("/", async (req,res)=>{
    const query = req.query.new;
    if(req.user.isAdmin){
        try {
            const users = query ? await User.find().sort({_id:-1}).limit(10) : await User.find();
            res.status(200).json(users);
        } catch (err) {
            res.status(500).json(err);
        }
    }else{
        res.status(403).json("You are not allowd to see all Users");
    }
});
//GET ALL USERS STATS


module.exports = router;