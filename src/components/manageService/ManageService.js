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
  OverlayTrigger,
  Pagination,
  Row,
  Spinner,
  Table,
  Tooltip,
} from "react-bootstrap";

//Components
import CreateService from "../createService/CreateService";
import ServiceDetail from "../serviceDetail/ServiceDetail";
import ConfirmCreateService from "../confirmCreateService/ConfirmCreateService";

//Icons
import { faPenToSquare, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//momentjs
import moment from "moment";

//CSS
import "./ManageService.css";
import CustomPagination from "../customPagination/CustomPagination";

const ManageService = () => {
  const {
    data: servicesData = [],
    refetch,
    isFetching,
  } = useGetServicesQuery();

  //Local state
  const [active, setActive] = useState(1);
  const [services, setServices] = useState([]);
  const [service, setService] = useState({
    name: "",
    description: "",
    price: "",
    type: "Thay thế",
    accessories_id: [],
    hasAccessory: false,
  });

  const [showCreateService, setShowCreateService] = useState(false);
  const [showConfirmCreateService, setShowConfirmCreateService] =
    useState(false);
  const [serviceDetail, setServiceDetail] = useState({
    name: "",
    description: "",
    price: "",
    type: "Thay thế",
    accessories_id: [],
    hasAccessory: false,
  });
  const [initServiceDetail, setInitServiceDetail] = useState({
    name: "",
    description: "",
    price: "",
    type: "Thay thế",
    accessories_id: [],
    hasAccessory: false,
  });
  const [showServiceDetail, setShowServiceDetail] = useState(false);
  const [isRefetch, setIsRefetch] = useState(false);

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
    setServices(servicesData.slice(10 * (number - 1), 10 * number));
  };

  useEffect(() => {
    if (isRefetch) {
      refetch();
      setIsRefetch(false);
    }
  }, [isRefetch]);

  useEffect(() => {
    if (!isFetching) {
      setServices(servicesData.slice(10 * (active - 1), 10 * active));
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
            <Col className="button-container">
              <Button
                variant="primary"
                onClick={() => {
                  setShowCreateService(true);
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
                  {services.map((service, index) => {
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
                                setShowServiceDetail(true);
                                setServiceDetail({ ...service });
                                setInitServiceDetail({ ...service });
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
            count={Math.ceil(servicesData.length / 10)}
            handlePaginationClick={handlePaginationClick}
            page={active}
          />
        </Card>
      </div>
      <ServiceDetail
        showServiceDetail={showServiceDetail}
        setShowServiceDetail={setShowServiceDetail}
        serviceDetail={serviceDetail}
        setServiceDetail={setServiceDetail}
        initServiceDetail={initServiceDetail}
      />
      <CreateService
        showCreateService={showCreateService}
        setShowCreateService={setShowCreateService}
        service={service}
        setService={setService}
        setShowConfirmCreateService={setShowConfirmCreateService}
        services={services}
      />
      <ConfirmCreateService
        setShowCreateService={setShowCreateService}
        service={service}
        setIsRefetch={setIsRefetch}
        setShowConfirmCreateService={setShowConfirmCreateService}
        showConfirmCreateService={showConfirmCreateService}
      />
    </>
  );
};

export default ManageService;
