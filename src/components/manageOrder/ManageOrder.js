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
    id: "",
    code: 0,
    bookingCode: "",
    customerName: "",
    phoneNumber: "",
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
                <th>#</th>
                <th>MÃ ĐƠN HÀNG</th>
                <th>TÊN KHÁCH HÀNG</th>
                <th>SỐ ĐIỆN THOẠI</th>
                <th style={{ width: "200px" }}>HÀNH ĐỘNG</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{order.code}</td>
                    <td>{order.customerName}</td>
                    <td>{order.phoneNumber}</td>
                    <td>
                      <div className="action-button-container">
                        <OverlayTrigger
                          placement="bottom"
                          delay={{ show: 200, hide: 100 }}
                          overlay={
                            <Tooltip
                              className="order-edit-button"
                              id="edit-button-tooltip"
                            >
                              EDIT
                            </Tooltip>
                          }
                        >
                          <Button
                            variant="primary"
                            onClick={() => {
                              setShowOrderDetail(true);
                              setOrderDetail({
                                id: order.id,
                                code: order.code,
                                bookingCode: order.bookingCode,
                                customerName: order.customerName,
                                phoneNumber: order.phoneNumber,
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
                              className="order-delete-button"
                              id="edit-button-tooltip"
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
      <OrderDetail
        showOrderDetail={showOrderDetail}
        setShowOrderDetail={setShowOrderDetail}
        orderDetail={orderDetail}
      />
    </>
  );
};

export default ManageOrder;
