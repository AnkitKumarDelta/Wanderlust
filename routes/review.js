const express = require("express");
const router = express.Router({mergeParams:true});//to pass from perent to child
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn,isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/review.js");

//Post Review route
router.post("/",validateReview,isLoggedIn,wrapAsync(reviewController.createreview)
  );
  
  //Delete review route
  router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroy));

  module.exports = router;