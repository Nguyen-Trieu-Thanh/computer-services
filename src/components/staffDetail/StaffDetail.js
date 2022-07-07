import React from "react";

//React-bootstrap
import { Button, Modal, Form, Row, Col } from "react-bootstrap";

//CSS
import "./StaffDetail.css";

const StaffDetail = ({ showStaffDetail, setShowStaffDetail, staffDetail }) => {
  const handleClose = () => {
    setShowStaffDetail(false);
  };

  return (
    <>
      <Modal
        size="lg"
        show={showStaffDetail}
        onHide={handleClose}
        dialogClassName="staff-detail-container"
        centered
      >
        <div className="modal-content-container">
          <Modal.Header closeButton={true}>
            <Modal.Title>Staff No. {staffDetail.number}</Modal.Title>
          </Modal.Header>
          <div className="modal-body-container">
            <Modal.Body>
              <Form>
                <Row>
                  <Col>
                    <Form.Group controlId="formStaffDetailPhoneNumber">
                      <Form.Label>Số điện thoại:</Form.Label>
                      <Form.Control
                        type="text"
                        name="phonenum"
                        defaultValue={staffDetail.phonenum}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="formStaffDetailRole">
                      <Form.Label>Vai trò:</Form.Label>
                      <Form.Control
                        type="text"
                        name="role"
                        defaultValue={staffDetail.role}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            </Modal.Body>
          </div>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleClose}>
              Save Changes
            </Button>
          </Modal.Footer>
        </div>
      </Modal>
    </>
  );
};

export default StaffDetail;
