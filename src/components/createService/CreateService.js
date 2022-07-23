import React from "react";

//Redux
//Actions

//API Actions
import { useGetServicesQuery } from "../../redux/slices/service/serviceApiSlice";

//React-redux
import { useDispatch } from "react-redux";

//CSS
import "./CreateService.css";

//React-bootstrap
import { Button, Col, Form, InputGroup, Modal, Row } from "react-bootstrap";

const CreateService = ({
  showCreateService,
  setShowCreateService,
  service,
  setService,
  setShowConfirmCreateService,
}) => {
  const handleClose = () => {
    setShowCreateService(false);
  };

  const handleCreateAccessoryChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setService({ ...service, [name]: value });
  };

  const handleConfirmAccessorySubmit = (e) => {
    e.preventDefault();
    setShowCreateService(false);
    setShowConfirmCreateService(true);
  };

  return (
    <>
      <Modal
        show={showCreateService}
        onHide={handleClose}
        dialogClassName="create-service-container"
        centered
      >
        <div className="modal-content-container">
          <Modal.Header>
            <Modal.Title>TẠO PHỤ KIỆN</Modal.Title>
          </Modal.Header>
          <Modal.Body className="modal-body-container">
            <Form>
              <Row>
                <Col>
                  <Form.Group controlId="formCreateAccessoryName">
                    <Form.Label>Tên phụ kiện:</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={service.name}
                      onChange={handleCreateAccessoryChange}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formCreateAccessoryInsurance">
                    <Form.Label>Thời gian bảo hành:</Form.Label>
                    <Form.Control
                      type="text"
                      name="insurance"
                      value={service.insurance}
                      onChange={handleCreateAccessoryChange}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formCreateAccessorySupplier_id">
                    <Form.Label>Nhà phân phối:</Form.Label>
                    <Form.Control
                      as="select"
                      name="supplier_id"
                      value={service.supplier_id}
                      onChange={handleCreateAccessoryChange}
                    >
                      <option>Intel</option>
                      <option>AMD</option>
                      <option>Asus</option>
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group controlId="formCreateAccessoryDescription">
                    <Form.Label>Mô tả phụ kiện:</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="description"
                      value={service.description}
                      onChange={handleCreateAccessoryChange}
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
              onClick={handleConfirmAccessorySubmit}
            >
              Tạo phụ kiện
            </Button>
          </Modal.Footer>
        </div>
      </Modal>
    </>
  );
};

export default CreateService;
