import React, { useState } from "react";

//Actions
import { setToast } from "../../redux/slices/toast/toastSlice";

//API Actions
import {
  useGetAccountByUsernameMutation,
  useCreateManagerMutation,
} from "../../redux/slices/account/accountApiSlice";

//React-redux
import { useDispatch } from "react-redux";

//React-bootstrap
import {
  Modal,
  Form,
  Row,
  Col,
  Button,
  InputGroup,
  Spinner,
} from "react-bootstrap";

//CSS
import "./CreateManager.css";

const CreateManager = ({
  showCreateManager,
  setShowCreateManager,
  refetch,
}) => {
  const [getAccountByUsername, { isLoading }] =
    useGetAccountByUsernameMutation();
  const [createManager, { isLoading: isCreateManagerLoading }] =
    useCreateManagerMutation();

  //Local state
  const [manager, setManager] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    role: "manager",
    agency_id: "62d11bfdee51782c70fe0736",
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
    setShowCreateManager(false);
    setManager({
      username: "",
      password: "",
      confirmPassword: "",
      role: "manager",
      agency_id: "62d11bfdee51782c70fe0736",
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

  const handleCreateManagerChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    if (name === "username") {
      const phonenumRegex = /^(?:\d+|)$/;
      if (!phonenumRegex.test(value)) {
        setManager({ ...manager, [name]: value });
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
          setManager({ ...manager, [name]: value });
          setValidation({
            ...validation,
            username: {
              message:
                "Tên đăng nhập/Số điện thoại không được vượt quá 10 chữ số",
              isInvalid: true,
              isValid: false,
            },
          });
          return;
        } else {
          setManager({ ...manager, [name]: value });
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
      setManager({ ...manager, [name]: value });

      return;
    }

    if (name === "confirmPassword") {
      setManager({ ...manager, [name]: value });

      return;
    }
  };

  const handleGetAccountByUsername = async () => {
    if (manager.username.length <= 10) {
      try {
        await getAccountByUsername(manager.username)
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

  const handleCreateManagerSubmit = async (e) => {
    e.preventDefault();

    if (manager.username === "") {
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

    if (manager.password === "") {
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

    if (manager.password !== manager.confirmPassword) {
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
      setManager({ ...manager, password: "", confirmPassword: "" });
      return;
    }

    if (
      validation.username.isValid &&
      !validation.username.isInvalid &&
      !validation.password.isInvalid &&
      !validation.confirmPassword.isInvalid
    ) {
      try {
        await createManager(manager)
          .unwrap()
          .then((res) => {
            if (res) {
              dispatch(
                setToast({
                  show: true,
                  title: "Tạo quản lí",
                  time: "just now",
                  content: "Quản lí được tạo thành công",
                  color: {
                    header: "#dbf0dc",
                    body: "#41a446",
                  },
                })
              );
              setManager({
                username: "",
                password: "",
                confirmPassword: "",
                role: "manager",
                agency_id: "62d11bfdee51782c70fe0736",
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
              setShowCreateManager(false);
            }
          });
      } catch (error) {
        if (error) {
          if (error.data) {
            dispatch(
              setToast({
                show: true,
                title: "Tạo quản lí",
                time: "just now",
                content: error.data,
                color: {
                  header: "#ffcccc",
                  body: "#e60000",
                },
              })
            );
            setManager({
              username: "",
              password: "",
              confirmPassword: "",
              role: "manager",
              agency_id: "62d11bfdee51782c70fe0736",
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
            setShowCreateManager(false);
          } else {
            dispatch(
              setToast({
                show: true,
                title: "Tạo quản lí",
                time: "just now",
                content: "Đã xảy ra lỗi. Xin thử lại sau",
                color: {
                  header: "#ffcccc",
                  body: "#e60000",
                },
              })
            );
            setManager({
              username: "",
              password: "",
              confirmPassword: "",
              role: "manager",
              agency_id: "62d11bfdee51782c70fe0736",
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
            setShowCreateManager(false);
          }
        }
      }
      return;
    }
  };

  return (
    <>
      <Modal
        show={showCreateManager}
        onHide={() => {
          setShowConfirmClose(true);
        }}
        dialogClassName="create-manager-container"
        centered
      >
        <Modal.Header>
          <Modal.Title>Đăng kí tài khoản quản lí</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreateManagerSubmit}>
          <Modal.Body>
            <Row>
              <Col>
                <Form.Group controlId="formCreateManagerUsername">
                  <Form.Label>Tên đăng nhập:</Form.Label>
                  <InputGroup>
                    <Form.Control
                      isInvalid={validation.username.isInvalid}
                      isValid={validation.username.isValid}
                      type="text"
                      name="username"
                      value={manager.username}
                      onChange={handleCreateManagerChange}
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
                <Form.Group controlId="formCreateManagerRole">
                  <Form.Label>Vai trò:</Form.Label>
                  <Form.Control
                    disabled
                    as="select"
                    name="role"
                    value={manager.role}
                    onChange={handleCreateManagerChange}
                  >
                    <option value="manager">Quản lí</option>
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group controlId="formCreateManagerPassword">
                  <Form.Label>Mật khẩu:</Form.Label>
                  <Form.Control
                    isInvalid={validation.password.isInvalid}
                    type="password"
                    name="password"
                    value={manager.password}
                    onChange={handleCreateManagerChange}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validation.password.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="formCreateManagerConfirmPassword">
                  <Form.Label>Xác nhận mật khẩu:</Form.Label>
                  <Form.Control
                    isInvalid={validation.confirmPassword.isInvalid}
                    type="password"
                    name="confirmPassword"
                    value={manager.confirmPassword}
                    onChange={handleCreateManagerChange}
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
              {isCreateManagerLoading ? (
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

export default CreateManager;
