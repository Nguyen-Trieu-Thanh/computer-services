import React, { useEffect, useState } from "react";

//Redux
//Actions

//API Actions
import { useGetServicesQuery } from "../../redux/slices/service/serviceApiSlice";

//React-redux

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

//Components
import ServiceDetail from "../serviceDetail/ServiceDetail";

//Icons
import { faPenToSquare, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//momentjs
import moment from "moment";

//CSS
import { useNavigate } from "react-router-dom";
import CustomPagination from "../customPagination/CustomPagination";
import "./ManageService.css";

const ManageService = () => {
  const {
    data: servicesData = [],
    refetch,
    isFetching,
  } = useGetServicesQuery();

  //Local state
  const [active, setActive] = useState(1);
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("desc");

  const navigate = useNavigate();

  //Pagination
  let items = [];
  for (
    let number = 1;
    number <= Math.ceil(servicesData.length / 10);
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
    refetch();

    setActive(number);
    // setServices(servicesData.slice(10 * (number - 1), 10 * number));
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

  // useEffect(() => {
  //   if (isRefetch) {
  //     refetch();
  //     setIsRefetch(false);
  //   }
  // }, [isRefetch]);

  useEffect(() => {
    if (!isFetching) {
      // setServices(servicesData.slice(10 * (active - 1), 10 * active));
      if (sort === "asc") {
        setServices(servicesData.filter((x) => x.name.includes(search)));
      } else {
        setServices(
          servicesData.filter((x) => x.name.includes(search)).reverse()
        );
      }
    }
  }, [isFetching]);

  return (
    <>
      <div className="manage-service-container">
        <Card body className="filter-container">
          <Row>
            <Col>
              <h4>Danh sách dịch vụ</h4>
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
            <Col xs={2} className="button-container">
              <Button
                variant="primary"
                onClick={() => {
                  navigate("/create-service");
                }}
              >
                Tạo dịch vụ <FontAwesomeIcon icon={faPlus} color="" />
              </Button>
            </Col>
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
                    <th>Tên dịch vụ</th>
                    <th>Giá dịch vụ</th>
                    <th>Ngày tạo (MM/DD/YYYY)</th>
                    <th style={{ width: "200px" }}>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {services
                    .slice(10 * (active - 1), 10 * active)
                    .map((service, index) => {
                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{service.name}</td>
                          <td>{service.price}</td>
                          <td>
                            {moment(service.createdAt).format("MM/DD/YYYY")}
                          </td>
                          <td>
                            <OverlayTrigger
                              placement="bottom"
                              delay={{ show: 200, hide: 100 }}
                              overlay={
                                <Tooltip
                                  className="service-edit-button"
                                  id="edit-button-tooltip"
                                >
                                  CHI TIẾT
                                </Tooltip>
                              }
                            >
                              <Button
                                variant="primary"
                                onClick={() => {
                                  navigate("/service-detail/" + service._id);
                                }}
                              >
                                <FontAwesomeIcon
                                  icon={faPenToSquare}
                                  color="#ffffff"
                                />
                              </Button>
                            </OverlayTrigger>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </Table>
            </div>
          )}
          <CustomPagination
            count={Math.ceil(services.length / 10)}
            handlePaginationClick={handlePaginationClick}
            page={active}
          />
        </Card>
      </div>
      {/* <ServiceDetail
        showServiceDetail={showServiceDetail}
        setShowServiceDetail={setShowServiceDetail}
        serviceDetail={serviceDetail}
        setServiceDetail={setServiceDetail}
        initServiceDetail={initServiceDetail}
      /> */}
      {/* <CreateService
        showCreateService={showCreateService}
        setShowCreateService={setShowCreateService}
        service={service}
        setService={setService}
        setShowConfirmCreateService={setShowConfirmCreateService}
        services={services}
      /> */}
    </>
  );
};

export default ManageService;
