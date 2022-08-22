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
import { Button, Col, Form, Modal, Row, Spinner, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

//Momentjs
import moment from "moment";

//CSS
import "./ConfirmCreateBooking.css";

const ConfirmCreateBooking = ({
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
        .then((res) => {
          if (res) {
            dispatch(
              setToast({
                show: true,
                title: "Tạo lịch hẹn",
                time: "just now",
                content: "Lịch hẹn được tạo thành công",
                color: {
                  header: "#dbf0dc",
                  body: "#41a446",
                },
              })
            );
            setShowConfirmCreateBooking(false);
            navigate("/order-detail/" + res._id);
          }
        });
    } catch (error) {
      if (error) {
        if (error.data) {
          dispatch(
            setToast({
              show: true,
              title: "Tạo lịch hẹn",
              time: "just now",
              content: error.data,
              color: {
                header: "#ffcccc",
                body: "#e60000",
              },
            })
          );
          setShowConfirmCreateBooking(false);
        } else {
          dispatch(
            setToast({
              show: true,
              title: "Tạo lịch hẹn",
              time: "just now",
              content: "Đã xảy ra lỗi. Xin thử lại sau",
              color: {
                header: "#ffcccc",
                body: "#e60000",
              },
            })
          );
          setShowConfirmCreateBooking(false);
        }
      }
    }
  };

  return (
    <>
      <Modal
        show={showConfirmCreateBooking}
        onHide={handleClose}
        dialogClassName="confirm-create-booking-container"
        centered
      >
        <Modal.Header>
          <Modal.Title>Xác nhận thông tin lịch hẹn</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
                  <Form.Label>Ngày hẹn:</Form.Label>
                  <p>{moment(booking.time).format("MM/DD/YYYY")}</p>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="formConfirmCreateBookingCustomerSlot">
                  <Form.Label>Giờ hẹn:</Form.Label>
                  <p>{moment(booking.time).format("HH:mm")}</p>
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
                  <p>{booking.type}</p>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="formConfirmCreateBookingAddress">
                  <Form.Label>Địa chỉ khách hàng:</Form.Label>
                  <p>{address}</p>
                </Form.Group>
              </Col>
            </Row>
            {booking.services.length !== 0 && (
              <Row>
                <Col className="table-container">
                  <Form.Label>Danh sách dịch vụ:</Form.Label>
                  <Table bordered size="sm">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Tên dịch vụ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {booking.services.map((service, index) => {
                        return (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{service}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </Col>
              </Row>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Quay lại
          </Button>
          <Button
            disabled={isLoading}
            type="submit"
            variant="primary"
            onClick={handleConfirmBookingSubmit}
            className="confirm-button"
          >
            {isLoading ? <Spinner animation="border" /> : "Xác nhận"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ConfirmCreateBooking;
