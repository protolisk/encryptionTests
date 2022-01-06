//jshint esversion:8
//---boiler plate---//
require("dotenv").config();
const express = require("express");
const https = require("https");
const mongoose = require("mongoose");
const ejs = require("ejs");
//const encrypt = require("mongoose-encryption"); //ezt lecseréljük MD5-ra.
//const md5 = require("md5");
const bcrypt = require('bcrypt');
const { Hash } = require("crypto");
const saltRounds = 10;

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
//userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] }); //ennek muszáj a User constant előtt lenni. //lecseréljük MD5-ra.

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
    
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const newUser = new User({
            email: req.body.username,
            password: hash // we use this to hash passwords at registration.
        });
        newUser.save(function(err){
            if(err){
                console.log(err);
            }else{
                res.render("secrets");
            }
        });
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
                bcrypt.compare(password, foundUser.password, function(err, result) {
                    if(result === true){
                        res.render("secrets");
                    }
                });
            }
        }
    });
});

//---end of Post reqs---//
app.listen(3000, function(){
    console.log("Server started on port 3000.");
});