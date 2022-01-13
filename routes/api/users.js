const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const User = require("../../models/User");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

// @route   POST api/users
// @desc    Test Route
// @access  Public

router.post(
  "/",
  [
    check("name", "name is required").not().isEmpty(),
    check("email", "Email is required").isEmail(),
    check("password", "password should be minimum 6 characters").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // User registeration
    const { name, email, password } = req.body;

    try {
      // see if user exists
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User Already Exists" }] });
      }
      // else run this rest of the code:
      // get user gravatar
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm",
      });
      user = new User({
        name,
        email,
        avatar,
        password,
      });

      // encrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      // Return JSONwebtoken
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
