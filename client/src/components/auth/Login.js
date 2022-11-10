import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";

// import axios from "axios";

const Login = () => {
  // first argument: formData is some value that we pass in as default in useState() and setFormData is a function that sets a new value to the formData so that the formData updates to a new value. we can pass in anything inside the useState() brackets, if it's a number or string it will be taken as that if it's an object it will be stored in formData as that.
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // console.log(formData);
  // destructuring the formData so that we can access the variables directly
  const { email, password } = formData;
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const onSubmit = async (e) => {
    e.preventDefault();
    console.log("Success");
  };
  return (
    <Fragment>
      <div className="container">
        <h1 className="large text-primary">Sign In</h1>
        <p className="lead">
          <i className="fas fa-user"></i> Sign Into Your Account
        </p>
        <form className="form" onSubmit={onSubmit}>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email Address"
              name="email"
              value={email}
              onChange={onChange}
            />
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
          <input type="submit" className="btn btn-primary" value="Login" />
        </form>
        <p className="my-1">
          Don't have an account? <Link to="/Register">Sign Up</Link>
        </p>
      </div>
    </Fragment>
  );
};

export default Login;
