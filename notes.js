//WYAK: What You Already Know
//ML: Machine Language
//STFFMIC: See The File For More Info and Comments
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
