import React, { useEffect, useState } from "react";

//React-router-dom
import { Link, useNavigate } from "react-router-dom";

//Redux
//Actions
import {
  selectCurrentRememberMe,
  selectCurrentToken,
  setCredentials,
  setRememberMe,
} from "../../redux/slices/auth/authSlice";

//API Actions
import { useLoginMutation } from "../../redux/slices/auth/authApiSlice";

//React-redux
import { useDispatch, useSelector } from "react-redux";

//React-bootstrap
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Nav,
  Row,
  Spinner,
} from "react-bootstrap";

//CSS
import "./Login.css";

const Login = () => {
  //Global state
  const token = useSelector(selectCurrentToken);
  const rememberMe = useSelector(selectCurrentRememberMe);

  //Local state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  //API
  const [login, { isLoading }] = useLoginMutation();

  //Utilities
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //Custom hooks

  //Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ username, password })
        .unwrap()
        .then(async (res) => {
          await dispatch(setCredentials({ ...res, username }));
          navigate("/dashboard");
        });
    } catch (error) {}
  };

  const toogleRememberMe = () => {
    dispatch(setRememberMe({ rememberMe: !rememberMe }));
  };

  useEffect(() => {
    localStorage.setItem("rememberMe", rememberMe);
  }, [rememberMe]);

  return (
    <>
      <div className="login-page">
        <Card>
          <Card.Body>
            <Card.Title>
              <Row>
                <Col className="text-center">ĐĂNG NHẬP</Col>
              </Row>
            </Card.Title>
            <Form onSubmit={handleLoginSubmit}>
              <Container fluid>
                <Row>
                  <Col>
                    <Form.Group controlId="formBasicUsername">
                      <Form.Label>Tên tài khoản</Form.Label>
                      <Form.Control
                        type="text"
                        value={username}
                        onChange={(e) => {
                          setUsername(e.target.value);
                        }}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group controlId="formBasicPassword">
                      <Form.Label>Mật khẩu</Form.Label>
                      <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                        }}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group controlId="remember-me-form-group">
                      <Form.Check
                        inline
                        label="Ghi nhớ đăng nhập"
                        name="rememberMe"
                        checked={rememberMe}
                        onChange={toogleRememberMe}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col className="text-center">
                    <Button
                      className="form-button"
                      variant="primary"
                      type="submit"
                    >
                      {isLoading ? <Spinner animation="border" /> : "ĐĂNG NHẬP"}
                    </Button>
                  </Col>
                </Row>
                <Row className="text-center">
                  <Col>
                    <Nav.Link as={Link} to="/">
                      Forgot password?
                    </Nav.Link>
                  </Col>
                </Row>
              </Container>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </>
  );
};

export default Login;
