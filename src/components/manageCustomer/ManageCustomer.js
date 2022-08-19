import React, { useEffect, useState } from "react";

//Redux
//Actions
import { selectCurrentRole } from "../../redux/slices/auth/authSlice";

//API Actions
import { useGetCustomersDetailQuery } from "../../redux/slices/account/accountApiSlice";

//React-bootstrap
import {
  Button,
  Card,
  Col,
  Form,
  InputGroup,
  OverlayTrigger,
  Pagination,
  Row,
  Spinner,
  Table,
  Tooltip,
} from "react-bootstrap";

//Icons
import { faPenToSquare, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//Components
import CreateCustomer from "../createCustomer/CreateCustomer";
import CustomerDetail from "../customerDetail/CustomerDetail";
import CustomPagination from "../customPagination/CustomPagination";

//CSS
import "./ManageCustomer.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ManageCustomer = () => {
  const {
    data: customersData = [],
    refetch,
    isFetching,
  } = useGetCustomersDetailQuery();

  //Global state
  const role = useSelector(selectCurrentRole);

  //Local state
  const [active, setActive] = useState(1);
  const [customers, setCustomers] = useState([]);
  const [showCreateCustomer, setShowCreateCustomer] = useState(false);
  const [showCustomerDetail, setShowCustomerDetail] = useState(false);
  const [customerDetail, setCustomerDetail] = useState({
    _id: "",
    username: "",
    role: "",
    bookings: [],
  });
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("desc");

  const navigate = useNavigate();

  const handlePaginationClick = (number) => {
    refetch();

    setActive(number);
    // setCustomers(
    //   customersData
    //     .filter((x) => x.user_id?.name.includes(search))
    //     .slice(10 * (number - 1), 10 * number)
    // );
  };

  const handleSearch = () => {
    setActive(1);
    refetch();
  };

  const handleSort = (e) => {
    setSort(e.target.value);
    setActive(1);
    refetch();
  };

  useEffect(() => {
    if (!isFetching) {
      // setCustomers(customersData.slice(0, 10));
      if (sort === "asc") {
        setCustomers(
          customersData.filter((x) => x.user_id?.name.includes(search))
        );
      } else {
        setCustomers(
          customersData
            .filter((x) => x.user_id?.name.includes(search))
            .reverse()
        );
      }
    }
  }, [isFetching]);

  return (
    <>
      <div className="manage-customer-container">
        <Card body className="filter-container">
          <Row>
            <Col>
              <h4>Danh sách khách hàng</h4>
            </Col>
          </Row>
          <Row className="mt-2">
            <Col>
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text>Tìm kiếm theo tên:</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control
                  type="text"
                  name="search"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                />
                <InputGroup.Append>
                  <Button
                    disabled={isFetching}
                    variant="primary"
                    onClick={handleSearch}
                    className="search-button"
                  >
                    Tìm kiếm
                  </Button>
                </InputGroup.Append>
              </InputGroup>
            </Col>
            <Col>
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text>Thứ tự:</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control
                  as="select"
                  name="sort"
                  value={sort}
                  onChange={handleSort}
                >
                  <option value="asc">Cũ đến mới</option>
                  <option value="desc">Mới đến cũ</option>
                </Form.Control>
              </InputGroup>
            </Col>
            {role === "manager" && (
              <Col xs={2} className="button-container">
                <Button
                  variant="primary"
                  onClick={() => {
                    setShowCreateCustomer(true);
                  }}
                >
                  Thêm tài khoản <FontAwesomeIcon icon={faPlus} color="" />
                </Button>
              </Col>
            )}
          </Row>
        </Card>
        <Card body className="content-container">
          {isFetching ? (
            <div className="loading">
              <Spinner animation="border" />
              <div className="loading-text">Đang tải dữ liệu...</div>
            </div>
          ) : (
            <div className="table-container">
              <Table bordered hover size="sm">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Tên khách hàng</th>
                    <th>Số điện thoại</th>
                    <th>Vai trò</th>
                    <th style={{ width: "200px" }}>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {customers
                    .slice(10 * (active - 1), 10 * active)
                    .map((customer, index) => {
                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{customer.user_id?.name}</td>
                          <td>{customer.user_id?.phonenum}</td>
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
                                    Chi tiết
                                  </Tooltip>
                                }
                              >
                                <Button
                                  variant="primary"
                                  onClick={() => {
                                    // setShowCustomerDetail(true);
                                    // setCustomerDetail({
                                    //   _id: customer._id,
                                    //   username: customer.username,
                                    //   role: customer.role,
                                    //   bookings: [...customer.booking],
                                    // });
                                    navigate(
                                      "/customer-detail/" + customer._id
                                    );
                                  }}
                                >
                                  <FontAwesomeIcon
                                    icon={faPenToSquare}
                                    color="#ffffff"
                                  />
                                </Button>
                              </OverlayTrigger>
                              {/* <OverlayTrigger
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
                                <FontAwesomeIcon
                                  icon={faTrash}
                                  color="#ffffff"
                                />
                              </Button>
                            </OverlayTrigger> */}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </Table>
            </div>
          )}
          <CustomPagination
            count={Math.ceil(customers.length / 10)}
            handlePaginationClick={handlePaginationClick}
            page={active}
          />
        </Card>
      </div>
      {/* <CustomerDetail
        showCustomerDetail={showCustomerDetail}
        setShowCustomerDetail={setShowCustomerDetail}
        customerDetail={customerDetail}
      /> */}
      <CreateCustomer
        showCreateCustomer={showCreateCustomer}
        setShowCreateCustomer={setShowCreateCustomer}
        refetch={refetch}
      />
    </>
  );
};

export default ManageCustomer;
