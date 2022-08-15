import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

//API Actions
import { useGetAccountDetailByIdQuery } from "../../redux/slices/account/accountApiSlice";

//React-bootstrap
import {
  Button,
  Modal,
  Form,
  Row,
  Col,
  Spinner,
  InputGroup,
  Table,
  Container,
} from "react-bootstrap";

//Momentjs
import moment from "moment";

//CSS
import "./StaffDetail.css";

const slots = [1, 2, 3, 4, 5, 6, 7, 8];

const StaffDetail = () => {
  const { account_id } = useParams();

  const {
    data: staffDetailData = [],
    refetch,
    isFetching,
  } = useGetAccountDetailByIdQuery(account_id);

  //Local state
  const [startDate, setStartDate] = useState(moment().format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(moment().format("YYYY-MM-DD"));
  const [datesInBetween, setDatesInBetween] = useState([]);

  const getDateInBetween = () => {
    let dates = [];
    let currentDate = moment(startDate);
    let stopDate = moment(endDate);

    while (currentDate <= stopDate) {
      dates.push({
        date: currentDate.format("MM/DD/YYYY"),
        slots: [],
        status: false,
      });

      currentDate = moment(currentDate).add(1, "days");
    }

    setDatesInBetween(dates);
  };

  useEffect(() => {
    getDateInBetween();
  }, [startDate, endDate]);

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
    <>
      <Container fluid className="staff-detail-container">
        <Row>
          <Col>
            <h3>Thông tin chi tiết nhân viên {account_id}</h3>
          </Col>
        </Row>
        <Row className="mt-2">
          <Col>
            <h4>Thông tin của nhân viên</h4>
          </Col>
        </Row>
        <Row>
          <Col>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text>Họ và tên:</InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control
                readOnly
                defaultValue={staffDetailData.user_id?.name}
              />
            </InputGroup>
          </Col>
          <Col>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text>Số điện thoại:</InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control
                readOnly
                defaultValue={staffDetailData.user_id?.phonenum}
              />
            </InputGroup>
          </Col>
          <Col>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text>Vai trò:</InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control readOnly defaultValue={staffDetailData.role} />
            </InputGroup>
          </Col>
        </Row>
        <Row className="mt-5">
          <Col>
            <h4>Thời gian biểu của nhân viên</h4>
          </Col>
        </Row>
        <Row>
          <Col>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text>Từ ngày (MM/DD/YYYY):</InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                }}
              />
            </InputGroup>
          </Col>
          <Col>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text>Đến ngày (MM/DD/YYYY):</InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                }}
              />
            </InputGroup>
          </Col>
        </Row>
        <Row className="table-container mt-2">
          <Col>
            <Table bordered>
              <thead>
                <tr>
                  <th className="date-th">Thời gian biểu</th>
                  {slots.map((slot) => {
                    return (
                      <th key={slot} className="slot-th">
                        Slot {slot}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {datesInBetween.map((date, dateIndex) => {
                  return (
                    <tr key={dateIndex}>
                      <td>{date.date}</td>
                      {slots.map((slot) => {
                        return <td key={slot}></td>;
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
      {/* <Modal
        size="lg"
        show={showStaffDetail}
        onHide={handleClose}
        dialogClassName="staff-detail-container"
        centered
      >
        <div className="modal-content-container">
          <Modal.Header closeButton={true}>
            <Modal.Title>Staff No. {staffDetail.number}</Modal.Title>
          </Modal.Header>
          <Modal.Body className="modal-body-container">
            <Form>
              <Row>
                <Col>
                  <Form.Group controlId="formStaffDetailPhoneNumber">
                    <Form.Label>Số điện thoại:</Form.Label>
                    <Form.Control
                      type="text"
                      name="phonenum"
                      defaultValue={staffDetail.phonenum}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formStaffDetailRole">
                    <Form.Label>Vai trò:</Form.Label>
                    <Form.Control
                      type="text"
                      name="role"
                      defaultValue={staffDetail.role}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleClose}>
              Save Changes
            </Button>
          </Modal.Footer>
        </div>
      </Modal> */}
    </>
  );
};

export default StaffDetail;
