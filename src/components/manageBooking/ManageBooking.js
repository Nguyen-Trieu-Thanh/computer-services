import React, { useState } from "react";

//React-bootstrap
import { Button, Pagination, Table } from "react-bootstrap";

//CSS
import "./ManageBooking.css";

//Data
import BookingData from "../../datas/BookingData";
import BookingDetail from "../bookingDetail/BookingDetail";

const ManageBooking = () => {
  //Local state
  const [active, setActive] = useState(1);
  const [bookings, setBookings] = useState(BookingData.slice(0, 5));
  const [showBookingDetail, setShowBookingDetail] = useState(false);
  const [bookingDetail, setBookingDetail] = useState({
    number: 0,
    id: 0,
    name: "",
  });

  //Pagination
  let items = [];
  for (let number = 1; number <= Math.ceil(BookingData.length / 5); number++) {
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
    setBookings(BookingData.slice(5 * (number - 1), 5 * number));
  };

  return (
    <>
      <div className="manage-booking-container">
        <div className="button-container">
          <Button>CREATE BOOKING</Button>
        </div>
        <Table bordered hover>
          <thead>
            <tr>
              <th>No.</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, index) => {
              return (
                <tr
                  key={index}
                  onClick={() => {
                    setShowBookingDetail(true);
                    setBookingDetail({
                      number: index + 1,
                      id: booking.id,
                      name: booking.name,
                    });
                  }}
                >
                  <td>{index + 1}</td>
                  <td>{booking.name}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        <Pagination className="pagination-container">{items}</Pagination>
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
