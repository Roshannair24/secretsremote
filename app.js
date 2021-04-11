//jshint esversion:6
require("dotenv").config();
const express= require("express");
const bodyParser= require("body-parser");
const ejs= require("ejs");
const mongoose=require("mongoose");
const md5= require("md5");



mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true , useUnifiedTopology: true } );

const app=express();


app.set("view engine","ejs");

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended:true}));

const userSchema= new mongoose.Schema( {

email:String,
password:String

}) ;





const UserModel=new mongoose.model("User",userSchema);


app.get("/",function(req,res){

res.render("home")  ;
});

app.get("/login",function(req,res){

res.render("login")  ;
});

app.get("/register",function(req,res){

res.render("register")  ;
});

app.post("/register",function(req,res){

const newUser= new UserModel({
email:req.body.username,
password:  md5(req.body.password)

});

newUser.save(function(err){

if(err){
  console.log(err);
}else{
  res.render("secrets");
}

});

});


app.post("/login",function(req,res){

const passwordvar=md5(req.body.password);


UserModel.findOne({email:req.body.username},function(err,foundUser){

if(err){
  console.log(err);
}else{

if(foundUser.password===passwordvar){

res.render("secrets");


}

}

});

});

app.listen(3000,function(err){
  if(err){
    console.log(err);
  }else{
    console.log("Successfully connected to server on port 3000");
  }
});
