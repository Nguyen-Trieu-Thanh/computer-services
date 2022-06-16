import React, { useState } from "react";

//React-bootstrap
import { Button, Pagination, Table } from "react-bootstrap";

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
} from "@fortawesome/free-solid-svg-icons";

const ManageBooking = () => {
  //Local state
  const [active, setActive] = useState(1);
  const [bookings, setBookings] = useState(BookingData.slice(0, 10));
  const [showBookingDetail, setShowBookingDetail] = useState(false);
  const [bookingDetail, setBookingDetail] = useState({
    number: 0,
    id: "",
    name: "",
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
                <th>NO.</th>
                <th>NAME</th>
                <th style={{ width: "200px" }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{booking.name}</td>
                    <td>
                      <div className="action-button-container">
                        <Button
                          variant="primary"
                          onClick={() => {
                            setShowBookingDetail(true);
                            setBookingDetail({
                              number: index + 1,
                              id: booking.id,
                              name: booking.name,
                            });
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faPenToSquare}
                            color="#ffffff"
                          />
                        </Button>
                        <Button variant="danger">
                          <FontAwesomeIcon icon={faTrash} color="#ffffff" />
                        </Button>
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
