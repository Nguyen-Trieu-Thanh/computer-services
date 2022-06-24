import React, { useState } from "react";

//React-bootstrap
import { Button, Modal, Form, Row, Col } from "react-bootstrap";
import GeneralSchedule from "../generalSchedule/GeneralSchedule";

//CSS
import "./BookingDetail.css";

const BookingDetail = ({
  showBookingDetail,
  setShowBookingDetail,
  bookingDetail,
}) => {
  //Local state
  const [showGeneralSchedule, setShowGeneralSchedule] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState({
    date: "",
    slot: "",
  });

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
              <Row>
                <Col>
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
                  </Form>
                </Col>
              </Row>
              <Row className="mb-2">
                <Col>
                  <Button
                    variant="primary"
                    onClick={() => {
                      setShowGeneralSchedule(true);
                    }}
                  >
                    Chọn slot
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group controlId="formDate">
                    <Form.Label>Ngày</Form.Label>
                    <Form.Control
                      readOnly
                      defaultValue=""
                      value={selectedSlot.date}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formSlot">
                    <Form.Label>Slot</Form.Label>
                    <Row>
                      <Col>
                        <Form.Control
                          readOnly
                          defaultValue=""
                          value={selectedSlot.slot}
                        />
                      </Col>
                    </Row>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formTime">
                    <Form.Label>Thời gian</Form.Label>
                    <Row>
                      <Col>
                        <Form.Control readOnly defaultValue="" />
                      </Col>
                      <Col>
                        <Form.Control readOnly defaultValue="" />
                      </Col>
                    </Row>
                  </Form.Group>
                </Col>
              </Row>
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
      <GeneralSchedule
        showGeneralSchedule={showGeneralSchedule}
        setShowGeneralSchedule={setShowGeneralSchedule}
        selectedSlot={selectedSlot}
        setSelectedSlot={setSelectedSlot}
      />
    </>
  );
};

export default BookingDetail;
