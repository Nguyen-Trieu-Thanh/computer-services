import React, { useEffect, useState } from "react";

//Redux
//Actions

//API Actions
import { useGetAccessoriesQuery } from "../../redux/slices/accessory/accessoryApiSlice";

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

//CSS
import "./ManageAccessory.css";

//Components
import ConfirmCreateAccessory from "../confirmCreateAccessory/ConfirmCreateAccessory";
import CreateAccessory from "../createAccessory/CreateAccessory";

//Icons
import { faPenToSquare, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//momentjs
import moment from "moment";
import CustomPagination from "../customPagination/CustomPagination";

const ManageAccessory = () => {
  const {
    data: accessoriesData = [],
    refetch,
    isFetching,
  } = useGetAccessoriesQuery();

  //Local state
  const [active, setActive] = useState(1);
  const [accessories, setAccessories] = useState([]);
  const [accessory, setAccessory] = useState({
    name: "",
    price: "",
    description: "",
    insurance: "",
    supplier_id: "Intel",
  });
  const [showCreateAccessory, setShowCreateAccessory] = useState(false);
  const [showConfirmCreateAccessory, setShowConfirmCreateAccessory] =
    useState(false);
  const [isRefetch, setIsRefetch] = useState(false);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("desc");

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
    // setAccessories(accessoriesData.slice(10 * (number - 1), 10 * number));
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
      // setAccessories(accessoriesData.slice(10 * (active - 1), 10 * active));
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
      <div className="manage-accessory-container">
        <Card body className="filter-container">
          <Row>
            <Col>
              <h4>Danh sách linh kiện</h4>
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
                  setShowCreateAccessory(true);
                }}
              >
                Tạo phụ kiện <FontAwesomeIcon icon={faPlus} color="" />
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
                    <th>Tên phụ kiện</th>
                    <th>Giá phụ kiện (VNĐ)</th>
                    <th>Thời hạn bảo hành</th>
                    <th>Nhà cung cấp</th>
                    <th>Ngày thêm mới (MM/DD/YYYY)</th>
                    <th style={{ width: "200px" }}>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {accessories
                    .slice(10 * (active - 1), 10 * active)
                    .map((accessory, index) => {
                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{accessory.name}</td>
                          <td>{accessory.price}</td>
                          <td>{accessory.insurance}</td>
                          <td>{accessory.supplier_id?.name}</td>
                          <td>
                            {moment(accessory.updatedAt).format("MM/DD/YYYY")}
                          </td>
                          <td>
                            <OverlayTrigger
                              placement="bottom"
                              delay={{ show: 200, hide: 100 }}
                              overlay={
                                <Tooltip
                                  className="accessory-edit-button"
                                  id="edit-button-tooltip"
                                >
                                  CHI TIẾT
                                </Tooltip>
                              }
                            >
                              <Button
                                variant="primary"
                                onClick={() => {
                                  // setShowAccessoryDetail(true);
                                  // setAccessoryDetail({ ...accessory });
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
            count={Math.ceil(accessories.length / 10)}
            handlePaginationClick={handlePaginationClick}
            page={active}
          />
        </Card>
      </div>
      <CreateAccessory
        showCreateAccessory={showCreateAccessory}
        setShowCreateAccessory={setShowCreateAccessory}
        accessory={accessory}
        setAccessory={setAccessory}
        setShowConfirmCreateAccessory={setShowConfirmCreateAccessory}
      />
      <ConfirmCreateAccessory
        setShowCreateAccessory={setShowCreateAccessory}
        accessory={accessory}
        setIsRefetch={setIsRefetch}
        setShowConfirmCreateAccessory={setShowConfirmCreateAccessory}
        showConfirmCreateAccessory={showConfirmCreateAccessory}
      />
    </>
  );
};

export default ManageAccessory;
