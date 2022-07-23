import React, { useEffect, useState } from "react";

//Redux
//Actions

//API Actions
import { useGetServicesQuery } from "../../redux/slices/service/serviceApiSlice";

//React-redux
import { useDispatch } from "react-redux";

//React-bootstrap
import { Button, Col, Form, InputGroup, Modal, Row } from "react-bootstrap";

//Data
import districts from "../../datas/HoChiMinhCityDistricts";

//CSS
import "./CreateBooking.css";

const CreateBooking = ({
  showCreateBooking,
  setShowCreateBooking,
  booking,
  setBooking,
  setShowConfirmCreateBooking,
  servicesData,
}) => {
  const dispatch = useDispatch();

  //Local state

  const handleClose = () => {
    setShowCreateBooking(false);
  };

  const handleCreateBookingChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setBooking({ ...booking, [name]: value });
  };

  const handleCreateBookingAddressChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    if (name === "district") {
      const ward = districts.find((district) => district.name === value)
        .wards[0].name;
      setBooking({
        ...booking,
        cus_address: { ...booking.cus_address, [name]: value, ward: ward },
      });
    } else {
      setBooking({
        ...booking,
        cus_address: { ...booking.cus_address, [name]: value },
      });
    }
  };

  const handleCreateBookingServiceChange = (e) => {
    let newServices = [...booking.services];
    const value = e.target.value;

    if (newServices.includes(value)) {
      const index = newServices.indexOf(value);
      newServices.splice(index, 1);
    } else {
      newServices.push(value);
    }

    setBooking({
      ...booking,
      services: [...newServices],
    });
  };

  const handleConfirmBookingSubmit = (e) => {
    e.preventDefault();
    setShowCreateBooking(false);
    setShowConfirmCreateBooking(true);
  };

  return (
    <>
      <Modal
        show={showCreateBooking}
        onHide={handleClose}
        dialogClassName="create-booking-container"
        centered
      >
        <div className="modal-content-container">
          <Modal.Header>
            <Modal.Title>TẠO LỊCH HẸN</Modal.Title>
          </Modal.Header>
          <Modal.Body className="modal-body-container">
            <Form>
              <Row>
                <Col>
                  <Form.Group controlId="formCreateBookingPhoneNumber">
                    <Form.Label>Số điện thoại:</Form.Label>
                    <Form.Control
                      type="text"
                      name="phonenum"
                      value={booking.phonenum}
                      onChange={handleCreateBookingChange}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formCreateBookingCustomerName">
                    <Form.Label>Họ và tên khách hàng:</Form.Label>
                    <Form.Control
                      type="text"
                      name="cus_name"
                      value={booking.cus_name}
                      onChange={handleCreateBookingChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                {/* <Col>
                  <Form.Group controlId="formCreateBookingAddress">
                    <Form.Label>Địa chỉ khách hàng:</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        placeholder="Thành phố"
                        name="city"
                        value={booking.cus_address.city}
                        onChange={handleCreateBookingAddressChange}
                      />
                      <Form.Control
                        type="text"
                        placeholder="Quận"
                        name="district"
                        value={booking.cus_address.district}
                        onChange={handleCreateBookingAddressChange}
                      />
                      <Form.Control
                        type="text"
                        placeholder="Phường"
                        name="ward"
                        value={booking.cus_address.ward}
                        onChange={handleCreateBookingAddressChange}
                      />
                      <Form.Control
                        type="text"
                        placeholder="Đường"
                        name="street"
                        value={booking.cus_address.street}
                        onChange={handleCreateBookingAddressChange}
                      />
                    </InputGroup>
                  </Form.Group>
                </Col> */}
                <Col lg={9}>
                  <Form.Group controlId="formCreateBookingAddress">
                    <Form.Label>Địa chỉ khách hàng:</Form.Label>
                    <InputGroup>
                      <InputGroup.Prepend>
                        <InputGroup.Text>Thành phố Hồ Chí Minh</InputGroup.Text>
                      </InputGroup.Prepend>
                      <Form.Control
                        as="select"
                        name="district"
                        value={booking.cus_address.district}
                        onChange={handleCreateBookingAddressChange}
                      >
                        {districts.map((district, index) => {
                          return (
                            <option key={index} value={district.name}>
                              {district.name}
                            </option>
                          );
                        })}
                      </Form.Control>
                      <Form.Control
                        as="select"
                        name="ward"
                        value={booking.cus_address.ward}
                        onChange={handleCreateBookingAddressChange}
                      >
                        {districts
                          .find(
                            (district) =>
                              district.name === booking.cus_address.district
                          )
                          .wards.map((ward, index) => {
                            return (
                              <option key={index} value={ward.name}>
                                {ward.name}
                              </option>
                            );
                          })}
                      </Form.Control>
                      <Form.Control
                        type="text"
                        placeholder="Đường"
                        name="street"
                        value={booking.cus_address.street}
                        onChange={handleCreateBookingAddressChange}
                      />
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formCreateBookingType">
                    <Form.Label>Loại lịch hẹn:</Form.Label>
                    <Form.Control
                      as="select"
                      name="type"
                      value={booking.type}
                      onChange={handleCreateBookingChange}
                    >
                      <option>Door-to-Door</option>
                      <option>In place</option>
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group controlId="formCreateBookingDescription">
                    <Form.Label>Mô tả lịch hẹn:</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      name="description"
                      value={booking.description}
                      onChange={handleCreateBookingChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Row>
                    <Col>
                      <Form.Label>Dịch vụ:</Form.Label>
                    </Col>
                  </Row>
                  <Row>
                    {servicesData.map((service, index) => {
                      return (
                        <Form.Group
                          key={index}
                          controlId={"formCreateBookingService-" + index}
                        >
                          <Col>
                            <Form.Check
                              inline
                              label={service.name}
                              value={service._id}
                              checked={booking.services.includes(service._id)}
                              onChange={handleCreateBookingServiceChange}
                            />
                          </Col>
                        </Form.Group>
                      );
                    })}
                  </Row>
                  {/* <Row>
                    <Form.Group controlId="formCreateBookingService-1">
                      <Col>
                        <Form.Check
                          inline
                          label="Vệ sinh máy"
                          name="clean"
                          checked={serviceCheckboxes.clean}
                          onChange={handleCreateBookingServiceChange}
                        />
                      </Col>
                    </Form.Group>
                    <Form.Group controlId="formCreateBookingServices-2">
                      <Col>
                        <Form.Check
                          inline
                          label="Thay linh kiện"
                          name="replace"
                          checked={serviceCheckboxes.replace}
                          onChange={handleCreateBookingServiceChange}
                        />
                      </Col>
                    </Form.Group>
                    <Form.Group controlId="formCreateBookingServices-3">
                      <Col>
                        <Form.Check
                          inline
                          label="Cài đặt phần mềm"
                          name="install"
                          checked={serviceCheckboxes.install}
                          onChange={handleCreateBookingServiceChange}
                        />
                      </Col>
                    </Form.Group>
                  </Row> */}
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
              onClick={handleConfirmBookingSubmit}
            >
              Tạo lịch hẹn
            </Button>
          </Modal.Footer>
        </div>
      </Modal>
    </>
  );
};

export default CreateBooking;
