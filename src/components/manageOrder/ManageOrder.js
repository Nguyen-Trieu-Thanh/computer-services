import React, { useState } from "react";

//React-bootstrap
import { Button, Pagination, Table } from "react-bootstrap";

//CSS
import "./ManageOrder.css";

//Data
import OrderData from "../../datas/OrderData";
import OrderDetail from "../orderDetail/OrderDetail";

//Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

const ManageOrder = () => {
  //Local state
  const [active, setActive] = useState(1);
  const [orders, setOrders] = useState(OrderData.slice(0, 10));
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [orderDetail, setOrderDetail] = useState({
    number: 0,
    id: "",
    bookingId: "",
    staffId: "",
    name: "",
  });

  //Pagination
  let items = [];
  for (let number = 1; number <= Math.ceil(OrderData.length / 10); number++) {
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
    setOrders(OrderData.slice(10 * (number - 1), 10 * number));
  };

  return (
    <>
      <div className="manage-order-container">
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
                <th>BOOKING ID</th>
                <th>STAFF ID</th>
                <th>NAME</th>
                <th style={{ width: "200px" }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{order.bookingId}</td>
                    <td>{order.staffId}</td>
                    <td>{order.name}</td>
                    <td>
                      <div className="action-button-container">
                        <Button
                          variant="primary"
                          onClick={() => {
                            setShowOrderDetail(true);
                            setOrderDetail({
                              number: index + 1,
                              id: order.id,
                              bookingId: order.bookingId,
                              staffId: order.staffId,
                              name: order.name,
                            });
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faPenToSquare}
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
      <OrderDetail
        showOrderDetail={showOrderDetail}
        setShowOrderDetail={setShowOrderDetail}
        orderDetail={orderDetail}
      />
    </>
  );
};

export default ManageOrder;
