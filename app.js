//jshint esversion:8
//---boiler plate---//
require("dotenv").config();
const express = require("express");
const https = require("https");
const mongoose = require("mongoose");
const ejs = require("ejs");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use(express.static("public"));

app.set('view engine', 'ejs');

//---mongoose setup---//
mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema ({
    email: String,
    password: String
});

//secret = process.env.SECRET;
userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] }); //ennek muszáj a User constant előtt lenni.

const User = new mongoose.model("User", userSchema);


//---end of mongoose setup---//

//--- end of boiler plate---//
//---Get reqs---//
app.get("/", function(req, res){
    res.render("home");
});
app.get("/login", function(req, res){
    res.render("login");
});
app.get("/register", function(req, res){
    res.render("register");
});
//---end of Get reqs---//

//---Post reqs---//

app.post("/register", function(req, res){
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save(function(err){
        if(err){
            console.log(err);
        }else{
            res.render("secrets");
        }
    });
});

app.post("/login", function(req, res){

    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username}, function(err, foundUser){
        if(err){
            console.log(err);
        }else{
            if(foundUser){
                if(foundUser.password === password){
                    res.render("secrets");
                }
            }
        }
    });
});

//---end of Post reqs---//
app.listen(3000, function(){
    console.log("Server started on port 3000.");
});