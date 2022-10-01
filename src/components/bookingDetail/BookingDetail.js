import { FormControlLabel, FormGroup, Switch } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

//Redux
//Actions
import { setToast } from "../../redux/slices/toast/toastSlice";
import { selectCurrentRole } from "../../redux/slices/auth/authSlice";

//API Actions
import {
  useAcceptBookingMutation,
  useGetBookingWithOrderByIdMutation,
  useUpdateBookingMutation,
} from "../../redux/slices/booking/bookingApiSlice";

//React-bootstrap
import { Button, Modal, Form, Row, Col, Spinner, Table } from "react-bootstrap";
import GeneralSchedule from "../generalSchedule/GeneralSchedule";

//Momentjs
import moment from "moment";

//CSS
import "./BookingDetail.css";
import { useEffect } from "react";

const BookingDetail = ({
  showBookingDetail,
  setShowBookingDetail,
  refetch,
  servicesData,
  bookingId,
}) => {
  const [updateBooking, { isLoading }] = useUpdateBookingMutation();
  const [acceptBooking, { isLoading: acceptBookingLoading }] =
    useAcceptBookingMutation();

  const [
    getBookingWithOrderById,
    { isLoading: isGetBookingWithOrderByIdLoading },
  ] = useGetBookingWithOrderByIdMutation();

  //Global state
  const isAdmin = useSelector(selectCurrentRole) === "admin";

  //Local state
  const [showGeneralSchedule, setShowGeneralSchedule] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState({
    date: "",
    slot: "",
  });
  const [isEditBooking, setIsEditBooking] = useState(false);
  const [showConfirmClose, setShowConfirmClose] = useState(false);
  const [bookingDetail, setBookingDetail] = useState({
    _id: "",
    cus_name: "",
    services: [],
    description: "",
    type: "Sửa tại nhà",
    cus_address: {
      city: "",
      district: "",
      ward: "",
      street: "",
    },
    time: "",
    status: "",
    phonenum: "",
    order_id: "",
  });
  const [initBookingDetail, setInitBookingDetail] = useState({
    _id: "",
    cus_name: "",
    services: [],
    description: "",
    type: "Sửa tại nhà",
    cus_address: {
      city: "",
      district: "",
      ward: "",
      street: "",
    },
    time: "",
    status: "",
    phonenum: "",
    order_id: "",
  });
  //Utilities
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClose = () => {
    setShowConfirmClose(false);
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

  const handleGetBookingWithOrderById = async () => {
    try {
      await getBookingWithOrderById(bookingId)
        .unwrap()
        .then((res) => {
          if (res) {
            setBookingDetail({
              _id: res._id,
              cus_name: res.cus_name,
              services: res.services,
              description: res.description,
              type: res.type,
              cus_address: res.cus_address,
              time: res.time,
              status: res.status,
              phonenum: res.phonenum,
              order_id: res.order_id,
            });
            setInitBookingDetail({
              _id: res._id,
              cus_name: res.cus_name,
              services: res.services,
              description: res.description,
              type: res.type,
              cus_address: res.cus_address,
              time: res.time,
              status: res.status,
              phonenum: res.phonenum,
              order_id: res.order_id,
            });
          }
        });
    } catch (error) {
      if (error) {
        if (error.data) {
          dispatch(
            setToast({
              show: true,
              title: "Cập nhật lịch hẹn",
              time: "just now",
              content: error.data,
              color: {
                header: "#ffcccc",
                body: "#e60000",
              },
            })
          );
          refetch();
          setShowBookingDetail(false);
        }
      } else {
        dispatch(
          setToast({
            show: true,
            title: "Cập nhật lịch hẹn",
            time: "just now",
            content: "Đã xảy ra lỗi. Xin thử lại sau",
            color: {
              header: "#ffcccc",
              body: "#e60000",
            },
          })
        );
        setShowBookingDetail(false);
      }
    }
  };

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
                  content: "Lịch hẹn được cập nhật thành công",
                  color: {
                    header: "#dbf0dc",
                    body: "#41a446",
                  },
                })
              );
              setShowBookingDetail(false);
              navigate("/order-detail/" + res._id);
            }
          });
      } catch (error) {
        if (error) {
          if (error.data) {
            dispatch(
              setToast({
                show: true,
                title: "Cập nhật lịch hẹn",
                time: "just now",
                content: error.data,
                color: {
                  header: "#ffcccc",
                  body: "#e60000",
                },
              })
            );
            refetch();
            setShowBookingDetail(false);
          }
        } else {
          dispatch(
            setToast({
              show: true,
              title: "Cập nhật lịch hẹn",
              time: "just now",
              content: "Đã xảy ra lỗi. Xin thử lại sau",
              color: {
                header: "#ffcccc",
                body: "#e60000",
              },
            })
          );
          setShowBookingDetail(false);
        }
      }
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
                  content: "Lịch hẹn được cập nhật thành công",
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
      } catch (error) {
        if (error) {
          if (error.data) {
            dispatch(
              setToast({
                show: true,
                title: "Cập nhật lịch hẹn",
                time: "just now",
                content: error.data,
                color: {
                  header: "#ffcccc",
                  body: "#e60000",
                },
              })
            );
            refetch();
            setShowBookingDetail(false);
          } else {
            dispatch(
              setToast({
                show: true,
                title: "Cập nhật lịch hẹn",
                time: "just now",
                content: "Đã xảy ra lỗi. Xin thử lại sau",
                color: {
                  header: "#ffcccc",
                  body: "#e60000",
                },
              })
            );
            setShowBookingDetail(false);
          }
        }
      }
    }
  };

  const isChange = () => {
    return JSON.stringify(initBookingDetail) !== JSON.stringify(bookingDetail);
  };

  const handleViewOrder = () => {
    window.open("/order-detail/" + bookingDetail.order_id._id);
  };

  useEffect(() => {
    if (bookingId) {
      handleGetBookingWithOrderById();
    }
  }, [showBookingDetail]);

  return (
    <>
      <Modal
        show={showBookingDetail}
        onHide={() => {
          setShowConfirmClose(true);
        }}
        dialogClassName="booking-detail"
        centered
      >
        <Modal.Header>
          {/* <Modal.Title>Chi tiết lịch hẹn mã: {bookingDetail._id}</Modal.Title> */}
          <Modal.Title>
            Chi tiết lịch hẹn của khách hàng:{" "}
            {!isGetBookingWithOrderByIdLoading && bookingDetail.cus_name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isGetBookingWithOrderByIdLoading ? (
            <div className="loading">
              <Spinner animation="border" />
              <div className="loading-text">Đang tải dữ liệu...</div>
            </div>
          ) : (
            <>
              <Form>
                <Row>
                  <Col>
                    <Form.Group controlId="formBookingDetailPhoneNumber">
                      <Form.Label>Số điện thoại:</Form.Label>
                      <p>{bookingDetail.phonenum}</p>
                    </Form.Group>
                  </Col>
                  {/* <Col>
                <Form.Group controlId="formBookingDetailCustomerName">
                  <Form.Label>Khách hàng:</Form.Label>
                  <p>{bookingDetail.cus_name}</p>
                </Form.Group>
              </Col> */}
                  <Col>
                    <Form.Group controlId="formBookingDetailDate">
                      <Form.Label>Ngày hẹn:</Form.Label>
                      <p>{moment(bookingDetail.time).format("MM/DD/YYYY")}</p>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="formBookingDetailTime">
                      <Form.Label>Giờ hẹn:</Form.Label>
                      <p>{moment(bookingDetail.time).format("HH:mm")}</p>
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
                      <p>{bookingDetail.type}</p>
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group controlId="formBookingDetailAddress">
                      <Form.Label>Địa chỉ khách hàng:</Form.Label>
                      <p>{address}</p>
                    </Form.Group>
                  </Col>
                </Row>
                {bookingDetail.services.length !== 0 && (
                  <Row>
                    <Col className="table-container">
                      <Form.Label>Danh sách dịch vụ khách hàng đặt:</Form.Label>
                      {/* <p>{bookingDetail.services.join(", ")}</p> */}
                      <Table bordered size="sm">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Tên dịch vụ</th>
                            <th>Trạng thái</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bookingDetail.services.map((service, index) => {
                            return (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{service.name}</td>
                                {service.deleted ? (
                                  <td
                                    style={{ color: "red", fontWeight: "600" }}
                                  >
                                    Ngưng hoạt động
                                  </td>
                                ) : (
                                  <td
                                    style={{
                                      color: "green",
                                      fontWeight: "600",
                                    }}
                                  >
                                    Hoạt động
                                  </td>
                                )}
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                    </Col>
                  </Row>
                )}
              </Form>
              <Row>
                <Col>
                  <Form.Group controlId="formCreateBookingType">
                    <Form.Label>Trạng thái:</Form.Label>
                    <Form.Control
                      as="select"
                      name="status"
                      disabled={
                        isAdmin ||
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
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{ width: "135px" }}
            variant="info"
            disabled={!initBookingDetail.order_id}
            onClick={handleViewOrder}
          >
            Xem đơn hàng
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setShowConfirmClose(true);
            }}
          >
            Đóng
          </Button>
          {!isAdmin && (
            <Button
              disabled={
                !isChange() ||
                (initBookingDetail.order_id &&
                  initBookingDetail.status !== "Đã tiếp nhận") ||
                isLoading ||
                acceptBookingLoading
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
          )}
        </Modal.Footer>
      </Modal>
      <GeneralSchedule
        showGeneralSchedule={showGeneralSchedule}
        setShowGeneralSchedule={setShowGeneralSchedule}
        selectedSlot={selectedSlot}
        setSelectedSlot={setSelectedSlot}
      />
      <Modal
        show={showConfirmClose}
        onHide={() => {
          setShowConfirmClose(false);
        }}
        centered
      >
        <Modal.Header>
          <Modal.Title>Xác nhận đóng</Modal.Title>
        </Modal.Header>
        <Modal.Body>Dữ liệu bạn nhập sẽ không được lưu</Modal.Body>
        <Modal.Footer>
          <Button
            style={{ width: "100px" }}
            variant="danger"
            onClick={() => {
              setShowConfirmClose(false);
            }}
          >
            Hủy
          </Button>
          <Button
            style={{ width: "100px" }}
            variant="primary"
            onClick={handleClose}
          >
            Xác nhận
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default BookingDetail;
