import React, { useEffect, useState } from "react";

//Redux

//API Actions
import { useGetAccessoriesQuery } from "../../redux/slices/accessory/accessoryApiSlice";

//React-bootstrap
import {
  Button,
  Col,
  Form,
  Modal,
  Row,
  Spinner,
  Table,
  Pagination,
  InputGroup,
} from "react-bootstrap";

//React-redux

//momentjs
import moment from "moment";

import CustomPagination from "../customPagination/CustomPagination";

//CSS
import "./AddAccessoryToService.css";

const AddAccessoryToService = ({
  showAddAccessoryToService,
  setShowAddAccessoryToService,
  serviceDetail,
  setServiceDetail,
  addAccessories,
  setAddAccessories,
}) => {
  const {
    data: accessoriesData = [],
    refetch,
    isFetching,
  } = useGetAccessoriesQuery();

  //Local state
  const [accessories, setAccessories] = useState([]);
  const [active, setActive] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("desc");

  const [showConfirmClose, setShowConfirmClose] = useState(false);

  //Pagination
  let items = [];
  for (
    let number = 1;
    number <= Math.ceil(accessoriesData.length / 10);
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
  };

  const handleClose = () => {
    setAddAccessories([]);
    setShowConfirmClose(false);
    setShowAddAccessoryToService(false);
  };

  const handleConfirm = () => {
    setServiceDetail({
      ...serviceDetail,
      accessories_id: [...addAccessories],
    });
    setAddAccessories([]);
    setShowAddAccessoryToService(false);
  };

  const handleAccessoriesChange = (e) => {
    let newAccessories = [...addAccessories];
    let newAccessory = accessories.find((x) => x._id === e.target.value);

    newAccessory = {
      ...newAccessory,
      type: newAccessory.type,
      brandCom: serviceDetail.brand,
    };

    if (newAccessories.map((x) => x._id).includes(newAccessory._id)) {
      const index = newAccessories.map((x) => x._id).indexOf(newAccessory._id);
      newAccessories.splice(index, 1);
    } else {
      newAccessories.push(newAccessory);
    }

    setAddAccessories([...newAccessories]);
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
      if (sort === "asc") {
        setAccessories(accessoriesData.filter((x) => x.name.includes(search)));
      } else {
        setAccessories(
          accessoriesData.filter((x) => x.name.includes(search)).reverse()
        );
      }
    }
  }, [isFetching]);

  return (
    <>
      <Modal
        show={showAddAccessoryToService}
        onHide={() => {
          setShowConfirmClose(true);
        }}
        dialogClassName="add-accessory-to-service"
        centered
      >
        <Modal.Header>
          <Modal.Title>Thêm linh kiện vào dịch vụ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
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
          </Row>
          <Row className="mt-2">
            <Col className="table-container">
              {isFetching ? (
                <div className="loading">
                  <Spinner animation="border" />
                  <div className="loading-text">Đang tải dữ liệu...</div>
                </div>
              ) : (
                <Table bordered size="sm">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Tên linh kiện (nhấn vào để xem chi tiết)</th>
                      <th>Giá linh kiện (VNĐ)</th>
                      <th>Nhà cung cấp</th>
                      <th>Loại máy tính</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accessories
                      .slice(10 * (active - 1), 10 * active)
                      .map((accessory, index) => {
                        return (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td
                              className="td-accessory-name"
                              onClick={() => {
                                window.open(
                                  "/accessory-detail/" + accessory._id,
                                  "_blank"
                                );
                              }}
                            >
                              {accessory.name}
                            </td>
                            <td>{accessory.price}</td>
                            <td>{accessory.supplier_id?.name}</td>
                            <td>{accessory.type}</td>
                            <td>
                              <Form.Check
                                inline
                                value={accessory._id}
                                checked={addAccessories
                                  ?.map((x) => x._id)
                                  .includes(accessory._id)}
                                onChange={handleAccessoriesChange}
                              />
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
                count={Math.ceil(accessories.length / 10)}
                handlePaginationClick={handlePaginationClick}
                page={active}
              />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{ width: "100px" }}
            variant="secondary"
            onClick={() => {
              setShowConfirmClose(true);
            }}
          >
            Đóng
          </Button>
          <Button
            style={{ width: "100px" }}
            variant="primary"
            onClick={handleConfirm}
          >
            Xác nhận
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showConfirmClose}
        onHide={() => {
          setShowConfirmClose(false);
        }}
        centered
      >
        <Modal.Header>
          <Modal.Title>Xác nhận đóng</Modal.Title>
        </Modal.Header>
        <Modal.Body>Dữ liệu bạn nhập sẽ không được lưu</Modal.Body>
        <Modal.Footer>
          <Button
            style={{ width: "100px" }}
            variant="danger"
            onClick={() => {
              setShowConfirmClose(false);
            }}
          >
            Hủy
          </Button>
          <Button
            style={{ width: "100px" }}
            variant="primary"
            onClick={handleClose}
          >
            Xác nhận
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddAccessoryToService;
