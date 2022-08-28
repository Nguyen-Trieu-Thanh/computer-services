import React, { useState, useEffect } from "react";

//Redux

//Actions
import { setToast } from "../../redux/slices/toast/toastSlice";

//API Actions
import {
  useGetServiceDetailQuery,
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

  useEffect(() => {
    if (!isFetching && !error) {
      setServiceDetail({
        ...serviceDetailData,
        accessories_id: serviceDetailData?.serHasAcc.map((x) => {
          return {
            ...x.accessory_id,
          };
        }),
        price: String(serviceDetailData.price),
      });
      setInitServiceDetail({
        ...serviceDetailData,
        accessories_id: serviceDetailData?.serHasAcc.map((x) => {
          return {
            ...x.accessory_id,
          };
        }),
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
        <Form onSubmit={handleConfirmUpdateServiceSubmit}>
          <Card body className="service-info-container">
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
                  <Col>
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
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group controlId="formCreateServiceDescription">
                      <Form.Label>
                        Mô tả dịch vụ ({serviceDetail?.description?.length}/200
                        từ) (bắt buộc):
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
          </Card>
          <Card className="service-table-container">
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
          </Card>
        </Form>
      </Container>
      <AddAccessoryToService
        showAddAccessoryToService={showAddAccessoryToService}
        setShowAddAccessoryToService={setShowAddAccessoryToService}
        serviceDetail={serviceDetail}
        setServiceDetail={setServiceDetail}
        addAccessories={addAccessories}
        setAddAccessories={setAddAccessories}
      />
    </>
  );
};

export default ServiceDetail;
