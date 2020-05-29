var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// COMMENTS ROUTES
// ===============

router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function(req, res) {
	Campground.findById(req.params.id, function(err, campground) {
		if(err) {
			console.log(err);
		} else {
			res.render("comments/new", {campground: campground});
		}
	});
});
router.post("/campgrounds/:id/comments",middleware.isLoggedIn, function(req, res) {
	Campground.findById(req.params.id, function(err, campground) {
		if(err) {
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			Comment.create(req.body.comment, function(err, comment) {
				if(err) {
					console.log(err);
				} else {
					// associate user with comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					// save comment
					comment.save();
					campground.comments.push(comment);
					campground.save();
					req.flash("success", "New Comment Created");
					res.redirect("/campgrounds/" +campground._id);
				}
			});
		}
	});
});
// EDIT COMMENT
router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
	Comment.findById(req.params.comment_id, function(err, foundComment) {
		if(err) {
			res.redirect("back");
		} else {
			res.render("comments/edit", {comment: foundComment, campground_id: req.params.id});
		}
	});
});
// UPDATE COMMENT
router.put("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res) {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, foundComment) {
		if(err) {
			res.redirect("back");
		} else {
			req.flash("success", "Changes Saved!");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});
// DELETE ROUTE
router.delete("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res) {
	Comment.findByIdAndRemove(req.params.comment_id, function(err) {
		if(err) {
			res.redirect("back");
		} else {
			req.flash("error", "Comment Deleted");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

module.exports = router;
