import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

//React-bootstrap
import {
  Button,
  ButtonGroup,
  Col,
  Dropdown,
  Form,
  InputGroup,
  Modal,
  Row,
} from "react-bootstrap";

//CSS
import "./OrderDetail.css";

//Data
import StaffData from "../../datas/StaffData";

//Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faCheck } from "@fortawesome/free-solid-svg-icons";

//Stepper
import { Step, StepLabel, Stepper } from "@mui/material";

const steps = ["Step 1", "Step 2", "Step 3", "Step 4"];

const OrderDetail = ({ showOrderDetail, setShowOrderDetail, orderDetail }) => {
  //Local state
  const [selectedStaff, setSelectedStaff] = useState("Chọn nhân viên");
  const [staffs, setStaffs] = useState(StaffData.slice(0, 10));

  const navigate = useNavigate();

  const handleClose = () => {
    setShowOrderDetail(false);
  };
  return (
    <>
      <Modal
        size="lg"
        show={showOrderDetail}
        onHide={handleClose}
        dialogClassName="order-detail"
        centered
      >
        <div className="modal-content-container">
          <Modal.Header closeButton={true}>
            <Modal.Title>ĐƠN HÀNG MÃ {orderDetail.code}</Modal.Title>
          </Modal.Header>
          <div className="modal-body-container">
            <Modal.Body>
              <Row>
                <Col>
                  <Form>
                    <Row>
                      <Col>
                        <Form.Group controlId="formBookingCode">
                          <Form.Label>Mã lịch hẹn</Form.Label>
                          <Form.Control
                            readOnly
                            defaultValue={orderDetail.bookingCode}
                          />
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group controlId="formCustomerName">
                          <Form.Label>Khách hàng</Form.Label>
                          <Form.Control
                            readOnly
                            defaultValue={orderDetail.customerName}
                          />
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group controlId="formPhoneNumber">
                          <Form.Label>Số điện thoại</Form.Label>
                          <Form.Control
                            readOnly
                            defaultValue={orderDetail.phoneNumber}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    {/* <Row>
                      <Col>
                        <Form.Group controlId="formServices">
                          <Row>
                            <Col>
                              <Form.Label>Danh sách dịch vụ</Form.Label>
                            </Col>
                          </Row>
                          <Row>
                            <Col>
                              <Form.Check
                                id="checkbox-1"
                                inline
                                type="checkbox"
                                label="Vệ sinh máy"
                                checked
                                disabled
                              />
                            </Col>
                            <Col>
                              <Form.Check
                                id="checkbox-2"
                                inline
                                type="checkbox"
                                label="Thay keo tản nhiệt"
                                checked
                                disabled
                              />
                            </Col>
                            <Col>
                              <Form.Check
                                id="checkbox-3"
                                inline
                                type="checkbox"
                                label="Thay linh kiện"
                                disabled
                              />
                            </Col>
                          </Row>
                        </Form.Group>
                      </Col>
                    </Row> */}
                  </Form>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group controlId="formStaffCode">
                    <Form.Label>Mã nhân viên</Form.Label>
                    <InputGroup>
                      <Form.Control readOnly defaultValue="" />
                      <Dropdown as={ButtonGroup}>
                        <Button variant="outline-dark" disabled>
                          {selectedStaff}
                        </Button>
                        <Dropdown.Toggle
                          split
                          variant="dark"
                          id="staff-dropdown"
                        />

                        <Dropdown.Menu
                          align="right"
                          style={{ height: "300px", overflowY: "scroll" }}
                        >
                          {staffs.map((staff, index) => {
                            return (
                              <Dropdown.Item
                                key={index}
                                onClick={() => {
                                  setSelectedStaff(staff.name);
                                }}
                              >
                                {staff.name}
                              </Dropdown.Item>
                            );
                          })}
                        </Dropdown.Menu>
                      </Dropdown>
                    </InputGroup>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Row>
                    <Col>
                      <h3>Tiến trình</h3>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <div className="step-progress-container">
                        <Stepper activeStep={1} alternativeLabel>
                          {steps.map((step, index) => {
                            return (
                              <Step key={index}>
                                <StepLabel>{step}</StepLabel>
                              </Step>
                            );
                          })}
                        </Stepper>
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Modal.Body>
          </div>
          <Modal.Footer>
            <Button
              variant="primary"
              onClick={() => {
                navigate("/order-detail-information", {
                  state: {
                    orderDetail: orderDetail,
                  },
                });
              }}
            >
              Xem chi tiết
            </Button>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleClose}>
              Save Changes
            </Button>
          </Modal.Footer>
        </div>
      </Modal>
    </>
  );
};

export default OrderDetail;
