var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");
// CAMPGROUND ROUTES
// =================
// INDEX
router.get("/campgrounds", function(req, res) {
	// retrieve all campgrounds from DB and show
	Campground.find({}, function(err, allCampgrounds) {
		if(err)
		{
			console.log(err);	
		}
		else
		{
			res.render("campgrounds/index", {campground: allCampgrounds});
		}
	});
});

// CREATE
router.post("/campgrounds", middleware.isLoggedIn, function(req, res) {
	//get data from form and add to DB
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var price = req.body.price;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newCampground = {name: name, image: image, description: desc, price:price, author: author};
	Campground.create(newCampground, function(err, newlyCreated) {
		if(err) {
			console.log(err);	
		} else {
			req.flash("success", "Successfully created a new campground");
			//redirect to /campgrounds
			res.redirect("/campgrounds");
		}
	});
});

// NEW
router.get("/campgrounds/new", middleware.isLoggedIn, function(req, res) {
	res.render("campgrounds/new");
});

// SHOW
router.get("/campgrounds/:id", function(req, res) {
	// find the campground with provided id
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
		if(err) {
			console.log(err);
		} else {
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

// EDIT
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
	Campground.findById(req.params.id, function(err, foundCampground) {
		if(err) {
			res.redirect("/campgrounds");
		} else {
			res.render("campgrounds/edit", {campground: foundCampground});
		}
	});
});

// UPDATE
router.put("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res) {
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, foundCampground) {
		if(err) {
			res.redirect("/campgrounds");
		} else {
			req.flash("success", "Changes Saved!");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

// DELETE ROUTE
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res) {
	Campground.findByIdAndRemove(req.params.id, function(err) {
		if(err) {
			res.redirect("/campgrounds");
		} else {
			req.flash("error", "Campground Deleted");
			res.redirect("/campgrounds");
		}
	});
});

module.exports = router;