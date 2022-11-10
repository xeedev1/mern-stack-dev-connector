import React, { Fragment } from "react";
import { Navbar } from "./components/layout/Navbar";
import { Landing } from "./components/layout/Landing";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // we renamed BrowserRouter as Router
import "./App.css";
// redux
import { Provider } from "react-redux";
import store from "./store";

// converting default function into arrow function
const App = () => (
  /* importing fragment - Fragment is a ghost container that acts as a one
    element wrapper inside which you can add multiple elements. */
  <Provider>
    <Router>
      <Fragment>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Landing />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
        </Routes>
      </Fragment>
    </Router>
  </Provider>
);

export default App;
