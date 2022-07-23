import React from "react";

//Redux
//Actions

//API Actions
import { useGetServicesQuery } from "../../redux/slices/service/serviceApiSlice";

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
}) => {
  const handleClose = () => {
    setShowCreateCustomer(false);
  };

  const handleCreateAccessoryChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setCustomer({ ...customer, [name]: value });
  };

  const handleCreateCustomerSubmit = (e) => {
    e.preventDefault();
    setShowCreateCustomer(false);
    setShowConfirmCreateCustomer(true);
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
                      defaultValue={customer.username}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formCreateCustomerPassword">
                    <Form.Label>Mật khẩu:</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      defaultValue={customer.password}
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
