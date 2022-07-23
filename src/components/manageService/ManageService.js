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

//CSS
import "./ManageService.css";

//Components
import CreateService from "../createService/CreateService";
import ServiceDetail from "../serviceDetail/ServiceDetail";

//Icons
import { faPenToSquare, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//momentjs
import moment from "moment";

const ManageService = () => {
  const {
    data: servicesData = [],
    refetch,
    isFetching,
  } = useGetServicesQuery();

  //Local state
  const [services, setServices] = useState([]);
  const [service, setService] = useState({
    accessories_id: [],
    createdAt: "",
    description: "",
    name: "",
    price: 0,
  });
  const [serviceDetail, setServiceDetail] = useState({});
  const [showServiceDetail, setShowServiceDetail] = useState(false);
  const [showCreateService, setShowCreateService] = useState(false);
  const [showConfirmCreateService, setShowConfirmCreateService] =
    useState(false);
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
            TẠO DỊCH VỤ <FontAwesomeIcon icon={faPlus} color="" />
          </Button>
        </div>
        <div className="table-container">
          <Table bordered hover size="sm">
            <thead>
              <tr>
                <th>#</th>
                <th>TÊN DỊCH VỤ</th>
                <th>GIÁ DỊCH VỤ</th>
                <th>NGÀY TẠO (DD/MM/YYYY)</th>
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
                    <td>{moment(service.createdAt).format("DD/MM/YYYY")}</td>
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
      />
      <CreateService
        showCreateService={showCreateService}
        setShowCreateService={setShowCreateService}
        service={service}
        setService={setService}
        setShowConfirmCreateService={setShowConfirmCreateService}
      />
    </>
  );
};

export default ManageService;
