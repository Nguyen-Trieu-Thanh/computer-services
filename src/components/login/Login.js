import React from "react";

//Redux
//Actions
import { setEmail, setPassword, getLogin } from "../../redux/slices/loginSlice";

//React-redux
import { useDispatch, useSelector } from "react-redux";

//React-bootstrap
import { Form, Button } from "react-bootstrap";

//CSS
import "./Login.css";

const Login = () => {
  const email = useSelector((state) => state.login.email);
  const password = useSelector((state) => state.login.password);
  const role = useSelector((state) => state.login.role);

  const dispatch = useDispatch();

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    dispatch(getLogin({ email, password }));
  };

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
                  dispatch(setEmail({ email: e.target.value }));
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
                  dispatch(setPassword({ password: e.target.value }));
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
