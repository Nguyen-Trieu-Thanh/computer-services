import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";

//React-bootstrap
import {
  Button,
  ButtonGroup,
  Card,
  Dropdown,
  DropdownButton,
  Form,
  ListGroup,
  Table,
} from "react-bootstrap";

//CSS
import "./Dashboard.css";

//Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleUp,
  faAngleDown,
  faPlus,
  faMinus,
  faArrowRight,
  faCircleUser,
} from "@fortawesome/free-solid-svg-icons";

//Components
import DashboardDynamicTable from "../dashboardDynamicTable/DashboardDynamicTable";
import DashboardManageStaff from "../dashboardManageStaff/DashboardManageStaff";
import DashboardManageBooking from "../dashboardManageBooking/DashboardManageBooking";

//Enum
import dashboardDynamicTableEnum from "../../enums/dashboardDynamicTableEnum";

const slots = ["1", "2", "3", "4", "5", "6", "7", "8"];

const Dashboard = () => {
  //Local state
  const [tableType, setTableType] = useState(dashboardDynamicTableEnum.BOOKING);
  const todayDate = moment().format("DD MMMM YYYY");
  const [startDate, setStartDate] = useState(moment().format("YYYY-MM-DD"));
  // const [endDate, setEndDate] = useState(
  //   moment().endOf("month").format("YYYY-MM-DD")
  // );
  const [endDate, setEndDate] = useState(moment().format("YYYY-MM-DD"));
  const [datesInBetween, setDatesInBetween] = useState([]);

  //Global state

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
      dates.push(currentDate.format("MM/DD/YYYY"));
      currentDate = moment(currentDate).add(1, "days");
    }

    setDatesInBetween(dates);
  };

  useEffect(() => {
    getDateInBetween();
  }, [startDate, endDate]);

  return (
    <>
      <div className="dashboard-page-title">DASHBOARD</div>
      <div className="dashboard-container">
        <div className="dashboard-user-welcome">
          <Card>
            <Card.Body>
              <Card.Title>Xin chào Thành,</Card.Title>
              <Card.Text>{todayDate}</Card.Text>
            </Card.Body>
          </Card>
        </div>
        <div className="dashboard-card-container">
          <Card className="dashboard-card">
            <Card.Header className="dashboard-card-header">
              <div>Lịch hẹn</div>
              <div className="profit">
                <FontAwesomeIcon icon={faPlus} size="xs" />
                <span>6%</span>
                <FontAwesomeIcon icon={faAngleUp} />
              </div>
            </Card.Header>
            <Card.Body className="dashboard-card-body">
              <Card.Title>25</Card.Title>
              <Card.Text>Lịch hẹn mới</Card.Text>
            </Card.Body>
            <Card.Footer className="dashboard-card-footer">
              <Card.Link as={Link} to="/order">
                <span>Xem thêm</span>
                <FontAwesomeIcon icon={faArrowRight} />
              </Card.Link>
            </Card.Footer>
          </Card>

          <Card className="dashboard-card">
            <Card.Header className="dashboard-card-header">
              <div>Đơn hàng</div>
              <div className="loss">
                <FontAwesomeIcon icon={faMinus} size="xs" />
                <span>3%</span>
                <FontAwesomeIcon icon={faAngleDown} />
              </div>
            </Card.Header>
            <Card.Body className="dashboard-card-body">
              <Card.Title>25</Card.Title>
              <Card.Text>Đơn hàng mới</Card.Text>
            </Card.Body>
            <Card.Footer className="dashboard-card-footer">
              <Card.Link as={Link} to="/staff">
                <span>Xem thêm</span>
                <FontAwesomeIcon icon={faArrowRight} />
              </Card.Link>
            </Card.Footer>
          </Card>

          <Card className="dashboard-card">
            <Card.Header className="dashboard-card-header">
              <div>Placeholder</div>
              <div className="profit">
                <FontAwesomeIcon icon={faPlus} size="xs" />
                <span>12%</span>
                <FontAwesomeIcon icon={faAngleUp} />
              </div>
            </Card.Header>
            <Card.Body className="dashboard-card-body">
              <Card.Title>25</Card.Title>
              <Card.Text>Placeholder mới</Card.Text>
            </Card.Body>
            <Card.Footer className="dashboard-card-footer">
              <Card.Link as={Link} to="/booking">
                <span>Xem thêm</span>
                <FontAwesomeIcon icon={faArrowRight} />
              </Card.Link>
            </Card.Footer>
          </Card>
        </div>
        {/* <div className="dashboard-schedule-container">
          <ListGroup>
            <ListGroup.Item>
              <div className="filter-container">
                <Form.Group controlId="formStartDate">
                  <Form.Label>Từ ngày</Form.Label>
                  <Form.Control
                    type="date"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                    }}
                  />
                </Form.Group>
                <Form.Group controlId="formEndDate">
                  <Form.Label>Đến ngày</Form.Label>
                  <Form.Control
                    type="date"
                    value={endDate}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                    }}
                  />
                </Form.Group>
              </div>
            </ListGroup.Item>
            <ListGroup.Item>
              <div className="dashboard-schedule-table-container">
                <Table bordered>
                  <thead>
                    <tr>
                      <th>Ngày\Slot</th>
                      {slots.map((slot) => {
                        return <th key={slot}>Slot {slot}</th>;
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {datesInBetween.map((date, index) => {
                      return (
                        <tr key={index}>
                          <td>{date}</td>
                          {slots.map((slot) => {
                            return <td key={slot} />;
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            </ListGroup.Item>
          </ListGroup>
        </div> */}

        <div className="dashboard-schedule-container">
          <ListGroup>
            <ListGroup.Item>
              <div className="filter-container">
                <Form inline>
                  <Form.Group controlId="formDashboardStartDate">
                    <Form.Label style={{ marginRight: "10px" }}>
                      Lịch làm việc từ ngày
                    </Form.Label>
                    <Form.Control
                      style={{ marginRight: "10px" }}
                      type="date"
                      value={startDate}
                      onChange={(e) => {
                        setStartDate(e.target.value);
                      }}
                    />
                  </Form.Group>
                  <Form.Group controlId="formDashboardEndDate">
                    <Form.Label style={{ marginRight: "10px" }}>
                      đến ngày
                    </Form.Label>
                    <Form.Control
                      type="date"
                      value={endDate}
                      onChange={(e) => {
                        setEndDate(e.target.value);
                      }}
                    />
                  </Form.Group>
                </Form>
              </div>
            </ListGroup.Item>
            <ListGroup.Item>
              <div className="dashboard-schedule-table-container">
                <Table bordered>
                  <thead>
                    <tr>
                      <th>Ngày\Slot</th>
                      {slots.map((slot) => {
                        return <th key={slot}>Slot {slot}</th>;
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {datesInBetween.map((date, index) => {
                      return (
                        <tr key={index}>
                          <td>{date}</td>
                          {slots.map((slot) => {
                            return <td key={slot} />;
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
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
    </>
  );
};

export default Dashboard;
