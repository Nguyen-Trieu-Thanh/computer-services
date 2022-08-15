import React from "react";

//Redux
//Actions
import { setToast } from "../../redux/slices/toast/toastSlice";

//API Actions
import { useGetServicesQuery } from "../../redux/slices/service/serviceApiSlice";
import { useRegisterMutation } from "../../redux/slices/auth/authApiSlice";

//React-redux
import { useDispatch } from "react-redux";

//CSS
import "./CreateCustomer.css";

//React-bootstrap
import { Button, Col, Form, InputGroup, Modal, Row } from "react-bootstrap";

const CreateCustomer = ({
  showCreateCustomer,
  setShowCreateCustomer,
  customer,
  setCustomer,
  setShowConfirmCreateCustomer,
  setIsRefetch,
}) => {
  const [register, { isLoading }] = useRegisterMutation();
  const dispatch = useDispatch();

  const handleClose = () => {
    setShowCreateCustomer(false);
  };

  const handleCreateCustomerChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setCustomer({ ...customer, [name]: value });
  };

  const handleCreateCustomerSubmit = async (e) => {
    e.preventDefault();

    try {
      await register(customer)
        .unwrap()
        .then(async (res) => {
          if (res) {
            await dispatch(
              setToast({
                show: true,
                title: "Tạo lịch hẹn",
                time: "just now",
                content: "Lịch hẹn được tạo thành công!",
                color: {
                  header: "#dbf0dc",
                  body: "#41a446",
                },
              })
            );
            await setIsRefetch(true);
            setShowCreateCustomer(false);
            //  setShowConfirmCreateCustomer(true);
          }
        });
    } catch (error) {}
  };

  return (
    <>
      <Modal
        show={showCreateCustomer}
        onHide={handleClose}
        dialogClassName="create-customer-container"
        centered
      >
        <div className="modal-content-container">
          <Modal.Header>
            <Modal.Title>Đăng kí tài khoản khách hàng</Modal.Title>
          </Modal.Header>
          <Modal.Body className="modal-body-container">
            <Form>
              <Row>
                <Col>
                  <Form.Group controlId="formCreateCustomerPhoneNumber/Username">
                    <Form.Label>Số điện thoại / Tên đăng nhập:</Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      value={customer.username}
                      onChange={handleCreateCustomerChange}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formCreateCustomerPassword">
                    <Form.Label>Mật khẩu:</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={customer.password}
                      onChange={handleCreateCustomerChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Đóng
            </Button>
            <Button
              type="submit"
              variant="primary"
              onClick={handleCreateCustomerSubmit}
            >
              Đăng kí
            </Button>
          </Modal.Footer>
        </div>
      </Modal>
    </>
  );
};

export default CreateCustomer;
