import React, { useEffect, useState } from "react";

//API Actions
import { useGetManagersDetailQuery } from "../../redux/slices/account/accountApiSlice";

//React-bootstrap
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Modal,
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
import CustomPagination from "../customPagination/CustomPagination";
import CreateManager from "../createManager/CreateManager";

//momentjs
import moment from "moment";

//Images
import defaultUserAvatar from "../../images/default-user-avatar.jpg";

//CSS
import "./ManageManager.css";
import { useNavigate } from "react-router-dom";
import { Avatar } from "@mui/material";

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
    username: "",
    name: "",
    role: "",
    birth: "",
    email: "",
    phonenum: "",
    createdAt: "",
    img: "",
  });
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("desc");
  const [imgLoading, setImgLoading] = useState(true);

  const navigate = useNavigate();

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
    // setManagers(managersData.slice(10 * (number - 1), 10 * number));
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
        setManagers(
          managersData.filter((x) => x.user_id?.name.includes(search))
        );
      } else {
        setManagers(
          managersData.filter((x) => x.user_id?.name.includes(search)).reverse()
        );
      }
    }
  }, [isFetching]);

  return (
    <>
      <Container fluid className="manage-manager-container">
        <Card body className="content-container">
          <Row>
            <Col>
              <Card.Title>Danh sách quản lí</Card.Title>
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
            <Col xs={2} className="button-container">
              <Button
                style={{ width: "100%" }}
                variant="primary"
                onClick={() => {
                  setShowCreateManager(true);
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
                      <th>Tên quản lí</th>
                      <th>Số điện thoại</th>
                      <th>Email</th>
                      <th>Ngày tạo</th>
                      <th style={{ width: "200px" }}>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {managers
                      .slice(10 * (active - 1), 10 * active)
                      .map((manager, index) => {
                        return (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{manager.user_id?.name}</td>
                            <td>{manager.user_id?.phonenum}</td>
                            <td>{manager.user_id?.email}</td>
                            <td>
                              {moment(manager.createdAt).format("MM/DD/YYYY")}
                            </td>
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
                                      Xem chi tiết
                                    </Tooltip>
                                  }
                                >
                                  <Button
                                    variant="primary"
                                    onClick={() => {
                                      setManagerDetail({
                                        username: manager.username,
                                        name: manager.user_id?.name,
                                        role: manager.role,
                                        birth: moment(
                                          manager.user_id?.birth
                                        ).format("MM/DD/YYYY"),
                                        email: manager.user_id?.email,
                                        phonenum: manager.user_id?.phonenum,
                                        createdAt: moment(
                                          manager.createdAt
                                        ).format("MM/DD/YYYY"),
                                        img: manager.user_id?.img,
                                      });
                                      setShowManagerDetail(true);
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
                count={Math.ceil(managers.length / 10)}
                handlePaginationClick={handlePaginationClick}
                page={active}
              />
            </Col>
          </Row>
        </Card>
      </Container>
      <Modal
        show={showManagerDetail}
        onHide={() => {
          setShowManagerDetail(false);
        }}
        centered
        dialogClassName="manager-detail-modal"
      >
        <Modal.Header>
          <Modal.Title>Chi tiết quản lí</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>Tài khoản:</Form.Label>
                    <Form.Control
                      readOnly
                      defaultValue={managerDetail.username}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Họ và tên:</Form.Label>
                    <Form.Control readOnly defaultValue={managerDetail.name} />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Ngày sinh:</Form.Label>
                    <Form.Control readOnly defaultValue={managerDetail.birth} />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>Email:</Form.Label>
                    <Form.Control readOnly defaultValue={managerDetail.email} />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Số điện thoại:</Form.Label>
                    <Form.Control
                      readOnly
                      defaultValue={managerDetail.phonenum}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Ngày tạo:</Form.Label>
                    <Form.Control
                      readOnly
                      defaultValue={managerDetail.createdAt}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Col>
            <Col xs={4}>
              <Row>
                <Col>
                  <Form.Label>Ảnh đại diện:</Form.Label>
                </Col>
              </Row>
              <Row>
                <Col className="d-flex justify-content-center align-items-center">
                  <Avatar
                    src={
                      !managerDetail.img || imgLoading
                        ? defaultUserAvatar
                        : `https://computer-services-api.herokuapp.com/account/avatar/${managerDetail.img}`
                    }
                    onLoad={() => setImgLoading(false)}
                    sx={{
                      width: "120px",
                      height: "120px",
                      border: "1px solid #000000",
                    }}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowManagerDetail(false);
            }}
          >
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
      <CreateManager
        showCreateManager={showCreateManager}
        setShowCreateManager={setShowCreateManager}
        refetch={refetch}
      />
    </>
  );
};

export default ManageManager;
