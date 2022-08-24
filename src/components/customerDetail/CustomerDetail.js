import React, { useEffect, useState } from "react";
import { useLocation, useParams, Navigate } from "react-router-dom";

//API Actions
import { useGetAccountDetailByIdQuery } from "../../redux/slices/account/accountApiSlice";
import { useGetServicesQuery } from "../../redux/slices/service/serviceApiSlice";
import { useGetBookingsWithOrderDetailByCusIdQuery } from "../../redux/slices/booking/bookingApiSlice";

//React-bootstrap
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  OverlayTrigger,
  Pagination,
  Row,
  Spinner,
  Table,
  Tooltip,
} from "react-bootstrap";

//momentjs
import moment from "moment";

//Icons
import { faPenToSquare, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//Components
import BookingDetail from "../bookingDetail/BookingDetail";

//Images
import defaultUserAvatar from "../../images/default-user-avatar.jpg";

//CSS
import "./CustomerDetail.css";
import CustomPagination from "../customPagination/CustomPagination";
import { Avatar } from "@mui/material";

const CustomerDetail = () => {
  const location = useLocation();

  const { account_id } = useParams();

  const {
    data: customerDetailData,
    refetch,
    isFetching,
    error,
  } = useGetAccountDetailByIdQuery(account_id);

  const {
    data: servicesData = [],
    refetch: servicesRefetch,
    isFetching: isServiceFetching,
  } = useGetServicesQuery();

  //Local state
  const [bookings, setBookings] = useState([]);
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
  const [showBookingDetail, setShowBookingDetail] = useState(false);
  const [filterBooking, setFilterBooking] = useState({
    status: "",
    sort: "desc",
    page: 1,
  });
  const [imgLoading, setImgLoading] = useState(true);

  const {
    data: bookingsData = {
      count: 1,
      bookings: [],
    },
    refetch: getBookingRefectch,
    isFetching: isGetBookingFetching,
  } = useGetBookingsWithOrderDetailByCusIdQuery({
    cusId: account_id,
    filterBooking,
  });

  const handleFilterBookingChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setFilterBooking({ ...filterBooking, [name]: value, page: 1 });
  };

  const checkBookingStatus = (status) => {
    if (status === "Đã tiếp nhận") {
      return "accept";
    }

    if (status === "Đang xử lí") {
      return "pending";
    }

    if (status === "Hủy") {
      return "cancel";
    }

    return "";
  };

  const checkOrderStatus = (status) => {
    if (status === "Chưa có") {
      return "not-available";
    }

    if (status === "Đang chờ") {
      return "pending";
    }

    if (status === "Đang xử lí") {
      return "pending";
    }

    if (status === "Chờ xác nhận") {
      return "processing";
    }

    if (status === "Quản lí xác nhận") {
      return "processing";
    }

    if (status === "Hoàn tất hóa đơn") {
      return "processing";
    }

    if (status === "Hoàn thành") {
      return "accept";
    }

    if (status === "Hủy") {
      return "cancel";
    }

    return "";
  };

  useEffect(() => {
    if (!isGetBookingFetching) {
      setBookings([...bookingsData.bookings]);
    }
  }, [isGetBookingFetching]);

  if (error) {
    return <Navigate to="/error" state={{ from: location }} replace />;
  }

  return (
    <>
      <Container fluid className="customer-detail-container">
        <Card body className="customer-info-container">
          <Row>
            <Col>
              <Card.Title>Thông tin khách hàng</Card.Title>
            </Col>
          </Row>
          {isFetching ? (
            <div className="loading">
              <Spinner animation="border" />
              <div className="loading-text">Đang tải dữ liệu...</div>
            </div>
          ) : (
            <Row>
              <Col>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Tài khoản:</Form.Label>
                      <Form.Control
                        readOnly
                        defaultValue={customerDetailData.username}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label>Họ và tên:</Form.Label>
                      <Form.Control
                        readOnly
                        defaultValue={customerDetailData.user_id?.name}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label>Thời gian tạo:</Form.Label>
                      <Form.Control
                        readOnly
                        defaultValue={moment(
                          customerDetailData.createdAt
                        ).format("HH:mm MM/DD/YYYY")}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Email:</Form.Label>
                      <Form.Control
                        readOnly
                        defaultValue={customerDetailData.user_id?.email}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label>Số điện thoại:</Form.Label>
                      <Form.Control
                        readOnly
                        defaultValue={customerDetailData.user_id?.phonenum}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label>Ngày sinh:</Form.Label>
                      <Form.Control
                        readOnly
                        defaultValue={moment(
                          customerDetailData.user_id?.birth
                        ).format("MM/DD/YYYY")}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Col>
              <Col xs={3}>
                <Row>
                  <Col>
                    <Form.Label>Ảnh đại diện:</Form.Label>
                  </Col>
                </Row>
                <Row>
                  <Col className="d-flex justify-content-center align-items-center">
                    <Avatar
                      src={
                        !customerDetailData.user_id?.img || imgLoading
                          ? defaultUserAvatar
                          : `https://computer-services-api.herokuapp.com/account/avatar/${customerDetailData.user_id.img}`
                      }
                      onLoad={() => setImgLoading(false)}
                      sx={{
                        width: "120px",
                        height: "120px",
                        border: "1px solid #000000",
                      }}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          )}
        </Card>

        <Card className="customer-bookings-container">
          <Card.Body>
            <Row>
              <Col>
                <Card.Title>Lịch sử lịch hẹn</Card.Title>
              </Col>
            </Row>
            <Row>
              <Col>
                <InputGroup>
                  <InputGroup.Prepend>
                    <InputGroup.Text>Trạng thái lịch hẹn:</InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control
                    as="select"
                    name="status"
                    value={filterBooking.status}
                    onChange={handleFilterBookingChange}
                  >
                    <option value="">Toàn bộ</option>
                    <option value="Đã tiếp nhận">Đã tiếp nhận</option>
                    <option value="Đang xử lí">Đang xử lí</option>
                    <option value="Hủy">Hủy</option>
                  </Form.Control>
                </InputGroup>
              </Col>
              <Col>
                <InputGroup>
                  <InputGroup.Prepend>
                    <InputGroup.Text>Thứ tự:</InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control
                    as="select"
                    name="sort"
                    value={filterBooking.sort}
                    onChange={handleFilterBookingChange}
                  >
                    <option value="asc">Cũ đến mới</option>
                    <option value="desc">Mới đến cũ</option>
                  </Form.Control>
                </InputGroup>
              </Col>
            </Row>
            <Row className="mt-2">
              <Col className="table-container">
                {isGetBookingFetching ? (
                  <div className="loading">
                    <Spinner animation="border" />
                    <div className="loading-text">Đang tải dữ liệu...</div>
                  </div>
                ) : (
                  <Table bordered hover size="sm">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Loại lịch hẹn</th>
                        <th>Thời gian hẹn</th>
                        <th>Cập nhật lúc</th>
                        <th>Trạng thái lịch hẹn</th>
                        <th>Trạng thái đơn hàng</th>
                        <th>Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking, index) => {
                        return (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{booking.type}</td>
                            <td>
                              {moment(booking.time).format("HH:mm MM/DD/YYYY")}
                            </td>
                            <td>
                              {moment(booking.updatedAt).format(
                                "HH:mm MM/DD/YYYY"
                              )}
                            </td>
                            <td className={checkBookingStatus(booking.status)}>
                              {booking.status}
                            </td>
                            <td
                              className={checkOrderStatus(
                                booking.order_id
                                  ? booking.order_id.status
                                  : "Chưa có"
                              )}
                            >
                              {booking.order_id
                                ? booking.order_id.status
                                : "Chưa có"}
                            </td>
                            <td>
                              <div className="action-button-container">
                                <OverlayTrigger
                                  placement="bottom"
                                  delay={{ show: 200, hide: 100 }}
                                  overlay={
                                    <Tooltip
                                      className="booking-edit-button"
                                      id="edit-button-tooltip"
                                    >
                                      Xem chi tiết
                                    </Tooltip>
                                  }
                                >
                                  <Button
                                    variant="primary"
                                    onClick={() => {
                                      setShowBookingDetail(true);
                                      setBookingDetail({
                                        _id: booking._id,
                                        cus_name: booking.cus_name,
                                        services: booking.services,
                                        description: booking.description,
                                        type: booking.type,
                                        cus_address: booking.cus_address,
                                        time: booking.time,
                                        status: booking.status,
                                        phonenum: booking.phonenum,
                                        order_id: booking.order_id,
                                      });
                                      setInitBookingDetail({
                                        _id: booking._id,
                                        cus_name: booking.cus_name,
                                        services: booking.services,
                                        description: booking.description,
                                        type: booking.type,
                                        cus_address: booking.cus_address,
                                        time: booking.time,
                                        status: booking.status,
                                        phonenum: booking.phonenum,
                                        order_id: booking.order_id,
                                      });
                                    }}
                                  >
                                    <FontAwesomeIcon
                                      icon={faPenToSquare}
                                      color="#ffffff"
                                    />
                                  </Button>
                                </OverlayTrigger>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                )}
              </Col>
            </Row>
            <Row className="mt-2">
              <Col>
                <CustomPagination
                  count={bookingsData.count}
                  handlePaginationClick={(number) => {
                    setFilterBooking({ ...filterBooking, page: number });
                  }}
                  page={filterBooking.page}
                />
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
      <BookingDetail
        showBookingDetail={showBookingDetail}
        setShowBookingDetail={setShowBookingDetail}
        bookingDetail={bookingDetail}
        setBookingDetail={setBookingDetail}
        refetch={refetch}
        servicesData={servicesData}
        initBookingDetail={initBookingDetail}
      />
    </>
  );
};

export default CustomerDetail;
