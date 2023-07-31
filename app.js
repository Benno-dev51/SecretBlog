//jshint esversion:6
require('dotenv').config()
const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const app=express()
const encrypt=require("mongoose-encryption")
const bcrypt = require('bcrypt');
const saltRounds = 10;
const mongoose=require("mongoose");

app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}))

mongoose.connect("mongodb://127.0.0.1:27017/userDB", { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema= new mongoose.Schema({
    email:String,
    password:String,
})


userSchema.plugin(encrypt, { secret:process.env.SECRET,encryptedFields: ['password']});
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

app.post("/register", (req, res) => {
    // Generar el hash dentro de esta función
    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
      // Comprobar si hay algún error al generar el hash
      if (err) {
        console.log("Hubo un error al generar el hash:", err);
        res.redirect("/register"); // Redireccionar a la página de registro en caso de error
      } else {
        // Crear un nuevo usuario con el hash generado
        const newUser = new User({
          email: req.body.username,
          password: hash,
        });
        newUser
          .save()
          .then(() => {
            res.render("secrets.ejs");
          })
          .catch((err) => {
            console.log("Hubo un error al guardar:", err);
            res.redirect("/register"); // Redireccionar a la página de registro en caso de error
          });
      }
    });
  });
  

  app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    User.findOne({ email: username })
      .then((foundUser) => {
        if (foundUser) {
          bcrypt.compare(password, foundUser.password, function (err, result) {
            if (err) {
              console.log("Error al comparar contraseñas:", err);
              res.redirect("/login"); // Redireccionar a la página de inicio de sesión en caso de error
            } else {
              if (result === true) {
                res.render("secrets.ejs");
              } else {
                console.log("Contraseña incorrecta");
                res.redirect("/login"); // Redireccionar a la página de inicio de sesión si la contraseña es incorrecta
              }
            }
          });
        } else {
          console.log("Usuario no encontrado");
          res.redirect("/login"); // Redireccionar a la página de inicio de sesión si el usuario no es encontrado
        }
      })
      .catch((err) => {
        console.log("Error al buscar usuario:", err);
        res.redirect("/login"); // Redireccionar a la página de inicio de sesión en caso de error al buscar el usuario
      });
  });
  

app.listen(3000,function(){
    console.log("Servidor inicializado en el port 3000")
})