import React, { useEffect, useState } from "react";

//Redux
//Actions

//API Actions
import { useGetStaffsDetailQuery } from "../../redux/slices/account/accountApiSlice";

//React-redux
import {} from "react-redux";

//React-router-dom
import { useNavigate } from "react-router-dom";

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
  faCalendarCheck,
  faPenToSquare,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//Components
import ManageStaffSchedule from "../manageStaffSchedule/ManageStaffSchedule";
import CreateStaff from "../createStaff/CreateStaff";

//CSS
import "./ManageStaff.css";
import CustomPagination from "../customPagination/CustomPagination";

const ManageStaff = () => {
  const {
    data: staffsData = [],
    refetch,
    isFetching,
  } = useGetStaffsDetailQuery();

  //Local state
  const [active, setActive] = useState(1);
  const [staffs, setStaffs] = useState([]);
  const [showStaffSchedule, setShowStaffSchedule] = useState(false);
  const [staffScheduleId, setStaffScheduleId] = useState(0);
  const [showCreateStaff, setShowCreateStaff] = useState(false);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("desc");

  //Utilities
  const navigate = useNavigate();

  //Pagination
  let items = [];
  for (let number = 1; number <= Math.ceil(staffsData.length / 10); number++) {
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
    // setStaffs(staffsData.slice(10 * (number - 1), 10 * number));
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
      // setStaffs(staffsData.slice(0, 10));
      if (sort === "asc") {
        setStaffs(staffsData.filter((x) => x.user_id?.name.includes(search)));
      } else {
        setStaffs(
          staffsData.filter((x) => x.user_id?.name.includes(search)).reverse()
        );
      }
    }
  }, [isFetching]);

  return (
    <>
      <Container fluid className="manage-staff-container">
        <Card body className="content-container">
          <Row>
            <Col>
              <Card.Title>Danh sách nhân viên</Card.Title>
            </Col>
          </Row>
          <Row className="d-flex align-items-end">
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
            <Col xs={2} className="button-container">
              <Button
                onClick={() => {
                  setShowCreateStaff(true);
                }}
              >
                Thêm tài khoản <FontAwesomeIcon icon={faPlus} color="" />
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
                      <th>Tên nhân viên</th>
                      <th>Số điện thoại</th>
                      <th>Vai trò</th>
                      <th style={{ width: "200px" }}>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staffs
                      .slice(10 * (active - 1), 10 * active)
                      .map((staff, index) => {
                        return (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{staff.user_id?.name}</td>
                            <td>{staff.user_id?.phonenum}</td>
                            <td>{staff.role}</td>
                            <td>
                              <div className="action-button-container">
                                <OverlayTrigger
                                  placement="bottom"
                                  delay={{ show: 200, hide: 100 }}
                                  overlay={
                                    <Tooltip
                                      className="staff-edit-button"
                                      id="edit-button-tooltip"
                                    >
                                      Chi tiết
                                    </Tooltip>
                                  }
                                >
                                  <Button
                                    variant="primary"
                                    onClick={() => {
                                      navigate("/staff-detail/" + staff._id);
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
              )}
            </Col>
          </Row>
          <Row className="mt-2">
            <Col>
              <CustomPagination
                count={Math.ceil(staffs.length / 10)}
                handlePaginationClick={handlePaginationClick}
                page={active}
              />
            </Col>
          </Row>
        </Card>
      </Container>
      <CreateStaff
        showCreateStaff={showCreateStaff}
        setShowCreateStaff={setShowCreateStaff}
        refetch={refetch}
      />
      <ManageStaffSchedule
        showStaffSchedule={showStaffSchedule}
        setShowStaffSchedule={setShowStaffSchedule}
        staffScheduleId={staffScheduleId}
      />
    </>
  );
};

export default ManageStaff;
