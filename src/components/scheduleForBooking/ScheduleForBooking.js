import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Form,
  InputGroup,
  Modal,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import { useGetSchedulesWithStaffDetailQuery } from "../../redux/slices/schedule/scheduleApiSlice";

//CSS
import "./ScheduleForBooking.css";

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

const ScheduleForBooking = ({
  showScheduleForBooking,
  setShowScheduleForBooking,
  booking,
  setBooking,
  slot,
  setSlot,
  validation,
  setValidation,
}) => {
  const {
    data: schedulesDatas = [],
    refetch: schedulesRefetch,
    isFetching: schedulesIsFetching,
    isLoading: schedulesIsLoading,
  } = useGetSchedulesWithStaffDetailQuery();

  //Local state
  const [schedules, setSchedules] = useState([]);
  const [startDate, setStartDate] = useState(
    moment(booking.time).format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState(
    moment(booking.time).add("2", "days").format("YYYY-MM-DD")
  );
  const [datesInBetween, setDatesInBetween] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState({
    date: moment().format(),
    slot: 0,
  });
  const [selectedSlotDetail, setSelectedSlotDetail] = useState({
    totalStaff: 0,
    freeStaff: 0,
  });

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

  const checkIsDateAndSlotSameOrAfter = (date, slot) => {
    if (moment(date).isSame(moment(), "day")) {
      if (slot === 1) {
        return moment().format("Hmm") <= 800;
      }

      if (slot === 2) {
        return moment().format("Hmm") <= 930;
      }

      if (slot === 3) {
        return moment().format("Hmm") <= 1100;
      }

      if (slot === 4) {
        return moment().format("Hmm") <= 1230;
      }

      if (slot === 5) {
        return moment().format("Hmm") <= 1400;
      }

      if (slot === 6) {
        return moment().format("Hmm") <= 1530;
      }

      if (slot === 7) {
        return moment().format("Hmm") <= 1700;
      }

      if (slot === 8) {
        return moment().format("Hmm") <= 1830;
      }
    }

    return true;
  };

  const handleClose = () => {
    setShowScheduleForBooking(false);
  };

  const handleConfirm = () => {
    setShowScheduleForBooking(false);

    setValidation({
      ...validation,
      time: {
        message: "",
        isInvalid: false,
      },
      slot: {
        message: "",
        isInvalid: false,
      },
    });

    if (selectedSchedule.slot == 1) {
      setBooking({
        ...booking,
        time: moment(selectedSchedule.date)
          .set({
            hour: 8,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .format(),
      });
      setSlot(selectedSchedule.slot);
      return;
    }

    if (selectedSchedule.slot == 2) {
      setBooking({
        ...booking,
        time: moment(selectedSchedule.date)
          .set({
            hour: 9,
            minute: 30,
            second: 0,
            millisecond: 0,
          })
          .format(),
      });
      setSlot(selectedSchedule.slot);
      return;
    }

    if (selectedSchedule.slot == 3) {
      setBooking({
        ...booking,
        time: moment(selectedSchedule.date)
          .set({
            hour: 11,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .format(),
      });
      setSlot(selectedSchedule.slot);
      return;
    }

    if (selectedSchedule.slot == 4) {
      setBooking({
        ...booking,
        time: moment(selectedSchedule.date)
          .set({
            hour: 12,
            minute: 30,
            second: 0,
            millisecond: 0,
          })
          .format(),
      });
      setSlot(selectedSchedule.slot);
      return;
    }

    if (selectedSchedule.slot == 5) {
      setBooking({
        ...booking,
        time: moment(selectedSchedule.date)
          .set({
            hour: 14,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .format(),
      });
      setSlot(selectedSchedule.slot);
      return;
    }

    if (selectedSchedule.slot == 6) {
      setBooking({
        ...booking,
        time: moment(selectedSchedule.date)
          .set({
            hour: 15,
            minute: 30,
            second: 0,
            millisecond: 0,
          })
          .format(),
      });
      setSlot(selectedSchedule.slot);
      return;
    }

    if (selectedSchedule.slot == 7) {
      setBooking({
        ...booking,
        time: moment(selectedSchedule.date)
          .set({
            hour: 17,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .format(),
      });
      setSlot(selectedSchedule.slot);
      return;
    }

    if (selectedSchedule.slot == 8) {
      setBooking({
        ...booking,
        time: moment(selectedSchedule.date)
          .set({
            hour: 18,
            minute: 30,
            second: 0,
            millisecond: 0,
          })
          .format(),
      });
      setSlot(selectedSchedule.slot);
      return;
    }
  };

  useEffect(() => {
    if (!schedulesIsFetching) {
      setSchedules([...schedulesDatas]);
    }
  }, [schedulesIsFetching]);

  useEffect(() => {
    setSelectedSchedule({
      date: moment().format(),
      slot: 0,
    });
    getDateInBetween();
  }, [startDate, endDate]);

  return (
    <Modal
      show={showScheduleForBooking}
      onHide={handleClose}
      dialogClassName="schedule-for-booking"
      centered
    >
      <Modal.Header>
        <Modal.Title>Chọn slot</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text>Từ ngày:</InputGroup.Text>
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
                <InputGroup.Text>Đến ngày:</InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control
                // disabled
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
                <InputGroup.Text>Tổng số nhân viên ở slot này:</InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control readOnly value={selectedSlotDetail.totalStaff} />
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
          <Col xs={3}>
            <div className="box-container">
              <div className="box box-disabled" />
              <span>Không có nhân viên/Quá thời gian</span>
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
                    return date.status &&
                      moment(date.date).isSameOrAfter(moment(), "day") ? (
                      <tr key={dateIndex}>
                        <td>{moment(date.date).format("MM/DD/YYYY")}</td>
                        {slots.map((slot, slotIndex) => {
                          return date.slots.find((x) => x.slot === slot) !==
                            undefined &&
                            checkIsDateAndSlotSameOrAfter(date.date, slot) ? (
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
                                    date.slots.findIndex((x) => x.slot === slot)
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
                                  });
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
                                <></>
                              )}
                            </td>
                          ) : (
                            <td key={slotIndex} className="td-disabled"></td>
                          );
                        })}
                      </tr>
                    ) : (
                      <tr key={dateIndex}>
                        <td>{moment(date.date).format("MM/DD/YYYY")}</td>
                        {slots.map((slot, slotIndex) => {
                          return (
                            <td key={slotIndex} className="td-disabled"></td>
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
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Đóng
        </Button>
        <Button onClick={handleConfirm}>Xác nhận</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ScheduleForBooking;
