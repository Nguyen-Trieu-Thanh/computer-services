import React, { useState } from "react";

//Redux
//Actions
import { selectCurrentToken } from "../../redux/slices/auth/authSlice";
import { setToast } from "../../redux/slices/toast/toastSlice";

//API Actions
import { useUpdatePasswordMutation } from "../../redux/slices/account/accountApiSlice";

//React-redux
import { useDispatch, useSelector } from "react-redux";

//React-bootstrap

import { Button, Card, Col, Form, Image, Row, Spinner } from "react-bootstrap";

//JWT-decode
import jwt_decode from "jwt-decode";

//Images
import lock from "../../images/lock.png";

//CSS
import "./SecuritySetting.css";

const SecuritySetting = () => {
  const [updatePassword, { isLoading }] = useUpdatePasswordMutation();
  const dispatch = useDispatch();

  //Global state
  const token = useSelector(selectCurrentToken);

  //Local state
  const [security, setSecurity] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [validation, setValidation] = useState({
    oldPassword: {
      message: "",
      isInvalid: false,
    },
    newPassword: {
      message: "",
      isInvalid: false,
    },
    confirmNewPassword: {
      message: "",
      isInvalid: false,
    },
  });
  const [isShowPassword, setIsShowPassword] = useState(false);

  const handleSecurityChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    if (name === "oldPassword") {
      setSecurity({ ...security, [name]: value });
      setValidation({
        ...validation,
        oldPassword: {
          message: "",
          isInvalid: false,
        },
      });
      return;
    }

    if (name === "newPassword") {
      setSecurity({ ...security, [name]: value });
      setValidation({
        ...validation,
        confirmNewPassword: {
          message: "",
          isInvalid: false,
        },
      });
      return;
    }

    if (name === "confirmNewPassword") {
      if (value !== security.newPassword) {
        setSecurity({ ...security, [name]: value });
        setValidation({
          ...validation,
          confirmNewPassword: {
            message: "Xác nhận mật khẩu không khớp. Hãy thử lại",
            isInvalid: true,
          },
        });
        return;
      } else {
        setSecurity({ ...security, [name]: value });
        setValidation({
          ...validation,
          confirmNewPassword: {
            message: "",
            isInvalid: false,
          },
        });
      }
    }
  };

  const handleSecuritySubmit = async (e) => {
    e.preventDefault();

    if (security.oldPassword === "") {
      setValidation({
        ...validation,
        oldPassword: {
          message: "Xin hãy nhập mật khẩu cũ",
          isInvalid: true,
        },
        newPassword: {
          message: "",
          isInvalid: false,
        },
        confirmPassword: {
          message: "",
          isInvalid: false,
        },
      });
      return;
    }

    if (security.newPassword === "") {
      setValidation({
        ...validation,
        newPassword: {
          message: "Mật khẩu mới không được để trống",
          isInvalid: true,
        },
        confirmNewPassword: {
          message: "",
          isInvalid: false,
        },
      });
      return;
    }

    if (security.newPassword !== security.confirmNewPassword) {
      setValidation({
        ...validation,
        newPassword: {
          message: "",
          isInvalid: false,
        },
        confirmNewPassword: {
          message: "Xác nhận mật khẩu không khớp. Hãy thử lại",
          isInvalid: true,
        },
      });
      setSecurity({ ...security, newPassword: "", confirmNewPassword: "" });
      return;
    }

    if (
      !validation.oldPassword.isInvalid &&
      !validation.newPassword.isInvalid &&
      !validation.confirmNewPassword.isInvalid
    ) {
      try {
        await updatePassword(security)
          .unwrap()
          .then((res) => {
            if (res) {
              dispatch(
                setToast({
                  show: true,
                  title: "Cập nhật mật khẩu",
                  time: "just now",
                  content: "Mật khẩu đã được thay đổi",
                  color: {
                    header: "#dbf0dc",
                    body: "#41a446",
                  },
                })
              );
              setSecurity({
                newPassword: "",
                confirmNewPassword: "",
              });
            }
          });
      } catch (error) {
        if (error) {
          if (error.data) {
            if (error.data === "Sai mật khẩu") {
              setValidation({
                ...validation,
                oldPassword: {
                  message: "Mật khẩu cũ không chính xác",
                  isInvalid: true,
                },
              });
              setSecurity({
                ...security,
                newPassword: "",
                confirmNewPassword: "",
              });
              return;
            } else {
              dispatch(
                setToast({
                  show: true,
                  title: "Cập nhật mật khẩu",
                  time: "just now",
                  content: error.data,
                  color: {
                    header: "#ffcccc",
                    body: "#e60000",
                  },
                })
              );
              setSecurity({
                newPassword: "",
                confirmNewPassword: "",
              });
            }
          } else {
            dispatch(
              setToast({
                show: true,
                title: "Cập nhật mật khẩu",
                time: "just now",
                content: "Đã xảy ra lỗi. Xin thử lại sau",
                color: {
                  header: "#ffcccc",
                  body: "#e60000",
                },
              })
            );
            setSecurity({
              newPassword: "",
              confirmNewPassword: "",
            });
          }
        }
      }
      return;
    }
  };

  return (
    <>
      <Card className="security-setting-container">
        <Card.Body>
          <Row>
            <Col>
              <Form onSubmit={handleSecuritySubmit}>
                <Row>
                  <Col>
                    <Form.Group controlId="formSecuritySettingOldPassword">
                      <Form.Label>Nhập lại mật khẩu cũ</Form.Label>
                      <Form.Control
                        isInvalid={validation.oldPassword.isInvalid}
                        type={isShowPassword ? "text" : "password"}
                        name="oldPassword"
                        value={security.oldPassword}
                        onChange={handleSecurityChange}
                      />
                      <Form.Control.Feedback type="invalid">
                        {validation.oldPassword.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group controlId="formSecuritySettingNewPassword">
                      <Form.Label>Mật khẩu mới</Form.Label>
                      <Form.Control
                        isInvalid={validation.newPassword.isInvalid}
                        type={isShowPassword ? "text" : "password"}
                        name="newPassword"
                        value={security.newPassword}
                        onChange={handleSecurityChange}
                      />
                      <Form.Control.Feedback type="invalid">
                        {validation.newPassword.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="formSecuritySettingConfirmNewPassword">
                      <Form.Label>Xác nhận mật khẩu mới</Form.Label>
                      <Form.Control
                        isInvalid={validation.confirmNewPassword.isInvalid}
                        type={isShowPassword ? "text" : "password"}
                        name="confirmNewPassword"
                        value={security.confirmNewPassword}
                        onChange={handleSecurityChange}
                      />
                      <Form.Control.Feedback type="invalid">
                        {validation.confirmNewPassword.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group controlId="formSecuritySettingIsShowPassword">
                      <Form.Check
                        inline
                        label="Hiện mật khẩu"
                        checked={isShowPassword}
                        onChange={() => {
                          setIsShowPassword(!isShowPassword);
                        }}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Button
                      className="form-button"
                      variant="primary"
                      type="submit"
                    >
                      {isLoading ? <Spinner animation="border" /> : "Cập nhật"}
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Col>
            <Col className="image-container">
              <Image src={lock} fluid />
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
};

export default SecuritySetting;
