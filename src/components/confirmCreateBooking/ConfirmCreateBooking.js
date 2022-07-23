import React from "react";

//Redux
//Actions
import { setToast } from "../../redux/slices/toast/toastSlice";

//API Actions
import { useCreateBookingMutation } from "../../redux/slices/booking/bookingApiSlice";

//React-redux
import { useDispatch } from "react-redux";

//React-bootstrap
import { Button, Col, Form, Modal, Row, Spinner } from "react-bootstrap";

//CSS
import "./ConfirmCreateBooking.css";

const ConfirmCreateBooking = ({
  setShowCreateBooking,
  booking,
  setIsRefetch,
  setShowConfirmCreateBooking,
  showConfirmCreateBooking,
  servicesData,
}) => {
  const [createBooking, { isLoading }] = useCreateBookingMutation();

  const dispatch = useDispatch();

  const handleClose = () => {
    setShowConfirmCreateBooking(false);
    setShowCreateBooking(true);
  };

  // const address =
  //   "Đường " +
  //   booking.cus_address.street +
  //   ", Phường " +
  //   booking.cus_address.ward +
  //   ", Quận " +
  //   booking.cus_address.district +
  //   ", Thành phố " +
  //   booking.cus_address.city;

  const address =
    booking.cus_address.street +
    ", " +
    booking.cus_address.ward +
    ", " +
    booking.cus_address.district +
    ", " +
    booking.cus_address.city;

  const handleConfirmBookingSubmit = async (e) => {
    e.preventDefault();

    try {
      await createBooking(booking)
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
            setShowConfirmCreateBooking(false);
          }
        });
    } catch (error) {}
  };

  return (
    <>
      <Modal
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
                  <Form.Group controlId="formConfirmCreateBookingPhoneNumber">
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
                  <Form.Group controlId="formConfirmCreateBookingCustomerName">
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
                  <Form.Group controlId="formConfirmCreateBookingDescription">
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
                  <Form.Group controlId="formConfirmCreateBookingType">
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
                  <Form.Group controlId="formConfirmCreateBookingServices">
                    <Form.Label>Danh sách dịch vụ:</Form.Label>
                    <Form.Control
                      plaintext
                      readOnly
                      disabled
                      type="text"
                      name="services"
                      defaultValue={servicesData
                        .filter((x) => booking.services.includes(x._id))
                        .map((service) => {
                          return service.name;
                        })
                        .join(", ")}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group controlId="formConfirmCreateBookingAddress">
                    <Form.Label>Địa chỉ khách hàng:</Form.Label>
                    <Form.Control
                      plaintext
                      readOnly
                      disabled
                      type="text"
                      name="address"
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
              className="confirm-button"
            >
              {isLoading ? <Spinner animation="border" /> : "Xác nhận"}
            </Button>
          </Modal.Footer>
        </div>
      </Modal>
    </>
  );
};

export default ConfirmCreateBooking;
