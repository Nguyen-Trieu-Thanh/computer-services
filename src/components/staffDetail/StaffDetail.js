import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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

//CSS
import "./StaffDetail.css";

const slots = [1, 2, 3, 4, 5, 6, 7, 8];

const StaffDetail = () => {
  const { account_id } = useParams();

  const {
    data: staffDetailData,
    refetch,
    isFetching,
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

  return (
    <>
      <Container fluid className="staff-detail-container">
        <Row>
          <Col>
            <h4>Thông tin chi tiết nhân viên {account_id}</h4>
          </Col>
        </Row>

        <Card body className="staff-info-container">
          <Row>
            <Col>
              <Card.Title>Thông tin của nhân viên</Card.Title>
            </Col>
          </Row>
          {isFetching ? (
            <Row className="loading">
              <Col className="loading-text">Đang tải dữ liệu...</Col>
            </Row>
          ) : (
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
          )}
        </Card>

        <Card body className="card-table-container mt-2">
          <Row>
            <Col>
              <Card.Title>Thời gian biểu của nhân viên</Card.Title>
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
        </Card>
      </Container>
    </>
  );
};

export default StaffDetail;
