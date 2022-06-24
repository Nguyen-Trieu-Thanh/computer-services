import React, { useState } from "react";

//React-bootstrap
import {
  Button,
  OverlayTrigger,
  Pagination,
  Table,
  Tooltip,
} from "react-bootstrap";

//CSS
import "./ManageBooking.css";

//Data
import BookingData from "../../datas/BookingData";

//Components
import BookingDetail from "../bookingDetail/BookingDetail";

//Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faPlus,
  faTrash,
  faCheck,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

const ManageBooking = () => {
  //Local state
  const [active, setActive] = useState(1);
  const [bookings, setBookings] = useState(BookingData.slice(0, 10));
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
    setBookings(BookingData.slice(10 * (number - 1), 10 * number));
  };

  return (
    <>
      <div className="manage-booking-container">
        <div className="button-container">
          <Button>
            ADD <FontAwesomeIcon icon={faPlus} color="" />
          </Button>
        </div>
        <div className="table-container">
          <Table bordered hover size="sm">
            <thead>
              <tr>
                <th>#</th>
                <th>MÃ LỊCH HẸN</th>
                <th>TÊN KHÁCH HÀNG</th>
                <th>SỐ ĐIỆN THOẠI</th>
                <th style={{ width: "200px" }}>HÀNH ĐỘNG</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{booking.code}</td>
                    <td>{booking.customerName}</td>
                    <td>{booking.phoneNumber}</td>
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
      <BookingDetail
        showBookingDetail={showBookingDetail}
        setShowBookingDetail={setShowBookingDetail}
        bookingDetail={bookingDetail}
      />
    </>
  );
};

export default ManageBooking;
