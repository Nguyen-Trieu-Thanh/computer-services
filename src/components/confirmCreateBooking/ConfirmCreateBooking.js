import React from "react";

//Redux
//Actions
import { setToast } from "../../redux/slices/toast/toastSlice";

//API Actions
import {
  useCreateBookingMutation,
  useCreateBookingManagerMutation,
} from "../../redux/slices/booking/bookingApiSlice";

//React-redux
import { useDispatch } from "react-redux";

//React-bootstrap
import { Button, Col, Form, Modal, Row, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

//Momentjs
import moment from "moment";

//CSS
import "./ConfirmCreateBooking.css";

const ConfirmCreateBooking = ({
  setShowCreateBooking,
  booking,
  setBooking,
  setIsRefetch,
  setShowConfirmCreateBooking,
  showConfirmCreateBooking,
  servicesData,
}) => {
  // const [createBooking, { isLoading }] = useCreateBookingMutation();
  const [createBooking, { isLoading }] = useCreateBookingManagerMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  // const handleConfirmBookingSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     await createBooking(booking)
  //       .unwrap()
  //       .then(async (res) => {
  //         if (res) {
  //           await dispatch(
  //             setToast({
  //               show: true,
  //               title: "Tạo lịch hẹn",
  //               time: "just now",
  //               content: "Lịch hẹn được tạo thành công!",
  //               color: {
  //                 header: "#dbf0dc",
  //                 body: "#41a446",
  //               },
  //             })
  //           );
  //           await setIsRefetch(true);
  //           await setShowConfirmCreateBooking(false);
  //           setBooking({
  //             ...booking,
  //             acc_id: "",
  //             cus_name: "",
  //             services: [],
  //             description: "",
  //             cus_address: {
  //               city: "Thành phố Hồ Chí Minh",
  //               district: "Quận 1",
  //               ward: "Phường Tân Định",
  //               street: "",
  //             },
  //             phonenum: "",
  //           });
  //         }
  //       });
  //   } catch (error) {}
  // };

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
            // await setIsRefetch(true);
            await setShowConfirmCreateBooking(false);
            // await setBooking({
            //   ...booking,
            //   acc_id: "",
            //   cus_name: "",
            //   services: [],
            //   description: "",
            //   cus_address: {
            //     city: "Thành phố Hồ Chí Minh",
            //     district: "Quận 1",
            //     ward: "Phường Tân Định",
            //     street: "",
            //   },
            //   phonenum: "",
            // });
            navigate("/order-detail", {
              state: {
                order_id: res._id,
                bookingDetail: booking,
              },
            });
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
            <Modal.Title>Xác nhận thông tin lịch hẹn</Modal.Title>
          </Modal.Header>
          <Modal.Body className="modal-body-container">
            <Form>
              <Row>
                <Col>
                  <Form.Group controlId="formConfirmCreateBookingPhoneNumber">
                    <Form.Label>Số điện thoại:</Form.Label>
                    {/* <Form.Control
                      plaintext
                      readOnly
                      disabled
                      type="text"
                      name="phonenum"
                      defaultValue={booking.phonenum}
                    /> */}
                    <p>{booking.phonenum}</p>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formConfirmCreateBookingCustomerName">
                    <Form.Label>Họ và tên khách hàng:</Form.Label>
                    {/* <Form.Control
                      plaintext
                      readOnly
                      disabled
                      type="text"
                      name="cus_name"
                      defaultValue={booking.cus_name}
                    /> */}
                    <p>{booking.cus_name}</p>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formConfirmCreateBookingCustomerTime">
                    <Form.Label>Ngày hẹn (MM/DD/YYYY):</Form.Label>
                    <p>{moment(booking.time).format("MM/DD/YYYY")}</p>
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
                  <Form.Group controlId="formConfirmCreateBookingServices">
                    <Form.Label>Danh sách dịch vụ:</Form.Label>
                    {/* <Form.Control
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
                    /> */}
                    <p>
                      {/* {servicesData
                        .filter((x) => booking.services.includes(x._id))
                        .map((service) => {
                          return service.name;
                        })
                        .join(", ")} */}
                      {booking.services.join(", ")}
                    </p>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formConfirmCreateBookingAddress">
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
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Quay lại
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
