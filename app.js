if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}


const express=require('express');
const path=require('path');
const mongoose=require('mongoose');
const methodOverride=require('method-override');
const ejsMate=require('ejs-mate');
const campground = require('./models/campground');
const Review=require('./models/review');
const Joi=require("joi");

const userRoutes=require('./routes/users');
const campgroundRoutes =require('./routes/campgrounds');
const reviewRoutes=require('./routes/reviews');
const catchAsync=require('./utils/catchAsync');
const flash=require('connect-flash');
const ExpressError=require('./utils/ExpressError');
const session=require('express-session');
const MongoStore = require('connect-mongo');
const Campground=require('./models/campground');
const {campgroundSchema,reviewSchema}=require('./schemas')
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('./models/user');
const dbUrl=process.env.DB_URL
// 'mongodb://127.0.0.1:27017/odisha-camp'
// process.env.DB_URL
mongoose.connect(dbUrl)

const db=mongoose.connection;
db.on("error",console.error.bind(console,"Connection Error"));
db.once("open",()=>{
    console.log("Connected to MongoDB");
});
const app=express();
app.engine('ejs',ejsMate);
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')));
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))



const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'thisshouldbeabettersecret!'
    }
});
store.on("error",function(e){
    console.log("SESSION STORE ERROR",e);
})
const sessionConfig={
    store,
    name:'session',
    secret:'thiscouldbeabettersecret!',
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires: Date.now()+1000*60*60*24*7,
        maxage:1000*60*60*24*7
    }
}
app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{
    res.locals.currentUser=req.user;
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    next();
})
app.use('/',userRoutes)
app.use('/campgrounds',campgroundRoutes);
app.use('/campgrounds/:id/reviews',reviewRoutes);


app.get('/',(req,res)=>{
    res.render('home');
})


app.all('*',(req,res,next)=>{
    console.log(req.body);
    next(new ExpressError('Page Not Found',404));
})
app.use((err,req,res,next)=>{
    const{statusCode=500}=err;
    if(!err.message) err.message='Oh No,Something Went Wrong!!!';
    res.status(statusCode).render('error',{err});
})
app.listen(3000,()=>{
    console.log('Serving on port 3000');
})
