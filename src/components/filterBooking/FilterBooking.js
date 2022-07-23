import React, { useEffect, useState } from "react";

//Redux
//Actions

//API Actions
import { useGetServicesQuery } from "../../redux/slices/service/serviceApiSlice";

//React-redux
import { useDispatch } from "react-redux";

//React-bootstrap
import { Button, Col, Form, InputGroup, Modal, Row } from "react-bootstrap";

//CSS
import "./FilterBooking.css";

const FilterBooking = ({
  showFilterBooking,
  setShowFilterBooking,
  filterBooking,
  setFilterBooking,
  setIsRefetch,
}) => {
  const handleClose = () => {
    setShowFilterBooking(false);
  };

  const handleFilterBookingChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setFilterBooking({ ...filterBooking, [name]: value });
  };

  const handleFilterBookingSubmit = (e) => {
    e.preventDefault();
    setIsRefetch(true);
    setShowFilterBooking(false);
  };
  return (
    <>
      <Modal
        show={showFilterBooking}
        onHide={handleClose}
        dialogClassName="filter-booking-container"
        centered
      >
        <div className="modal-content-container">
          <Modal.Header>
            <Modal.Title>Bộ lọc lịch hẹn</Modal.Title>
          </Modal.Header>
          <Modal.Body className="modal-body-container">
            <Form>
              <Row>
                <Col>
                  <Form.Group controlId="formFilterBookingStatus">
                    <Form.Label>Trạng thái:</Form.Label>
                    <Form.Control
                      as="select"
                      name="status"
                      value={filterBooking.status}
                      onChange={handleFilterBookingChange}
                    >
                      <option value="pending">Đang chờ</option>
                      <option value="accept">Chấp nhận</option>
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formFilterBookingSort">
                    <Form.Label>Thứ tự sắp xếp:</Form.Label>
                    <Form.Control
                      as="select"
                      name="sort"
                      value={filterBooking.sort}
                      onChange={handleFilterBookingChange}
                    >
                      <option value="asc">Cũ đến mới</option>
                      <option value="desc">Mới đến cũ</option>
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Đóng
            </Button>
            <Button
              type="submit"
              variant="primary"
              onClick={handleFilterBookingSubmit}
            >
              Lọc lịch hẹn
            </Button>
          </Modal.Footer>
        </div>
      </Modal>
    </>
  );
};

export default FilterBooking;
