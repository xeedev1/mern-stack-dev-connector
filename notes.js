//WYAK: What You Already Know
//ML: Machine Language
//STFFMIC: See The File For More Info and Comments
//FF: Fun Fact
/*
extensions we'll need:
    - bracket pair colorizer
    - ES7/react/redux blabla
    - Prettier 
Setting git bash as default vscode terminal:
    - click on the arrow icon on right side of plus button in the terminal tab, select "Set Default Profile", restart the vs code and you will see git bash as default terminal.
Set up mongodb atlas
Project setup - installing dependencies
    - npm init
    - dependencies: express express-validator bcryptjs config gravatar jsonwebtoken mongoose request
    - dev dependencies (npm i -D): nodemon concurrently
Add node_modules into .gitignore file before using git add and push - we don't want to add modules as well into git file or on server
*/

/********/
Server.js;
/********/
const express = require("express");

const app = express();
const PORT = process.env.PORT || 5000; // process.env.PORT means that WHEN DEPLOYED on a live server, it will look for the specific port and run on that otherwise, locally, it will run on port 5000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`); // WYAK: es6 veriables - back ticks
});

/********/
package.json;
/*******
"scripts": {
    "start": "node server", // we will use this while deploying to heroku - heroku runs this comand
    "server": "nodemon server" // local project will use this as "npm run server"
}
*/

/* 
then we created a folder named "Config" and inside that folder we added "default.json" that will have our mongodb connection uri
to access that uri we created another file "db.js" that will contain the following code:  
*/

/********/
db.js;
/*******/
const mongoose = require("mongoose");
const config = require("config"); // the package that we already have installed
const db = config.get("mongoURI"); // config.get points towards the default.json file that we created in the config folder, from that file, it fetches whatever we add in the paranthesis - mongoURI in this case

const connectDB = async () => {
  // as connection to mongodb returns a promise so we will be using async await
  try {
    await mongoose.connect(db, () => {
      console.log("Mongodb Connected...");
    });
  } catch (error) {
    console.log(error);
    process.exit(1); // to stop the process (as it is getting error we don't need to continue)
  }
};
module.exports = connectDB;

/*
now all we have to do is just to import this function (connectDB) into the server.js file and then call the function there
*/

/********/
Routes;
/*******/
/*
create a new folder "routes", inside that folder, "api" and inside the api folder, create four files: users.js | auth.js | posts.js | profile.js
inside each route file, we added this code:

const express = require('express');
const router = express.Router();   // gets router from express

// @route   GET api/auth
// @desc    Test Route
// @access  Public

router.get('/',()=>{
    res.send('Auth route');     
});

module.exports = router; 
*/

// Then we define routes in server.js file as:

app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));

// now head over to the postman and create new folders: Users & Auth | Profile | Posts - we will work on those later

/*******/
Models - User;
/******/
// Create a new folder called models and inside that folder, create a new file and name it as User.js (basically different files for different models right now we are going to work on user model)
// create a user model in User.js as:
const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  Date: {
    type: Date,
    default: Data.now(),
  },
});
module.exports = User = mongoose.model("user", UserSchema); // mongoose.model(model name to be displayed in db, model function name)

// now from user.js we are adding a post request and in response we want data from the body
router.post("/", (req, res) => {
  console.log(req.body);
});

// to run this req.body, we will need to add body parser in server.js
// middleware
// old method - this is method used in tutorial and is no longer being used - terminal gives depreciation warnings
app.use(bodyParser({ extended: false }));
// new method - this works fine as a replacement of previous method, no warnings at all
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // To parse the incoming requests with JSON payloads

// from postman, select body tab and check the "raw" radio button and then from "text" dropdown on extreme right, select Json. now add some code in json format and once you make post request to users api, you will have the code you sent from body of postman (frontend), displayed on console

/*****/
Express - Validator;
/*****/
// we will need to import express validator as:
const { check, validationResult } = require("express-validator");
// NOTE: old method was require('express-validator/check');
// then we will check if the entered params are valid or not i.e. email is really an email or name is not empty etc etc
// in users.js, we now have router.post block to be updated to:
router.post(
  "/",
  [
    check("name", "name is required").not().isEmpty(), // check if name is empty, send response, name is required
    check("email", "Email is required").isEmail(), // check if email field is really looking like an email
    check("password", "password should be minimum 6 characters").isLength({
      min: 6,
    }), // check if password > 6 characters
  ],
  (req, res) => {
    const errors = validationResult(req); //then in req,res block, add a variable named errors
    if (!errors.isEmpty()) {
      // read it as, if errors are not empty -  (ML: not errors is empty)
      return res.status(400).json({ errors: errors.array() }); // if errors are there, then return a response status 400 (bad request) and send a json response that says errors are and then show the error array as we defined above
    }
    console.log(req.body);
    res.send("Users route");
  }
);

/*****/
User - Registration;
/*****/
// in users.js first we import these:
const User = require("../../models/User"); // model that we created - will be used to create user instances
const gravatar = require("gravatar"); // you know already :P
const bcrypt = require("bcryptjs"); // password hashing lolopino
// then we set the req,res function as the async becuase we are going to use await inside this function now
Get - ready - to - be - scared; // 😈😈😈😈😈😈
// User registeration
const { name, email, password } = req.body;

try {
  // see if user exists
  let user = await User.findOne({ email }); // find through email, if email exists that means if user exists
  if (user) {
    // if exists then:

    return res.status(400).json({ errors: [{ msg: "User Already Exists" }] }); // user already exists
  }
  // else run this rest of the code:
  // get user gravatar

  const avatar = gravatar.url(email, {
    s: "200", // size
    r: "pg", // pg means no kanjr khana only saf suthri pictures
    d: "mm", // means put default image of gravatar if no image found
  });
  user = new User({
    // create a new object from User and name it user set it equal to name, email, avatar and password
    name, // now since it's es6 so we don't need to do it like name = name
    email,
    avatar,
    password,
  });

  // encrypt password
  const salt = await bcrypt.genSalt(10); // salt generation that salt will later be used for hashing
  user.password = await bcrypt.hash(password, salt);

  await user.save(); // save user in database that was created just before

  // Return JSONwebtoken

  //   console.log(req.body);
  res.send("Users Registered");
} catch (error) {
  console.log(error);
  res.status(500).send("Server Error");
}

/********/
jsonWebToken;
/********/

// import the following - we are importing config because we have added our secret token id inside that default.json file
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require("./middleware/auth");
// then

// Return JSONwebtoken
const payload = {
  // payload is the information we want to add to the token - in this case we are adding user id
  user: {
    id: user.id,
  },
};
jwt.sign(
  //jwt.sign( payload, jwtsecret, expire-time, arrow function that returns the token)
  payload,
  config.get("jwtSecret"),
  { expiresIn: 360000 },
  (error, token) => {
    if (error) throw error; // if error then throw error otherwise:
    res.json({ token });
  }
);

/*****/
Auth - Middleware;
/*****/

// create a folder named middleware in the root directory and then create a file named auth.js
// inside that auth.js file we wrote the following:
/*****/
auth.js;
/*****/

const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  // directly export this function, next parameter is used to move middleware to the next middleware when this middleware completes it's task
  // get token from header of name x-auth-token
  const token = req.header("x-auth-token"); // we can name it whatever we want instead of x-auth-token, then we will have to use that name as headers in postman

  // check if not token
  if (!token) {
    return res.status(401).json({ msg: "No Token, authorization denied!" });
  }

  // verify token
  // if token then return token and if token but not a valid one then return that enter a valid token bsdk
  try {
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    req.user = decoded.user; // save decoded user's id in json, to req.user - this will be used later
    next();
  } catch (error) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

// now we want to return the user data as response after the token is authenticated so in api/auth.js, req,res is now:
router.get("/", auth, async (req, res) => {
  // async because we are using await in the function
  try {
    // find the user by id, (that we decoded from token as req.user=decoded.user) and store it's data (except password) in a const named user  then send that user object as response (res.json)
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).send("error in api/authjs");
  }
});

/********/
User - Login;
/********/
// we copied all the  router.post  code block from users.js and pasted in auth.js and edited a few things as:

// @route   POST api/auth
// @desc    User login
// @access  Public

router.post(
  "/",
  [
    check("email", "Email is required").isEmail(),
    check("password", "password is required").exists(), // check if email exists or not, empty or wrong email means invalid credentials
  ],
  async (req, res) => {
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // User registeration
    const { email, password } = req.body; // removed other things we just need email and password

    try {
      // credentails are correct or not
      let user = await User.findOne({ email }); //find user by email
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

/////////////////////////////////////////365 - Profile///////////////////////////////////////////////////

/*******/
models > Profile.js;
/*******/
// Then we Created a Profile.js inside the models and added the code - STFFMIC

/*******/
routes > api > profile.js;
/*******/

/* now we are going to add a few things to GET the data from the profile of the user */

const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth"); // to use the authentication
const User = require("../../models/User"); // to use the user model
const Profile = require("../../models/Profile"); // to use the profile model

// @route   GET api/profile/me
// @desc    user's profile route where all of his info is available
// @access  Private

router.get("/me", auth, async (req, res) => {
  // find the profile of the user from user id and then get his profile and avatar alongwith his profile fields
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

// now inside that profile we will use POST method to add data of the user's profile
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
      const { experience } = profile;
      experience.unshift(newExp); // inside profile object create an array/object named experience and push the newly created arrray inside it. the main difference between PUSH() and UNSHIFT() is that push adds the new element from bottom while ushift adds the new element on the top
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

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ADDING AND DELETING EDUCATION IS SAME AS EXPERIENCE SO I AM NOT ADDING THAT, YOU CAN SEE IT FROM THE routes/api/profile.js FILE
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// we import request from request and config from config to use in the following code
const request = require("request");
const config = require("config");
const Posts = require("./models/Posts");

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
      headers: { "user-agent": "node.js" }, // this one simple tells the github that what user agent (coding system) we are using
      // FF: even if I write hehe at user-agent, it will still work
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

/***********/
routes > api > Posts.js;
/***********/

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
    const user = await User.findOne({ user: req.user.id }).select("-password"); // get all the enteries from the user model except password and save them in user. req.user.id is coming from auth middleware that saves user's id from decoded token to user const and we find the user through that id.
    const posts = new Post({
      user: req.user.id,
      avatar: user.avatar, // we have access to all of user's data and we can access the objects as user -> avatar
      name: user.name,
      text: req.body.text, // text we will give from body
    });
    await posts.save();

    console.log(user);
    return res.send(posts);
  }
);

// @route   GET api/posts
// @desc    Getting all Posts
// @access  Private

router.get("/", auth, async (req, res) => {
  const posts = await Post.find().sort({ date: -1 }); // -1 sorts the newest first while default is oldest first
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
