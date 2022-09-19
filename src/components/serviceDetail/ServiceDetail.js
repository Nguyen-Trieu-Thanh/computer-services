import React, { useState, useEffect } from "react";

//Redux

//Actions
import { setToast } from "../../redux/slices/toast/toastSlice";

//API Actions
import {
  useDeleteServiceMutation,
  useGetServiceDetailQuery,
  useRestoreServiceMutation,
  useUpdateServiceMutation,
} from "../../redux/slices/service/serviceApiSlice";

//React-bootstrap
import {
  Button,
  Col,
  Form,
  Modal,
  Row,
  Table,
  Container,
  Card,
  InputGroup,
  Spinner,
} from "react-bootstrap";

//React-redux

//momentjs
import moment from "moment";

//Components
import AddAccessoryToService from "../addAccessoryToService/AddAccessoryToService";

//CSS
import "./ServiceDetail.css";
import { useLocation, useParams, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";

const ServiceDetail = () => {
  const location = useLocation();

  const { service_id } = useParams();

  const {
    data: serviceDetailData,
    refetch,
    isFetching,
    error,
  } = useGetServiceDetailQuery(service_id);

  const [updateService, { isLoading }] = useUpdateServiceMutation();
  const [deleteService, { isLoading: isDeleteServiceLoading }] =
    useDeleteServiceMutation();
  const [restoreService, { isLoading: isRestoreServiceLoading }] =
    useRestoreServiceMutation();
  //Local state
  const [showAddAccessoryToService, setShowAddAccessoryToService] =
    useState(false);
  const [validation, setValidation] = useState({
    name: {
      message: "",
      isInvalid: false,
    },
    price: {
      message: "",
      isInvalid: false,
    },
    description: {
      message: "",
      isInvalid: false,
    },
  });
  const [serviceDetail, setServiceDetail] = useState({
    name: "",
    description: "",
    price: "",
    type: "Thay thế",
    brand: "Asus",
    accessories_id: [],
    hasAccessory: false,
  });
  const [initServiceDetail, setInitServiceDetail] = useState({
    name: "",
    description: "",
    price: "",
    type: "Thay thế",
    brand: "Asus",
    serHasAcc: [],
    hasAccessory: false,
  });

  const [addAccessories, setAddAccessories] = useState([]);

  const [showDelete, setShowDelete] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState("");

  const [showRestore, setShowRestore] = useState(false);
  const [confirmRestore, setConfirmRestore] = useState("");

  const dispatch = useDispatch();

  const handleUpdateServiceChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    if (name === "name") {
      setServiceDetail({ ...serviceDetail, [name]: value });
      setValidation({
        ...validation,
        name: {
          message: "",
          isInvalid: false,
        },
      });
      return;
    }

    if (name === "price") {
      const priceRegex = /^(?:\d+|)$/;

      if (!priceRegex.test(value)) {
        setServiceDetail({ ...serviceDetail, [name]: value });
        setValidation({
          ...validation,
          price: {
            message: "Giá dịch vụ chỉ được chứa số",
            isInvalid: true,
          },
        });
        return;
      } else {
        setServiceDetail({ ...serviceDetail, [name]: value });
        setValidation({
          ...validation,
          price: {
            message: "",
            isInvalid: false,
          },
        });
      }
    }

    if (name === "type") {
      setServiceDetail({ ...serviceDetail, [name]: value });
      return;
    }

    if (name === "brand") {
      setServiceDetail({ ...serviceDetail, [name]: value });
      return;
    }

    if (name === "description") {
      if (value?.length > 200) {
        setServiceDetail({ ...serviceDetail, [name]: value });
        setValidation({
          ...validation,
          description: {
            message: "Số lượng từ vượt quá giới hạn",
            isInvalid: true,
          },
        });
        return;
      } else {
        setServiceDetail({ ...serviceDetail, [name]: value });
        setValidation({
          ...validation,
          description: {
            message: "",
            isInvalid: false,
          },
        });
      }
    }
  };

  const handleConfirmUpdateServiceSubmit = async (e) => {
    e.preventDefault();

    if (serviceDetail.name === "") {
      setValidation({
        ...validation,
        name: {
          message: "Tên dịch vụ không được để trống",
          isInvalid: true,
        },
      });
      return;
    }

    if (serviceDetail.name.trim() !== serviceDetail.name) {
      setValidation({
        ...validation,
        name: {
          message: "Tên dịch vụ không hợp lệ",
          isInvalid: true,
        },
      });
      return;
    }

    if (serviceDetail.price === "") {
      setValidation({
        ...validation,
        price: {
          message: "Giá dịch vụ không được để trống",
          isInvalid: true,
        },
      });
      return;
    }

    if (serviceDetail.description === "") {
      setValidation({
        ...validation,
        description: {
          message: "Mô tả dịch vụ không được để trống",
          isInvalid: true,
        },
      });
      return;
    }

    if (
      !validation.name.isInvalid &&
      !validation.price.isInvalid &&
      !validation.description.isInvalid
    ) {
      try {
        await updateService(serviceDetail)
          .unwrap()
          .then((res) => {
            if (res) {
              dispatch(
                setToast({
                  show: true,
                  title: "Tạo dịch vụ",
                  time: "just now",
                  content: "Dịch vụ được cập nhật thành công",
                  color: {
                    header: "#dbf0dc",
                    body: "#41a446",
                  },
                })
              );
              refetch();
            }
          });
      } catch (error) {
        if (error) {
          if (error.data) {
            dispatch(
              setToast({
                show: true,
                title: "Tạo dịch vụ",
                time: "just now",
                content: error.data,
                color: {
                  header: "#ffcccc",
                  body: "#e60000",
                },
              })
            );
            refetch();
          } else {
            dispatch(
              setToast({
                show: true,
                title: "Tạo dịch vụ",
                time: "just now",
                content: "Đã xảy ra lỗi. Xin thử lại sau",
                color: {
                  header: "#ffcccc",
                  body: "#e60000",
                },
              })
            );
          }
        }
      }
    }
  };

  const isChange = () => {
    return JSON.stringify(initServiceDetail) !== JSON.stringify(serviceDetail);
  };

  const handleConfirmDeleteChange = (e) => {
    const value = e.target.value;
    setConfirmDelete(value);
  };

  const handleDeleteServiceSubmit = async (e) => {
    try {
      await deleteService(serviceDetail)
        .unwrap()
        .then(async (res) => {
          if (res) {
            setConfirmDelete("");
            setShowDelete(false);
            dispatch(
              setToast({
                show: true,
                title: "Ngưng dịch vụ",
                time: "just now",
                content: "Dịch vụ đã ngưng hoạt động",
                color: {
                  header: "#dbf0dc",
                  body: "#41a446",
                },
              })
            );
            refetch();
          }
        });
    } catch (error) {
      if (error) {
        if (error.data) {
          dispatch(
            setToast({
              show: true,
              title: "Ngưng dịch vụ",
              time: "just now",
              content: error.data,
              color: {
                header: "#ffcccc",
                body: "#e60000",
              },
            })
          );
        } else {
          dispatch(
            setToast({
              show: true,
              title: "Ngưng dịch vụ",
              time: "just now",
              content: "Đã xảy ra lỗi. Xin thử lại sau",
              color: {
                header: "#ffcccc",
                body: "#e60000",
              },
            })
          );
        }
      }
    }
  };

  const handleConfirmRestoreChange = (e) => {
    const value = e.target.value;
    setConfirmRestore(value);
  };

  const handleRestoreServiceSubmit = async (e) => {
    try {
      await restoreService(serviceDetail)
        .unwrap()
        .then(async (res) => {
          if (res) {
            setConfirmRestore("");
            setShowRestore(false);
            dispatch(
              setToast({
                show: true,
                title: "Kích hoạt dịch vụ",
                time: "just now",
                content: "Dịch vụ đã hoạt động trở lại",
                color: {
                  header: "#dbf0dc",
                  body: "#41a446",
                },
              })
            );
            refetch();
          }
        });
    } catch (error) {
      if (error) {
        if (error.data) {
          dispatch(
            setToast({
              show: true,
              title: "Kích hoạt dịch vụ",
              time: "just now",
              content: error.data,
              color: {
                header: "#ffcccc",
                body: "#e60000",
              },
            })
          );
        } else {
          dispatch(
            setToast({
              show: true,
              title: "Kích hoạt dịch vụ",
              time: "just now",
              content: "Đã xảy ra lỗi. Xin thử lại sau",
              color: {
                header: "#ffcccc",
                body: "#e60000",
              },
            })
          );
        }
      }
    }
  };

  useEffect(() => {
    if (!isFetching && !error) {
      setServiceDetail({
        ...serviceDetailData,
        // accessories_id: serviceDetailData?.serHasAcc.map((x) => {
        //   return {
        //     ...x.accessory_id,
        //   };
        // }),
        price: String(serviceDetailData.price),
      });
      setInitServiceDetail({
        ...serviceDetailData,
        // accessories_id: serviceDetailData?.serHasAcc.map((x) => {
        //   return {
        //     ...x.accessory_id,
        //   };
        // }),
        price: String(serviceDetailData.price),
      });
    }
  }, [isFetching]);

  if (error) {
    return <Navigate to="/error" state={{ from: location }} replace />;
  }

  return (
    <>
      <Container fluid className="service-detail-container">
        {serviceDetail.deleted && (
          <Card body className="service-info-container">
            <Card.Text>
              Linh kiện này đã ngưng hoạt động. Bạn có muốn kích hoạt lại?
            </Card.Text>
            <Button
              disabled={isFetching || !serviceDetail.deleted}
              variant="success"
              onClick={() => setShowRestore(true)}
            >
              Kích hoạt lại
            </Button>
          </Card>
        )}
        <Form onSubmit={handleConfirmUpdateServiceSubmit}>
          <Card className="service-info-container">
            <Card.Body>
              <Row>
                <Col>
                  <Card.Title>Thông tin dịch vụ</Card.Title>
                </Col>
              </Row>
              {isFetching ? (
                <div className="loading">
                  <Spinner animation="border" />
                  <div className="loading-text">Đang tải dữ liệu...</div>
                </div>
              ) : (
                <>
                  <Row>
                    <Col>
                      <Form.Group controlId="formCreateServiceName">
                        <Form.Label>Tên dịch vụ:</Form.Label>
                        <Form.Control
                          isInvalid={validation.name.isInvalid}
                          type="text"
                          name="name"
                          value={serviceDetail.name}
                          onChange={handleUpdateServiceChange}
                        />
                        <Form.Control.Feedback type="invalid">
                          {validation.name.message}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group controlId="formCreateServicePrice">
                        <Form.Label>Giá dịch vụ (VNĐ):</Form.Label>
                        <Form.Control
                          isInvalid={validation.price.isInvalid}
                          type="text"
                          name="price"
                          value={serviceDetail.price}
                          onChange={handleUpdateServiceChange}
                        />
                        <Form.Control.Feedback type="invalid">
                          {validation.price.message}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group controlId="formCreateServiceType">
                        <Form.Label>Loại dịch vụ:</Form.Label>
                        <Form.Control
                          as="select"
                          name="type"
                          value={serviceDetail.type}
                          onChange={handleUpdateServiceChange}
                        >
                          <option>Thay thế</option>
                          <option>Vệ sinh</option>
                          <option>Cài đặt</option>
                          <option>Sửa lỗi</option>
                        </Form.Control>
                      </Form.Group>
                    </Col>
                    {/* <Col>
                    <Form.Group controlId="formCreateServiceType">
                      <Form.Label>Hãng:</Form.Label>
                      <Form.Control
                        as="select"
                        name="brand"
                        value={serviceDetail.brand}
                        onChange={handleUpdateServiceChange}
                      >
                        <option value="Acer">Acer</option>
                        <option value="Asus">Asus</option>
                        <option value="MSI">MSI</option>
                        <option value="Lenovo">Lenovo</option>
                        <option value="Dell">Dell</option>
                        <option value="Gigabyte">Gigabyte</option>
                        <option value="HP">HP</option>
                        <option value="Razer">Razer</option>
                        <option value="Apple">Apple</option>
                        <option value="">Khác</option>
                      </Form.Control>
                    </Form.Group>
                  </Col> */}
                  </Row>
                  <Row>
                    <Col>
                      <Form.Group controlId="formCreateServiceDescription">
                        <Form.Label>
                          Mô tả dịch vụ ({serviceDetail?.description?.length}
                          /200 từ) (bắt buộc):
                        </Form.Label>
                        <Form.Control
                          isInvalid={validation.description.isInvalid}
                          as="textarea"
                          rows={3}
                          name="description"
                          value={serviceDetail.description}
                          onChange={handleUpdateServiceChange}
                        />
                        <Form.Control.Feedback type="invalid">
                          {validation.description.message}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                </>
              )}
            </Card.Body>
            <Card.Footer>
              <Row>
                <Col className="button-container">
                  <Button
                    disabled={isLoading || !isChange()}
                    type="submit"
                    variant="primary"
                  >
                    {isLoading ? <Spinner animation="border" /> : "Cập nhật"}
                  </Button>
                  <Button
                    disabled={isFetching || serviceDetail.deleted}
                    className="mr-2"
                    style={{ width: "140px" }}
                    variant="outline-danger"
                    onClick={() => setShowDelete(true)}
                  >
                    Ngưng dịch vụ
                  </Button>
                </Col>
              </Row>
            </Card.Footer>
          </Card>
          {/* <Card className="service-table-container">
            <Card.Body>
              <Row>
                <Col>
                  <Card.Title>Dịch vụ bao gồm linh kiện</Card.Title>
                </Col>
              </Row>
              {isFetching ? (
                <div className="loading">
                  <Spinner animation="border" />
                  <div className="loading-text">Đang tải dữ liệu...</div>
                </div>
              ) : (
                <Row>
                  <Col>
                    <div className="table-container">
                      <Table bordered size="sm">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Tên linh kiện</th>
                            <th>Giá linh kiện (VNĐ)</th>
                            <th>Nhà cung cấp</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td colSpan={4}>
                              <Button
                                variant="link"
                                size="sm"
                                onClick={() => {
                                  setAddAccessories([
                                    ...serviceDetail.accessories_id,
                                  ]);
                                  setShowAddAccessoryToService(true);
                                }}
                              >
                                Thêm / Xóa linh kiện
                              </Button>
                            </td>
                          </tr>
                          {serviceDetail.accessories_id?.map(
                            (accessory, index) => {
                              return (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>{accessory.name}</td>
                                  <td>
                                    {new Intl.NumberFormat("de-DE").format(
                                      accessory.price
                                    )}
                                  </td>
                                  <td>{accessory.supplier_id?.name}</td>
                                </tr>
                              );
                            }
                          )}
                        </tbody>
                      </Table>
                    </div>
                  </Col>
                </Row>
              )}
            </Card.Body>
            <Card.Footer>
              <Row>
                <Col className="button-container">
                  <Button
                    disabled={isLoading || !isChange()}
                    type="submit"
                    variant="primary"
                  >
                    {isLoading ? <Spinner animation="border" /> : "Cập nhật"}
                  </Button>
                </Col>
              </Row>
            </Card.Footer>
          </Card> */}
        </Form>
      </Container>
      {/* <AddAccessoryToService
        showAddAccessoryToService={showAddAccessoryToService}
        setShowAddAccessoryToService={setShowAddAccessoryToService}
        serviceDetail={serviceDetail}
        setServiceDetail={setServiceDetail}
        addAccessories={addAccessories}
        setAddAccessories={setAddAccessories}
      /> */}
      <Modal
        show={showDelete}
        onHide={() => {
          setShowDelete(false);
        }}
        centered
        dialogClassName="service-modal"
      >
        <Modal.Header>
          <Modal.Title>Xác nhận ngưng dịch vụ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Dịch vụ sẽ không tiếp tục hoạt động nữa. <br />
            Xin hãy nhập <b>DELETE</b> để xác nhận
          </p>
          <Form.Group controlId="formConfirmDelete">
            <Form.Control
              type="text"
              name="deleteName"
              value={confirmDelete}
              onChange={handleConfirmDeleteChange}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{ width: "100px" }}
            variant="danger"
            onClick={() => {
              setShowDelete(false);
              setConfirmDelete("");
            }}
          >
            Hủy
          </Button>
          <Button
            disabled={isDeleteServiceLoading || confirmDelete !== "DELETE"}
            style={{ width: "100px" }}
            variant="primary"
            onClick={handleDeleteServiceSubmit}
          >
            {isDeleteServiceLoading ? (
              <Spinner animation="border" />
            ) : (
              "Xác nhận"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showRestore}
        onHide={() => {
          setShowRestore(false);
        }}
        centered
        dialogClassName="service-modal"
      >
        <Modal.Header>
          <Modal.Title>Xác nhận kích hoạt lại dịch vụ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Dịch vụ sẽ tiếp tục hoạt động trở lại. <br />
            Xin hãy nhập <b>RESTORE</b> để xác nhận
          </p>
          <Form.Group controlId="formConfirmRestore">
            <Form.Control
              type="text"
              name="restoreName"
              value={confirmRestore}
              onChange={handleConfirmRestoreChange}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{ width: "100px" }}
            variant="danger"
            onClick={() => {
              setShowRestore(false);
              setConfirmRestore("");
            }}
          >
            Hủy
          </Button>
          <Button
            disabled={isRestoreServiceLoading || confirmRestore !== "RESTORE"}
            style={{ width: "100px" }}
            variant="primary"
            onClick={handleRestoreServiceSubmit}
          >
            {isRestoreServiceLoading ? (
              <Spinner animation="border" />
            ) : (
              "Xác nhận"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ServiceDetail;
