import React, { useEffect, useState } from "react";

//API Actions
import { useGetManagersDetailQuery } from "../../redux/slices/account/accountApiSlice";

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

//Icons
import { faPenToSquare, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//Components
import CustomPagination from "../customPagination/CustomPagination";
import CreateManager from "../createManager/CreateManager";

//CSS
import "./ManageManager.css";

const ManageManager = () => {
  const {
    data: managersData = [],
    refetch,
    isFetching,
  } = useGetManagersDetailQuery();

  //Local state
  const [active, setActive] = useState(1);
  const [managers, setManagers] = useState([]);
  const [showCreateManager, setShowCreateManager] = useState(false);
  const [showManagerDetail, setShowManagerDetail] = useState(false);
  const [managerDetail, setManagerDetail] = useState({
    _id: "",
    username: "",
    role: "",
  });

  //Pagination
  let items = [];
  for (
    let number = 1;
    number <= Math.ceil(managersData.length / 10);
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
    setManagers(managersData.slice(10 * (number - 1), 10 * number));
  };

  useEffect(() => {
    if (!isFetching) {
      setManagers(managersData.slice(10 * (active - 1), 10 * active));
    }
  }, [isFetching]);

  return (
    <>
      <div className="manage-manager-container">
        <Card body className="filter-container">
          <Row>
            <Col>
              <h4>Danh sách quản lí</h4>
            </Col>
          </Row>
          <Row className="mt-2">
            <Col className="button-container">
              <Button
                variant="primary"
                onClick={() => {
                  setShowCreateManager(true);
                }}
              >
                Thêm tài khoản <FontAwesomeIcon icon={faPlus} color="" />
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
                    <th>Tên quản lí</th>
                    <th>Số điện thoại</th>
                    <th>Vai trò</th>
                    <th style={{ width: "200px" }}>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {managers.map((manager, index) => {
                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{manager.user_id?.name}</td>
                        <td>{manager.user_id?.phonenum}</td>
                        <td>{manager.role}</td>
                        <td>
                          <div className="action-button-container">
                            <OverlayTrigger
                              placement="bottom"
                              delay={{ show: 200, hide: 100 }}
                              overlay={
                                <Tooltip
                                  className="manager-edit-button"
                                  id="edit-button-tooltip"
                                >
                                  Chi tiết
                                </Tooltip>
                              }
                            >
                              <Button
                                variant="primary"
                                onClick={() => {
                                  setShowManagerDetail(true);
                                  setManagerDetail({
                                    _id: manager._id,
                                    username: manager.username,
                                    role: manager.role,
                                  });
                                }}
                              >
                                <FontAwesomeIcon
                                  icon={faPenToSquare}
                                  color="#ffffff"
                                />
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
          )}
          <CustomPagination
            count={Math.ceil(managersData.length / 10)}
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
      <CreateManager
        showCreateManager={showCreateManager}
        setShowCreateManager={setShowCreateManager}
        refetch={refetch}
      />
    </>
  );
};

export default ManageManager;
