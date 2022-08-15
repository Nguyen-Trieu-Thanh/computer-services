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
  selectCurrentUsername,
} from "../../redux/slices/auth/authSlice";
import SlotDetail from "../slotDetail/SlotDetail";
import CustomChart from "../customChart/CustomChart";

const slots = [1, 2, 3, 4, 5, 6, 7, 8];

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
  //Global state
  const profile = useSelector(selectCurrentProfile);
  const username = useSelector(selectCurrentUsername);

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

  const navigate = useNavigate();

  const handleTableSeeAllClick = () => {
    if (tableType === dashboardDynamicTableEnum.BOOKING) {
      navigate("/booking");
    }

    if (tableType === dashboardDynamicTableEnum.ORDER) {
      navigate("/order");
    }

    if (tableType === dashboardDynamicTableEnum.STAFF) {
      navigate("/staff");
    }
  };

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
              <Card.Title>25</Card.Title>
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
              <Card.Title>25</Card.Title>
              <Card.Text>Đơn hàng</Card.Text>
            </Card.Body>
          </Card>

          <Card className="dashboard-card">
            <Card.Header className="dashboard-card-header">
              Khách hàng mới trong tháng này
            </Card.Header>
            <Card.Body className="dashboard-card-body">
              <Card.Title>25</Card.Title>
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
        <div className="dashboard-chart-container">
          <CustomChart />
        </div>
        <div className="dashboard-schedule-container">
          <ListGroup>
            <ListGroup.Item>
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
              <Row className="mt-3">
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
            </ListGroup.Item>
            <ListGroup.Item>
              <Row className="dashboard-schedule-table-container">
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
                                    <div className="td-text">
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
                                    </div>
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
            </ListGroup.Item>
          </ListGroup>
        </div>

        {
          //#region dashboard recent container
          /* <div className="dashboard-recent-container">
          <div className="dashboard-dynamic-table">
            <ListGroup>
              <ListGroup.Item className="dashboard-dynamic-table-title">
                <Dropdown as={ButtonGroup}>
                  <Button variant="outline-dark" disabled>
                    {tableType} mới
                  </Button>
                  <Dropdown.Toggle split variant="dark" id="table-dropdown" />
                  <Dropdown.Menu align="right">
                    <Dropdown.Item
                      as="button"
                      onClick={() => {
                        setTableType(dashboardDynamicTableEnum.BOOKING);
                      }}
                    >
                      Lịch hẹn
                    </Dropdown.Item>
                    <Dropdown.Item
                      as="button"
                      onClick={() => {
                        setTableType(dashboardDynamicTableEnum.ORDER);
                      }}
                    >
                      Đơn hàng
                    </Dropdown.Item>
                    <Dropdown.Item
                      as="button"
                      onClick={() => {
                        setTableType(dashboardDynamicTableEnum.STAFF);
                      }}
                    >
                      Nhân viên
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <Button variant="primary" onClick={handleTableSeeAllClick}>
                  Xem thêm <FontAwesomeIcon icon={faArrowRight} />
                </Button>
              </ListGroup.Item>
              <ListGroup.Item>
                {tableType === dashboardDynamicTableEnum.BOOKING ? (
                  <DashboardManageBooking />
                ) : null}

                {tableType === dashboardDynamicTableEnum.STAFF ? (
                  <DashboardManageStaff />
                ) : null}
              </ListGroup.Item>
            </ListGroup>
          </div>
          <div className="recent-customer">
            <ListGroup>
              <ListGroup.Item className="recent-customer-list-title">
                <span>Khách hàng mới</span>
                <Button
                  variant="primary"
                  onClick={() => {
                    navigate("/customer");
                  }}
                >
                  Xem thêm <FontAwesomeIcon icon={faArrowRight} />
                </Button>
              </ListGroup.Item>
              {[0, 1, 2, 3, 4].map((customer, index) => {
                return (
                  <ListGroup.Item key={index} className="recent-customer-item">
                    <div className="customer-img">
                      <FontAwesomeIcon icon={faCircleUser} size="4x" />
                    </div>
                    <div className="customer-info">
                      <div className="customer-name">Nguyễn Văn A</div>
                      <div className="customer-address">24 Trần Hưng Đạo</div>
                      <div className="customer-phone">0994215628</div>
                    </div>
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          </div>
        </div> */
          //#endregion
        }
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