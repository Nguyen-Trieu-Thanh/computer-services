import React, { useEffect, useState } from "react";
import { useLocation, useParams, Navigate } from "react-router-dom";

//API Actions
import { useGetAccountDetailByIdQuery } from "../../redux/slices/account/accountApiSlice";
import {
  useGetSchedulesWithStaffDetailQuery,
  useGetWorkSlotsByIdQuery,
} from "../../redux/slices/schedule/scheduleApiSlice";

//React-bootstrap
import {
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";

//Momentjs
import moment from "moment";

//Icons
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//Images
import defaultUserAvatar from "../../images/default-user-avatar.jpg";

//CSS
import "./StaffDetail.css";
import { Avatar } from "@mui/material";

const slots = [1, 2, 3, 4, 5, 6, 7, 8];

const StaffDetail = () => {
  const location = useLocation();

  const { account_id } = useParams();

  const {
    data: staffDetailData,
    refetch,
    isFetching,
    error,
  } = useGetAccountDetailByIdQuery(account_id);

  const {
    data: workSlotsData = [],
    refetch: getWorkSlotsByIdRefetch,
    isFetching: isGetWorkSlotsByIdRefetch,
  } = useGetWorkSlotsByIdQuery(account_id);

  const {
    data: schedulesDatas = [],
    refetch: schedulesRefetch,
    isFetching: schedulesIsFetching,
  } = useGetSchedulesWithStaffDetailQuery();

  //Local state
  const [startDate, setStartDate] = useState(moment().format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(moment().format("YYYY-MM-DD"));
  const [datesInBetween, setDatesInBetween] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [imgLoading, setImgLoading] = useState(true);

  const getDateInBetween = () => {
    let dates = [];
    let currentDate = moment(startDate);
    let stopDate = moment(endDate);

    while (currentDate <= stopDate) {
      dates.push({
        date: currentDate.format(),
        slots: [],
        status: false,
      });

      currentDate = moment(currentDate).add(1, "days");
    }

    setDatesInBetween(dates);
  };

  for (let dateIndex = 0; dateIndex < datesInBetween.length; dateIndex++) {
    for (
      let scheduleIndex = 0;
      scheduleIndex < schedules.length;
      scheduleIndex++
    ) {
      if (
        moment(datesInBetween[dateIndex].date).format("MM/DD/YYYY") ===
        moment(schedules[scheduleIndex].date).format("MM/DD/YYYY")
      ) {
        datesInBetween[dateIndex].slots = [...schedules[scheduleIndex].slots];
        datesInBetween[dateIndex].status = true;
      }
    }
  }

  useEffect(() => {
    schedulesRefetch();
    getWorkSlotsByIdRefetch();
    getDateInBetween();
  }, [startDate, endDate]);

  useEffect(() => {
    if (!schedulesIsFetching) {
      setSchedules([...schedulesDatas]);
    }
  }, [schedulesIsFetching]);

  if (error) {
    return <Navigate to="/error" state={{ from: location }} replace />;
  }

  return (
    <>
      <Container fluid className="staff-detail-container">
        <Card body className="staff-info-container">
          <Row>
            <Col>
              <Card.Title>Thông tin nhân viên</Card.Title>
            </Col>
          </Row>
          {isFetching ? (
            <div className="loading">
              <Spinner animation="border" />
              <div className="loading-text">Đang tải dữ liệu...</div>
            </div>
          ) : (
            <Row>
              <Col>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Tài khoản:</Form.Label>
                      <Form.Control
                        readOnly
                        defaultValue={staffDetailData.username}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label>Họ và tên:</Form.Label>
                      <Form.Control
                        readOnly
                        defaultValue={staffDetailData.user_id?.name}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label>Ngày tạo:</Form.Label>
                      <Form.Control
                        readOnly
                        defaultValue={moment(staffDetailData.createdAt).format(
                          "MM/DD/YYYY"
                        )}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Email:</Form.Label>
                      <Form.Control
                        readOnly
                        defaultValue={staffDetailData.user_id?.email}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label>Số điện thoại:</Form.Label>
                      <Form.Control
                        readOnly
                        defaultValue={staffDetailData.user_id?.phonenum}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label>Ngày sinh:</Form.Label>
                      <Form.Control
                        readOnly
                        defaultValue={moment(
                          staffDetailData.user_id?.birth
                        ).format("MM/DD/YYYY")}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Col>
              <Col xs={3}>
                <Row>
                  <Col>
                    <Form.Label>Ảnh đại diện:</Form.Label>
                  </Col>
                </Row>
                <Row>
                  <Col className="d-flex justify-content-center align-items-center">
                    <Avatar
                      src={
                        !staffDetailData.user_id?.img || imgLoading
                          ? defaultUserAvatar
                          : `https://computer-services-api.herokuapp.com/account/avatar/${staffDetailData.user_id.img}`
                      }
                      onLoad={() => setImgLoading(false)}
                      sx={{
                        width: "120px",
                        height: "120px",
                        border: "1px solid #000000",
                      }}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          )}
        </Card>

        <Card className="card-table-container">
          <Card.Body>
            <Row>
              <Col>
                <Card.Title>Thời gian biểu của nhân viên</Card.Title>
              </Col>
            </Row>
            <Row>
              <Col>
                <InputGroup>
                  <InputGroup.Prepend>
                    <InputGroup.Text>Từ ngày:</InputGroup.Text>
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
                    <InputGroup.Text>Đến ngày:</InputGroup.Text>
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
            <Row className="table-filter-container mt-2">
              <Col>
                <div className="box-container">
                  <div className="box" />
                  <span>Không có lịch làm việc</span>
                </div>
              </Col>
              <Col>
                <div className="box-container">
                  <div className="box box-checked" />
                  <span>Có lịch làm việc</span>
                </div>
              </Col>
            </Row>
            <Row className="mt-2">
              <Col className="table-container">
                {schedulesIsFetching || isGetWorkSlotsByIdRefetch ? (
                  <div className="loading">
                    <Spinner animation="border" />
                    <div className="loading-text">Đang tải dữ liệu...</div>
                  </div>
                ) : (
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
                            <td>{moment(date.date).format("MM/DD/YYYY")}</td>
                            {slots.map((slot, slotIndex) => {
                              return date.slots.find((x) => x.slot === slot) !==
                                undefined ? (
                                date.slots
                                  .find((x) => x.slot === slot)
                                  .work_slot.map((x) => x._id)
                                  .some((y) =>
                                    workSlotsData
                                      .map((workSlot) => workSlot._id)
                                      .includes(y)
                                  ) ? (
                                  <td key={slotIndex} className="td-checked">
                                    <FontAwesomeIcon
                                      icon={faCheck}
                                      color="#ffffff"
                                    />
                                  </td>
                                ) : (
                                  <td key={slotIndex}></td>
                                )
                              ) : (
                                <td key={slotIndex}></td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                )}
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default StaffDetail;
