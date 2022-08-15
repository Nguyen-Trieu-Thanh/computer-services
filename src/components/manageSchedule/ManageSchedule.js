import React, { useEffect, useState } from "react";

//Redux
//Actions

//API Actions
import { useGetSchedulesQuery } from "../../redux/slices/schedule/scheduleApiSlice";

//React-redux

//React-bootstrap
import { Button, Form, InputGroup, Modal, Table } from "react-bootstrap";

//Momentjs
import moment from "moment";

//CSS
import "./ManageSchedule.css";

const slots = [1, 2, 3, 4, 5, 6, 7, 8];

const ManageSchedule = () => {
  //Local state
  const [schedules, setSchedules] = useState([]);
  const [startDate, setStartDate] = useState(moment().format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(
    moment().endOf("month").format("YYYY-MM-DD")
  );
  const [datesInBetween, setDatesInBetween] = useState([]);

  //Fetch API
  const {
    data: schedulesDatas = [],
    refetch,
    isFetching,
  } = useGetSchedulesQuery();

  // const getDateInBetween = () => {
  //   let dates = [];
  //   let currentDate = moment(startDate);
  //   let stopDate = moment(endDate);

  //   while (currentDate <= stopDate) {
  //     dates.push(currentDate.format("MM/DD/YYYY"));
  //     currentDate = moment(currentDate).add(1, "days");
  //   }

  //   setDatesInBetween(dates);
  // };
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

  useEffect(() => {
    getDateInBetween();
  }, [startDate, endDate]);

  useEffect(() => {
    if (!isFetching) {
      setSchedules([...schedulesDatas]);
    }
  }, [isFetching]);

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

  return (
    <>
      <div className="manage-schedule-container">
        <div className="filter-container">
          <InputGroup className="mr-3">
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
        </div>
        <div className="table-container">
          <Table bordered>
            <thead>
              <tr>
                <th>Thời gian biểu</th>
                {slots.map((slot) => {
                  return <th key={slot}>Slot {slot}</th>;
                })}
              </tr>
            </thead>
            <tbody>
              {datesInBetween.map((date, dateIndex) => {
                return date.status ? (
                  <tr key={dateIndex}>
                    <td>{date.date}</td>
                    {slots.map((slot, slotIndex) => {
                      return date.slots.sort((a, b) => a.slot - b.slot)[
                        slotIndex
                      ] !== undefined ? (
                        <td
                          key={slotIndex}
                          onClick={() => console.log(date.slots[slotIndex])}
                        >
                          {date.slots[slotIndex].work_slot.length} nhân viên
                        </td>
                      ) : (
                        <td key={slotIndex} className="td-disabled"></td>
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
        </div>
      </div>
    </>
  );
};

export default ManageSchedule;
