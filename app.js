//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const app = express();


app.set("view engine", "ejs");

app.use(express.static("public"));

app.use(bodyParser.urlencoded({
  extended: true
}));

const userSchema = new mongoose.Schema({

  email: String,
  password: String

});





const UserModel = new mongoose.model("User", userSchema);


app.get("/", function(req, res) {

  res.render("home");
});

app.get("/login", function(req, res) {

  res.render("login");
});

app.get("/register", function(req, res) {

  res.render("register");
});

app.post("/register", function(req, res) {

  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    // Store hash in your password DB.

    const newUser = new UserModel({
      email: req.body.username,
      password: hash

    });

    newUser.save(function(err) {

      if (err) {
        console.log(err);
      } else {
        res.render("secrets");
      }

    });




  });




});


app.post("/login", function(req, res) {

  const passwordvar = req.body.password;


  UserModel.findOne({
    email: req.body.username
  }, function(err, foundUser) {

    if (err) {
      console.log(err);
    } else {

    if(foundUser){

      bcrypt.compare(passwordvar, foundUser.password, function(err, result) {
          // result == true

          if(result===true){

            res.render("secrets");


          }
      });



    }






    }

  });

});

app.listen(3000, function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Successfully connected to server on port 3000");
  }
});
