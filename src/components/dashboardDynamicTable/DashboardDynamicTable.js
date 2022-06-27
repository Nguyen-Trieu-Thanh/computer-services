import React, { useState } from "react";

//Redux
//Actions
import { getBookings } from "../../redux/slices/bookingSlice";

//React-redux
import { useDispatch, useSelector } from "react-redux";

//React-bootstrap
import { Pagination, Table, Spinner } from "react-bootstrap";

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
  const dispatch = useDispatch();
  let datas = useSelector((state) => state.booking.data);
  const loading = useSelector((state) => state.minorState.loading);

  //Local state
  const [active, setActive] = useState(1);
  // const [datas, setDatas] = useState(bookings);

  useEffect(() => {
    setActive(1);
    if (tableType === dashboardDynamicTableEnum.BOOKING) {
      dispatch(getBookings());
      // setDatas(bookings);
    }

    if (tableType === dashboardDynamicTableEnum.ORDER) {
      // setDatas(OrderData.slice(0, 10));
    }

    if (tableType === dashboardDynamicTableEnum.STAFF) {
      // setDatas(StaffData.slice(0, 10));
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
      // setDatas(BookingData.slice(10 * (number - 1), 10 * number));
    }

    if (tableType === dashboardDynamicTableEnum.ORDER) {
      // setDatas(OrderData.slice(10 * (number - 1), 10 * number));
    }

    if (tableType === dashboardDynamicTableEnum.STAFF) {
      // setDatas(StaffData.slice(10 * (number - 1), 10 * number));
    }
  };

  if (loading) {
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
      <div className="dashboard-dynamic-table-container">
        <div className="table-container">
          <Table bordered size="sm">
            <thead>
              <tr>
                <th>#</th>
                {tableType === dashboardDynamicTableEnum.BOOKING ? (
                  <th>TÊN KHÁCH HÀNG</th>
                ) : (
                  ""
                )}
                {tableType === dashboardDynamicTableEnum.BOOKING ? (
                  <th>SỐ ĐIỆN THOẠI</th>
                ) : (
                  ""
                )}
                {tableType === dashboardDynamicTableEnum.BOOKING ? (
                  <th>LOẠI LỊCH HẸN</th>
                ) : (
                  ""
                )}
                {tableType === dashboardDynamicTableEnum.BOOKING ? (
                  <th>TRẠNG THÁI</th>
                ) : (
                  ""
                )}

                {tableType === dashboardDynamicTableEnum.ORDER ? (
                  <th>MÃ ĐƠN HÀNG</th>
                ) : (
                  ""
                )}
                {tableType === dashboardDynamicTableEnum.ORDER ? (
                  <th>TÊN KHÁCH HÀNG</th>
                ) : (
                  ""
                )}
                {tableType === dashboardDynamicTableEnum.ORDER ? (
                  <th>SÓ ĐIỆN THOẠI</th>
                ) : (
                  ""
                )}
              </tr>
            </thead>
            <tbody>
              {datas.map((data, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    {tableType === dashboardDynamicTableEnum.BOOKING ? (
                      <td>{data.cus_name}</td>
                    ) : (
                      ""
                    )}
                    {tableType === dashboardDynamicTableEnum.BOOKING ? (
                      <td>{data.phonenum}</td>
                    ) : (
                      ""
                    )}
                    {tableType === dashboardDynamicTableEnum.BOOKING ? (
                      <td>{data.type}</td>
                    ) : (
                      ""
                    )}
                    {tableType === dashboardDynamicTableEnum.BOOKING ? (
                      <td>{data.status}</td>
                    ) : (
                      ""
                    )}

                    {tableType === dashboardDynamicTableEnum.ORDER ? (
                      <td>{data.code}</td>
                    ) : (
                      ""
                    )}
                    {tableType === dashboardDynamicTableEnum.ORDER ? (
                      <td>{data.customerName}</td>
                    ) : (
                      ""
                    )}
                    {tableType === dashboardDynamicTableEnum.ORDER ? (
                      <td>{data.phoneNumber}</td>
                    ) : (
                      ""
                    )}
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
