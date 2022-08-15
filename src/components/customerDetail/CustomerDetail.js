import React, { useEffect, useState } from "react";

//React-bootstrap
import {
  Button,
  Modal,
  Form,
  Row,
  Col,
  Table,
  Pagination,
} from "react-bootstrap";

//momentjs
import moment from "moment";

//CSS
import "./CustomerDetail.css";
import { useGetServicesQuery } from "../../redux/slices/service/serviceApiSlice";

const CustomerDetail = ({
  showCustomerDetail,
  setShowCustomerDetail,
  customerDetail,
}) => {
  const {
    data: servicesData = [],
    refetch: servicesRefetch,
    isFetching: isServiceFetching,
  } = useGetServicesQuery();

  //Local state
  const [active, setActive] = useState(1);
  const [bookingsHistory, setBookingsHistory] = useState([]);

  const handleClose = () => {
    setShowCustomerDetail(false);
  };

  //Pagination
  let items = [];
  for (
    let number = 1;
    number <= Math.ceil([...customerDetail.bookings].reverse().length / 10);
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
    setBookingsHistory(
      [...customerDetail.bookings]
        .reverse()
        .slice(10 * (number - 1), 10 * number)
    );
  };

  useEffect(() => {
    setBookingsHistory([...customerDetail.bookings].reverse().slice(0, 10));
  }, [customerDetail]);
  return (
    <>
      <Modal
        show={showCustomerDetail}
        onHide={handleClose}
        dialogClassName="customer-detail"
        centered
      >
        <div className="modal-content-container">
          <Modal.Header closeButton>
            <Modal.Title>
              Chi tiết khách hàng mã: {customerDetail._id}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="modal-body-container">
            <Form>
              <Row>
                <Col>
                  <Form.Group controlId="formCustomerDetailPhoneNumber/Username">
                    <Form.Label>Số điện thoại / Tên đăng nhập:</Form.Label>
                    <Form.Control
                      plaintext
                      readOnly
                      disabled
                      type="text"
                      name="username"
                      defaultValue={customerDetail.username}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formCustomerDetailRole">
                    <Form.Label>Vai trò:</Form.Label>
                    <Form.Control
                      plaintext
                      readOnly
                      disabled
                      type="text"
                      name="role"
                      defaultValue={customerDetail.role}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Label>Lịch sử lịch hẹn:</Form.Label>
                  <div className="table-container">
                    <Table bordered size="sm">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>ĐỊA CHỈ</th>
                          <th>DỊCH VỤ</th>
                          <th>NGÀY ĐẶT (MM/DD/YYYY)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookingsHistory.map((booking, index) => {
                          return (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>
                                {booking.cus_address.street +
                                  ", " +
                                  booking.cus_address.ward +
                                  ", " +
                                  booking.cus_address.district +
                                  ", " +
                                  booking.cus_address.city}
                              </td>
                              <td>
                                {servicesData
                                  .filter((x) =>
                                    booking.services.includes(x._id)
                                  )
                                  .map((service) => {
                                    return service.name;
                                  })
                                  .join(", ")}
                              </td>
                              <td>
                                {moment(booking.createdAt).format("MM/DD/YYYY")}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </div>
                  <div>
                    <Pagination className="pagination-container">
                      {items}
                    </Pagination>
                  </div>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
          {/* <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
             <Button variant="primary" onClick={handleClose}>
              Save Changes
            </Button> 
          </Modal.Footer> */}
        </div>
      </Modal>
    </>
  );
};

export default CustomerDetail;
