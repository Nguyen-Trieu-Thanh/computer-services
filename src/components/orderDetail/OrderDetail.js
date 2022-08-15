import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

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
  Col,
  Container,
  Dropdown,
  Form,
  InputGroup,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";

//Stepper
import { Step, StepLabel, Stepper } from "@mui/material";

//Momentjs
import moment from "moment";

//Components
import ScheduleForOrder from "../scheduleForOrder/ScheduleForOrder";

//CSS
import "./OrderDetail.css";
import { useDispatch } from "react-redux";

// const steps = ["Step 1", "Step 2", "Step 3", "Step 4"];
const steps = [
  "Đang chờ",
  "Đang xử lí",
  "Chờ xác nhận",
  "Quản lí xác nhận",
  "Khách hàng xác nhận",
  "Hoàn thành",
];

const OrderDetail = () => {
  const dispatch = useDispatch();
  const { state } = useLocation();
  const { order_id, bookingDetail } = state;

  //Fetch API
  const {
    data: orderDetailData,
    refetch,
    isFetching,
  } = useGetOrderQuery(order_id);
  const [assignWorkSlotToOrder, { isLoading }] =
    useAssignWorkSlotToOrderMutation();
  const {
    data: schedulesDatas = [],
    refetch: schedulesRefetch,
    isFetching: schedulesIsFetching,
  } = useGetSchedulesWithStaffDetailQuery();

  const [updateOrderById, { isLoading: isUpdateOrderByIdLoading }] =
    useUpdateOrderByIdMutation();

  //Local state
  const [showScheduleForOrder, setShowScheduleForOrder] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [schedule, setSchedule] = useState({
    date: bookingDetail.time,
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

  const handleUpdateOrder = async (e) => {
    e.preventDefault();
    try {
      if (orderDetail.status === "Đang chờ") {
        await assignWorkSlotToOrder(updateOrderSlot)
          .unwrap()
          .then(async (res) => {
            if (res) {
              await dispatch(
                setToast({
                  show: true,
                  title: "Cập nhật đơn hàng",
                  time: "just now",
                  content: "Đơn hàng được cập nhật thành công!",
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
      if (orderDetail.status === "Chờ xác nhận") {
        await updateOrderById({ ...orderDetail, status: "Quản lí xác nhận" })
          .unwrap()
          .then(async (res) => {
            if (res) {
              await dispatch(
                setToast({
                  show: true,
                  title: "Cập nhật đơn hàng",
                  time: "just now",
                  content: "Đơn hàng được cập nhật thành công!",
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
    } catch (error) {}
  };

  const checkIsUpdateDisabled = () => {
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

  useEffect(() => {
    if (!isFetching) {
      setOrderDetail({ ...orderDetailData });
      setOrderDetails_id([...orderDetailData.orderDetails_id]);
    }
  }, [isFetching]);

  useEffect(() => {
    if (!schedulesIsFetching) {
      setSchedules([...schedulesDatas]);
    }
  }, [schedulesIsFetching]);

  useEffect(() => {
    if (!isFetching && !schedulesIsFetching && schedules.length !== 0) {
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
  }, [isFetching, schedulesIsFetching, schedules]);

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

  return (
    <>
      <div className="order-detail-container">
        <Container fluid className="order-detail-body-container">
          <Row>
            <Col>
              <h3>Thông tin chi tiết đơn hàng {orderDetail._id}</h3>
            </Col>
          </Row>
          <Row className="mt-2">
            <Col>
              <h4>Thông tin lịch hẹn</h4>
            </Col>
          </Row>
          <Row>
            <Col>
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text>Khách hàng:</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control readOnly defaultValue={bookingDetail.cus_name} />
              </InputGroup>
            </Col>
            <Col>
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text>Số điện thoại:</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control readOnly defaultValue={bookingDetail.phonenum} />
              </InputGroup>
            </Col>
            <Col>
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text>Ngày hẹn (MM/DD/YYYY):</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control
                  readOnly
                  defaultValue={moment(bookingDetail.time).format("MM/DD/YYYY")}
                />
              </InputGroup>
            </Col>
          </Row>
          <Row className="mt-5">
            <Col>
              <h4>Thông tin đơn hàng</h4>
            </Col>
          </Row>
          {schedulesIsFetching ? (
            <div className="loading">
              <Spinner animation="border" />
              <div className="loading-text">Đang tải dữ liệu...</div>
            </div>
          ) : (
            <Row>
              <Col xs={6}>
                <InputGroup>
                  <InputGroup.Prepend>
                    <InputGroup.Text>
                      Ngày thực hiện (MM/DD/YYYY):
                    </InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control
                    readOnly
                    value={moment(schedule.date).format("MM/DD/YYYY")}
                  />
                </InputGroup>
              </Col>
              <Col>
                <InputGroup>
                  <InputGroup.Prepend>
                    <InputGroup.Text>Slot:</InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control
                    readOnly
                    value={
                      schedule.slot === 0 ? "Xin hãy chọn slot" : schedule.slot
                    }
                  />
                </InputGroup>
              </Col>
              <Col xs={2}>
                <Button
                  disabled={orderDetail.work_slot}
                  style={{ width: "100%" }}
                  onClick={() => setShowScheduleForOrder(true)}
                >
                  Chọn ngày hẹn
                </Button>
              </Col>
            </Row>
          )}

          <Row className="mt-5">
            <Col>
              <h4>Thông tin nhân viên</h4>
            </Col>
          </Row>
          <Row>
            <Col>
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text>Nhân viên:</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control
                  disabled={
                    schedule.slot === 0 || orderDetail.status !== "Đang chờ"
                  }
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
              </InputGroup>
            </Col>
            <Col>
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text>Số điện thoại:</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control
                  readOnly
                  defaultValue={
                    schedule.work_slots.find(
                      (y) => y._id === updateOrderSlot.workSlotId
                    )?.staff_id.user_id.phonenum
                  }
                />
              </InputGroup>
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
                    <th>XÁC NHẬN</th>
                    {/* <th>SỐ LƯỢNG</th>
                    <th>GIÁ</th> */}
                  </tr>
                </thead>
                <tbody>
                  {orderDetails_id.map(
                    (orderDetailData, orderDetailDataIndex) => {
                      return (
                        <tr key={orderDetailDataIndex}>
                          <td>{orderDetailDataIndex + 1}</td>
                          <td>{orderDetailData._id}</td>
                          <td>
                            <Form.Check
                              disabled={orderDetail.status !== "Chờ xác nhận"}
                              inline
                              value={orderDetailData._id}
                              checked={orderDetail.orderDetails_id
                                .map((x) => x._id)
                                .includes(orderDetailData._id)}
                              onChange={handleOrderDetails_idChange}
                            />
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </Table>
            </Col>
          </Row>
          <Row className="mt-5">
            <Col>
              <h4>Tiến trình</h4>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="step-progress-container">
                <Stepper
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
                </Stepper>
              </div>
            </Col>
          </Row>
          <Row className="mt-5">
            <Col className="button-container">
              <Button
                disabled={checkIsUpdateDisabled()}
                className="confirm-button"
                onClick={handleUpdateOrder}
              >
                {isLoading || isUpdateOrderByIdLoading ? (
                  <Spinner animation="border" />
                ) : (
                  "Cập nhật"
                )}
              </Button>
            </Col>
          </Row>
        </Container>
      </div>
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
      />
    </>
  );
};

export default OrderDetail;
