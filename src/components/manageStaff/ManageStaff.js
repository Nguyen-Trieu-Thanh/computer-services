import React, { useState } from "react";

//React-bootstrap
import {
  Button,
  OverlayTrigger,
  Pagination,
  Table,
  Tooltip,
} from "react-bootstrap";

//CSS
import "./ManageStaff.css";

//Data
import StaffData from "../../datas/StaffData";

//Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faPlus,
  faTrash,
  faCalendarCheck,
} from "@fortawesome/free-solid-svg-icons";
import StaffDetail from "../staffDetail/StaffDetail";
import ManageSchedule from "../manageSchedule/ManageSchedule";

const ManageStaff = () => {
  //Local state
  const [active, setActive] = useState(1);
  const [staffs, setStaffs] = useState(StaffData.slice(0, 10));
  const [showStaffDetail, setShowStaffDetail] = useState(false);
  const [staffDetail, setStaffDetail] = useState({
    number: 0,
    id: "",
    name: "",
  });

  const [showStaffSchedule, setShowStaffSchedule] = useState(false);
  const [staffScheduleId, setStaffScheduleId] = useState(0);

  //Pagination
  let items = [];
  for (let number = 1; number <= Math.ceil(StaffData.length / 10); number++) {
    items.push(
      <Pagination.Item
        onClick={() => {
          handlePaginationClick(number);
        }}
        key={number}
        active={number === active}
        activeLabel=""
      >
        {number}
      </Pagination.Item>
    );
  }

  //Tooltip
  // const renderTooltip = (props, text) => (
  //   <Tooltip id="button-tooltip" {...props}></Tooltip>
  // );

  const handlePaginationClick = (number) => {
    setActive(number);
    setStaffs(StaffData.slice(10 * (number - 1), 10 * number));
  };
  return (
    <>
      <div className="manage-staff-container">
        <div className="button-container">
          <Button>
            ADD <FontAwesomeIcon icon={faPlus} color="" />
          </Button>
        </div>
        <div className="table-container">
          <Table bordered hover size="sm">
            <thead>
              <tr>
                <th>NO.</th>
                <th>NAME</th>
                <th style={{ width: "200px" }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {staffs.map((staff, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{staff.name}</td>
                    <td>
                      <div className="action-button-container">
                        <Button
                          variant="primary"
                          onClick={() => {
                            setShowStaffDetail(true);
                            setStaffDetail({
                              number: index + 1,
                              id: staff.id,
                              name: staff.name,
                            });
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faPenToSquare}
                            color="#ffffff"
                          />
                        </Button>
                        <Button
                          variant="success"
                          onClick={() => {
                            setShowStaffSchedule(true);
                            setStaffScheduleId(staff.scheduleId);
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faCalendarCheck}
                            color="#ffffff"
                          />
                        </Button>
                        <Button variant="danger">
                          <FontAwesomeIcon icon={faTrash} color="#ffffff" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
        <div>
          <Pagination className="pagination-container">{items}</Pagination>
        </div>
      </div>
      <StaffDetail
        showStaffDetail={showStaffDetail}
        setShowStaffDetail={setShowStaffDetail}
        staffDetail={staffDetail}
      />
      <ManageSchedule
        showStaffSchedule={showStaffSchedule}
        setShowStaffSchedule={setShowStaffSchedule}
        staffScheduleId={staffScheduleId}
      />
    </>
  );
};

export default ManageStaff;
