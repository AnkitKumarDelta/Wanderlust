const Listing  = require("../models/listing");
const Review  = require("../models/review");

module.exports.createreview = async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
  newReview.author = req.user._id;//person who LoggedIn is the author 
    listing.reviews.push(newReview);
  
    await newReview.save();
    await listing.save();
  res.redirect(`/listings/${req.params.id}`);
  };

  module.exports.destroy  = async (req,res) => {
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
};


