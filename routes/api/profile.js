const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const Profile = require("../../models/Profile");
const request = require("request");
const config = require("config");
const { check, validationResult } = require("express-validator");
const { findOneAndUpdate } = require("../../models/User");

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

// @route   POST api/profile
// @desc    user's profile route from where all of his info is add
// @access  Private

router.post(
  "/",
  [
    auth,
    [
      check("status", "Status is required").not().isEmpty(),
      check("skills", "Skills should not be empty").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    let profile = await Profile.findOne({ user: req.user.id });
    console.log(profile);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors });
    }
    // if errors are not there, then proceed with the code

    // destructure the request - get the data entered from the frontend
    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      twitter,
      instagram,
      linkedin,
      facebook,
    } = req.body;

    // build profile object
    const profileFields = {};
    profileFields.user = req.user.id; // that user id we are getting from the token
    if (company) profileFields.company = company; // if(something){set that thing equal to an object inside profileFields}
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(",").map((skill) => skill.trim());
      /* we want the skills to be added as an array while the user will add it as coma seperated list
      now what does this code mean? it means the following:
      take the skills entered by the user and add split them where there is coma for example if we have abc,bgt then split them at abc that'll make it two array objects abc and bgt. now we are mapping throught the skills array, passing in the parameter of skill which we can reead as: For each skill inside skills array do this: and we are using trim() that will remove white spaces from the array items. that means if we have "abc "," bgt" the final result after this code will be "abc" and "bgt"
      */
    }
    // console.log(profileFields.skills);
    // now for social links/data we will need to add all of those inside an array named social
    profileFields.social = {}; // we have initialized an array inside the profileFields object
    if (facebook) profileFields.social.facebook = facebook;
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (instagram) profileFields.social.instagram = instagram;
    if (linkedin) profileFields.social.linkedin = linkedin;

    //UPDATE
    // now we will UPDATE the profile with the data we have collected above
    try {
      if (profile) {
        // profile = await profile.findOneAndUpdate(filter,update,new:true)
        profile = await Profile.findOneAndUpdate(
          { id: req.user.id }, // filter: find the user whose profile is to be updated i.e. name = sam
          { $set: profileFields }, // update: The update that we want to apply i.e. age = 23
          { new: true } // new:true: return the document after update was applied
        );

        return res.json(profile);
      }
      //CREATE NEW
      // if the profile is not there, then create a new user profile (Sign up)
      profile = new Profile(profileFields);
      await profile.save();
      return res.json(profile);
      ////
    } catch (error) {
      console.log(error);
    }

    return res.json("haha nice");
  }
);

// @route   GET api/profile/
// @desc    We will get all the users' profiles
// @access  Public

router.get("/", async (req, res) => {
  const profiles = await Profile.find().populate("user", ["name", "avatar"]); // .populate('from',['what','to','populate']);
  res.json(profiles); // send profiles to the frontend as a response
});

// @route   GET api/profile/user/:user_id
// @desc    getting user's profile through it's id
// @access  Public

router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"]); // .populate('from',['what','to','populate']);
    res.json(profile); // send profiles to the frontend as a response
  } catch (error) {
    console.log(error);
  }
});

// @route   DELETE api/profile/
// @desc    Deleting user's profile
// @access  Private

router.delete("/", auth, async (req, res) => {
  try {
    // deleting the profile
    await Profile.findOneAndDelete({
      user: req.user.id,
    });

    // deleting the user
    await User.findOneAndDelete({
      _id: req.user.id,
    });

    res.json("user deleted");
  } catch (error) {
    console.log(error);
  }
});

// @route   PUT api/profile/experience
// @desc    Updating some other fields in user's profile
// @access  Private

router.put(
  "/experience",
  [
    auth,
    [
      check("title", "title is required").not().isEmpty(),
      check("company", "company is required").not().isEmpty(),
      check("from", "from date is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(500).json({ errors: errors.array() });
    }

    const { title, company, location, from, to, current, description } =
      req.body; // destructuring
    const newExp = { title, company, location, from, to, current, description }; // setting that new data inside an array named newExp

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      // const { experience } = profile;
      profile.experience.unshift(newExp); // inside profile object create an array/object named experience and push the newly created arrray inside it. the main difference between PUSH() and UNSHIFT() is that push adds the new element from bottom while ushift adds the new element on the top
      await profile.save();
      res.json(profile);
    } catch (error) {
      console.log("----------------------------");
      console.error(error.message);
      res.status(500).json({ error: "Server Error" });
    }
  }
);

// @route   DELETE api/profile/experience/:exp_id
// @desc    Deleting the experience from the profile
// @access  Private

router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    const removeIndex = profile.experience
      .map((item) => item.id) // map through all the items inside that array and check the item id for each item
      .indexOf(req.params.exp_id); // find the index that contains this id - id is coming from url

    // splice adds, removes or overwrites an array https://www.w3schools.com/jsref/jsref_splice.asp
    profile.experience.splice(removeIndex, 1); // this means at removeindex position, remove one item
    profile.save();
    return res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// @route   PUT api/profile/education
// @desc    Updating some other fields in user's profile
// @access  Private

router.put(
  "/education",
  [
    auth,
    [
      check("school", "School is required").not().isEmpty(),
      check("degree", "Degree is required").not().isEmpty(),
      check("fieldofstudy", "Field of study is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(500).json({ errors: errors.array() });
    }

    const { school, degree, fieldofstudy, from, to, current, description } =
      req.body; // destructuring
    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    }; // setting that new data inside an array named newEdu

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      // const { education } = profile;
      profile.education.unshift(newEdu); // inside profile object create an array/object named education and push the newly created arrray inside it. the main difference between PUSH() and UNSHIFT() is that push adds the new element from bottom while ushift adds the new element on the top
      await profile.save();
      res.json(profile);
    } catch (error) {
      console.log("----------------------------");
      console.error(error.message);
      res.status(500).json({ error: "Server Error" });
    }
  }
);

// @route   DELETE api/profile/education/:edu_id
// @desc    Deleting the Education from the profile
// @access  Private

router.delete("/education/:edu_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    const removeIndex = profile.education
      .map((item) => item.id) // map through all the items inside that array and check the item id for each item
      .indexOf(req.params.edu_id); // find the index that contains this id - id is coming from url

    if (removeIndex < 0) {
      return res.status(500).json({ error: "No such Entry Exists" }); // when there is no such id, the index returns -1 so I have set it so if we get any number less then 0 we can say that no such directory exists instead of going further and deleting anything
    }
    // splice adds, removes or overwrites an array https://www.w3schools.com/jsref/jsref_splice.asp
    profile.education.splice(removeIndex, 1); // this means at removeindex position, remove one item
    profile.save();
    return res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// @route   GET api/profile/github/:username
// @desc    Get user repos from github
// @access  public

router.get("/github/:username", (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        "githubClientID"
      )}&client_secret=${config.get("githubClientSecret")}`,
      method: "GET",
      headers: { "user-agent": "node.js" },
    };

    request(options, (error, response, body) => {
      if (error) console.log(error);
      if (response.statusCode != 200) {
        res.status(404).json({ msg: "No Github User Found!" });
      }
      res.json(JSON.parse(body));
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Server Error" });
  }
});

module.exports = router;
