import moment from "moment";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

//API Actions
import { useGetAccountDetailByUsernameQuery } from "../../redux/slices/account/accountApiSlice";
import { useGetSchedulesWithStaffDetailQuery } from "../../redux/slices/schedule/scheduleApiSlice";

//React-bootstrap
import {
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  ListGroup,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";

//CSS
import "./Dashboard.css";

//Icons
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//Components

//Enum
import dashboardDynamicTableEnum from "../../enums/dashboardDynamicTableEnum";
import {
  selectCurrentProfile,
  selectCurrentRole,
  selectCurrentUsername,
} from "../../redux/slices/auth/authSlice";
import SlotDetail from "../slotDetail/SlotDetail";
import CustomChart from "../customChart/CustomChart";
import { useDataForDashboardQuery } from "../../redux/slices/chart/chartApiSlice";

const slots = [1, 2, 3, 4, 5, 6, 7, 8];
const slotTimes = [
  "08:00 - 09:30",
  "09:30 - 11:00",
  "11:00 - 12:30",
  "12:30 - 14:00",
  "14:00 - 15:30",
  "15:30 - 17:00",
  "17:00 - 18:30",
  "18:30 - 20:00",
];

const Dashboard = () => {
  //Local state
  const [tableType, setTableType] = useState(dashboardDynamicTableEnum.BOOKING);
  const todayDate = moment().format("LL");
  const [startDate, setStartDate] = useState(moment().format("YYYY-MM-DD"));
  // const [endDate, setEndDate] = useState(
  //   moment().endOf("month").format("YYYY-MM-DD")
  // );
  const [endDate, setEndDate] = useState(moment().format("YYYY-MM-DD"));
  const [datesInBetween, setDatesInBetween] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [showSlotDetail, setShowSlotDetail] = useState(false);
  const [slotDetail, setSlotDetail] = useState({
    date: "",
    slot: 0,
    work_slots: [],
  });
  const [dashboardBoxs, setDashboardBoxs] = useState({
    booking: {
      name: "Lịch hẹn mới trong hôm nay",
      count: 0,
    },
    order: {
      name: "Đơn hàng được hoàn thành trong hôm nay",
      count: 0,
    },
    customer: {
      name: "Khách hàng mới trong tháng này",
      count: 0,
    },
  });

  //Global state
  const profile = useSelector(selectCurrentProfile);
  const username = useSelector(selectCurrentUsername);
  const role = useSelector(selectCurrentRole);

  //Fetch API
  const {
    data: schedulesDatas = [],
    refetch,
    isFetching,
  } = useGetSchedulesWithStaffDetailQuery();

  const {
    data: currentUserData,
    refetch: userRefetch,
    isFetching: userIsFetching,
  } = useGetAccountDetailByUsernameQuery(username);

  const {
    data: dashboardBoxDatas,
    refetch: dashboardBoxDatasRefetch,
    isFetching: isDashboardBoxDatasFetching,
    isLoading: isDashboardBoxDatasLoading,
  } = useDataForDashboardQuery(null, { pollingInterval: 5000 });

  const navigate = useNavigate();

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

  for (let dateIndex = 0; dateIndex < datesInBetween.length; dateIndex++) {
    for (
      let scheduleIndex = 0;
      scheduleIndex < schedules.length;
      scheduleIndex++
    ) {
      if (
        datesInBetween[dateIndex].date ===
        moment(schedules[scheduleIndex].date).format("MM/DD/YYYY")
      ) {
        datesInBetween[dateIndex].slots = [...schedules[scheduleIndex].slots];
        datesInBetween[dateIndex].status = true;
      }
    }
  }

  const checkSlotStatus = (workSlotWithOrder, totalWorkSlot) => {
    if (workSlotWithOrder === totalWorkSlot) {
      return "td-clickable is-full";
    }

    if (workSlotWithOrder > totalWorkSlot / 2) {
      return "td-clickable almost-full";
    }

    return "td-clickable";
  };

  useEffect(() => {
    refetch();
    getDateInBetween();
  }, [startDate, endDate]);

  useEffect(() => {
    if (!isFetching) {
      setSchedules([...schedulesDatas]);
    }
  }, [isFetching]);

  useEffect(() => {
    if (!isDashboardBoxDatasFetching) {
      setDashboardBoxs({ ...dashboardBoxDatas });
    }
  }, [isDashboardBoxDatasFetching]);

  return (
    <>
      <div className="dashboard-page-title">DASHBOARD</div>
      <div className="dashboard-container">
        <div className="dashboard-user-welcome">
          <Card>
            <Card.Body>
              {userIsFetching ? (
                <Card.Title>Đang tải dữ liệu...</Card.Title>
              ) : (
                <Card.Title>
                  Xin chào {currentUserData.user_id.name},
                </Card.Title>
              )}
              <Card.Subtitle>Chức vụ: {role}</Card.Subtitle>
              <Card.Text>{todayDate}</Card.Text>
            </Card.Body>
          </Card>
        </div>
        <div className="dashboard-card-container">
          <Card className="dashboard-card">
            <Card.Header className="dashboard-card-header">
              Lịch hẹn mới trong hôm nay
            </Card.Header>
            <Card.Body className="dashboard-card-body">
              <Card.Title>
                {isDashboardBoxDatasLoading
                  ? "Đang tải dữ liệu..."
                  : dashboardBoxs.booking.count}
              </Card.Title>
              <Card.Text>Lịch hẹn</Card.Text>
            </Card.Body>
            <Card.Footer className="dashboard-card-footer">
              <Card.Link as={Link} to="/booking">
                <span>Xem tất cả</span>
                <FontAwesomeIcon icon={faArrowRight} />
              </Card.Link>
            </Card.Footer>
          </Card>

          <Card className="dashboard-card">
            <Card.Header className="dashboard-card-header">
              Đơn hàng được hoàn thành trong hôm nay
            </Card.Header>
            <Card.Body className="dashboard-card-body">
              <Card.Title>
                {isDashboardBoxDatasLoading
                  ? "Đang tải dữ liệu..."
                  : dashboardBoxs.order.count}
              </Card.Title>
              <Card.Text>Đơn hàng</Card.Text>
            </Card.Body>
          </Card>

          <Card className="dashboard-card">
            <Card.Header className="dashboard-card-header">
              Khách hàng mới trong tháng này
            </Card.Header>
            <Card.Body className="dashboard-card-body">
              <Card.Title>
                {isDashboardBoxDatasLoading
                  ? "Đang tải dữ liệu..."
                  : dashboardBoxs.customer.count}
              </Card.Title>
              <Card.Text>Khách hàng</Card.Text>
            </Card.Body>
            <Card.Footer className="dashboard-card-footer">
              <Card.Link as={Link} to="/customer">
                <span>Xem tất cả</span>
                <FontAwesomeIcon icon={faArrowRight} />
              </Card.Link>
            </Card.Footer>
          </Card>
        </div>
        {role === "admin" && <CustomChart />}

        {role === "manager" && (
          <Container fluid className="dashboard-schedule-container">
            <Card className="schedule-container">
              <Card.Body>
                <Row>
                  <Col>
                    <Card.Title>
                      Thời gian biểu (nhấn vào slot để xem danh sách nhân viên)
                    </Card.Title>
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
                <Row className="mt-2">
                  <Col>
                    <div className="box-container">
                      <div className="box" />
                      <span>Bình thường</span>
                    </div>
                  </Col>
                  <Col>
                    <div className="box-container">
                      <div className="box box-almost-full" />
                      <span>Gần đầy</span>
                    </div>
                  </Col>
                  <Col>
                    <div className="box-container">
                      <div className="box box-is-full" />
                      <span>Đã đầy</span>
                    </div>
                  </Col>
                  <Col>
                    <div className="box-container">
                      <div className="box box-disabled" />
                      <span>Không có nhân viên</span>
                    </div>
                  </Col>
                </Row>
                <Row className="dashboard-schedule-table-container mt-2">
                  <Col>
                    {isFetching ? (
                      <div className="loading">
                        <Spinner animation="border" />
                        <div className="loading-text">Đang tải dữ liệu...</div>
                      </div>
                    ) : (
                      <Table bordered>
                        <thead>
                          <tr>
                            <th className="date-th">Thời gian biểu</th>
                            {slots.map((slot, index) => {
                              return (
                                <th key={slot} className="slot-th">
                                  Slot {slot} <br />
                                  {slotTimes[index]}
                                </th>
                              );
                            })}
                          </tr>
                        </thead>
                        <tbody>
                          {datesInBetween.map((date, dateIndex) => {
                            return date.status ? (
                              <tr key={dateIndex}>
                                <td>{date.date}</td>
                                {slots.map((slot, slotIndex) => {
                                  return date.slots.find(
                                    (x) => x.slot === slot
                                  ) !== undefined ? (
                                    <td
                                      className={checkSlotStatus(
                                        date.slots[
                                          date.slots.findIndex(
                                            (x) => x.slot === slot
                                          )
                                        ].work_slot.filter((y) => y.order_id)
                                          .length,
                                        date.slots[
                                          date.slots.findIndex(
                                            (x) => x.slot === slot
                                          )
                                        ].work_slot.length
                                      )}
                                      key={slotIndex}
                                      onClick={() => {
                                        setSlotDetail({
                                          ...slotDetail,
                                          date: date.date,
                                          slot: slot,
                                          work_slots: JSON.parse(
                                            JSON.stringify(
                                              date.slots[
                                                date.slots.findIndex(
                                                  (x) => x.slot === slot
                                                )
                                              ].work_slot
                                            )
                                          ),
                                        });
                                        setShowSlotDetail(true);
                                      }}
                                    >
                                      {/* <div className="td-text">
                                        Tổng số nhân viên:{" "}
                                        {
                                          date.slots[
                                            date.slots.findIndex(
                                              (x) => x.slot === slot
                                            )
                                          ].work_slot.length
                                        }
                                      </div>
                                      <div className="td-text">
                                        Số nhân viên có sẵn:{" "}
                                        {
                                          date.slots[
                                            date.slots.findIndex(
                                              (x) => x.slot === slot
                                            )
                                          ].work_slot.filter((y) => !y.order_id)
                                            .length
                                        }
                                      </div> */}
                                    </td>
                                  ) : (
                                    <td
                                      key={slotIndex}
                                      className="td-disabled"
                                    ></td>
                                  );
                                })}
                              </tr>
                            ) : (
                              <tr key={dateIndex} className="tr-disabled">
                                <td>{date.date}</td>
                                {slots.map((slot, slotIndex) => {
                                  return <td key={slotIndex}></td>;
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
        )}
      </div>
      <SlotDetail
        slotDetail={slotDetail}
        showSlotDetail={showSlotDetail}
        setShowSlotDetail={setShowSlotDetail}
      />
    </>
  );
};

export default Dashboard;
