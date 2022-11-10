import React, { Fragment, useState } from "react";
import {connect} from "react-redux";
import { Link } from "react-router-dom";
import { setAlert } from "../../actions/alert";
import PropTypes from 'prop-types';
import Alert from "../layout/Alert";
// import axios from "axios";

const Register = ({setAlert}) => {
  // first argument: formData is some value that we pass in as default in useState() and setFormData is a function that sets a new value to the formData so that the formData updates to a new value. we can pass in anything inside the useState() brackets, if it's a number or string it will be taken as that if it's an object it will be stored in formData as that.
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });

  // console.log(formData);
  // destructuring the formData so that we can access the variables directly
  const { name, email, password, password2 } = formData;
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      setAlert("Password missmatched","danger");
    } else {
      console.log("Success");
      // const newUser = {
      //   name,
      //   email,
      //   password,
      // };
      // const config = {
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      // };
      // const body = JSON.stringify(newUser);
      // // axios.post(where,what,headers(information to be sent along))
      // const res = await axios.post("/api/users", body, config);
      // console.log(res.data);
    }
  };
  return (
    <Fragment>
      <Alert />
      <div className="container">
        <h1 className="large text-primary">Sign Up</h1>
        <p className="lead">
          <i className="fas fa-user"></i> Create Your Account
        </p>
        <form className="form" onSubmit={onSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Name"
              name="name"
              value={name}
              onChange={onChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email Address"
              name="email"
              value={email}
              onChange={onChange}
            />
            <small className="form-text">
              This site uses Gravatar so if you want a profile image, use a
              Gravatar email
            </small>
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              name="password"
              minLength="6"
              value={password}
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Confirm Password"
              name="password2"
              minLength="6"
              value={password2}
              onChange={onChange}
            />
          </div>
          <input type="submit" className="btn btn-primary" value="Register" />
        </form>
        <p className="my-1">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </Fragment>
  );
};

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
}
export default connect(null, {setAlert})(Register);
