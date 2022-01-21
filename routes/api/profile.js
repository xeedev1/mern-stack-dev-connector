const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const Profile = require("../../models/Profile");

// @route   GET api/profile/me
// @desc    user's profile route where all of his info is available
// @access  Private

router.get("/me", auth, async (req, res) => {
  const profile = await Profile.findOne({ user: req.user.id }).populate(
    "user",
    ["name", "avatar"]
  ); // .populate('from',['what','to','populate'])

  if (!profile) {
    res.status(404).json({ msg: "there is no profile for this user" });
  }

  res.json(profile);
});

module.exports = router;
