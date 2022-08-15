import React, { useEffect, useState } from "react";

//API Actions

//React-bootstrap
import {
  Button,
  Col,
  Form,
  InputGroup,
  Modal,
  Row,
  Table,
  Spinner,
} from "react-bootstrap";

//Momentjs
import moment from "moment";

//Icons
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//CSS
import "./ScheduleForOrder.css";

const slots = [1, 2, 3, 4, 5, 6, 7, 8];

const ScheduleForOrder = ({
  showScheduleForOrder,
  setShowScheduleForOrder,
  schedules,
  setSchedules,
  schedule,
  setSchedule,
  updateOrderSlot,
  setUpdateOrderSlot,
  schedulesRefetch,
  schedulesIsFetching,
}) => {
  //Local state
  const [startDate, setStartDate] = useState(
    moment(schedule.date).format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState(
    moment(schedule.date).format("YYYY-MM-DD")
  );
  const [datesInBetween, setDatesInBetween] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState({
    date: moment().format(),
    slot: 0,
    work_slots: [],
  });
  const [selectedWorkSlotId, setSelectedWorkSlotId] = useState("");
  const [selectedSlotDetail, setSelectedSlotDetail] = useState({
    totalStaff: 0,
    freeStaff: 0,
  });

  //Fetch API

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

  const checkSlotStatus = (workSlotWithOrder, totalWorkSlot) => {
    if (workSlotWithOrder === totalWorkSlot) {
      return "is-full";
    }

    if (workSlotWithOrder > totalWorkSlot / 2) {
      return "td-clickable almost-full";
    }

    return "td-clickable";
  };

  const handleClose = () => {
    setShowScheduleForOrder(false);
    if (!updateOrderSlot.workSlotId) {
      setSelectedSchedule({
        date: moment().format(),
        slot: 0,
        work_slots: [],
      });
      setSelectedWorkSlotId("");
      setEndDate(moment(schedule.date).format("YYYY-MM-DD"));
      setSelectedSlotDetail({
        totalStaff: 0,
        freeStaff: 0,
      });
    }
  };

  const handleConfirm = () => {
    setShowScheduleForOrder(false);
    setSchedule(JSON.parse(JSON.stringify(selectedSchedule)));
    setUpdateOrderSlot({
      ...updateOrderSlot,
      workSlotId: selectedWorkSlotId,
    });
  };

  useEffect(() => {
    getDateInBetween();
  }, [startDate, endDate]);

  return (
    <>
      <Modal
        show={showScheduleForOrder}
        onHide={handleClose}
        dialogClassName="schedule-for-order"
        centered
      >
        <div className="modal-content-container">
          <Modal.Header>
            <Modal.Title>Chọn slot</Modal.Title>
          </Modal.Header>
          <Modal.Body className="modal-body-container">
            <Row>
              <Col>
                <InputGroup>
                  <InputGroup.Prepend>
                    <InputGroup.Text>Từ ngày (MM/DD/YYYY):</InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control
                    disabled
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
                      schedulesRefetch();
                      setEndDate(e.target.value);
                    }}
                  />
                </InputGroup>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col>
                <InputGroup>
                  <InputGroup.Prepend>
                    <InputGroup.Text>
                      Số nhân viên có sẵn ở slot này:
                    </InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control readOnly value={selectedSlotDetail.freeStaff} />
                </InputGroup>
              </Col>
              <Col>
                <InputGroup>
                  <InputGroup.Prepend>
                    <InputGroup.Text>
                      Tổng số nhân viên ở slot này:
                    </InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control
                    readOnly
                    value={selectedSlotDetail.totalStaff}
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
                  <div className="box box-selected" />
                  <span>Đang chọn</span>
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
            <Row className="mt-3 table-container">
              <Col>
                {schedulesIsFetching ? (
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
                            <td>{moment(date.date).format("MM/DD/YYYY")}</td>
                            {slots.map((slot, slotIndex) => {
                              return date.slots.find((x) => x.slot === slot) !==
                                undefined ? (
                                <td
                                  className={
                                    selectedSchedule.date === date.date &&
                                    selectedSchedule.slot === slot
                                      ? "td-clickable selected-td"
                                      : checkSlotStatus(
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
                                        )
                                  }
                                  key={slotIndex}
                                  onClick={() => {
                                    if (
                                      date.slots[
                                        date.slots.findIndex(
                                          (x) => x.slot === slot
                                        )
                                      ].work_slot.filter((y) => !y.order_id)
                                        .length !== 0
                                    ) {
                                      setSelectedSchedule({
                                        ...selectedSchedule,
                                        date: date.date,
                                        slot: date.slots[
                                          date.slots.findIndex(
                                            (x) => x.slot === slot
                                          )
                                        ].slot,
                                        work_slots: JSON.parse(
                                          JSON.stringify(
                                            date.slots[
                                              date.slots.findIndex(
                                                (x) => x.slot === slot
                                              )
                                            ].work_slot.filter(
                                              (y) => !y.order_id
                                            )
                                          )
                                        ),
                                      });
                                      setSelectedWorkSlotId(
                                        date.slots[
                                          date.slots.findIndex(
                                            (x) => x.slot === slot
                                          )
                                        ].work_slot[0]._id
                                      );
                                      setSelectedSlotDetail({
                                        ...selectedSlotDetail,
                                        totalStaff:
                                          date.slots[
                                            date.slots.findIndex(
                                              (x) => x.slot === slot
                                            )
                                          ].work_slot.length,
                                        freeStaff: date.slots[
                                          date.slots.findIndex(
                                            (x) => x.slot === slot
                                          )
                                        ].work_slot.filter((y) => !y.order_id)
                                          .length,
                                      });
                                    }
                                  }}
                                >
                                  {selectedSchedule.date === date.date &&
                                  selectedSchedule.slot === slot ? (
                                    <FontAwesomeIcon
                                      icon={faCheck}
                                      color="#ffffff"
                                    />
                                  ) : (
                                    <>
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
                                    </>
                                  )}
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
                            <td>{moment(date.date).format("MM/DD/YYYY")}</td>
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
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Đóng
            </Button>
            <Button disabled={!selectedWorkSlotId} onClick={handleConfirm}>
              Xác nhận
            </Button>
          </Modal.Footer>
        </div>
      </Modal>
    </>
  );
};

export default ScheduleForOrder;
