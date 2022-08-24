import React, { useEffect, useState } from "react";
import { Chart, registerables } from "chart.js";
import { Line } from "react-chartjs-2";

//React-bootstrap
import {
  Button,
  ButtonGroup,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  ListGroup,
  Row,
  Spinner,
} from "react-bootstrap";

//momentjs
import moment from "moment";

//CSS
import "./CustomChart.css";
import { useDataToChartMutation } from "../../redux/slices/chart/chartApiSlice";
import { useDispatch } from "react-redux";
import { setToast } from "../../redux/slices/toast/toastSlice";

Chart.register(...registerables);

const chartDataTypes = [
  {
    nameVN: "Tổng số lịch hẹn",
    nameEN: "totalbooking",
  },
  {
    nameVN: "Số đơn hoàn thành",
    nameEN: "completedorder",
  },
  {
    nameVN: "Số khách hàng mới",
    nameEN: "newcustomer",
  },
];

const CustomChart = () => {
  const [dataToChart, { isLoading }] = useDataToChartMutation();

  //Local state
  const [labels, setLabels] = useState([]);
  const [datasets, setDatasets] = useState([]);

  const [request, setRequest] = useState({
    dates: [],
    types: ["totalbooking", "completedorder", "newcustomer"],
    filter: "bydate",
  });

  const dispatch = useDispatch();

  const getChart = async () => {
    try {
      await dataToChart(request)
        .unwrap()
        .then((res) => {
          if (res) {
            let datas = JSON.parse(JSON.stringify(res));
            datas.map((data, index) => {
              if (data.label.includes("Tổng số lịch hẹn")) {
                data.backgroundColor = "#ff0000";
                data.borderColor = "#ff0000";
              }

              if (data.label.includes("Số khách hàng mới")) {
                data.backgroundColor = "#0000ff";
                data.borderColor = "#0000ff";
              }

              if (data.label.includes("Số đơn hoàn thành")) {
                data.backgroundColor = "#008000";
                data.borderColor = "#008000";
              }
            });
            setDatasets([...datas]);
          }
        });
    } catch (error) {
      if (error) {
        if (error.data) {
          dispatch(
            setToast({
              show: true,
              title: "Lấy biểu đồ",
              time: "just now",
              content: error.data,
              color: {
                header: "#ffcccc",
                body: "#e60000",
              },
            })
          );
        } else {
          dispatch(
            setToast({
              show: true,
              title: "Lấy biểu đồ",
              time: "just now",
              content: "Đã xảy ra lỗi. Xin thử lại sau",
              color: {
                header: "#ffcccc",
                body: "#e60000",
              },
            })
          );
        }
      }
    }
  };

  const getDatesInBetween = (value) => {
    let dates = [];
    let requestDates = [];
    let currentDate = moment().subtract(value, "day");
    let stopDate = moment();

    while (currentDate <= stopDate) {
      dates.push(currentDate.format("MM/DD/YYYY"));
      requestDates.push(currentDate.format("YYYY-MM-DD"));
      currentDate = moment(currentDate).add(1, "days");
    }

    setRequest({
      ...request,
      dates: [...requestDates],
      filter: "bydate",
    });
    setLabels(dates);
  };

  const getMonthsInBetween = (value) => {
    let months = [];
    let requestMonths = [];
    let currentMonth = moment().subtract(value, "month");
    let stopMonth = moment();
    let interim = currentMonth.clone();

    while (
      interim <= stopMonth ||
      interim.format("M") === stopMonth.format("M")
    ) {
      months.push(interim.format("MM/YYYY"));
      requestMonths.push(interim.format("YYYY-MM-DD"));
      interim.add(1, "month");
    }

    setRequest({
      ...request,
      dates: [...requestMonths],
      filter: "bymonth",
    });
    setLabels(months);
  };

  const handleRequestTypesChange = (e) => {
    let newRequestTypes = [...request.types];
    const value = e.target.value;

    if (newRequestTypes.includes(value)) {
      const index = newRequestTypes.indexOf(value);
      newRequestTypes.splice(index, 1);
    } else {
      newRequestTypes.push(value);
    }

    setRequest({
      ...request,
      types: [...newRequestTypes],
    });
  };

  useEffect(() => {
    getDatesInBetween(7);
  }, []);

  useEffect(() => {
    getChart();
  }, [request]);

  return (
    <>
      <Container fluid className="custom-chart-container">
        <Card body className="chart-request-container">
          <Row>
            <Col>
              <Card.Title>Biểu đồ doanh số hệ thống</Card.Title>
            </Col>
          </Row>
          <Row>
            <Col>
              <ListGroup horizontal defaultActiveKey="7days">
                <ListGroup.Item
                  disabled={isLoading}
                  className="date-item"
                  action
                  eventKey="7days"
                  onClick={() => {
                    getDatesInBetween(7);
                  }}
                >
                  7 ngày trước
                </ListGroup.Item>
                <ListGroup.Item
                  disabled={isLoading}
                  className="date-item"
                  action
                  eventKey="14days"
                  onClick={() => {
                    getDatesInBetween(14);
                  }}
                >
                  14 ngày trước
                </ListGroup.Item>
                <ListGroup.Item
                  disabled={isLoading}
                  className="date-item"
                  action
                  eventKey="30days"
                  onClick={() => {
                    getDatesInBetween(30);
                  }}
                >
                  30 ngày trước
                </ListGroup.Item>
                <ListGroup.Item
                  disabled={isLoading}
                  className="date-item"
                  action
                  eventKey="6months"
                  onClick={() => {
                    getMonthsInBetween(6);
                  }}
                >
                  6 tháng trước
                </ListGroup.Item>
                <ListGroup.Item
                  disabled={isLoading}
                  className="date-item"
                  action
                  eventKey="9months"
                  onClick={() => {
                    getMonthsInBetween(9);
                  }}
                >
                  9 tháng trước
                </ListGroup.Item>
                <ListGroup.Item
                  disabled={isLoading}
                  className="date-item"
                  action
                  eventKey="12months"
                  onClick={() => {
                    getMonthsInBetween(12);
                  }}
                >
                  12 tháng trước
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
          <Row className="request-type-items-container">
            {chartDataTypes.map((chartDataType, index) => {
              return (
                <Form.Group
                  key={index}
                  controlId={"formChartDataType-" + index}
                >
                  <Col>
                    <Form.Check
                      disabled={isLoading}
                      inline
                      label={chartDataType.nameVN}
                      value={chartDataType.nameEN}
                      checked={request.types.includes(chartDataType.nameEN)}
                      onChange={handleRequestTypesChange}
                    />
                  </Col>
                </Form.Group>
              );
            })}
          </Row>
          <Row>
            <Col>
              {isLoading ? (
                <div className="loading">
                  <Spinner animation="border" />
                  <div className="loading-text">Đang tải dữ liệu...</div>
                </div>
              ) : (
                <Line
                  data={{
                    labels: labels,
                    datasets: datasets,
                  }}
                  height={140}
                />
              )}
            </Col>
          </Row>
        </Card>
        {/* <ListGroup.Item className="chart-request-container">
          <Row>
            <Col>
              <ListGroup horizontal defaultActiveKey="7days">
                <ListGroup.Item
                  className="date-item"
                  action
                  eventKey="7days"
                  onClick={() => {
                    getDatesInBetween(7);
                  }}
                >
                  7 ngày
                </ListGroup.Item>
                <ListGroup.Item
                  className="date-item"
                  action
                  eventKey="14days"
                  onClick={() => {
                    getDatesInBetween(14);
                  }}
                >
                  14 ngày
                </ListGroup.Item>
                <ListGroup.Item
                  className="date-item"
                  action
                  eventKey="30days"
                  onClick={() => {
                    getDatesInBetween(30);
                  }}
                >
                  30 ngày
                </ListGroup.Item>
                <ListGroup.Item
                  className="date-item"
                  action
                  eventKey="6months"
                  onClick={() => {
                    getMonthsInBetween(6);
                  }}
                >
                  6 tháng
                </ListGroup.Item>
                <ListGroup.Item
                  className="date-item"
                  action
                  eventKey="9months"
                  onClick={() => {
                    getMonthsInBetween(9);
                  }}
                >
                  9 tháng
                </ListGroup.Item>
                <ListGroup.Item
                  className="date-item"
                  action
                  eventKey="12months"
                  onClick={() => {
                    getMonthsInBetween(12);
                  }}
                >
                  12 tháng
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
          <Row className="request-type-items-container">
            {chartDataTypes.map((chartDataType, index) => {
              return (
                <Form.Group
                  key={index}
                  controlId={"formChartDataType-" + index}
                >
                  <Col>
                    <Form.Check
                      inline
                      label={chartDataType.nameVN}
                      value={chartDataType.nameEN}
                      checked={request.types.includes(chartDataType.nameEN)}
                      onChange={handleRequestTypesChange}
                    />
                  </Col>
                </Form.Group>
              );
            })}
          </Row>
        </ListGroup.Item>
        <ListGroup.Item className="line-chart-container">
          <Row>
            <Col>
              {isLoading ? (
                <div className="loading">
                  <Spinner animation="border" />
                  <div className="loading-text">Đang tải dữ liệu...</div>
                </div>
              ) : (
                <Line
                  data={{
                    labels: labels,
                    datasets: datasets,
                  }}
                />
              )}
            </Col>
          </Row>
        </ListGroup.Item> */}
      </Container>
      {/* <ListGroup className="custom-chart-container">
        <ListGroup.Item className="chart-request-container">
          <Row>
            <Col>
              <ListGroup horizontal defaultActiveKey="7days">
                <ListGroup.Item
                  className="date-item"
                  action
                  eventKey="7days"
                  onClick={() => {
                    getDatesInBetween(7);
                  }}
                >
                  7 ngày
                </ListGroup.Item>
                <ListGroup.Item
                  className="date-item"
                  action
                  eventKey="14days"
                  onClick={() => {
                    getDatesInBetween(14);
                  }}
                >
                  14 ngày
                </ListGroup.Item>
                <ListGroup.Item
                  className="date-item"
                  action
                  eventKey="30days"
                  onClick={() => {
                    getDatesInBetween(30);
                  }}
                >
                  30 ngày
                </ListGroup.Item>
                <ListGroup.Item
                  className="date-item"
                  action
                  eventKey="6months"
                  onClick={() => {
                    getMonthsInBetween(6);
                  }}
                >
                  6 tháng
                </ListGroup.Item>
                <ListGroup.Item
                  className="date-item"
                  action
                  eventKey="9months"
                  onClick={() => {
                    getMonthsInBetween(9);
                  }}
                >
                  9 tháng
                </ListGroup.Item>
                <ListGroup.Item
                  className="date-item"
                  action
                  eventKey="12months"
                  onClick={() => {
                    getMonthsInBetween(12);
                  }}
                >
                  12 tháng
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
          <Row className="request-type-items-container">
            {chartDataTypes.map((chartDataType, index) => {
              return (
                <Form.Group
                  key={index}
                  controlId={"formChartDataType-" + index}
                >
                  <Col>
                    <Form.Check
                      inline
                      label={chartDataType.nameVN}
                      value={chartDataType.nameEN}
                      checked={request.types.includes(chartDataType.nameEN)}
                      onChange={handleRequestTypesChange}
                    />
                  </Col>
                </Form.Group>
              );
            })}
          </Row>
        </ListGroup.Item>
        <ListGroup.Item className="line-chart-container">
          <Row>
            <Col>
              {isLoading ? (
                <div className="loading">
                  <Spinner animation="border" />
                  <div className="loading-text">Đang tải dữ liệu...</div>
                </div>
              ) : (
                <Line
                  data={{
                    labels: labels,
                    datasets: datasets,
                  }}
                />
              )}
            </Col>
          </Row>
        </ListGroup.Item>
      </ListGroup> */}
    </>
  );
};

export default CustomChart;
