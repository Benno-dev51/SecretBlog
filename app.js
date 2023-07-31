//jshint esversion:6
const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const app=express()
const mongoose=require("mongoose");
app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}))

mongoose.connect("mongodb://127.0.0.1:27017/userDB", { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema={
    email:String,
    password:String,
}
const User= new mongoose.model("User",userSchema)





app.get("/",(req,res)=>{
    res.render("home.ejs")
})
app.get("/register",(req,res)=>{
        res.render("register.ejs")
})
app.get("/login",(req,res)=>{
        res.render("login")
})

app.post("/register",(req,res)=>{
    const newUser= new User({
        email:req.body.username,
        password:req.body.password,
    })
    newUser.save()
    .then(() => {
        res.render("secrets.ejs");
    })
    .catch((err) => {
        console.log("Hubo un error al guardar", err);
    });

})

app.post("/login",(req,res)=>{

    const username=req.body.username;
    const password=req.body.password;

    
    User.findOne({ email: username })
    .then((foundUser) => {
        if (foundUser) {
            if (foundUser.password == password) {
                res.render("secrets.ejs");
            } else {
                console.log("Contraseña incorrecta");
            }
        } else {
            console.log("Usuario no encontrado");
        }
    })
    .catch((err) => {
        console.log(err);
    });


})


app.listen(3000,function(){
    console.log("Servidor inicializado en el port 3000")
})