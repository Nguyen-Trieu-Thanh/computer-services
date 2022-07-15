import React, { useEffect, useState } from "react";

//Redux
//Actions

//API Actions
import { useGetAccountsQuery } from "../../redux/slices/account/accountApiSlice";

//React-redux
import {} from "react-redux";

//React-bootstrap
import {
  Button,
  OverlayTrigger,
  Pagination,
  Table,
  Spinner,
  Tooltip,
} from "react-bootstrap";

//CSS
import "./ManageCustomer.css";

//Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faPlus,
  faTrash,
  faCalendarCheck,
} from "@fortawesome/free-solid-svg-icons";

//Components
import StaffDetail from "../staffDetail/StaffDetail";
import ManageSchedule from "../manageSchedule/ManageSchedule";

const ManageCustomer = () => {
  const { data: staffsData = [], refetch, isFetching } = useGetAccountsQuery();

  //Local state
  const [active, setActive] = useState(1);
  const [staffs, setStaffs] = useState([]);
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
      <div className="manage-customer-container">
        <div className="button-container">
          <Button>
            ADD <FontAwesomeIcon icon={faPlus} color="" />
          </Button>
        </div>
        <div className="table-container">
          <Table bordered hover size="sm">
            <thead>
              <tr>
                <th>#</th>
                <th>USERNAME</th>
                <th>ROLE</th>
                <th style={{ width: "200px" }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {staffs.map((staff, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{staff.username}</td>
                    <td>{staff.role}</td>
                    <td>
                      <div className="action-button-container">
                        <OverlayTrigger
                          placement="bottom"
                          delay={{ show: 200, hide: 100 }}
                          overlay={
                            <Tooltip
                              className="customer-edit-button"
                              id="edit-button-tooltip"
                            >
                              EDIT
                            </Tooltip>
                          }
                        >
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
                        </OverlayTrigger>
                        <OverlayTrigger
                          placement="bottom"
                          delay={{ show: 200, hide: 100 }}
                          overlay={
                            <Tooltip
                              className="customer-schedule-button"
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
                              className="customer-delete-button"
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

export default ManageCustomer;
