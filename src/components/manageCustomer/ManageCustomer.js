import React, { useEffect, useState } from "react";

//Redux
//Actions

//API Actions
import { useGetCustomersDetailQuery } from "../../redux/slices/account/accountApiSlice";

//React-redux
import {} from "react-redux";

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
  faPenToSquare,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//Components
import CustomerDetail from "../customerDetail/CustomerDetail";
import CreateCustomer from "../createCustomer/CreateCustomer";

//CSS
import "./ManageCustomer.css";

const ManageCustomer = () => {
  const {
    data: customersData = [],
    refetch,
    isFetching,
  } = useGetCustomersDetailQuery();

  //Local state
  const [active, setActive] = useState(1);
  const [customers, setCustomers] = useState([]);
  const [customer, setCustomer] = useState({
    username: "",
    password: "",
    role: "customer",
  });
  const [showCreateCustomer, setShowCreateCustomer] = useState(false);
  const [showConfirmCreateCustomer, setShowConfirmCreateCustomer] =
    useState(false);
  const [showCustomerDetail, setShowCustomerDetail] = useState(false);
  const [customerDetail, setCustomerDetail] = useState({
    _id: "",
    username: "",
    role: "",
    bookings: [],
  });
  const [isRefetch, setIsRefetch] = useState(false);

  //Pagination
  let items = [];
  for (
    let number = 1;
    number <= Math.ceil(customersData.length / 10);
    number++
  ) {
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
    setCustomers(customersData.slice(10 * (number - 1), 10 * number));
  };

  useEffect(() => {
    if (isRefetch) {
      refetch();
      setIsRefetch(false);
    }
  }, [isRefetch]);

  useEffect(() => {
    if (!isFetching) {
      setCustomers(customersData.slice(0, 10));
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
          <Button
            variant="primary"
            onClick={() => {
              setShowCreateCustomer(true);
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
                <th>USERNAME</th>
                <th>ROLE</th>
                <th style={{ width: "200px" }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{customer.username}</td>
                    <td>{customer.role}</td>
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
                              setShowCustomerDetail(true);
                              setCustomerDetail({
                                _id: customer._id,
                                username: customer.username,
                                role: customer.role,
                                bookings: [...customer.booking],
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
      <CustomerDetail
        showCustomerDetail={showCustomerDetail}
        setShowCustomerDetail={setShowCustomerDetail}
        customerDetail={customerDetail}
      />
      <CreateCustomer
        showCreateCustomer={showCreateCustomer}
        setShowCreateCustomer={setShowCreateCustomer}
        customer={customer}
        setCustomer={setCustomer}
        setShowConfirmCreateCustomer={setShowConfirmCreateCustomer}
        setIsRefetch={setIsRefetch}
      />
    </>
  );
};

export default ManageCustomer;
