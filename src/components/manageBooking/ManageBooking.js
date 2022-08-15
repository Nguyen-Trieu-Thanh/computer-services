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
  Form,
  InputGroup,
  OverlayTrigger,
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
import { faPenToSquare, faPlus } from "@fortawesome/free-solid-svg-icons";
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
  });

  //Utilities
  const navigate = useNavigate();

  const {
    data: bookingsData = {
      count: 1,
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
    if (!isFetching) {
      setBookings([...bookingsData.bookings]);
    }
  }, [isFetching]);

  return (
    <>
      <div className="manage-booking-container">
        <div className="button-container">
          <Button
            variant="primary"
            onClick={() => {
              navigate("/create-booking");
            }}
          >
            Tạo lịch hẹn <FontAwesomeIcon icon={faPlus} color="" />
          </Button>
        </div>
        <div className="filter-container">
          <InputGroup className="mr-3">
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
        </div>
        {isFetching ? (
          <div className="loading">
            <Spinner animation="border" />
            <div className="loading-text">Đang tải dữ liệu...</div>
          </div>
        ) : (
          <div className="table-container">
            <Table bordered hover size="sm">
              <thead>
                <tr>
                  <th>#</th>
                  <th>TÊN KHÁCH HÀNG</th>
                  <th>SỐ ĐIỆN THOẠI</th>
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
                      <td>{booking.cus_name}</td>
                      <td>{booking.phonenum}</td>
                      <td>{booking.type}</td>
                      <td>{moment(booking.time).format("MM/DD/YYYY")}</td>
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
                      <td>
                        {booking.order_id ? booking.order_id.status : "Chưa có"}
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
          </div>
        )}
        <div>
          <CustomPagination
            count={bookingsData.count}
            handlePaginationClick={(number) => {
              setFilterBooking({ ...filterBooking, page: number });
            }}
            page={filterBooking.page}
          />
        </div>
      </div>
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
