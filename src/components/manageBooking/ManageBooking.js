import React, { useEffect, useState } from "react";

//Redux
//Actions

//API Actions
import { useGetBookingsWithOrderDetailQuery } from "../../redux/slices/booking/bookingApiSlice";
import { useGetServicesQuery } from "../../redux/slices/service/serviceApiSlice";

//React-redux

//React-bootstrap
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  OverlayTrigger,
  Row,
  Spinner,
  Table,
  Tooltip,
} from "react-bootstrap";

//React-router-dom
import { useNavigate } from "react-router-dom";

//Components
import BookingDetail from "../bookingDetail/BookingDetail";
import CustomPagination from "../customPagination/CustomPagination";

//Icons
import {
  faPenToSquare,
  faPlus,
  faArrowRotateRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//Momentjs
import moment from "moment";

//CSS
import "./ManageBooking.css";

const ManageBooking = () => {
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
    cus_name: "",
  });
  const [search, setSearch] = useState("");

  //Utilities
  const navigate = useNavigate();

  const {
    data: bookingsData = {
      count: 0,
      bookings: [],
    },
    refetch,
    isFetching,
  } = useGetBookingsWithOrderDetailQuery(filterBooking);

  const {
    data: servicesData = [],
    refetch: servicesRefetch,
    isFetching: isServiceFetching,
  } = useGetServicesQuery();

  const handleFilterBookingChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setFilterBooking({ ...filterBooking, [name]: value, page: 1 });
  };

  const handleSearch = () => {
    setFilterBooking({ ...filterBooking, cus_name: search, page: 1 });
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
    if (!isFetching) {
      setBookings([...bookingsData.bookings]);
    }
  }, [isFetching]);

  return (
    <>
      <Container fluid className="manage-booking-container">
        <Card className="content-container">
          <Card.Body>
            <Row>
              <Col>
                <Card.Title>Danh sách lịch hẹn</Card.Title>
              </Col>
            </Row>
            <Row className="d-flex align-items-end justify-content-between">
              <Col xs={6}>
                <Form.Label>Tìm kiếm theo tên:</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    name="search"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                    }}
                  />
                  <InputGroup.Append>
                    <Button
                      disabled={isFetching}
                      variant="primary"
                      onClick={handleSearch}
                      className="search-button"
                    >
                      Tìm kiếm
                    </Button>
                  </InputGroup.Append>
                </InputGroup>
              </Col>
              <Col>
                <Form.Label>Trạng thái lịch hẹn:</Form.Label>
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
              </Col>
              <Col>
                <Form.Label>Thứ tự:</Form.Label>
                <Form.Control
                  as="select"
                  name="sort"
                  value={filterBooking.sort}
                  onChange={handleFilterBookingChange}
                >
                  <option value="asc">Cũ đến mới</option>
                  <option value="desc">Mới đến cũ</option>
                </Form.Control>
              </Col>
              <Col xs={2}>
                <Button
                  style={{ width: "100%" }}
                  disabled={isFetching}
                  variant="dark"
                  onClick={() => {
                    refetch();
                  }}
                >
                  Tải lại dữ liệu{" "}
                  <FontAwesomeIcon icon={faArrowRotateRight} color="" />
                </Button>
              </Col>
            </Row>
            <Row className="d-flex justify-content-end mt-2">
              <Col xs={2}>
                <Button
                  style={{ width: "100%" }}
                  variant="primary"
                  onClick={() => {
                    navigate("/create-booking");
                  }}
                >
                  Tạo lịch hẹn <FontAwesomeIcon icon={faPlus} color="" />
                </Button>
              </Col>
            </Row>
            <Row className="mt-2">
              <Col className="table-container">
                {isFetching ? (
                  <div className="loading">
                    <Spinner animation="border" />
                    <div className="loading-text">Đang tải dữ liệu...</div>
                  </div>
                ) : (
                  <Table bordered hover size="sm">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Tên khách hàng</th>
                        <th>Số điện thoại</th>
                        {/* <th>Loại lịch hẹn</th> */}
                        <th>Thời gian hẹn</th>
                        <th>Trạng thái lịch hẹn</th>
                        <th>Trạng thái đơn hàng</th>
                        <th>Thời gian tạo</th>
                        <th>Cập nhật lúc</th>
                        <th>Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking, index) => {
                        return (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{booking.cus_name}</td>
                            <td>{booking.phonenum}</td>
                            {/* <td>{booking.type}</td> */}
                            <td>
                              {moment(booking.time).format("HH:mm MM/DD/YYYY")}
                            </td>

                            <td className={checkBookingStatus(booking.status)}>
                              {booking.status}
                            </td>
                            {/* {booking.status === "pending" ? (
                        <td>Đang chờ</td>
                      ) : booking.status === "accept" ? (
                        <td>Chấp nhận</td>
                      ) : (
                        <td>Từ chối</td>
                      )} */}
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
                              {moment(booking.createdAt).format(
                                "HH:mm MM/DD/YYYY"
                              )}
                            </td>
                            <td>
                              {moment(booking.updatedAt).format(
                                "HH:mm MM/DD/YYYY"
                              )}
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

export default ManageBooking;
