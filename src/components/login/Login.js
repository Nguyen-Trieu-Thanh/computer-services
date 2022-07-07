import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//Redux
//Actions
import { getLogin, setIsLoggedIn } from "../../redux/slices/authSlice";

//React-redux
import { useDispatch, useSelector } from "react-redux";

//React-bootstrap
import { Form, Button, Spinner } from "react-bootstrap";

//CSS
import "./Login.css";

const Login = () => {
  //Local state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  //Global state
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const loginLoading = useSelector((state) => state.minorState.loginLoading);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    dispatch(getLogin({ username, password }));
  };

  useEffect(() => {
    if (isLoggedIn && localStorage.getItem("token") !== null) {
      navigate("/dashboard");
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(setIsLoggedIn({ isLoggedIn: false }));
    }

    if (localStorage.getItem("token") !== null) {
      localStorage.clear();
    }
  }, []);

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
                {loginLoading ? <Spinner animation="border" /> : "ĐĂNG NHẬP"}
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
