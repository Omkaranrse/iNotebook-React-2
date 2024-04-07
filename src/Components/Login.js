import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = (props) => {
  const [creadentials, setCreadentials] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:2000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: creadentials.email,
        password: creadentials.password,
      }),
    });
    const json = await response.json();
    console.log(json);
    if (json.success) {
      localStorage.setItem("token", json.authtoken);
      props.showAlert("Logged In Successfully", "success");
      navigate("/");
    } else {
      props.showAlert("Invalid credentials", "danger");
    }
  };

  const onChange = (e) => {
    setCreadentials({ ...creadentials, [e.target.name]: e.target.value });
  };

  return (
    <div className="container my-5 mt-4">
      <h2>Login to continue with iNotebook</h2>
      <form onSubmit={handleOnSubmit}>
        {/* Email */}
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={creadentials.email}
            onChange={onChange}
            aria-describedby="emailHelp"
          />
          <div id="emailHelp" className="form-text">
            We'll never share your email with anyone else.
          </div>
        </div>
        {/* PAssword */}
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={creadentials.password}
            onChange={onChange}
          />
        </div>
        {/* Submit button */}
        <button type="submit" className="btn btn-primary">
          {" "}
          Submit
        </button>
      </form>
    </div>
  );
};

export default Login;
