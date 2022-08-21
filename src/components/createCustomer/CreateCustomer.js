import React, { useState } from "react";

//Redux
//Actions
import { setToast } from "../../redux/slices/toast/toastSlice";

//API Actions
import { useGetServicesQuery } from "../../redux/slices/service/serviceApiSlice";
import { useRegisterMutation } from "../../redux/slices/auth/authApiSlice";
import { useGetAccountByUsernameMutation } from "../../redux/slices/account/accountApiSlice";

//React-redux
import { useDispatch } from "react-redux";

//CSS
import "./CreateCustomer.css";

//React-bootstrap
import {
  Button,
  Col,
  Form,
  InputGroup,
  Modal,
  Row,
  Spinner,
} from "react-bootstrap";

const CreateCustomer = ({
  showCreateCustomer,
  setShowCreateCustomer,
  refetch,
}) => {
  const [getAccountByUsername, { isLoading }] =
    useGetAccountByUsernameMutation();
  const [register, { isLoading: isCreateCustomerLoading }] =
    useRegisterMutation();

  //Local state
  const [customer, setCustomer] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    role: "customer",
  });
  const [validation, setValidation] = useState({
    username: {
      message: "",
      isInvalid: false,
      isValid: false,
    },
    password: {
      message: "",
      isInvalid: false,
    },
    confirmPassword: {
      message: "",
      isInvalid: false,
    },
  });

  const [showConfirmClose, setShowConfirmClose] = useState(false);

  const dispatch = useDispatch();

  const handleClose = () => {
    setShowConfirmClose(false);
    setShowCreateCustomer(false);
    setCustomer({
      username: "",
      password: "",
      confirmPassword: "",
      role: "customer",
    });
    setValidation({
      username: {
        message: "",
        isInvalid: false,
        isValid: false,
      },
      password: {
        message: "",
        isInvalid: false,
      },
      confirmPassword: {
        message: "",
        isInvalid: false,
      },
    });
  };

  const handleCreateCustomerChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    if (name === "username") {
      const phonenumRegex = /^(?:\d+|)$/;
      if (!phonenumRegex.test(value)) {
        setCustomer({ ...customer, [name]: value });
        setValidation({
          ...validation,
          username: {
            message: "Tên đăng nhập/Số điện thoại chỉ được chứa số",
            isInvalid: true,
            isValid: false,
          },
        });
        return;
      } else {
        if (value.length > 10) {
          setCustomer({ ...customer, [name]: value });
          setValidation({
            ...validation,
            username: {
              message: "Tên đăng nhập/Số điện thoại không được vượt quá 10 số",
              isInvalid: true,
              isValid: false,
            },
          });
          return;
        } else {
          setCustomer({ ...customer, [name]: value });
          setValidation({
            ...validation,
            username: {
              message: "",
              isInvalid: false,
              isValid: false,
            },
          });
        }
      }
      return;
    }

    if (name === "password") {
      setCustomer({ ...customer, [name]: value });
      //   setValidation({
      //     ...validation,
      //     confirmPassword: {
      //       message: "",
      //       isInvalid: false,
      //       isValid: false,
      //     },
      //   });
      return;
    }

    if (name === "confirmPassword") {
      setCustomer({ ...customer, [name]: value });
      //   setValidation({
      //     ...validation,
      //     confirmPassword: {
      //       message: "",
      //       isInvalid: false,
      //       isValid: true,
      //     },
      //   });
      return;
    }
  };

  const handleGetAccountByUsername = async () => {
    if (customer.username.length <= 10) {
      try {
        await getAccountByUsername(customer.username)
          .unwrap()
          .then(async (res) => {
            if (res) {
              setValidation({
                ...validation,
                username: {
                  message: "Tên đăng nhập/Số điện thoại đã được sử dụng",
                  isInvalid: true,
                  isValid: false,
                },
              });
            } else {
              setValidation({
                ...validation,
                username: {
                  message: "",
                  isInvalid: false,
                  isValid: true,
                },
              });
            }
          });
      } catch (error) {
        if (error) {
          if (error.data) {
            setValidation({
              ...validation,
              username: {
                message: error.data,
                isInvalid: true,
                isValid: false,
              },
            });
          } else {
            setValidation({
              ...validation,
              username: {
                message: "Đã xảy ra lỗi. Xin thử lại sau",
                isInvalid: true,
                isValid: false,
              },
            });
          }
        }
      }
    }
  };

  const handleCreateCustomerSubmit = async (e) => {
    e.preventDefault();

    if (customer.username === "") {
      setValidation({
        ...validation,
        username: {
          message: "Tên đăng nhập không được để trống",
          isInvalid: true,
          isValid: false,
        },
      });
      return;
    }

    if (!validation.username.isValid) {
      if (validation.username.message !== "Tài khoản đã tồn tại") {
        setValidation({
          ...validation,
          username: {
            message: "Xin hãy kiểm tra tên đăng nhập",
            isInvalid: true,
            isValid: false,
          },
        });
      }
      return;
    }

    if (customer.password === "") {
      setValidation({
        ...validation,
        password: {
          message: "Mật khẩu không được để trống",
          isInvalid: true,
        },
        confirmPassword: {
          message: "",
          isInvalid: false,
        },
      });
      return;
    }

    if (customer.password !== customer.confirmPassword) {
      setValidation({
        ...validation,
        password: {
          message: "",
          isInvalid: false,
        },
        confirmPassword: {
          message: "Xác nhận mật khẩu không chính xác",
          isInvalid: true,
        },
      });
      setCustomer({ ...customer, password: "", confirmPassword: "" });
      return;
    }

    if (
      validation.username.isValid &&
      !validation.username.isInvalid &&
      !validation.password.isInvalid &&
      !validation.confirmPassword.isInvalid
    ) {
      try {
        await register(customer)
          .unwrap()
          .then((res) => {
            if (res) {
              dispatch(
                setToast({
                  show: true,
                  title: "Tạo khách hàng",
                  time: "just now",
                  content: "Khách hàng được tạo thành công",
                  color: {
                    header: "#dbf0dc",
                    body: "#41a446",
                  },
                })
              );
              setCustomer({
                username: "",
                password: "",
                confirmPassword: "",
                role: "customer",
              });
              setValidation({
                username: {
                  message: "",
                  isInvalid: false,
                  isValid: false,
                },
                password: {
                  message: "",
                  isInvalid: false,
                },
                confirmPassword: {
                  message: "",
                  isInvalid: false,
                },
              });
              refetch();
              setShowCreateCustomer(false);
            }
          });
      } catch (error) {
        if (error) {
          if (error.data) {
            dispatch(
              setToast({
                show: true,
                title: "Tạo khách hàng",
                time: "just now",
                content: error.data,
                color: {
                  header: "#ffcccc",
                  body: "#e60000",
                },
              })
            );
            setCustomer({
              username: "",
              password: "",
              confirmPassword: "",
              role: "customer",
            });
            setValidation({
              username: {
                message: "",
                isInvalid: false,
                isValid: false,
              },
              password: {
                message: "",
                isInvalid: false,
              },
              confirmPassword: {
                message: "",
                isInvalid: false,
              },
            });
            refetch();
            setShowCreateCustomer(false);
          } else {
            dispatch(
              setToast({
                show: true,
                title: "Tạo khách hàng",
                time: "just now",
                content: "Đã xảy ra lỗi. Xin thử lại sau",
                color: {
                  header: "#ffcccc",
                  body: "#e60000",
                },
              })
            );
            setCustomer({
              username: "",
              password: "",
              confirmPassword: "",
              role: "customer",
            });
            setValidation({
              username: {
                message: "",
                isInvalid: false,
                isValid: false,
              },
              password: {
                message: "",
                isInvalid: false,
              },
              confirmPassword: {
                message: "",
                isInvalid: false,
              },
            });
            setShowCreateCustomer(false);
          }
        }
      }
      return;
    }
  };

  return (
    <>
      <Modal
        show={showCreateCustomer}
        onHide={() => {
          setShowConfirmClose(true);
        }}
        dialogClassName="create-customer-container"
        centered
      >
        <Modal.Header>
          <Modal.Title>Đăng kí tài khoản khách hàng</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreateCustomerSubmit}>
          <Modal.Body>
            <Row>
              <Col>
                <Form.Group controlId="formCreateCustomerUsername">
                  <Form.Label>Tên đăng nhập/Số điện thoại:</Form.Label>
                  <InputGroup>
                    <Form.Control
                      isInvalid={validation.username.isInvalid}
                      isValid={validation.username.isValid}
                      type="text"
                      name="username"
                      value={customer.username}
                      onChange={handleCreateCustomerChange}
                    />
                    <InputGroup.Append>
                      <Button
                        variant="primary"
                        onClick={handleGetAccountByUsername}
                        className="check-phonenumber-button"
                      >
                        {isLoading ? (
                          <Spinner animation="border" />
                        ) : (
                          "Kiểm tra"
                        )}
                      </Button>
                    </InputGroup.Append>
                    <Form.Control.Feedback type="invalid">
                      {validation.username.message}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="formCreateCustomerRole">
                  <Form.Label>Vai trò:</Form.Label>
                  <Form.Control
                    disabled
                    as="select"
                    name="role"
                    value={customer.role}
                    onChange={handleCreateCustomerChange}
                  >
                    <option value="customer">Khách hàng</option>
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group controlId="formCreateCustomerPassword">
                  <Form.Label>Mật khẩu:</Form.Label>
                  <Form.Control
                    isInvalid={validation.password.isInvalid}
                    type="password"
                    name="password"
                    value={customer.password}
                    onChange={handleCreateCustomerChange}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validation.password.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="formCreateCustomerConfirmPassword">
                  <Form.Label>Xác nhận mật khẩu:</Form.Label>
                  <Form.Control
                    isInvalid={validation.confirmPassword.isInvalid}
                    type="password"
                    name="confirmPassword"
                    value={customer.confirmPassword}
                    onChange={handleCreateCustomerChange}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validation.confirmPassword.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                setShowConfirmClose(true);
              }}
            >
              Đóng
            </Button>
            <Button type="submit" variant="primary" className="confirm-button">
              {isCreateCustomerLoading ? (
                <Spinner animation="border" />
              ) : (
                "Đăng kí"
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      <Modal
        show={showConfirmClose}
        onHide={() => {
          setShowConfirmClose(false);
        }}
        centered
      >
        <Modal.Header>
          <Modal.Title>Xác nhận đóng</Modal.Title>
        </Modal.Header>
        <Modal.Body>Dữ liệu bạn nhập sẽ không được lưu</Modal.Body>
        <Modal.Footer>
          <Button
            style={{ width: "100px" }}
            variant="danger"
            onClick={() => {
              setShowConfirmClose(false);
            }}
          >
            Hủy
          </Button>
          <Button
            style={{ width: "100px" }}
            variant="primary"
            onClick={handleClose}
          >
            Xác nhận
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CreateCustomer;
