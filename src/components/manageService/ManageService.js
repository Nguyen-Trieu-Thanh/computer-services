import React, { useEffect, useState } from "react";

//Redux
//Actions

//API Actions
import { useGetServicesQuery } from "../../redux/slices/service/serviceApiSlice";

//React-redux

//React-bootstrap
import {
  Button,
  OverlayTrigger,
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

const ManageService = () => {
  const {
    data: servicesData = [],
    refetch,
    isFetching,
  } = useGetServicesQuery();

  //Local state
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

  useEffect(() => {
    if (isRefetch) {
      refetch();
      setIsRefetch(false);
    }
  }, [isRefetch]);

  useEffect(() => {
    if (!isFetching) {
      setServices([...servicesData].reverse().slice(0, 10));
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
      <div className="manage-service-container">
        <div className="button-container">
          <Button
            variant="primary"
            onClick={() => {
              setShowCreateService(true);
            }}
          >
            Tạo dịch vụ <FontAwesomeIcon icon={faPlus} color="" />
          </Button>
        </div>
        <div className="table-container">
          <Table bordered hover size="sm">
            <thead>
              <tr>
                <th>#</th>
                <th>TÊN DỊCH VỤ</th>
                <th>GIÁ DỊCH VỤ</th>
                <th>NGÀY TẠO (MM/DD/YYYY)</th>
                <th style={{ width: "200px" }}>HÀNH ĐỘNG</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{service.name}</td>
                    <td>{service.price}</td>
                    <td>{moment(service.createdAt).format("MM/DD/YYYY")}</td>
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
