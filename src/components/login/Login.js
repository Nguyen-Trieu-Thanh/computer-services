import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//Redux
//Actions
import { getLogin, setIsLoginCorrect } from "../../redux/slices/loginSlice";

//React-redux
import { useDispatch, useSelector } from "react-redux";

//React-bootstrap
import { Form, Button } from "react-bootstrap";

//CSS
import "./Login.css";

const Login = () => {
  //Local state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //Global state
  const isLoginCorrect = useSelector((state) => state.login.isLoginCorrect);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    dispatch(getLogin({ email, password }));
  };

  useEffect(() => {
    if (isLoginCorrect) {
      navigate("/booking");
      dispatch(setIsLoginCorrect({ isLoginCorrect: false }));
    }
  }, [isLoginCorrect]);

  return (
    <>
      <div className="login-page">
        <div className="login-area">
          <div className="login-title-container">Login</div>
          <Form onSubmit={handleLoginSubmit}>
            <Form.Group className="email-form-group" controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
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
                Login
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
