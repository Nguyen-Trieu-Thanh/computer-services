import React, { useState, useEffect } from "react";

//Redux
//Actions

//API Actions
import { useGetBookingsQuery } from "../../redux/slices/booking/bookingApiSlice";

//React-redux
import { useDispatch, useSelector } from "react-redux";

//CSS
import "./DashboardManageBooking.css";

//React-bootstrap
import { Pagination, Table, Spinner } from "react-bootstrap";

const DashboardManageBooking = () => {
  const {
    data: bookingsData = [],
    refetch,
    isFetching,
  } = useGetBookingsQuery();

  //Local state
  const [active, setActive] = useState(1);
  const [bookings, setBookings] = useState([]);

  //Pagination
  let items = [];
  for (
    let number = 1;
    number <= Math.ceil(bookingsData.length / 10);
    number++
  ) {
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
    setBookings(bookingsData.slice(10 * (number - 1), 10 * number));
  };

  useEffect(() => {
    if (!isFetching) {
      setBookings(bookingsData.slice(0, 10));
    }
  }, [isFetching]);

  if (isFetching) {
    return (
      <>
        <div className="loading mt-3">
          <Spinner animation="border" />
          <div className="loading-text">Đang tải dữ liệu...</div>
        </div>
      </>
    );
  }

  return (
    <div className="dashboard-manage-booking-table-container">
      <div className="table-container">
        <Table bordered size="sm">
          <thead>
            <tr>
              <th>#</th>
              <th>TÊN KHÁCH HÀNG</th>
              <th>SỐ ĐIỆN THOẠI</th>
              <th>LOẠI LỊCH HẸN</th>
              <th>TRẠNG THÁI</th>
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
  );
};

export default DashboardManageBooking;
