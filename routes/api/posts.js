const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const Post = require("../../models/Posts");

// @route   POST api/posts
// @desc    Adding Posts
// @access  Private

router.post(
  "/",
  [auth, [check("text", "text is required!").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const user = await User.findOne({ user: req.user.id }).select("-password");
    const post = new Post({
      user: req.user.id,
      avatar: user.avatar,
      name: user.name,
      text: req.body.text,
    });
    await post.save();

    console.log(user);
    return res.send(post);
  }
);

// @route   GET api/posts
// @desc    Getting all Posts
// @access  Private

router.get("/", auth, async (req, res) => {
  const posts = await Post.find().sort({ date: -1 });
  res.json(posts);
});

// @route   GET api/posts/:id
// @desc    Getting a post using it's id
// @access  Private

router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    return res.json(post);
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    console.error(error.message);
    res.status(500).json({ msg: "Server Error" });
  }
});

// @route   DELETE api/posts/:id
// @desc    Deleting a post using it's id
// @access  Private

router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    if (post.user.toString() !== req.user.id) {
      return res.status(500).json({ msg: "User not Authorized" });
    }
    await post.remove();
    return res.json({ msg: "post Deleted!" });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    console.error(error.message);
    return res.status(500).json({ msg: "Server Error" });
  }
});

// @route   PUT api/posts/likes/:id
// @desc    Adding likes to a post
// @access  Private

router.put("/likes/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // check if user has already liked the post
    if (
      post.likes.filter((like) => {
        return like.user.toString() === req.user.id;
      }).length > 0
    ) {
      //IMP: like.user is checking all the users who already liked the post, req.user.id checks current logged in user.
      //this whole code means that if amoung all likes, any like's user's id matches with the id of loggged in user then say 1
      //(TRUE)  which is greater than 0. so we will then say that the post has already been liked
      return res.status(500).json({ msg: "post has already been liked" });
    }
    // otherwise
    post.likes.unshift({ user: req.user.id });
    await post.save();
    res.json(post.likes);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "server error" });
  }
});

// @route   DELETE api/posts/unlike/:id
// @desc    Removing your like from a post
// @access  Private

router.delete("/unlike/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // check if there is like or not
    if (
      post.likes.filter((like) => {
        return like.user.toString() === req.user.id;
      }).length === 0 // this would mean FALSE || 0 that says the like isn't already there
    ) {
      return res.status(500).json({ msg: "post has not yet been liked!" });
    }
    // removing the like index
    const removeIndex = post.likes
      .map((like) => like.user.toString()) // mapp through all likes of a post and see which one is added by the logged in user and find it's index
      .indexOf(req.user.id); // OR left to write we can read it as: find the index number that matches with the index of any of the likes we have in the post (mappping through all the likes to find that one like). then save this index number into a variable called removeIndex

    post.likes.splice(removeIndex, 1);
    await post.save();
    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "server error" });
  }
});

// @route   POST api/posts/comment/:id      // this is not the id of comment, it's the id of the post on which the comment is being added
// @desc    Adding Comment inside a post
// @access  Private

router.post(
  "/comment/:id",
  [auth, [check("text", "text is required!").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const user = await User.findById(req.user.id).select("-password");
    const post = await Post.findById(req.params.id);
    const comment = {
      user: req.user.id,
      avatar: user.avatar,
      name: user.name,
      text: req.body.text,
    };

    post.comments.unshift(comment);

    await post.save();
    return res.send(post);
  }
);

// @route   DELETE api/posts/comment/:id/:comment_id        // first :id is post's id
// @desc    Removing your comment from a post
// @access  Private

router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // check the comment with same id as that of the id given in url, if the id is same, TRUE or FALSE, save it in the comment const
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id // see if id in url is same as the id of a comment available in the array
    );

    // check if there is comment or not
    if (!comment) {
      return res.status(500).json({ msg: "Comment does not exit" });
    }

    // check if the poster of that comment is removing the comment
    if (comment.user.toString() !== req.user.id) {
      // CHECK if the user in the database is the same user that's logged in using token
      return res.status(401).json({ msg: "User not authorized!" });
    }
    // getting the remove index
    const removeIndex = post.comments
      .map((comment) => comment.user.toString())
      .indexOf(req.user.id); // match the comments in the array and see which comment's id matches with the id of the user we got from token i.e. logged in user. that user at which index, save that index

    post.comments.splice(removeIndex, 1);
    await post.save();
    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "server error" });
  }
});

module.exports = router;
