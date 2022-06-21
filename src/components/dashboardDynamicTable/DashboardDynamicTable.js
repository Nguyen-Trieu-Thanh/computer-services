import React, { useState } from "react";

//React-bootstrap
import { Pagination, Table } from "react-bootstrap";

//CSS
import "./DashboardDynamicTable.css";

//Data
import BookingData from "../../datas/BookingData";
import OrderData from "../../datas/OrderData";
import StaffData from "../../datas/StaffData";

//Enum
import dashboardDynamicTableEnum from "../../enums/dashboardDynamicTableEnum";
import { useEffect } from "react";

const DashboardDynamicTable = ({ tableType }) => {
  //Local state
  const [active, setActive] = useState(1);
  const [datas, setDatas] = useState(BookingData.slice(0, 10));

  useEffect(() => {
    setActive(1);
    if (tableType === dashboardDynamicTableEnum.BOOKING) {
      setDatas(BookingData.slice(0, 10));
    }

    if (tableType === dashboardDynamicTableEnum.ORDER) {
      setDatas(OrderData.slice(0, 10));
    }

    if (tableType === dashboardDynamicTableEnum.STAFF) {
      setDatas(StaffData.slice(0, 10));
    }
  }, [tableType]);

  //Pagination
  const datasLength = () => {
    if (tableType === dashboardDynamicTableEnum.BOOKING) {
      return BookingData.length;
    }

    if (tableType === dashboardDynamicTableEnum.ORDER) {
      return BookingData.length;
    }

    if (tableType === dashboardDynamicTableEnum.STAFF) {
      return BookingData.length;
    }

    return 0;
  };

  let items = [];
  for (let number = 1; number <= Math.ceil(datasLength() / 10); number++) {
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
    if (tableType === dashboardDynamicTableEnum.BOOKING) {
      setDatas(BookingData.slice(10 * (number - 1), 10 * number));
    }

    if (tableType === dashboardDynamicTableEnum.ORDER) {
      setDatas(OrderData.slice(10 * (number - 1), 10 * number));
    }

    if (tableType === dashboardDynamicTableEnum.STAFF) {
      setDatas(StaffData.slice(10 * (number - 1), 10 * number));
    }
  };

  return (
    <>
      <div className="dashboard-dynamic-table-container">
        <div className="table-container">
          <Table bordered size="sm">
            <thead>
              <tr>
                <th>NO.</th>
                {tableType === dashboardDynamicTableEnum.ORDER ? (
                  <th>BOOKING ID</th>
                ) : (
                  ""
                )}
                {tableType === dashboardDynamicTableEnum.ORDER ? (
                  <th>STAFF ID</th>
                ) : (
                  ""
                )}
                <th>NAME</th>
              </tr>
            </thead>
            <tbody>
              {datas.map((data, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    {tableType === dashboardDynamicTableEnum.ORDER ? (
                      <td>{data.bookingId}</td>
                    ) : (
                      ""
                    )}
                    {tableType === dashboardDynamicTableEnum.ORDER ? (
                      <td>{data.staffId}</td>
                    ) : (
                      ""
                    )}
                    <td>{data.name}</td>
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
    </>
  );
};

export default DashboardDynamicTable;
