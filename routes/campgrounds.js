// const express=require('express');
// const router=express.Router();
// const catchAsync=require('../utils/catchAsync');
// const ExpressError=require('../utils/ExpressError');
// const Campground=require('../models/campground');
// const {campgroundSchema,reviewSchema}=require('../schemas')
// const {isLoggedIn}=require('../middleware');

// const validateCampground=(req,res,next)=>{
    
//     const {error}=campgroundSchema.validate(req.body);
//     if(error){
//         const msg=error.details.map(el=>el.message).join(',')
//         throw new ExpressError(msg,400)
//     }
//     else{
//         next();
//     }
// }
// router.get('/',catchAsync(async(req,res,next)=>{
//     const campgrounds=await Campground.find({});
//     res.render('campgrounds/index',{campgrounds});
// }))
// router.get('/new',isLoggedIn,(req,res)=>{
//     res.render('campgrounds/new');
// })
// router.post('/',isLoggedIn,validateCampground,catchAsync(async(req,res,next)=>{
    
//     const campground=new Campground(req.body.campground);
//     campground.author=req.user._id;
//     await campground.save();
//     req.flash('success','Successfully made a new campground!');
//     res.redirect(`/campgrounds/${campground._id}`)
// }))
// router.get('/:id',catchAsync(async(req,res,next)=>{
//     const campground=await Campground.findById(req.params.id).populate('reviews').populate('author');
//     if(!campground){
//         req.flash('error','Cannot find that campground!');
//         return res.redirect('/campgrounds');
//     }
//     res.render('campgrounds/show',{campground})
// }))
// router.get('/:id/edit',isLoggedIn,catchAsync(async(req,res,next)=>{
//     const campground=await Campground.findById(req.params.id)
//     if(!campground){
//         req.flash('error','Cannot find that campground!');
//         return res.redirect('/campgrounds');
//     }
//     res.render('campgrounds/edit',{campground})
// }))
// router.put('/:id',isLoggedIn,validateCampground,catchAsync(async(req,res,next)=>{
//     const{id}=req.params;
//     const campground=await Campground.findByIdAndUpdate(id,{...req.body.campground});
//     req.flash('success','Successfully updated Campground');
//     res.redirect(`/campgrounds/${campground._id}`)
// }))
// router.delete('/:id',isLoggedIn,catchAsync(async(req,res,next)=>{
//     const { id } = req.params;
//     const campground = await Campground.findByIdAndDelete(id);
//     //res.send(`Deleted ${campground}`);
//     req.flash('success','Successfully deleted Campground');
//     res.redirect('/campgrounds');
// }))

// module.exports=router;

const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const campgrounds=require('../controller/campgrounds');
const Campground = require('../models/campground');
const multer  = require('multer')
const {storage}=require('../cloudinary')
const upload = multer({storage})

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'),validateCampground,catchAsync(campgrounds.createCampground))
    
router.get('/new', isLoggedIn, campgrounds.renderNewForm)
router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'),validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))
module.exports = router;