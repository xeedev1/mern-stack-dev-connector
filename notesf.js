// MSFTB Frontend notes
// HTWIC - Had to write in comments

// npx create-react-app client
// in packages json file, add the folwowing in scripts object:

// "client": "npm start --prefix client",  // this will run the npm start command inside the client folder
// "dev": "concurrently \"npm run server\" \"npm run client\" "
// "npm run dev" in the terminal to start it

// inside client folder,
Installing | dependencies;

// npm i axios react-router-dom redux react-redux redux-thunk redux-devtools-extension moment react-moment

client > package.json;
// add this as an object so that we can use routes as /api/something instead of http:''localhost:5000/api/something 
// "proxy": "http://localhost:5000"

// cleanup: 32. Clean Up & Initial Components
// fragment added:
// converting default function into arrow function
const App = () => (
  // importing fragment - Fragment is a ghost container that acts as a one element wrapper inside which you can add multiple elements.
  <Fragment>
    <h1>App</h1>
  </Fragment>
);
// FONTAWESOME added through cdn in index.html file

// inside src, create a new folder for components, inside that folder create layout folder and then create Navbar.js and Layout.js file
Navbar.js - Layout.js;
// for both of these files, write rafc (React Arrow Function Component) that will give you the following component:
import React from "react";

export const notesf = () => {
  // name comes from the title of the page
  return <div>notesf</div>;
};
// BETTER USE rafce if you have only one component to be exported from a file

// then just replace the div with the nav section in the theme file and replace the class with className
// PRESS CONTROL D TO SELECT ALL SIMILAR ELEMENTS
// now come back to app.js and import the components
import { Navbar } from "./components/layout/Navbar";
import { Landing } from "./components/layout/Landing";
// now add them inside the Fragment tag
<Fragment>
  <Navbar />
  <Landing />
</Fragment>;

// the app is running :)

////////////////// React-Router ///////////////////////////////

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// we renamed BrowserRouter as Router
// now we will wrap the fragment inside the Router tag (we would be doing BrowserRouter instead if we haven't renamed it to Router)

// it is used as
<Route exact path="/" component={Landing} />;
// Route the / to the landing component

////////////////////////////////// REACT-ROUTER///////////////////
<BrowserRouter>
  // we wrap everything inside it so that the routes can function
  <Fragment>
    <Navbar />
    <Routes>
      // these were perviously called switch
      <Route exact path="/" element={<Landing />} />
      <Route exact path="/login" element={<Login />} />
      <Route exact path="/register" element={<Register />} />
    </Routes>
  </Fragment>
</BrowserRouter>;

// See Register js file
// Registering a user using axios

const onSubmit = async (e) => {
  // once user clicks on submit button, this functions is triggered
  e.preventDefault();
  if (password !== password2) {
    console.log("Password missmatched");
  } else {
    // console.log(formData);
    const newUser = {
      // created a new user object and passed in the values that we have updated through the state
      name,
      email,
      password,
    };
    const config = {
      // Headers are important to send as we send tokens etc through headers as well
      headers: {
        "Content-Type": "application/json",
      },
    };
    const body = JSON.stringify(newUser); // converts into a json string i.e. {name: 'sudais} will be converted to {'name':'sudais'}
    // axios.post(where,what,headers(information to be sent along))
    const res = await axios.post("/api/users", body, config);
    // IMPORTANT: axios post method sends a post request to the backend route as we do with the postman, so it saves the user and sends the token back
    console.log(res.data);
  }
};

// REDUX SETUP
// create a file named store.js inside src and add the following code

import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import rootReducer from "./reducers";

const initialState = {}; // initialized and empty variable

const middleware = [thunk]; // thunk used as middleware here

const store = createStore(
  // function to create the store
  rootReducer, // reducer we are fetching from the index.js inside reducers folder
  initialState,
  composeWithDevTools(applyMiddleware(...middleware)) // this imported thing can help us write more understandable code.
);

export default store;

// then Go to app.js and add this:
// redux
import { Provider } from "react-redux"; // connects the react and redux
import store from "./store"; // import the store that we just created

// go to the index.js inside reducers folder and write this:
// import { combineReducers } from "redux";
// export default combineReducers({});

// THE STORE IS CREATED

actions > types.js;
// Stores the action type - we can use it in multiple positions and if we need to change something we will have to change it in one place
export const SET_ALERT = "SET_ALERT";
export const REMOVE_ALERT = "REMOVE_ALERT";

reducers > alert.js;
// HTWIC
// import { SET_ALERT, REMOVE_ALERT } from "../actions/types";  // we just created
// const initialState = [];

// export default function (state = initialState, action) {
//  const { type, payload } = action;                           // destructured action.type and action.payload

//   switch (type) {                                            // action.type
//     case SET_ALERT:                                          // SET_ALERT is a variable
//       return [...state, payload];
//     case REMOVE_ALERT:
//       return state.filter((alert) => alert.id !== payload);  // filter out - show all the enteries except the one with id not equal to that of the payload id
//      default:
//      return state;
//   }
// }

actions > alert.js;
// import { SET_ALERT, REMOVE_ALERT } from "../actions/types";
// import uuid from "uuid";               // for generating custom id

// export const setAlert = (msg, alertType) => (dispatch) => {
//////// we can pass whatever we want to dispatch in this case we are passing msg and alertType
//   const id = uuid.v4();
//   dispatch({                         // method to send data to the reducer
//     type: SET_ALERT,                 // action.type comes from here
//     payload: { msg, alertType, id }, // action.payload comes from here
//   });
// };
