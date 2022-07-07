import React, { useState } from "react";
import { useEffect } from "react";
import moment from "moment";

//Redux
//Actions
import { getBookings } from "../../redux/slices/bookingSlice";

//React-redux
import { useDispatch, useSelector } from "react-redux";

//React-bootstrap
import {
  Button,
  OverlayTrigger,
  Pagination,
  Table,
  Tooltip,
  Spinner,
} from "react-bootstrap";

//CSS
import "./ManageBooking.css";

//Data
import BookingData from "../../datas/BookingData";

//Components
import BookingDetail from "../bookingDetail/BookingDetail";
import CreateBooking from "../createBooking/CreateBooking";
import ConfirmCreateBooking from "../confirmCreateBooking/ConfirmCreateBooking";

//Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faPlus,
  faTrash,
  faCheck,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { getRefreshAccessToken } from "../../redux/slices/authSlice";

const ManageBooking = () => {
  const dispatch = useDispatch();

  //Global state
  const bookings = useSelector((state) => state.booking.data);
  const loading = useSelector((state) => state.minorState.loading);
  const createBookingLoading = useSelector(
    (state) => state.minorState.createBookingLoading
  );

  //Local state
  const [active, setActive] = useState(1);
  const [booking, setBooking] = useState({
    cus_name: "",
    services: [],
    description: "",
    type: "Door-to-Door",
    cus_address: {
      city: "",
      district: "",
      ward: "",
      street: "",
    },
    time: moment().format(),
    status: "accept",
    phonenum: "",
  });
  // const [bookings, setBookings] = useState(BookingData.slice(0, 10));
  const [showCreateBooking, setShowCreateBooking] = useState(false);
  const [showBookingDetail, setShowBookingDetail] = useState(false);
  const [bookingDetail, setBookingDetail] = useState({
    id: "",
    code: 0,
    customerName: "",
    phoneNumber: "",
  });

  //Pagination
  let items = [];
  for (let number = 1; number <= Math.ceil(BookingData.length / 10); number++) {
    items.push(
      <Pagination.Item
        onClick={() => {
          handlePaginationClick(number);
        }}
        key={number}
        active={number === active}
        activeLabel=""
      >
        {number}
      </Pagination.Item>
    );
  }

  const handlePaginationClick = (number) => {
    setActive(number);
    // setBookings(BookingData.slice(10 * (number - 1), 10 * number));
  };

  useEffect(() => {
    if (!createBookingLoading) {
      dispatch(getBookings());
    }
  }, [createBookingLoading]);

  if (loading) {
    return (
      <>
        <div className="loading mt-3">
          <Spinner animation="border" />
          <div className="loading-text">Đang tải dữ liệu...</div>
        </div>
      </>
    );
  }

  const handleRefreshAccessToken = () => {
    dispatch(getRefreshAccessToken());
  };

  return (
    <>
      <div className="manage-booking-container">
        <div className="button-container">
          <Button
            variant="primary"
            onClick={() => {
              setShowCreateBooking(true);
            }}
          >
            TẠO LỊCH HẸN <FontAwesomeIcon icon={faPlus} color="" />
          </Button>
          <Button variant="primary" onClick={handleRefreshAccessToken}>
            TEST <FontAwesomeIcon icon={faPlus} color="" />
          </Button>
        </div>
        <div className="table-container">
          <Table bordered hover size="sm">
            <thead>
              <tr>
                <th>#</th>
                <th>TÊN KHÁCH HÀNG</th>
                <th>SỐ ĐIỆN THOẠI</th>
                <th>LOẠI LỊCH HẸN</th>
                <th>TRẠNG THÁI</th>
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
                    <td>{booking.status}</td>
                    <td>
                      <div className="action-button-container">
                        <OverlayTrigger
                          placement="bottom"
                          delay={{ show: 200, hide: 100 }}
                          overlay={
                            <Tooltip
                              className="booking-approve-button"
                              id="edit-button-tooltip"
                            >
                              APPROVE
                            </Tooltip>
                          }
                        >
                          <Button
                            variant="success"
                            onClick={() => {
                              setShowBookingDetail(true);
                              setBookingDetail({
                                id: booking.id,
                                code: booking.code,
                                customerName: booking.customerName,
                                phoneNumber: booking.phoneNumber,
                              });
                            }}
                          >
                            <FontAwesomeIcon icon={faCheck} color="#ffffff" />
                          </Button>
                        </OverlayTrigger>
                        <OverlayTrigger
                          placement="bottom"
                          delay={{ show: 200, hide: 100 }}
                          overlay={
                            <Tooltip
                              className="booking-delete-button"
                              id="edit-button-tooltip"
                            >
                              DELETE
                            </Tooltip>
                          }
                        >
                          <Button variant="danger">
                            <FontAwesomeIcon icon={faXmark} color="#ffffff" />
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
        <div>
          <Pagination className="pagination-container">{items}</Pagination>
        </div>
      </div>
      <CreateBooking
        showCreateBooking={showCreateBooking}
        setShowCreateBooking={setShowCreateBooking}
        booking={booking}
        setBooking={setBooking}
      />
      <ConfirmCreateBooking
        setShowCreateBooking={setShowCreateBooking}
        booking={booking}
      />
      <BookingDetail
        showBookingDetail={showBookingDetail}
        setShowBookingDetail={setShowBookingDetail}
        bookingDetail={bookingDetail}
      />
    </>
  );
};

export default ManageBooking;
