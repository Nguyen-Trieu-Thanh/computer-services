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
  Container,
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
import {
  faPenToSquare,
  faPlus,
  faArrowRotateRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//Components
import CreateCustomer from "../createCustomer/CreateCustomer";
import CustomerDetail from "../customerDetail/CustomerDetail";
import CustomPagination from "../customPagination/CustomPagination";

//Momentjs
import moment from "moment";

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
      <Container fluid className="manage-customer-container">
        <Card body className="content-container">
          <Row>
            <Col>
              <Card.Title>Danh sách khách hàng</Card.Title>
            </Col>
          </Row>
          <Row className="d-flex align-items-end justify-content-between">
            <Col xs={6}>
              <Form.Label>Tìm kiếm theo tên:</Form.Label>
              <InputGroup>
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
              <Form.Label>Thứ tự:</Form.Label>
              <Form.Control
                as="select"
                name="sort"
                value={sort}
                onChange={handleSort}
              >
                <option value="asc">Cũ đến mới</option>
                <option value="desc">Mới đến cũ</option>
              </Form.Control>
            </Col>
            <Col xs={2}>
              <Button
                disabled={isFetching}
                style={{ width: "100%" }}
                variant="dark"
                onClick={() => {
                  refetch();
                }}
              >
                Tải lại dữ liệu{" "}
                <FontAwesomeIcon icon={faArrowRotateRight} color="" />
              </Button>
            </Col>
          </Row>

          {role === "manager" && (
            <Row className="d-flex justify-content-end mt-2">
              <Col xs={2}>
                <Button
                  style={{ width: "100%" }}
                  variant="primary"
                  onClick={() => {
                    setShowCreateCustomer(true);
                  }}
                >
                  Thêm tài khoản <FontAwesomeIcon icon={faPlus} color="" />
                </Button>
              </Col>
            </Row>
          )}
          <Row className="mt-2">
            <Col className="table-container">
              {isFetching ? (
                <div className="loading">
                  <Spinner animation="border" />
                  <div className="loading-text">Đang tải dữ liệu...</div>
                </div>
              ) : (
                <Table bordered hover size="sm">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Tên khách hàng</th>
                      <th>Số điện thoại</th>
                      <th>Email</th>
                      <th>Ngày tạo</th>
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
                            <td>{customer.user_id?.email}</td>
                            <td>
                              {moment(customer.createdAt).format("MM/DD/YYYY")}
                            </td>
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
                                      Xem chi tiết
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
              )}
            </Col>
          </Row>
          <Row className="mt-2">
            <Col>
              <CustomPagination
                count={Math.ceil(customers.length / 10)}
                handlePaginationClick={handlePaginationClick}
                page={active}
              />
            </Col>
          </Row>
        </Card>
      </Container>
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
