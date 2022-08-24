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
  Toast,
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
  const [toast, setToast] = useState({
    show: false,
    title: "",
    time: "",
    content: "",
    color: {
      header: "",
      body: "",
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
          .then((res) => {
            if (res) {
              if (res.role === "manager" || res.role === "admin") {
                dispatch(setRememberMe({ rememberMe: true }));
                dispatch(setCredentials({ ...res, username }));
                navigate("/dashboard");
              } else {
                setValidation({
                  ...validation,
                  username: {
                    message: "Tài khoản không hợp lệ",
                    isInvalid: true,
                  },
                });
                return;
              }
            }
          });
      } catch (error) {
        if (error) {
          if (error.data) {
            if (error.data === "Tài khoản không tồn tại") {
              setValidation({
                ...validation,
                username: {
                  message: "Tài khoản không tồn tại",
                  isInvalid: true,
                },
              });
              return;
            }
            if (error.data === "Sai mật khẩu") {
              setValidation({
                ...validation,
                password: {
                  message: "Mật khẩu không chính xác",
                  isInvalid: true,
                },
              });
              return;
            }
          } else {
            setToast({
              show: true,
              title: "Đăng nhập",
              time: "just now",
              content: "Đã xảy ra lỗi. Xin thử lại sau",
              color: {
                header: "#ffcccc",
                body: "#e60000",
              },
            });
          }
        }
      }
    }
  };

  const toogleRememberMe = () => {
    dispatch(setRememberMe({ rememberMe: !rememberMe }));
  };

  const handleToastClose = () => {
    setToast({ ...toast, show: false });
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
                        disabled={isLoading}
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
                  {/* <Row className="text-center">
                    <Col>
                      <Nav.Link as={Link} to="/">
                        Forgot password?
                      </Nav.Link>
                    </Col>
                  </Row> */}
                </Form>
              </Card.Body>
            </Col>
            <Col xs={7} className="logo-container">
              <img src={logo} />
            </Col>
          </Row>
        </Card>
      </div>
      <Toast
        show={toast.show}
        onClose={handleToastClose}
        delay={3000}
        autohide
        animation={false}
      >
        <Toast.Header style={{ backgroundColor: toast.color.header }}>
          <strong className="mr-auto">{toast.title}</strong>
          <small>{toast.time}</small>
        </Toast.Header>
        <Toast.Body
          style={{ backgroundColor: toast.color.body, color: "#ffffff" }}
        >
          {toast.content}
        </Toast.Body>
      </Toast>
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
