import React, { useEffect, useState } from "react";

//Redux
//Actions

//API Actions
import { useGetStaffsDetailQuery } from "../../redux/slices/account/accountApiSlice";

//React-redux
import {} from "react-redux";

//React-router-dom
import { useNavigate } from "react-router-dom";

//React-bootstrap
import {
  Button,
  OverlayTrigger,
  Pagination,
  Spinner,
  Table,
  Tooltip,
} from "react-bootstrap";

//Icons
import {
  faCalendarCheck,
  faPenToSquare,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//Components
import ManageStaffSchedule from "../manageStaffSchedule/ManageStaffSchedule";
import CreateStaff from "../createStaff/CreateStaff";

//CSS
import "./ManageStaff.css";

const ManageStaff = () => {
  const {
    data: staffsData = [],
    refetch,
    isFetching,
  } = useGetStaffsDetailQuery();

  //Local state
  const [active, setActive] = useState(1);
  const [staffs, setStaffs] = useState([]);
  const [showStaffSchedule, setShowStaffSchedule] = useState(false);
  const [staffScheduleId, setStaffScheduleId] = useState(0);
  const [showCreateStaff, setShowCreateStaff] = useState(false);

  //Utilities
  const navigate = useNavigate();

  //Pagination
  let items = [];
  for (let number = 1; number <= Math.ceil(staffsData.length / 10); number++) {
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

  const handlePaginationClick = (number) => {
    setActive(number);
    setStaffs(staffsData.slice(10 * (number - 1), 10 * number));
  };

  useEffect(() => {
    if (!isFetching) {
      setStaffs(staffsData.slice(0, 10));
    }
  }, [isFetching]);

  if (isFetching) {
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
      <div className="manage-staff-container">
        <div className="button-container">
          <Button
            onClick={() => {
              setShowCreateStaff(true);
            }}
          >
            Thêm tài khoản <FontAwesomeIcon icon={faPlus} color="" />
          </Button>
        </div>
        <div className="table-container">
          <Table bordered hover size="sm">
            <thead>
              <tr>
                <th>#</th>
                <th>Tên nhân viên</th>
                <th>Số điện thoại</th>
                <th>Vai trò</th>
                <th style={{ width: "200px" }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {staffs.map((staff, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{staff.user_id?.name}</td>
                    <td>{staff.user_id?.phonenum}</td>
                    <td>{staff.role}</td>
                    <td>
                      <div className="action-button-container">
                        <OverlayTrigger
                          placement="bottom"
                          delay={{ show: 200, hide: 100 }}
                          overlay={
                            <Tooltip
                              className="staff-edit-button"
                              id="edit-button-tooltip"
                            >
                              EDIT
                            </Tooltip>
                          }
                        >
                          <Button
                            variant="primary"
                            onClick={() => {
                              navigate("/staff-detail/" + staff._id);
                            }}
                          >
                            <FontAwesomeIcon
                              icon={faPenToSquare}
                              color="#ffffff"
                            />
                          </Button>
                        </OverlayTrigger>
                        <OverlayTrigger
                          placement="bottom"
                          delay={{ show: 200, hide: 100 }}
                          overlay={
                            <Tooltip
                              className="staff-schedule-button"
                              id="schedule-button-tooltip"
                            >
                              SCHEDULE
                            </Tooltip>
                          }
                        >
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
                        </OverlayTrigger>
                        <OverlayTrigger
                          placement="bottom"
                          delay={{ show: 200, hide: 100 }}
                          overlay={
                            <Tooltip
                              className="staff-delete-button"
                              id="delete-button-tooltip"
                            >
                              DELETE
                            </Tooltip>
                          }
                        >
                          <Button variant="danger">
                            <FontAwesomeIcon icon={faTrash} color="#ffffff" />
                          </Button>
                        </OverlayTrigger>
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
      <CreateStaff
        showCreateStaff={showCreateStaff}
        setShowCreateStaff={setShowCreateStaff}
        refetch={refetch}
      />
      <ManageStaffSchedule
        showStaffSchedule={showStaffSchedule}
        setShowStaffSchedule={setShowStaffSchedule}
        staffScheduleId={staffScheduleId}
      />
    </>
  );
};

export default ManageStaff;
