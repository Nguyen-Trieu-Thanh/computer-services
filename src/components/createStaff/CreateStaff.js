import React, { useState } from "react";

//Actions
import { setToast } from "../../redux/slices/toast/toastSlice";

//API Actions
import {
  useGetAccountByUsernameMutation,
  useCreateStaffMutation,
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
import "./CreateStaff.css";

const CreateStaff = ({ showCreateStaff, setShowCreateStaff, refetch }) => {
  const [getAccountByUsername, { isLoading }] =
    useGetAccountByUsernameMutation();
  const [createStaff, { isLoading: isCreateStaffLoading }] =
    useCreateStaffMutation();

  //Local state
  const [staff, setStaff] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    role: "staff",
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
    setShowCreateStaff(false);
    setStaff({
      username: "",
      password: "",
      confirmPassword: "",
      role: "staff",
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

  const handleCreateStaffChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    if (name === "username") {
      const phonenumRegex = /^(?:\d+|)$/;
      if (!phonenumRegex.test(value)) {
        setStaff({ ...staff, [name]: value });
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
          setStaff({ ...staff, [name]: value });
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
          setStaff({ ...staff, [name]: value });
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
      setStaff({ ...staff, [name]: value });
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
      setStaff({ ...staff, [name]: value });
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
    if (staff.username === "") {
      setValidation({
        ...validation,
        username: {
          message: "Tên đăng nhập/Số điện thoại không được để trống",
          isInvalid: true,
          isValid: false,
        },
      });
      return;
    }

    const phonenumRegex = /^(?:\d+|)$/;
    if (!phonenumRegex.test(staff.username)) {
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
      if (staff.username.length > 10) {
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

    try {
      await getAccountByUsername(staff.username)
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
              message: error.data.message ? error.data.message : error.data,
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
  };

  const handleCreateStaffSubmit = async (e) => {
    e.preventDefault();

    if (staff.username === "") {
      setValidation({
        ...validation,
        username: {
          message: "Tên đăng nhập/Số điện thoại không được để trống",
          isInvalid: true,
          isValid: false,
        },
      });
      return;
    }

    if (!validation.username.isValid) {
      if (!validation.username.isInvalid) {
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

    if (staff.password === "") {
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

    if (staff.password !== staff.confirmPassword) {
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
      setStaff({ ...staff, password: "", confirmPassword: "" });
      return;
    }

    if (
      validation.username.isValid &&
      !validation.username.isInvalid &&
      !validation.password.isInvalid &&
      !validation.confirmPassword.isInvalid
    ) {
      try {
        await createStaff(staff)
          .unwrap()
          .then((res) => {
            if (res) {
              dispatch(
                setToast({
                  show: true,
                  title: "Đăng kí tài khoản nhân viên",
                  time: "just now",
                  content: "Tài khoản nhân viên được đăng kí thành công",
                  color: {
                    header: "#dbf0dc",
                    body: "#41a446",
                  },
                })
              );
              setStaff({
                username: "",
                password: "",
                confirmPassword: "",
                role: "staff",
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
              setShowCreateStaff(false);
            }
          });
      } catch (error) {
        if (error) {
          if (error.data) {
            dispatch(
              setToast({
                show: true,
                title: "Tạo nhân viên",
                time: "just now",
                content: error.data,
                color: {
                  header: "#ffcccc",
                  body: "#e60000",
                },
              })
            );
            setStaff({
              username: "",
              password: "",
              confirmPassword: "",
              role: "staff",
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
            setShowCreateStaff(false);
          } else {
            dispatch(
              setToast({
                show: true,
                title: "Tạo nhân viên",
                time: "just now",
                content: "Đã xảy ra lỗi. Xin thử lại sau",
                color: {
                  header: "#ffcccc",
                  body: "#e60000",
                },
              })
            );
            setStaff({
              username: "",
              password: "",
              confirmPassword: "",
              role: "staff",
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
            setShowCreateStaff(false);
          }
        }
      }
      return;
    }
  };

  return (
    <>
      <Modal
        show={showCreateStaff}
        onHide={() => {
          setShowConfirmClose(true);
        }}
        dialogClassName="create-staff-container"
        centered
      >
        <Modal.Header>
          <Modal.Title>Đăng kí tài khoản nhân viên</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreateStaffSubmit}>
          <Modal.Body>
            <Row>
              <Col>
                <Form.Group controlId="formCreateStaffUsername">
                  <Form.Label>Tên đăng nhập/Số điện thoại:</Form.Label>
                  <InputGroup>
                    <Form.Control
                      isInvalid={validation.username.isInvalid}
                      isValid={validation.username.isValid}
                      type="text"
                      name="username"
                      value={staff.username}
                      onChange={handleCreateStaffChange}
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
                <Form.Group controlId="formCreateStaffRole">
                  <Form.Label>Vai trò:</Form.Label>
                  <Form.Control
                    disabled
                    as="select"
                    name="role"
                    value={staff.role}
                    onChange={handleCreateStaffChange}
                  >
                    <option value="staff">Nhân viên</option>
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group controlId="formCreateStaffPassword">
                  <Form.Label>Mật khẩu:</Form.Label>
                  <Form.Control
                    isInvalid={validation.password.isInvalid}
                    type="password"
                    name="password"
                    value={staff.password}
                    onChange={handleCreateStaffChange}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validation.password.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="formCreateStaffConfirmPassword">
                  <Form.Label>Xác nhận mật khẩu:</Form.Label>
                  <Form.Control
                    isInvalid={validation.confirmPassword.isInvalid}
                    type="password"
                    name="confirmPassword"
                    value={staff.confirmPassword}
                    onChange={handleCreateStaffChange}
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
              {isCreateStaffLoading ? (
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

export default CreateStaff;
