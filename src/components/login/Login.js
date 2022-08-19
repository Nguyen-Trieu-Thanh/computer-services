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
  setProfile,
} from "../../redux/slices/auth/authSlice";
import { useGetAccountByUsernameMutation } from "../../redux/slices/account/accountApiSlice";

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

import logo from "../../images/computer-services-logo.png";

//CSS
import "./Login.css";

const Login = () => {
  //Global state
  const token = useSelector(selectCurrentToken);
  const rememberMe = useSelector(selectCurrentRememberMe);

  //Local state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [validation, setValidation] = useState({
    username: {
      message: "",
      isInvalid: false,
    },
    password: {
      message: "",
      isInvalid: false,
    },
  });
  //API
  const [login, { isLoading }] = useLoginMutation();
  const [getAccountByUsername, { isLoading: isGetAccountByUserNameLoading }] =
    useGetAccountByUsernameMutation();

  //Utilities
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //Custom hooks

  //Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (username === "") {
      setValidation({
        ...validation,
        username: {
          message: "Tên đăng nhập không được để trống",
          isInvalid: true,
        },
      });
      return;
    }

    if (password === "") {
      setValidation({
        ...validation,
        password: {
          message: "Mật khẩu không được để trống",
          isInvalid: true,
        },
      });
      return;
    }

    if (!validation.username.isInvalid && !validation.password.isInvalid) {
      try {
        await login({ username, password })
          .unwrap()
          .then(async (res) => {
            await dispatch(setRememberMe({ rememberMe: true }));
            await dispatch(setCredentials({ ...res, username }));
            // await getAccountByUsername(username)
            //   .unwrap()
            //   .then(async (getAccountRes) => {
            //     const userDetail = getAccountRes.user_id;
            //     await dispatch(
            //       setProfile({
            //         name: userDetail.name,
            //         phonenum: userDetail.phonenum,
            //       })
            //     );
            //   });
            navigate("/dashboard");
          });
      } catch (error) {
        if (error.status === 404) {
          if (error.data === "User not existed") {
            setValidation({
              ...validation,
              username: {
                message: "Người dùng không tồn tại",
                isInvalid: true,
              },
            });
            return;
          }
          if (error.data === "Wrong password") {
            setValidation({
              ...validation,
              password: {
                message: "Mật khẩu không chính xác",
                isInvalid: true,
              },
            });
            return;
          }
        }
      }
    }
  };

  const toogleRememberMe = () => {
    dispatch(setRememberMe({ rememberMe: !rememberMe }));
  };

  useEffect(() => {
    localStorage.setItem("rememberMe", rememberMe);
  }, [rememberMe]);

  return (
    <>
      {/* <div className="login-page-container">
        <div className="logo-container">
          <img src={logo} />
        </div> */}
      <div className="login-page">
        <Card style={{ width: "750px" }}>
          <Row>
            <Col>
              <Card.Body>
                <Card.Title>
                  <Row>
                    <Col className="text-center">ĐĂNG NHẬP</Col>
                  </Row>
                </Card.Title>
                <Form onSubmit={handleLoginSubmit}>
                  <Row>
                    <Col>
                      <Form.Group controlId="formBasicUsername">
                        <Form.Label>Tên tài khoản</Form.Label>
                        <Form.Control
                          isInvalid={validation.username.isInvalid}
                          type="text"
                          value={username}
                          onChange={(e) => {
                            setUsername(e.target.value);
                            setValidation({
                              ...validation,
                              username: {
                                message: "",
                                isInvalid: false,
                              },
                            });
                          }}
                        />
                        <Form.Control.Feedback type="invalid">
                          {validation.username.message}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Form.Group controlId="formBasicPassword">
                        <Form.Label>Mật khẩu</Form.Label>
                        <Form.Control
                          isInvalid={validation.password.isInvalid}
                          type="password"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            setValidation({
                              ...validation,
                              password: {
                                message: "",
                                isInvalid: false,
                              },
                            });
                          }}
                        />
                        <Form.Control.Feedback type="invalid">
                          {validation.password.message}
                        </Form.Control.Feedback>
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
                        {isLoading ? (
                          <Spinner animation="border" />
                        ) : (
                          "ĐĂNG NHẬP"
                        )}
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
                </Form>
              </Card.Body>
            </Col>
            <Col xs={7} className="logo-container">
              <img src={logo} />
            </Col>
          </Row>
        </Card>
      </div>
      {/* <Col>
          <div className="login-page">
            <Card style={{ width: "350px" }}>
              <Card.Body>
                <Card.Title>
                  <Row>
                    <Col className="text-center">ĐĂNG NHẬP</Col>
                  </Row>
                </Card.Title>
                <Form onSubmit={handleLoginSubmit}>
                  <Row>
                    <Col>
                      <Form.Group controlId="formBasicUsername">
                        <Form.Label>Tên tài khoản</Form.Label>
                        <Form.Control
                          isInvalid={validation.username.isInvalid}
                          type="text"
                          value={username}
                          onChange={(e) => {
                            setUsername(e.target.value);
                            setValidation({
                              ...validation,
                              username: {
                                message: "",
                                isInvalid: false,
                              },
                            });
                          }}
                        />
                        <Form.Control.Feedback type="invalid">
                          {validation.username.message}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Form.Group controlId="formBasicPassword">
                        <Form.Label>Mật khẩu</Form.Label>
                        <Form.Control
                          isInvalid={validation.password.isInvalid}
                          type="password"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            setValidation({
                              ...validation,
                              password: {
                                message: "",
                                isInvalid: false,
                              },
                            });
                          }}
                        />
                        <Form.Control.Feedback type="invalid">
                          {validation.password.message}
                        </Form.Control.Feedback>
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
                        {isLoading ? (
                          <Spinner animation="border" />
                        ) : (
                          "ĐĂNG NHẬP"
                        )}
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
                </Form>
              </Card.Body>
            </Card>
          </div>
        </Col> */}
      {/* </div> */}
    </>
  );
};

export default Login;
