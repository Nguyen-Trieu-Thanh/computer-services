import React, { useState } from "react";
import {
  Button,
  ButtonGroup,
  Col,
  Container,
  Dropdown,
  Form,
  InputGroup,
  Row,
  Table,
} from "react-bootstrap";
import { useLocation } from "react-router-dom";

//CSS
import "./CreateOrder.css";

//Data
import StaffData from "../../datas/StaffData";

//Stepper
import { Step, StepLabel, Stepper } from "@mui/material";

const steps = ["Step 1", "Step 2", "Step 3", "Step 4"];

const CreateOrder = () => {
  //Local state
  const [selectedStaff, setSelectedStaff] = useState("Chọn nhân viên");
  const [staffs, setStaffs] = useState(StaffData.slice(0, 10));

  const { state } = useLocation();
  const { orderDetail } = state;
  return (
    <>
      <div className="order-detail-information-container">
        <Container fluid className="order-detail-information-body-container">
          <Row>
            <Col>
              <h3>THÔNG TIN CHI TIẾT ĐƠN HÀNG {orderDetail.code}</h3>
            </Col>
          </Row>
          <Row className="mt-2">
            <Col>
              <Row>
                <Col>
                  <h4>Thông tin khách hàng</h4>
                </Col>
              </Row>
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
              </Form>
            </Col>
          </Row>
          <Row className="mt-5">
            <Col>
              <Row>
                <Col>
                  <h4>Thông tin nhân viên</h4>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group controlId="formStaffCode">
                    <Form.Label>Mã nhân viên</Form.Label>
                    <InputGroup>
                      <Form.Control readOnly defaultValue="123456" />
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
                <Col>
                  <Form.Group controlId="formStaffName">
                    <Form.Label>Nhân viên</Form.Label>
                    <Form.Control readOnly defaultValue="Nguyễn Triệu Thành" />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formStaffPhoneNumber">
                    <Form.Label>Số điện thoại</Form.Label>
                    <Form.Control readOnly defaultValue="(897) 439-2917" />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group controlId="formOrderDate">
                    <Form.Label>Ngày lịch hẹn</Form.Label>
                    <Form.Control readOnly defaultValue="25/05/2022" />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formOrderStartTime">
                    <Form.Label>Thời gian bắt đầu</Form.Label>
                    <Form.Control readOnly defaultValue="13h00" />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formOrderEndTime">
                    <Form.Label>Thời gian kết thúc (dự kiến)</Form.Label>
                    <Form.Control readOnly defaultValue="14h00" />
                  </Form.Group>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className="mt-5">
            <Col>
              <h4>Danh sách dịch vụ</h4>
            </Col>
          </Row>
          <Row>
            <Col>
              <Table bordered size="sm">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>TÊN DỊCH VỤ</th>
                    <th>SỐ LƯỢNG</th>
                    <th>GIÁ</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>Thay màn hình</td>
                    <td>1</td>
                    <td>300.000 VNĐ</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>Vệ sinh máy</td>
                    <td>1</td>
                    <td>100.000 VNĐ</td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>Cài đặt window</td>
                    <td>1</td>
                    <td>400.000 VNĐ</td>
                  </tr>
                  <tr>
                    <td colSpan={3}>
                      <b>Tổng giá</b>
                    </td>
                    <td>
                      <b>800.000 VNĐ</b>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>
          <Row className="mt-5">
            <Col>
              <Row>
                <Col>
                  <h4>Tiến trình</h4>
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
        </Container>
      </div>
    </>
  );
};

export default CreateOrder;
