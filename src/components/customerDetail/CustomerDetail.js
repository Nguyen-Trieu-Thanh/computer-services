import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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

//CSS
import "./CustomerDetail.css";
import CustomPagination from "../customPagination/CustomPagination";

const CustomerDetail = () => {
  const { account_id } = useParams();

  const {
    data: customerDetailData,
    refetch,
    isFetching,
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

  useEffect(() => {
    if (!isGetBookingFetching) {
      setBookings([...bookingsData.bookings]);
    }
  }, [isGetBookingFetching]);

  return (
    <>
      <Container fluid className="customer-detail-container">
        <Row>
          <Col>
            <h4>Thông tin chi tiết khách hàng {account_id}</h4>
          </Col>
        </Row>

        <Card body className="customer-info-container">
          <Row>
            <Col>
              <Card.Title>Thông tin của khách hàng</Card.Title>
            </Col>
          </Row>
          {isFetching ? (
            <Row className="loading">
              <Col className="loading-text">Đang tải dữ liệu...</Col>
            </Row>
          ) : (
            <Row>
              <Col>
                <InputGroup>
                  <InputGroup.Prepend>
                    <InputGroup.Text>Họ và tên:</InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control
                    readOnly
                    defaultValue={customerDetailData.user_id?.name}
                  />
                </InputGroup>
              </Col>
              <Col>
                <InputGroup>
                  <InputGroup.Prepend>
                    <InputGroup.Text>Số điện thoại:</InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control
                    readOnly
                    defaultValue={customerDetailData.user_id?.phonenum}
                  />
                </InputGroup>
              </Col>
              <Col>
                <InputGroup>
                  <InputGroup.Prepend>
                    <InputGroup.Text>Vai trò:</InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control
                    readOnly
                    defaultValue={customerDetailData.role}
                  />
                </InputGroup>
              </Col>
            </Row>
          )}
        </Card>

        <Card body className="customer-bookings-container mt-2">
          <Row>
            <Col>
              <Card.Title>Lịch sử lịch hẹn</Card.Title>
            </Col>
          </Row>
          <Row>
            <Col>
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text>Trạng thái:</InputGroup.Text>
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
                      <th>LOẠI LỊCH HẸN</th>
                      <th>NGÀY HẸN (MM/DD/YYYY)</th>
                      <th>TRẠNG THÁI LỊCH HẸN</th>
                      <th>TRẠNG THÁI ĐƠN HÀNG</th>
                      <th style={{ width: "200px" }}>HÀNH ĐỘNG</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking, index) => {
                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{booking.type}</td>
                          <td>{moment(booking.time).format("MM/DD/YYYY")}</td>
                          <td className={checkBookingStatus(booking.status)}>
                            {booking.status}
                          </td>
                          <td>
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
                                    XEM CHI TIẾT
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
          <CustomPagination
            count={bookingsData.count}
            handlePaginationClick={(number) => {
              setFilterBooking({ ...filterBooking, page: number });
            }}
            page={filterBooking.page}
          />
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
