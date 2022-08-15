import React, { useState, useEffect } from "react";

//Redux
//Actions

//API Actions
import { useGetAccountsQuery } from "../../redux/slices/account/accountApiSlice";

//React-redux
import { useDispatch, useSelector } from "react-redux";

//CSS
import "./DashboardManageStaff.css";

//React-bootstrap
import { Pagination, Table, Spinner } from "react-bootstrap";

const DashboardManageStaff = () => {
  const { data: staffsData = [], refetch, isFetching } = useGetAccountsQuery();

  //Local state
  const [active, setActive] = useState(1);
  const [staffs, setStaffs] = useState([]);

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
    <div className="dashboard-manage-booking-table-container">
      <div className="table-container">
        <Table bordered size="sm">
          <thead>
            <tr>
              <th>#</th>
              <th>USERNAME</th>
              <th>ROLE</th>
            </tr>
          </thead>
          <tbody>
            {staffs.map((staff, index) => {
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{staff.username}</td>
                  <td>{staff.role}</td>
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
  );
};

export default DashboardManageStaff;
