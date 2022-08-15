import { FormControlLabel, FormGroup, Switch } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

//Redux
//Actions
import { setToast } from "../../redux/slices/toast/toastSlice";

//API Actions
import {
  useAcceptBookingMutation,
  useUpdateBookingMutation,
} from "../../redux/slices/booking/bookingApiSlice";

//React-bootstrap
import { Button, Modal, Form, Row, Col, Spinner } from "react-bootstrap";
import GeneralSchedule from "../generalSchedule/GeneralSchedule";

//Momentjs
import moment from "moment";

//CSS
import "./BookingDetail.css";
import { useDispatch } from "react-redux";

const BookingDetail = ({
  showBookingDetail,
  setShowBookingDetail,
  bookingDetail,
  setBookingDetail,
  refetch,
  servicesData,
  initBookingDetail,
}) => {
  const [updateBooking, { isLoading }] = useUpdateBookingMutation();
  const [acceptBooking, { isLoading: acceptBookingLoading }] =
    useAcceptBookingMutation();

  //Local state
  const [showGeneralSchedule, setShowGeneralSchedule] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState({
    date: "",
    slot: "",
  });
  const [isEditBooking, setIsEditBooking] = useState(false);

  //Utilities
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClose = () => {
    setShowBookingDetail(false);
  };

  const handleUpdateBookingChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setBookingDetail({ ...bookingDetail, [name]: value });
  };

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
    if (bookingDetail.status === "Đã tiếp nhận") {
      try {
        await acceptBooking(bookingDetail)
          .unwrap()
          .then((res) => {
            if (res) {
              dispatch(
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
              // await setIsRefetch(true);
              setShowBookingDetail(false);
              navigate("/order-detail", {
                state: {
                  order_id: res._id,
                  bookingDetail: bookingDetail,
                },
              });
            }
          });
      } catch (error) {}
    } else {
      try {
        await updateBooking(bookingDetail)
          .unwrap()
          .then((res) => {
            if (res) {
              dispatch(
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
              refetch();
              setShowBookingDetail(false);
            }
          });
      } catch (error) {}
    }
  };

  const isChange = () => {
    return JSON.stringify(initBookingDetail) !== JSON.stringify(bookingDetail);
  };

  const handleViewOrder = () => {
    navigate("/order-detail", {
      state: {
        order_id: bookingDetail.order_id._id,
        bookingDetail: bookingDetail,
      },
    });
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
            <Modal.Title>Chi tiết lịch hẹn mã: {bookingDetail._id}</Modal.Title>
          </Modal.Header>
          <div className="modal-body-container">
            <Modal.Body>
              <Form>
                <Row>
                  <Col>
                    <Form.Group controlId="formBookingDetailPhoneNumber">
                      <Form.Label>Số điện thoại:</Form.Label>
                      {/* <Form.Control
                        plaintext
                        readOnly
                        disabled
                        type="text"
                        name="phonenum"
                        defaultValue={bookingDetail.phonenum}
                      /> */}
                      <p>{bookingDetail.phonenum}</p>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="formBookingDetailCustomerName">
                      <Form.Label>Khách hàng:</Form.Label>
                      {/* <Form.Control
                        plaintext
                        readOnly
                        disabled
                        type="text"
                        name="cus_name"
                        defaultValue={bookingDetail.cus_name}
                      /> */}
                      <p>{bookingDetail.cus_name}</p>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="formBookingDetailTime">
                      <Form.Label>Ngày hẹn (MM/DD/YYYY):</Form.Label>
                      {/* <Form.Control
                        plaintext
                        readOnly
                        disabled
                        type="text"
                        name="time"
                        defaultValue={moment(bookingDetail.time).format(
                          "MM/DD/YYYY"
                        )}
                      /> */}
                      <p>{moment(bookingDetail.time).format("MM/DD/YYYY")}</p>
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
                      {/* <Form.Control
                        plaintext
                        readOnly
                        disabled
                        type="text"
                        name="type"
                        defaultValue={bookingDetail.type}
                      /> */}
                      <p>{bookingDetail.type}</p>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="formBookingDetailOrderStatus">
                      <Form.Label>Trạng thái đơn hàng:</Form.Label>
                      <p>
                        {bookingDetail.order_id
                          ? bookingDetail.order_id.status
                          : "Chưa có"}
                      </p>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group controlId="formBookingDetailAddress">
                      <Form.Label>Địa chỉ khách hàng:</Form.Label>
                      {/* <Form.Control
                        plaintext
                        readOnly
                        disabled
                        type="text"
                        name="address"
                        defaultValue={address}
                      /> */}
                      <p>{address}</p>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="formBookingDetailAddress">
                      <Form.Label>Danh sách dịch vụ:</Form.Label>
                      <p>
                        {/* {servicesData
                          .filter((x) => bookingDetail.services.includes(x._id))
                          .map((service) => {
                            return service.name;
                          })
                          .join(", ")} */}
                        {bookingDetail.services.join(", ")}
                      </p>
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
              <Row>
                <Col>
                  <Form.Group controlId="formCreateBookingType">
                    <Form.Label>Trạng thái:</Form.Label>
                    <Form.Control
                      as="select"
                      name="status"
                      // disabled={!isEditBooking}
                      disabled={
                        initBookingDetail.order_id ||
                        initBookingDetail.status === "Đã tiếp nhận" ||
                        initBookingDetail.status === "Hủy"
                      }
                      value={bookingDetail.status}
                      onChange={handleUpdateBookingChange}
                    >
                      <option value="Đã tiếp nhận">Đã tiếp nhận</option>
                      <option value="Đang xử lí">Đang xử lí</option>
                      <option value="Hủy">Hủy</option>
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>
            </Modal.Body>
          </div>
          <Modal.Footer>
            <Button
              variant="primary"
              disabled={!initBookingDetail.order_id}
              onClick={handleViewOrder}
            >
              Xem đơn hàng
            </Button>
            <Button variant="secondary" onClick={handleClose}>
              Đóng
            </Button>
            <Button
              disabled={
                !isChange() ||
                (initBookingDetail.order_id &&
                  initBookingDetail.status !== "Đã tiếp nhận")
              }
              type="submit"
              variant="primary"
              onClick={handleUpdateBookingSubmit}
            >
              {isLoading || acceptBookingLoading ? (
                <Spinner animation="border" />
              ) : (
                "Cập nhật"
              )}
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
