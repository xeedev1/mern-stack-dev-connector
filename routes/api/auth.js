const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");

// @route   GET api/auth
// @desc    Test Route
// @access  Public

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).send("error in api/authjs");
  }
});

// @route   POST api/auth
// @desc    User login
// @access  Public

router.post(
  "/",
  [
    check("email", "Email is required").isEmail(),
    check("password", "password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // User registeration
    const { email, password } = req.body;

    try {
      // credentails are correct or not
      let user = await User.findOne({ email });
      if (!user) {
        // if user not there, then:
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid credentials" }] }); // user not found
      }

      const isMatch = await bcrypt.compare(password, user.password); // means bcrypt will compare entered password in body (password) and the users, hashed password, and then it will return true or false based on that

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid credentials" }] }); // incorrect password
      }

      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (error, token) => {
          if (error) throw error;
          res.json({ token });
        }
      );

      //   console.log(req.body);
      //   res.send("Users Registered");
    } catch (error) {
      console.log(error);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
