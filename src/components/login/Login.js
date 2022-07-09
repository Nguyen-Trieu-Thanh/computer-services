import React, { useState } from "react";

//React-router-dom
import { useNavigate } from "react-router-dom";

//Redux
//Actions
import { setCredentials } from "../../redux/slices/auth/authSlice";

//API Actions
import { useLoginMutation } from "../../redux/slices/auth/authApiSlice";

//React-redux
import { useDispatch } from "react-redux";

//React-bootstrap
import { Button, Form, Spinner } from "react-bootstrap";

//CSS
import "./Login.css";

const Login = () => {
  //Local state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  //API
  const [login, { isLoading }] = useLoginMutation();

  //Utilities
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await login({ username, password }).unwrap();
      dispatch(setCredentials({ ...userData, username }));
      navigate("/dashboard");
    } catch (error) {}
  };

  return (
    <>
      <div className="login-page">
        <div className="login-area">
          <div className="login-title-container">ĐĂNG NHẬP</div>
          <Form onSubmit={handleLoginSubmit}>
            <Form.Group className="email-form-group" controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              />
            </Form.Group>
            <Form.Group
              className="password-form-group"
              controlId="formBasicPassword"
            >
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </Form.Group>
            <div className="text-center">
              <Button className="form-button" variant="primary" type="submit">
                {isLoading ? <Spinner animation="border" /> : "ĐĂNG NHẬP"}
              </Button>
            </div>
            <div className="forgot-password-container">
              <a className="forgot-password-button" href="">
                Forgot password?
              </a>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Login;
