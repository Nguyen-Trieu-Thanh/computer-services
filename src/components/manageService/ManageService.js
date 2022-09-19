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

//Components
import ServiceDetail from "../serviceDetail/ServiceDetail";

//Icons
import {
  faPenToSquare,
  faPlus,
  faArrowRotateRight,
} from "@fortawesome/free-solid-svg-icons";
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
      <Container fluid className="manage-service-container">
        <Card body className="content-container">
          <Row>
            <Col>
              <Card.Title>Danh sách dịch vụ</Card.Title>
            </Col>
          </Row>
          <Row className="d-flex align-items-end">
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
          <Row className="d-flex justify-content-end mt-2">
            <Col xs={2}>
              <Button
                style={{ width: "100%" }}
                variant="primary"
                onClick={() => {
                  navigate("/create-service");
                }}
              >
                Tạo dịch vụ <FontAwesomeIcon icon={faPlus} color="" />
              </Button>
            </Col>
          </Row>
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
                      <th>Tên dịch vụ</th>
                      <th>Loại dịch vụ</th>
                      <th>Giá dịch vụ (VNĐ)</th>
                      <th>Trạng thái</th>
                      <th>Thời gian tạo</th>
                      <th>Cập nhật lúc</th>
                      <th>Hành động</th>
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
                            <td>{service.type}</td>
                            <td>
                              {new Intl.NumberFormat("de-DE").format(
                                service.price
                              )}
                            </td>
                            {service.deleted ? (
                              <td style={{ color: "red", fontWeight: "600" }}>
                                Ngưng hoạt động
                              </td>
                            ) : (
                              <td style={{ color: "green", fontWeight: "600" }}>
                                Hoạt động
                              </td>
                            )}
                            <td>
                              {moment(service.createdAt).format(
                                "HH:mm MM/DD/YYYY"
                              )}
                            </td>
                            <td>
                              {moment(service.updatedAt).format(
                                "HH:mm MM/DD/YYYY"
                              )}
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
                                    Xem chi tiết
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
              )}
            </Col>
          </Row>
          <Row className="mt-2">
            <Col>
              <CustomPagination
                count={Math.ceil(services.length / 10)}
                handlePaginationClick={handlePaginationClick}
                page={active}
              />
            </Col>
          </Row>
        </Card>
      </Container>
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
