const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require('multer')//multer is use to upload files
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});//here multer save our files to storage of cloudinary

// Route to filter listings by category
router.get("/category/:category", wrapAsync(listingController.filterByCategory));

// Search route by country
router.get("/country/:country", wrapAsync(listingController.searchByCountry));

//we did this below because index and create both have same route
router
.route("/")
//index route
.get(wrapAsync(listingController.index))//index is callback in listing.js of controller folder 
//create route
.post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingController.createpost));
//upload.single is use to send single file 

//new route
router.get("/new",isLoggedIn,listingController.renderNewForm);

 router
 .route("/:id")
 //show route
 .get(wrapAsync(listingController.show))
 //update route
 .put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingController.update))
 //delete route
 .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroy)
 );
 
 //edit route
 router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.edit)
 );
 
 


module.exports = router;
