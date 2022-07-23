import React, { useState, useEffect } from "react";

//Redux
//Actions

//API Actions
import { useGetBookingsQuery } from "../../redux/slices/booking/bookingApiSlice";
import { useGetServicesQuery } from "../../redux/slices/service/serviceApiSlice";

//React-redux

//React-bootstrap
import {
  Button,
  OverlayTrigger,
  Pagination,
  Table,
  Tooltip,
  Spinner,
  Col,
  Form,
  InputGroup,
  Row,
} from "react-bootstrap";

//Material UI

//CSS
import "./ManageBooking.css";

//Components
import BookingDetail from "../bookingDetail/BookingDetail";
import CreateBooking from "../createBooking/CreateBooking";
import ConfirmCreateBooking from "../confirmCreateBooking/ConfirmCreateBooking";
import FilterBooking from "../filterBooking/FilterBooking";
import CustomPagination from "../customPagination/CustomPagination";

//Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faCheck,
  faXmark,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";

//momentjs
import moment from "moment";

const ManageBooking = () => {
  //Local state
  const [active, setActive] = useState(1);
  const [bookings, setBookings] = useState([]);
  const [booking, setBooking] = useState({
    cus_name: "",
    services: [],
    description: "",
    type: "Door-to-Door",
    cus_address: {
      city: "Thành phố Hồ Chí Minh",
      district: "Quận 1",
      ward: "Phường Tân Định",
      street: "",
    },
    time: moment().format(),
    status: "accept",
    phonenum: "",
  });
  const [showCreateBooking, setShowCreateBooking] = useState(false);
  const [showConfirmCreateBooking, setShowConfirmCreateBooking] =
    useState(false);
  const [showBookingDetail, setShowBookingDetail] = useState(false);
  const [bookingDetail, setBookingDetail] = useState({
    _id: "",
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
    status: "",
    phonenum: "",
  });
  const [showConfirmUpdateBooking, setShowConfirmUpdateBooking] =
    useState(false);
  const [isRefetch, setIsRefetch] = useState(false);
  const [showFilterBooking, setShowFilterBooking] = useState(false);
  const [filterBooking, setFilterBooking] = useState({
    status: "",
    sort: "desc",
    page: 1,
  });

  //Fetch API
  const {
    data: bookingsData = {
      count: 1,
      bookings: [],
    },
    refetch,
    isFetching,
  } = useGetBookingsQuery(filterBooking);

  const {
    data: servicesData = [],
    refetch: servicesRefetch,
    isFetching: isServiceFetching,
  } = useGetServicesQuery();

  const handleFilterBookingChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setFilterBooking({ ...filterBooking, [name]: value });
  };

  useEffect(() => {
    if (isRefetch) {
      refetch();
      setIsRefetch(false);
    }
  }, [isRefetch]);

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
              setShowCreateBooking(true);
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
              <option value="pending">Đang chờ</option>
              <option value="accept">Chấp nhận</option>
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
                  <th>NGÀY TẠO (DD/MM/YYYY)</th>
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
                      <td>{moment(booking.createdAt).format("DD/MM/YYYY")}</td>
                      <td>{booking.status}</td>
                      <td>
                        <div className="action-button-container">
                          {/* <OverlayTrigger
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
                                _id: booking._id,
                                cus_name: booking.cus_name,
                                services: booking.services,
                                description: booking.description,
                                type: booking.type,
                                cus_address: booking.cus_address,
                                status: booking.status,
                                phonenum: booking.phonenum,
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
                        </OverlayTrigger> */}
                          <OverlayTrigger
                            placement="bottom"
                            delay={{ show: 200, hide: 100 }}
                            overlay={
                              <Tooltip
                                className="booking-edit-button"
                                id="edit-button-tooltip"
                              >
                                CHI TIẾT
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
                                  status: booking.status,
                                  phonenum: booking.phonenum,
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
      <CreateBooking
        showCreateBooking={showCreateBooking}
        setShowCreateBooking={setShowCreateBooking}
        booking={booking}
        setBooking={setBooking}
        setShowConfirmCreateBooking={setShowConfirmCreateBooking}
        servicesData={servicesData}
      />
      <ConfirmCreateBooking
        setShowCreateBooking={setShowCreateBooking}
        booking={booking}
        setIsRefetch={setIsRefetch}
        setShowConfirmCreateBooking={setShowConfirmCreateBooking}
        showConfirmCreateBooking={showConfirmCreateBooking}
        servicesData={servicesData}
      />
      <BookingDetail
        showBookingDetail={showBookingDetail}
        setShowBookingDetail={setShowBookingDetail}
        bookingDetail={bookingDetail}
        setBookingDetail={setBookingDetail}
        setIsRefetch={setIsRefetch}
        servicesData={servicesData}
      />
      <FilterBooking
        showFilterBooking={showFilterBooking}
        setShowFilterBooking={setShowFilterBooking}
        filterBooking={filterBooking}
        setFilterBooking={setFilterBooking}
        setIsRefetch={setIsRefetch}
      />
    </>
  );
};

export default ManageBooking;
