if(process.env.NODE_ENV !="production"){
require("dotenv").config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride=require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

//const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;
// const dbUrl = 


//CONNECTION OF DATABASE
main()
.then(()=>{
    console.log("connected to DB");
})
.catch((err)  =>{
 console.log(err)
});

async function main() {
    await mongoose.connect(dbUrl);
  }
// esko change karna padega. esko change kar ke new database setup karna padega jo mongoatlas se hoga ,, kyu ki tumne Url use kiya 
// hai but access nhi kiya wo url

  app.set("views",path.join(__dirname,"views"));
  app.set("view engine","ejs");
  app.use(express.urlencoded({extended: true}));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")))
app.use(methodOverride("_method"));

const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:23 * 3600,
});

store.on("error",()=>{
    console.log("ERROR in MONGO SESSION STORE",err);
});

const sessionOptions = {
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge:7 * 24 * 60 * 60 * 1000,
        httpOnly:true,//this is for security purpose mainly
    },
};



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//locals are accessible everywhere
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;//this stores the current user
    res.locals.info = req.flash("info");
    next();
});

// app.get("/demo",async(req,res)=>{
//     let fakeUser = new User({
//         email:"student@gmail.com",
//         username:"ankit"
//     });
//   let registeredUser =  await User.register (fakeUser,"helloworld");
//   res.send(registeredUser);
// })



app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

//HOME ROUTE
// app.get("/",(req,res)=>{
//     res.send("root is working");
// });

app.all("*",(req,res,next)=>{
    next (new ExpressError(404,"page not found"));
});

app.use((err,req,res,next)=>{
    let {statuscode=500,message="something went wrong"}=err;
    res.status(statuscode).render("error.ejs",{message});
});

app.listen(8080,()=>{
    console.log("server is listening on port 8080");
});

//curreUser wali function ko use karne ke liye mongo atlas pe connect karna padega db 
// wo wala part dekho lec.. ka then ye work karega 
// currUser ip addresss se base hai 