import React from "react";

//Redux
//Actions
import { createBooking } from "../../redux/slices/bookingSlice";

//React-redux
import { useDispatch, useSelector } from "react-redux";

//React-bootstrap
import { Button, Form, Modal, Row, Col, InputGroup } from "react-bootstrap";

//CSS
import "./ConfirmCreateBooking.css";

const ConfirmCreateBooking = ({
  showConfirmCreateBooking,
  setShowConfirmCreateBooking,
  setShowCreateBooking,
  booking,
}) => {
  const dispatch = useDispatch();

  const handleClose = () => {
    setShowConfirmCreateBooking(false);
    setShowCreateBooking(true);
  };

  const address =
    "Đường " +
    booking.cus_address.street +
    ", Phường " +
    booking.cus_address.ward +
    ", Quận " +
    booking.cus_address.district +
    ", Thành phố " +
    booking.cus_address.city;

  const handleConfirmBookingSubmit = (e) => {
    e.preventDefault();
    dispatch(createBooking(booking));
    setShowConfirmCreateBooking(false);
  };

  return (
    <>
      <Modal
        // show={showConfirmCreateBooking}
        show={showConfirmCreateBooking}
        onHide={handleClose}
        dialogClassName="confirm-create-booking-container"
        centered
      >
        <div className="modal-content-container">
          <Modal.Header>
            <Modal.Title>XÁC NHẬN THÔNG TIN LỊCH HẸN</Modal.Title>
          </Modal.Header>
          <Modal.Body className="modal-body-container">
            <Form>
              <Row>
                <Col>
                  <Form.Group controlId="formCreateBookingPhoneNumber">
                    <Form.Label>Số điện thoại:</Form.Label>
                    <Form.Control
                      plaintext
                      readOnly
                      disabled
                      type="text"
                      name="phonenum"
                      defaultValue={booking.phonenum}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formCreateBookingCustomerName">
                    <Form.Label>Họ và tên khách hàng:</Form.Label>
                    <Form.Control
                      plaintext
                      readOnly
                      disabled
                      type="text"
                      name="cus_name"
                      defaultValue={booking.cus_name}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group controlId="formCreateBookingDescription">
                    <Form.Label>Mô tả lịch hẹn:</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      readOnly
                      disabled
                      name="description"
                      defaultValue={booking.description}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group controlId="formCreateBookingType">
                    <Form.Label>Loại lịch hẹn:</Form.Label>
                    <Form.Control
                      plaintext
                      readOnly
                      disabled
                      type="text"
                      name="type"
                      defaultValue={booking.type}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formCreateBookingAddress">
                    <Form.Label>Danh sách dịch vụ:</Form.Label>
                    <Form.Control
                      plaintext
                      readOnly
                      disabled
                      type="text"
                      name="type"
                      defaultValue={booking.services.join(", ")}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group controlId="formCreateBookingAddress">
                    <Form.Label>Địa chỉ khách hàng:</Form.Label>
                    <Form.Control
                      plaintext
                      readOnly
                      disabled
                      type="text"
                      name="type"
                      defaultValue={address}
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
              onClick={handleConfirmBookingSubmit}
            >
              Xác nhận
            </Button>
          </Modal.Footer>
        </div>
      </Modal>
    </>
  );
};

export default ConfirmCreateBooking;
