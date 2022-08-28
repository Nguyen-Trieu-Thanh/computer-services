import React, { useEffect, useState } from "react";
import {
  useNavigate,
  useLocation,
  Navigate,
  useParams,
} from "react-router-dom";

//API Actions
import { useGetOrderQuery } from "../../redux/slices/order/orderApiSlice";
import { useGetAccountsDetailQuery } from "../../redux/slices/account/accountApiSlice";
import {
  useAssignWorkSlotToOrderMutation,
  useGetSchedulesQuery,
  useGetSchedulesWithStaffDetailQuery,
} from "../../redux/slices/schedule/scheduleApiSlice";
import { useUpdateOrderByIdMutation } from "../../redux/slices/order/orderApiSlice";
import { setToast } from "../../redux/slices/toast/toastSlice";

//React-bootstrap
import {
  Button,
  ButtonGroup,
  Card,
  Carousel,
  Col,
  Container,
  Dropdown,
  Form,
  InputGroup,
  Modal,
  OverlayTrigger,
  Row,
  Spinner,
  Table,
  Tooltip,
} from "react-bootstrap";

//Stepper
import { Step, StepLabel, Stepper, Typography } from "@mui/material";

//Momentjs
import moment from "moment";

//Components
import ScheduleForOrder from "../scheduleForOrder/ScheduleForOrder";

//Icons
import { faPenToSquare, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//CSS
import "./OrderDetail.css";
import { useDispatch, useSelector } from "react-redux";
import { useGetBookingByIdMutation } from "../../redux/slices/booking/bookingApiSlice";
import { selectCurrentRole } from "../../redux/slices/auth/authSlice";

// const steps = ["Step 1", "Step 2", "Step 3", "Step 4"];
const steps = [
  "Đang chờ",
  "Đang xử lí",
  "Chờ xác nhận",
  "Quản lí xác nhận",
  "Hoàn tất hóa đơn",
  "Hoàn thành",
];

const OrderDetail = () => {
  const location = useLocation();
  const { order_id } = useParams();

  //Fetch API
  const {
    data: orderDetailData,
    refetch,
    isFetching,
    error,
  } = useGetOrderQuery(order_id);
  const [assignWorkSlotToOrder, { isLoading }] =
    useAssignWorkSlotToOrderMutation();
  const {
    data: schedulesDatas = [],
    refetch: schedulesRefetch,
    isFetching: schedulesIsFetching,
    isLoading: schedulesIsLoading,
  } = useGetSchedulesWithStaffDetailQuery();
  const [updateOrderById, { isLoading: isUpdateOrderByIdLoading }] =
    useUpdateOrderByIdMutation();
  const [getBookingById, { isLoading: isGetBookingByIdLoading }] =
    useGetBookingByIdMutation();

  //Global state
  const role = useSelector(selectCurrentRole);

  //Local state
  const [showScheduleForOrder, setShowScheduleForOrder] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [schedule, setSchedule] = useState({
    date: moment().format(),
    slot: 0,
    work_slots: [],
  });
  const [updateOrderSlot, setUpdateOrderSlot] = useState({
    workSlotId: "",
    orderId: order_id,
  });
  const [initUpdateOrderSlot, setInitUpdateOrderSlot] = useState({
    workSlotId: "",
    orderId: order_id,
  });
  const [orderDetail, setOrderDetail] = useState();
  const [orderDetails_id, setOrderDetails_id] = useState([]);
  const [serviceDetail, setServiceDetail] = useState({
    serviceName: "",
    servicePrice: 0,
    serviceType: "",
    serviceDescription: "",
    serviceHasAccessory: false,
    serviceAccessories: [],
  });
  const [showServiceDetail, setShowServiceDetail] = useState(false);
  const [bookingDetail, setBookingDetail] = useState({
    cus_name: "",
    phonenum: "",
    time: moment().format(),
    description: "",
    services: [],
    type: "Sửa tại nhà",
    cus_address: {
      city: "",
      district: "",
      ward: "",
      street: "",
    },
  });
  const [validation, setValidation] = useState({
    time: {
      message: "",
      isInvalid: false,
    },
    slot: {
      message: "",
      isInvalid: false,
    },
  });

  const [showViewImg, setShowViewImg] = useState(false);
  const [img, setImg] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const checkIsDateAndSlotSameOrAfter = () => {
    if (moment(schedule.date).isSame(moment(), "day")) {
      if (schedule.slot == 1) {
        return moment().format("Hmm") < 800;
      }

      if (schedule.slot == 2) {
        return moment().format("Hmm") < 930;
      }

      if (schedule.slot == 3) {
        return moment().format("Hmm") < 1100;
      }

      if (schedule.slot == 4) {
        return moment().format("Hmm") < 1230;
      }

      if (schedule.slot == 5) {
        return moment().format("Hmm") < 1400;
      }

      if (schedule.slot == 6) {
        return moment().format("Hmm") < 1530;
      }

      if (schedule.slot == 7) {
        return moment().format("Hmm") < 1700;
      }

      if (schedule.slot == 8) {
        return moment().format("Hmm") < 1830;
      }
    }

    return true;
  };

  const handleUpdateOrder = async (e) => {
    e.preventDefault();
    try {
      if (
        orderDetail.status === "Đang chờ" ||
        orderDetail.status === "Đang xử lí"
      ) {
        if (moment(schedule.date).isBefore(moment(), "day")) {
          setValidation({
            ...validation,
            time: {
              message: "Ngày không được nhỏ hơn ngày hôm nay",
              isInvalid: true,
            },
            slot: {
              message: "",
              isInvalid: false,
            },
          });
          return;
        }

        if (!checkIsDateAndSlotSameOrAfter()) {
          setValidation({
            ...validation,
            time: {
              message: "",
              isInvalid: false,
            },
            slot: {
              message: "Đã quá thời gian slot hẹn",
              isInvalid: true,
            },
          });
          return;
        }

        if (!validation.time.isInvalid && !validation.slot.isInvalid) {
          await assignWorkSlotToOrder(updateOrderSlot)
            .unwrap()
            .then(async (res) => {
              if (res) {
                dispatch(
                  setToast({
                    show: true,
                    title: "Cập nhật đơn hàng",
                    time: "just now",
                    content: "Đơn hàng được cập nhật thành công",
                    color: {
                      header: "#dbf0dc",
                      body: "#41a446",
                    },
                  })
                );
                refetch();
              }
            });
          return;
        }
        return;
      }
      if (orderDetail.status === "Chờ xác nhận") {
        await updateOrderById({ ...orderDetail, status: "Quản lí xác nhận" })
          .unwrap()
          .then(async (res) => {
            if (res) {
              dispatch(
                setToast({
                  show: true,
                  title: "Cập nhật đơn hàng",
                  time: "just now",
                  content: "Đơn hàng được cập nhật thành công",
                  color: {
                    header: "#dbf0dc",
                    body: "#41a446",
                  },
                })
              );
              refetch();
            }
          });
        return;
      }
    } catch (error) {
      if (error) {
        if (error.data) {
          dispatch(
            setToast({
              show: true,
              title: "Cập nhật đơn hàng",
              time: "just now",
              content: error.data.message ? error.data.message : error.data,
              color: {
                header: "#ffcccc",
                body: "#e60000  ",
              },
            })
          );
        } else {
          dispatch(
            setToast({
              show: true,
              title: "Cập nhật đơn hàng",
              time: "just now",
              content: "Đã xảy ra lỗi. Xin thử lại sau",
              color: {
                header: "#ffcccc",
                body: "#e60000  ",
              },
            })
          );
        }
      }
    }
  };

  const checkIsUpdateDisabled = () => {
    if (orderDetail.status_workslot === "closed") {
      return (
        JSON.stringify(updateOrderSlot) === JSON.stringify(initUpdateOrderSlot)
      );
    }

    if (orderDetail.status === "Đang xử lí") {
      return true;
    }

    if (orderDetail.status === "Chờ xác nhận") {
      return false;
    }

    return (
      JSON.stringify(updateOrderSlot) === JSON.stringify(initUpdateOrderSlot)
    );
  };

  const checkSelectStaffIsInvalid = () => {
    if (orderDetail.status_workslot === "closed") {
      return (
        JSON.stringify(updateOrderSlot) === JSON.stringify(initUpdateOrderSlot)
      );
    }

    return false;
  };

  const checkSelectStaffDisabled = () => {
    if (orderDetail.status_workslot === "closed") {
      return false;
    }

    return schedule.slot === 0 || orderDetail.status !== "Đang chờ";
  };

  const handleOrderDetails_idChange = (e) => {
    let newOrderDetails_id = [
      ...JSON.parse(JSON.stringify(orderDetail.orderDetails_id)),
    ];

    let newOrderDetail_id = orderDetails_id.find(
      (x) => x._id === e.target.value
    );

    if (newOrderDetails_id.find((x) => x._id === newOrderDetail_id._id)) {
      const index = newOrderDetails_id
        .map((x) => x._id)
        .indexOf(newOrderDetail_id._id);
      newOrderDetails_id.splice(index, 1);
    } else {
      newOrderDetails_id.push(newOrderDetail_id);
    }

    setOrderDetail({
      ...orderDetail,
      orderDetails_id: [...newOrderDetails_id],
    });
  };

  const getBookingDetail = async (booking_id) => {
    try {
      await getBookingById(booking_id)
        .unwrap()
        .then((res) => {
          if (res) {
            setBookingDetail({
              ...res,
            });
          }
        });
    } catch (error) {
      if (error) {
        if (error.data) {
          dispatch(
            setToast({
              show: true,
              title: "Lấy thông tin lịch hẹn",
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
              title: "Lấy thông tin lịch hẹn",
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

  const isStepFailed = (step) => {
    return step === 5 && orderDetail.status === "Hủy";
  };

  useEffect(() => {
    if (!isFetching) {
      if (!error) {
        getBookingDetail(orderDetailData.booking_id);
        setOrderDetail({ ...orderDetailData });
        setOrderDetails_id([...orderDetailData.orderDetails_id]);
      }
    }
  }, [isFetching]);

  useEffect(() => {
    if (!schedulesIsFetching) {
      setSchedules([...schedulesDatas]);
    }
  }, [schedulesIsFetching]);

  useEffect(() => {
    if (!isFetching && !schedulesIsFetching && schedules.length !== 0) {
      if (orderDetail !== undefined) {
        if (orderDetail.status === "Đang chờ") {
          setSchedule({
            ...schedule,
            date: moment(bookingDetail.time).format(),
          });
        } else {
          schedules.map((scheduleData, scheduleIndex) =>
            scheduleData.slots.map((slot, slotIndex) =>
              slot.work_slot.map((work_slot, index) => {
                if (work_slot._id === orderDetail.work_slot) {
                  setSchedule({
                    ...schedule,
                    date: scheduleData.date,
                    slot: slot.slot,
                    work_slots: slot.work_slot,
                  });
                  setUpdateOrderSlot({
                    ...updateOrderSlot,
                    workSlotId: orderDetail.work_slot,
                  });
                  setInitUpdateOrderSlot({
                    ...updateOrderSlot,
                    workSlotId: orderDetail.work_slot,
                  });
                }
              })
            )
          );
        }
      }
    }
  }, [
    isFetching,
    schedulesIsFetching,
    schedules,
    isGetBookingByIdLoading,
    bookingDetail.time,
  ]);

  if (error) {
    return <Navigate to="/error" state={{ from: location }} replace />;
  }

  if (isFetching || !orderDetail) {
    return (
      <>
        <div className="loading mt-3">
          <Spinner animation="border" />
          <div className="loading-text">Đang tải dữ liệu...</div>
        </div>
      </>
    );
  }

  const address =
    bookingDetail.cus_address.street +
    ", " +
    bookingDetail.cus_address.ward +
    ", " +
    bookingDetail.cus_address.district +
    ", " +
    bookingDetail.cus_address.city;

  return (
    <>
      <Container fluid className="order-detail-container">
        <Card body className="booking-info-container">
          <Row>
            <Col>
              <Card.Title>Thông tin lịch hẹn</Card.Title>
            </Col>
          </Row>
          {isGetBookingByIdLoading ? (
            <div className="loading">
              <Spinner animation="border" />
              <div className="loading-text">Đang tải dữ liệu...</div>
            </div>
          ) : (
            <>
              <Row>
                <Col>
                  <Form.Label>Khách hàng:</Form.Label>
                  <p>{bookingDetail.cus_name}</p>
                </Col>
                <Col>
                  <Form.Label>Số điện thoại:</Form.Label>
                  <p>{bookingDetail.phonenum}</p>
                </Col>
                <Col>
                  <Form.Label>Ngày hẹn:</Form.Label>
                  <p>{moment(bookingDetail.time).format("MM/DD/YYYY")}</p>
                </Col>
                <Col>
                  <Form.Label>Giờ hẹn:</Form.Label>
                  <p>{moment(bookingDetail.time).format("HH:mm")}</p>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Label>Mô tả lịch hẹn:</Form.Label>
                  <Form.Control
                    readOnly
                    as="textarea"
                    rows={3}
                    value={bookingDetail.description}
                  />
                </Col>
              </Row>
              <Row className="mt-2">
                <Col>
                  <Form.Label>Loại lịch hẹn:</Form.Label>
                  <p>{bookingDetail.type}</p>
                </Col>
                <Col>
                  <Form.Label>Địa chỉ:</Form.Label>
                  <p>{address}</p>
                </Col>
              </Row>
              <Row>
                <Col className="table-container">
                  <Form.Label>Danh sách dịch vụ khách hàng đặt:</Form.Label>
                  <Table bordered size="sm">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Tên dịch vụ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookingDetail.services.map((service, index) => {
                        return (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{service}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </>
          )}
        </Card>
        <Card className="order-info-container">
          <Card.Body>
            <Row>
              <Col>
                <Card.Title>Thông tin đơn hàng</Card.Title>
              </Col>
            </Row>
            {schedulesIsLoading ? (
              <div className="loading">
                <Spinner animation="border" />
                <div className="loading-text">Đang tải dữ liệu...</div>
              </div>
            ) : (
              <>
                <Row>
                  <Col>
                    <Form.Label>Ngày thực hiện:</Form.Label>
                    <Form.Control
                      isInvalid={validation.time.isInvalid}
                      readOnly
                      value={moment(schedule.date).format("MM/DD/YYYY")}
                    />
                    <Form.Control.Feedback type="invalid">
                      {validation.time.message}
                    </Form.Control.Feedback>
                  </Col>
                  <Col>
                    <Form.Label>Slot:</Form.Label>
                    <Form.Control
                      isInvalid={validation.slot.isInvalid}
                      readOnly
                      value={
                        schedule.slot === 0
                          ? "Xin hãy chọn slot"
                          : schedule.slot
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {validation.slot.message}
                    </Form.Control.Feedback>
                  </Col>
                  <Col xs={4}>
                    <Form.Label>Nhân viên:</Form.Label>
                    <Form.Control
                      isInvalid={checkSelectStaffIsInvalid()}
                      disabled={checkSelectStaffDisabled() || role === "admin"}
                      as="select"
                      name="work_slot"
                      value={updateOrderSlot.workSlotId}
                      onChange={(e) => {
                        setUpdateOrderSlot({
                          ...updateOrderSlot,
                          workSlotId: e.target.value,
                        });
                      }}
                    >
                      {schedule.work_slots.map((work_slot, index) => {
                        return (
                          <option key={index} value={work_slot._id}>
                            {work_slot.staff_id.user_id.name}
                          </option>
                        );
                      })}
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                      Nhân viên đã thông báo bận. Xin hãy chọn nhân viên khác
                    </Form.Control.Feedback>
                  </Col>
                  <Col>
                    <Form.Label>Số điện thoại:</Form.Label>
                    <Form.Control
                      readOnly
                      defaultValue={
                        schedule.work_slots.find(
                          (y) => y._id === updateOrderSlot.workSlotId
                        )?.staff_id.user_id.phonenum
                      }
                    />
                  </Col>
                </Row>
                {(orderDetail.status === "Đang chờ" ||
                  orderDetail.status === "Đang xử lí") && (
                  <Row className="mt-2">
                    {role === "manager" && (
                      <Col className="d-flex flex-row-reverse">
                        <Button
                          disabled={orderDetail.work_slot}
                          onClick={() => setShowScheduleForOrder(true)}
                        >
                          Chọn ngày hẹn
                        </Button>
                      </Col>
                    )}
                  </Row>
                )}

                {orderDetail.computer_id && (
                  <>
                    {/* <Row className="mt-2">
                      <Col>
                        <Form.Label>Mã máy:</Form.Label>
                        <p>{orderDetail.computer_id.code}</p>
                      </Col>
                      <Col>
                        <Form.Label>Thời gian tạo:</Form.Label>
                        <p>
                          {moment(orderDetail.computer_id.createdAt).format(
                            "HH:mm DD/MM/YYYY"
                          )}
                        </p>
                      </Col>
                      <Col>
                        <Form.Label>Cập nhật lúc:</Form.Label>
                        <p>
                          {moment(orderDetail.computer_id.updatedAt).format(
                            "HH:mm DD/MM/YYYY"
                          )}
                        </p>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Form.Label>Tên máy:</Form.Label>
                        <p>{orderDetail.computer_id.name}</p>
                      </Col>
                      <Col>
                        <Form.Label>Hãng máy:</Form.Label>
                        <p>{orderDetail.computer_id.brand}</p>
                      </Col>
                      <Col>
                        <Form.Label>Loại máy:</Form.Label>
                        <p>{orderDetail.computer_id.type}</p>
                      </Col>
                    </Row> */}
                    <Row className="mt-3">
                      <Col>
                        <Form.Label>Tên máy:</Form.Label>
                        <p>{orderDetail.computer_id.name}</p>
                      </Col>
                      <Col>
                        <Form.Label>Hãng máy:</Form.Label>
                        <p>{orderDetail.computer_id.brand}</p>
                      </Col>
                      <Col xs={4}>
                        <Form.Label>Mã máy:</Form.Label>
                        <p>{orderDetail.computer_id.code}</p>
                      </Col>
                      <Col>
                        <Form.Label>Loại máy:</Form.Label>
                        <p>{orderDetail.computer_id.type}</p>
                      </Col>
                    </Row>
                  </>
                )}

                {orderDetail.imgComUrls?.length !== 0 && (
                  <>
                    <Row>
                      <Col>
                        <Form.Label>
                          Hình ảnh máy (nhấn vào ảnh để phóng lớn):
                        </Form.Label>
                      </Col>
                    </Row>
                    <Row>
                      {orderDetail.imgComUrls.map((img, index) => {
                        return (
                          <Col
                            key={index}
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              setImg(img);
                              setShowViewImg(true);
                            }}
                          >
                            <img src={img} />
                          </Col>
                        );
                      })}
                    </Row>
                  </>
                )}
              </>
            )}
            <Row className="mt-3">
              <Col className="table-container">
                <Form.Label>Danh sách dịch vụ nhân viên thực hiện:</Form.Label>
                <Table bordered size="sm">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Tên dịch vụ (nhấn vào để xem chi tiết)</th>
                      <th>Số linh kiện sử dụng</th>
                      <th>Giá dịch vụ (VNĐ)</th>
                      {role === "manager" && <th>Xác nhận</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {orderDetails_id.map(
                      (orderDetailData, orderDetailDataIndex) => {
                        return (
                          <tr key={orderDetailDataIndex}>
                            <td>{orderDetailDataIndex + 1}</td>
                            <td
                              className="td-service-name"
                              onClick={() => {
                                setServiceDetail({
                                  serviceName: orderDetailData.service_id.name,
                                  servicePrice:
                                    orderDetailData.service_id.price,
                                  serviceType: orderDetailData.service_id.type,
                                  serviceDescription:
                                    orderDetailData.service_id.description,
                                  serviceHasAccessory:
                                    orderDetailData.service_id.hasAccessory,
                                  serviceAccessories:
                                    orderDetailData.accessories,
                                });
                                setShowServiceDetail(true);
                              }}
                            >
                              {orderDetailData.service_id.name}
                            </td>
                            <td>
                              {orderDetailData.service_id.hasAccessory
                                ? orderDetailData.accessories.length
                                : 0}
                            </td>
                            <td style={{ textAlign: "right" }}>
                              {new Intl.NumberFormat("de-DE").format(
                                orderDetailData.service_id.price
                              )}
                            </td>
                            {role === "manager" && (
                              <td>
                                <div className="action-button-container">
                                  <Form.Check
                                    disabled={
                                      orderDetail.status !== "Chờ xác nhận" ||
                                      role === "admin"
                                    }
                                    inline
                                    value={orderDetailData._id}
                                    checked={orderDetail.orderDetails_id
                                      .map((x) => x._id)
                                      .includes(orderDetailData._id)}
                                    onChange={handleOrderDetails_idChange}
                                  />
                                </div>
                              </td>
                            )}
                          </tr>
                        );
                      }
                    )}
                    <tr>
                      <td colSpan={2}>Tổng giá tiền (VNĐ)</td>
                      <td colSpan={2} style={{ textAlign: "right" }}>
                        {new Intl.NumberFormat("de-DE").format(
                          orderDetail.totalPrice
                        )}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col>
                <Form.Label>Tiến trình:</Form.Label>
              </Col>
            </Row>
            <Row className="mt-2">
              <Col>
                {/* <Stepper
                  activeStep={steps.findIndex(
                    (step) => step === orderDetail.status
                  )}
                  alternativeLabel
                >
                  {steps.map((step, index) => {
                    return (
                      <Step key={index}>
                        <StepLabel>{step}</StepLabel>
                      </Step>
                    );
                  })}
                </Stepper> */}
                <Stepper
                  activeStep={
                    orderDetail.status === "Hủy"
                      ? 5
                      : steps.findIndex((step) => step === orderDetail.status)
                  }
                  alternativeLabel
                >
                  {steps.map((step, index) => {
                    const labelProps = {};
                    if (isStepFailed(index)) {
                      labelProps.error = true;
                    }
                    return orderDetail.status === "Hoàn thành" ||
                      orderDetail.status === "Hủy" ? (
                      <Step
                        key={index}
                        completed={
                          orderDetail.status === "Hoàn thành" ||
                          orderDetail.status === "Hủy"
                        }
                      >
                        <StepLabel {...labelProps}>
                          {index === 5 && orderDetail.status === "Hủy"
                            ? "Hủy"
                            : step}
                        </StepLabel>
                      </Step>
                    ) : (
                      <Step key={index}>
                        <StepLabel {...labelProps}>{step}</StepLabel>
                      </Step>
                    );
                    // <Step
                    //   key={index}
                    //   completed={
                    //     orderDetail.status === "Hoàn thành" ||
                    //     orderDetail.status === "Hủy"
                    //   }
                    // >
                    //   <StepLabel {...labelProps}>
                    //     {index === 5 && orderDetail.status === "Hủy"
                    //       ? "Hủy"
                    //       : step}
                    //   </StepLabel>
                    // </Step>
                  })}
                </Stepper>
              </Col>
            </Row>
          </Card.Body>
          {role === "manager" && (
            <Card.Footer>
              <Row>
                <Col className="d-flex flex-row-reverse">
                  {orderDetail.status === "Hủy" ? (
                    <Button
                      disabled={isFetching || isGetBookingByIdLoading}
                      onClick={() => {
                        navigate("/create-booking", {
                          state: {
                            bookingDetailFromOrder: bookingDetail,
                          },
                        });
                      }}
                    >
                      Tạo lịch hẹn mới
                    </Button>
                  ) : (
                    <Button
                      disabled={
                        checkIsUpdateDisabled() ||
                        isLoading ||
                        isUpdateOrderByIdLoading
                      }
                      className="confirm-button"
                      onClick={handleUpdateOrder}
                    >
                      {isLoading || isUpdateOrderByIdLoading ? (
                        <Spinner animation="border" />
                      ) : (
                        "Cập nhật"
                      )}
                    </Button>
                  )}
                </Col>
              </Row>
            </Card.Footer>
          )}
        </Card>
      </Container>
      <Modal
        show={showServiceDetail}
        onHide={() => {
          setShowServiceDetail(false);
        }}
        centered
        dialogClassName="service-detail-modal"
      >
        <Modal.Header>
          <Modal.Title>
            Chi tiết dịch vụ {serviceDetail.serviceName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              <Form.Label>Giá dịch vụ (VNĐ):</Form.Label>
              <p>
                {new Intl.NumberFormat("de-DE").format(
                  serviceDetail.servicePrice
                )}
              </p>
            </Col>
            <Col>
              <Form.Label>Loại dịch vụ:</Form.Label>
              <p>{serviceDetail.serviceType}</p>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Label>Mô tả dịch vụ:</Form.Label>
              <p>{serviceDetail.serviceDescription}</p>
            </Col>
          </Row>
          {serviceDetail.serviceHasAccessory && (
            <Row>
              <Col className="table-container">
                <Form.Label>Danh sách linh kiện:</Form.Label>
                <Table bordered size="sm">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Tên linh kiện</th>
                      <th>Giá linh kiện (VNĐ)</th>
                      <th>Số lượng</th>
                      <th>Thời hạn bảo hành</th>
                      <th>Nhà cung cấp</th>
                      {role === "manager" && <th>Hành động</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {serviceDetail.serviceAccessories.map(
                      (accessory, index) => {
                        return (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{accessory.accessory_id.name}</td>
                            <td>
                              {new Intl.NumberFormat("de-DE").format(
                                accessory.accessory_id.price
                              )}
                            </td>
                            <td>{accessory.amount_acc}</td>
                            <td>{accessory.accessory_id.insurance}</td>
                            <td>{accessory.accessory_id.supplier_id.name}</td>
                            {role === "manager" && (
                              <td>
                                <OverlayTrigger
                                  placement="bottom"
                                  delay={{ show: 200, hide: 100 }}
                                  overlay={
                                    <Tooltip
                                      className="accessory-edit-button"
                                      id="edit-button-tooltip"
                                    >
                                      Xem chi tiết
                                    </Tooltip>
                                  }
                                >
                                  <Button
                                    variant="primary"
                                    onClick={() => {
                                      window.open(
                                        "/accessory-detail/" +
                                          accessory.accessory_id._id,
                                        "_blank"
                                      );
                                    }}
                                  >
                                    <FontAwesomeIcon
                                      icon={faPenToSquare}
                                      color="#ffffff"
                                    />
                                  </Button>
                                </OverlayTrigger>
                              </td>
                            )}
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </Table>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowServiceDetail(false);
            }}
          >
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showViewImg}
        onHide={() => {
          setShowViewImg(false);
        }}
        centered
        dialogClassName="img-modal"
      >
        <img style={{ width: "100%", height: "auto" }} src={img} />
      </Modal>
      <ScheduleForOrder
        showScheduleForOrder={showScheduleForOrder}
        setShowScheduleForOrder={setShowScheduleForOrder}
        schedules={schedules}
        setSchedules={setSchedules}
        schedule={schedule}
        setSchedule={setSchedule}
        updateOrderSlot={updateOrderSlot}
        setUpdateOrderSlot={setUpdateOrderSlot}
        schedulesRefetch={schedulesRefetch}
        schedulesIsFetching={schedulesIsFetching}
        bookingDetail={bookingDetail}
        isGetBookingByIdLoading={isGetBookingByIdLoading}
        validation={validation}
        setValidation={setValidation}
      />
    </>
  );
};

export default OrderDetail;
