import { FormControlLabel, FormGroup, Switch } from "@mui/material";
import React, { useState } from "react";

//Redux
//Actions
import { setToast } from "../../redux/slices/toast/toastSlice";

//API Actions
import { useUpdateBookingMutation } from "../../redux/slices/booking/bookingApiSlice";

//React-bootstrap
import { Button, Modal, Form, Row, Col, Spinner } from "react-bootstrap";
import GeneralSchedule from "../generalSchedule/GeneralSchedule";

//CSS
import "./BookingDetail.css";
import { useDispatch } from "react-redux";

const BookingDetail = ({
  showBookingDetail,
  setShowBookingDetail,
  bookingDetail,
  setBookingDetail,
  setIsRefetch,
  servicesData,
}) => {
  const [updateBooking, { isLoading }] = useUpdateBookingMutation();

  //Local state
  const [showGeneralSchedule, setShowGeneralSchedule] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState({
    date: "",
    slot: "",
  });
  const [isEditBooking, setIsEditBooking] = useState(false);

  //Utilities
  const dispatch = useDispatch();

  const handleClose = () => {
    setShowBookingDetail(false);
  };

  const handleUpdateBookingChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setBookingDetail({ ...bookingDetail, [name]: value });
  };

  // const address =
  //   "Đường " +
  //   bookingDetail.cus_address.street +
  //   ", Phường " +
  //   bookingDetail.cus_address.ward +
  //   ", Quận " +
  //   bookingDetail.cus_address.district +
  //   ", Thành phố " +
  //   bookingDetail.cus_address.city;

  const address =
    bookingDetail.cus_address.street +
    ", " +
    bookingDetail.cus_address.ward +
    ", " +
    bookingDetail.cus_address.district +
    ", " +
    bookingDetail.cus_address.city;

  const handleUpdateBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateBooking(bookingDetail)
        .unwrap()
        .then(async (res) => {
          if (res) {
            await dispatch(
              setToast({
                show: true,
                title: "Cập nhật lịch hẹn",
                time: "just now",
                content: "Lịch hẹn được cập nhật thành công!",
                color: {
                  header: "#dbf0dc",
                  body: "#41a446",
                },
              })
            );
            await setIsRefetch(true);
            setShowBookingDetail(false);
          }
        });
    } catch (error) {}
  };

  return (
    <>
      <Modal
        show={showBookingDetail}
        onHide={handleClose}
        dialogClassName="booking-detail"
        centered
      >
        <div className="modal-content-container">
          <Modal.Header>
            <Modal.Title>CHI TIẾT LỊCH HẸN MÃ: {bookingDetail._id}</Modal.Title>
          </Modal.Header>
          <div className="modal-body-container">
            <Modal.Body>
              <Form>
                <Row>
                  <Col>
                    <Form.Group controlId="formBookingDetailPhoneNumber">
                      <Form.Label>Số điện thoại:</Form.Label>
                      <Form.Control
                        plaintext
                        readOnly
                        disabled
                        type="text"
                        name="phonenum"
                        defaultValue={bookingDetail.phonenum}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="formBookingDetailCustomerName">
                      <Form.Label>Khách hàng:</Form.Label>
                      <Form.Control
                        plaintext
                        readOnly
                        disabled
                        type="text"
                        name="cus_name"
                        defaultValue={bookingDetail.cus_name}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group controlId="formBookingDetailDescription">
                      <Form.Label>Mô tả lịch hẹn:</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        readOnly
                        disabled
                        name="description"
                        defaultValue={bookingDetail.description}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group controlId="formBookingDetailType">
                      <Form.Label>Loại lịch hẹn:</Form.Label>
                      <Form.Control
                        plaintext
                        readOnly
                        disabled
                        type="text"
                        name="type"
                        defaultValue={bookingDetail.type}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="formBookingDetailAddress">
                      <Form.Label>Danh sách dịch vụ:</Form.Label>
                      <Form.Control
                        plaintext
                        readOnly
                        disabled
                        type="text"
                        name="services"
                        defaultValue={servicesData
                          .filter((x) => bookingDetail.services.includes(x._id))
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
                    <Form.Group controlId="formBookingDetailAddress">
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
              {/* <Row className="mb-2">
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
                    <Form.Control readOnly value={selectedSlot.date} />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formSlot">
                    <Form.Label>Slot</Form.Label>
                    <Row>
                      <Col>
                        <Form.Control readOnly value={selectedSlot.slot} />
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
              </Row> */}
              <Row>
                <Col>
                  <Form.Group controlId="formCreateBookingType">
                    <Form.Label>Trạng thái:</Form.Label>
                    <Form.Control
                      as="select"
                      name="status"
                      disabled={!isEditBooking}
                      value={bookingDetail.status}
                      onChange={handleUpdateBookingChange}
                    >
                      <option>pending</option>
                      <option>accept</option>
                      <option>cancel</option>
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>
            </Modal.Body>
          </div>
          <Modal.Footer>
            <Form.Check
              style={{ flex: "1" }}
              type="switch"
              id="formBookingDetailSwitchEditBooking"
              label="Cập nhật lịch hẹn"
              checked={isEditBooking}
              onChange={() => {
                setIsEditBooking(!isEditBooking);
              }}
            />
            <Button variant="secondary" onClick={handleClose}>
              Đóng
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={!isEditBooking}
              onClick={handleUpdateBookingSubmit}
            >
              {isLoading ? <Spinner animation="border" /> : "Cập nhật"}
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
