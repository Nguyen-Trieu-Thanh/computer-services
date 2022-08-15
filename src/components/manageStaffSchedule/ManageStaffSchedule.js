import moment from "moment";
import React, { useEffect, useState } from "react";

//React-bootstrap
import { Button, Form, Modal, Table } from "react-bootstrap";

//CSS
import "./ManageStaffSchedule.css";

const ManageStaffSchedule = ({
  showStaffSchedule,
  setShowStaffSchedule,
  staffScheduleId,
}) => {
  const slots = [1, 2, 3, 4, 5, 6, 7, 8];
  //Local state
  const [startDate, setStartDate] = useState(moment().format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(
    moment().endOf("month").format("YYYY-MM-DD")
  );

  const [datesInBetween, setDatesInBetween] = useState([]);

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

  const handleClose = () => {
    setShowStaffSchedule(false);
    setStartDate(moment().format("YYYY-MM-DD"));
    setEndDate(moment().endOf("month").format("YYYY-MM-DD"));
  };

  useEffect(() => {
    getDateInBetween();
  }, [startDate, endDate]);

  return (
    <>
      <Modal
        show={showStaffSchedule}
        onHide={handleClose}
        dialogClassName="manage-staff-schedule-container"
      >
        <div className="modal-content-container">
          <Modal.Header>
            <Modal.Title>
              <div>Schedule Id: {staffScheduleId}</div>
              <div className="filter-container">
                <Form.Group controlId="formStartDate">
                  <Form.Label>FROM DATE</Form.Label>
                  <Form.Control
                    type="date"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                    }}
                  />
                </Form.Group>
                <Form.Group controlId="formEndDate">
                  <Form.Label>TO DATE</Form.Label>
                  <Form.Control
                    type="date"
                    value={endDate}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                    }}
                  />
                </Form.Group>
              </div>
            </Modal.Title>
          </Modal.Header>
          <div className="modal-body-container">
            <Modal.Body>
              <Table bordered>
                <thead>
                  <tr>
                    <th>Date\Slot</th>
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
                          return <td key={slot}></td>;
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Modal.Body>
          </div>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleClose}>
              Save Changes
            </Button>
          </Modal.Footer>
        </div>
      </Modal>
    </>
  );
};

export default ManageStaffSchedule;
