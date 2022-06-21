import React from "react";

//React-bootstrap
import { Button, Modal, Form, Row, Col } from "react-bootstrap";

//CSS
import "./BookingDetail.css";

const BookingDetail = ({
  showBookingDetail,
  setShowBookingDetail,
  bookingDetail,
}) => {
  const handleClose = () => {
    setShowBookingDetail(false);
  };

  return (
    <>
      <Modal
        size="lg"
        show={showBookingDetail}
        onHide={handleClose}
        dialogClassName="booking-detail"
        centered
      >
        <div className="modal-content-container">
          <Modal.Header closeButton={true}>
            <Modal.Title>
              XÁC NHẬN LỊCH HẸN MÃ: {bookingDetail.code}
            </Modal.Title>
          </Modal.Header>
          <div className="modal-body-container">
            <Modal.Body>
              <Form>
                <Row>
                  <Col>
                    <Form.Group controlId="formCustomerName">
                      <Form.Label>Khách hàng:</Form.Label>
                      <Form.Control
                        readOnly
                        defaultValue={bookingDetail.customerName}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="formPhoneNumber">
                      <Form.Label>Số điện thoại:</Form.Label>
                      <Form.Control
                        readOnly
                        defaultValue={bookingDetail.phoneNumber}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group controlId="formServices">
                      <Row>
                        <Col>
                          <Form.Label>Danh sách dịch vụ:</Form.Label>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <Form.Check
                            id="checkbox-1"
                            inline
                            type="checkbox"
                            label="Vệ sinh máy"
                            checked
                            disabled
                          />
                        </Col>
                        <Col>
                          <Form.Check
                            id="checkbox-2"
                            inline
                            type="checkbox"
                            label="Thay keo tản nhiệt"
                            checked
                            disabled
                          />
                        </Col>
                        <Col>
                          <Form.Check
                            id="checkbox-3"
                            inline
                            type="checkbox"
                            label="Thay linh kiện"
                            disabled
                          />
                        </Col>
                      </Row>
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            </Modal.Body>
          </div>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Đóng
            </Button>
            <Button variant="primary" onClick={handleClose}>
              Xác nhận
            </Button>
          </Modal.Footer>
        </div>
      </Modal>
    </>
  );
};

export default BookingDetail;
