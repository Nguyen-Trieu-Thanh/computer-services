import React from "react";
import { useParams, Navigate, useLocation } from "react-router-dom";
import { useGetAccessoryDetailQuery } from "../../redux/slices/accessory/accessoryApiSlice";

//Actions
import { setToast } from "../../redux/slices/toast/toastSlice";

import {
  useUpdateAccessoryMutation,
  useUploadAccessoryImageMutation,
} from "../../redux/slices/accessory/accessoryApiSlice";

//React-bootstrap
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Image,
  InputGroup,
  Modal,
  Row,
  Spinner,
} from "react-bootstrap";

//CSS
import "./AccessoryDetail.css";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";

const AccessoryDetail = () => {
  const location = useLocation();

  const { accessory_id } = useParams();

  const {
    data: accessoryDetailData,
    refetch,
    isFetching,
    error,
  } = useGetAccessoryDetailQuery(accessory_id);

  const [updateAccessory, { isLoading }] = useUpdateAccessoryMutation();
  const [uploadAccessoryImage, { isLoading: isUploadAccessoryImage }] =
    useUploadAccessoryImageMutation();

  //Local state
  const [accessoryDetail, setAccessoryDetail] = useState();
  const [initAccessoryDetail, setInitAccessoryDetail] = useState();
  const [file, setFile] = useState();
  const [imgData, setImgData] = useState();
  const [imgLoading, setImgLoading] = useState(true);
  const [validation, setValidation] = useState({
    name: {
      message: "",
      isInvalid: false,
    },
    price: {
      message: "",
      isInvalid: false,
    },
    insurance: {
      message: "",
      isInvalid: false,
    },
    description: {
      message: "",
      isInvalid: false,
    },
  });

  const dispatch = useDispatch();

  const handleUpdateAccessoryChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    if (name === "name") {
      setAccessoryDetail({ ...accessoryDetail, [name]: value });
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
        setAccessoryDetail({ ...accessoryDetail, [name]: value });
        setValidation({
          ...validation,
          price: {
            message: "Giá linh kiện chỉ được chứa chữ số",
            isInvalid: true,
          },
        });
        return;
      } else {
        setAccessoryDetail({ ...accessoryDetail, [name]: value });
        setValidation({
          ...validation,
          price: {
            message: "",
            isInvalid: false,
          },
        });
      }
    }

    if (name === "insurance") {
      setAccessoryDetail({ ...accessoryDetail, [name]: value });
      setValidation({
        ...validation,
        insurance: {
          message: "",
          isInvalid: false,
        },
      });
      return;
    }

    if (name === "type") {
      setAccessoryDetail({ ...accessoryDetail, [name]: value });
      return;
    }

    if (name === "component") {
      setAccessoryDetail({ ...accessoryDetail, [name]: value });
      return;
    }

    if (name === "supplier_id") {
      setAccessoryDetail({ ...accessoryDetail, [name]: value });
      return;
    }

    if (name === "description") {
      if (value.length > 100) {
        setAccessoryDetail({ ...accessoryDetail, [name]: value });
        setValidation({
          ...validation,
          description: {
            message: "Số lượng từ vượt quá giới hạn",
            isInvalid: true,
          },
        });
        return;
      } else {
        setAccessoryDetail({ ...accessoryDetail, [name]: value });
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

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgData(reader.result);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleUpdateAccessorySubmit = async (e) => {
    e.preventDefault();

    if (accessoryDetail.name === "") {
      setValidation({
        ...validation,
        name: {
          message: "Tên linh kiện không được để trống",
          isInvalid: true,
        },
      });
      return;
    }

    if (accessoryDetail.price === "") {
      setValidation({
        ...validation,
        price: {
          message: "Giá linh kiện không được để trống",
          isInvalid: true,
        },
      });
      return;
    }

    if (accessoryDetail.insurance === "") {
      setValidation({
        ...validation,
        insurance: {
          message: "Thời hạn bảo hành không được để trống",
          isInvalid: true,
        },
      });
      return;
    }

    if (accessoryDetail.description === "") {
      setValidation({
        ...validation,
        description: {
          message: "Mô tả linh kiện không được để trống",
          isInvalid: true,
        },
      });
      return;
    }

    if (
      !validation.name.isInvalid &&
      !validation.price.isInvalid &&
      !validation.insurance.isInvalid &&
      !validation.description.isInvalid
    ) {
      if (!isChange() && file) {
        const formData = new FormData();
        formData.append("img", file);
        try {
          await uploadAccessoryImage({ id: accessory_id, body: formData })
            .unwrap()
            .then((imgRes) => {
              if (imgRes) {
                dispatch(
                  setToast({
                    show: true,
                    title: "Cập nhập linh kiện",
                    time: "just now",
                    content: "Linh kiện được cập nhập thành công",
                    color: {
                      header: "#dbf0dc",
                      body: "#41a446",
                    },
                  })
                );
                setFile();
                setImgData();
                refetch();
              }
            });
        } catch (error) {
          if (error) {
            if (error.data) {
              dispatch(
                setToast({
                  show: true,
                  title: "Cập nhập linh kiện",
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
                  title: "Cập nhập linh kiện",
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
        return;
      }

      try {
        await updateAccessory(accessoryDetail)
          .unwrap()
          .then(async (res) => {
            if (res) {
              if (file) {
                const formData = new FormData();
                formData.append("img", file);
                try {
                  await uploadAccessoryImage({
                    id: accessory_id,
                    body: formData,
                  })
                    .unwrap()
                    .then((imgRes) => {
                      if (imgRes) {
                        dispatch(
                          setToast({
                            show: true,
                            title: "Cập nhập linh kiện",
                            time: "just now",
                            content: "Linh kiện được cập nhập thành công",
                            color: {
                              header: "#dbf0dc",
                              body: "#41a446",
                            },
                          })
                        );
                        setFile();
                        setImgData();
                        refetch();
                      }
                    });
                } catch (error) {
                  if (error) {
                    if (error.data) {
                      dispatch(
                        setToast({
                          show: true,
                          title: "Cập nhập linh kiện",
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
                          title: "Cập nhập linh kiện",
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
              } else {
                dispatch(
                  setToast({
                    show: true,
                    title: "Cập nhập linh kiện",
                    time: "just now",
                    content: "Linh kiện được cập nhập thành công",
                    color: {
                      header: "#dbf0dc",
                      body: "#41a446",
                    },
                  })
                );
                refetch();
              }
            }
          });
      } catch (error) {
        if (error) {
          if (error.data) {
            dispatch(
              setToast({
                show: true,
                title: "Cập nhập linh kiện",
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
                title: "Cập nhập linh kiện",
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
    return (
      JSON.stringify(initAccessoryDetail) !== JSON.stringify(accessoryDetail)
    );
  };

  useEffect(() => {
    if (!isFetching && !error) {
      setAccessoryDetail({
        ...JSON.parse(JSON.stringify(accessoryDetailData)),
        price: String(accessoryDetailData.price),
      });
      setInitAccessoryDetail({
        ...JSON.parse(JSON.stringify(accessoryDetailData)),
        price: String(accessoryDetailData.price),
      });
    }
  }, [isFetching]);

  if (error) {
    return <Navigate to="/error" state={{ from: location }} replace />;
  }

  return (
    <Container fluid className="accessory-detail-container">
      <Form onSubmit={handleUpdateAccessorySubmit}>
        <Card body className="accessory-info-container ">
          <Row>
            <Col>
              <Card.Title>Thông tin linh kiện</Card.Title>
            </Col>
          </Row>
          {isFetching || !accessoryDetail ? (
            <div className="loading">
              <Spinner animation="border" />
              <div className="loading-text">Đang tải dữ liệu...</div>
            </div>
          ) : (
            <>
              <Row>
                <Col>
                  <Form.Group controlId="formAccessoryDetailName">
                    <Form.Label>Tên dịch vụ:</Form.Label>
                    <Form.Control
                      isInvalid={validation.name.isInvalid}
                      type="text"
                      name="name"
                      value={accessoryDetail.name}
                      onChange={handleUpdateAccessoryChange}
                    />
                    <Form.Control.Feedback type="invalid">
                      {validation.name.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formAccessoryDetailPrice">
                    <Form.Label>Giá dịch vụ (VNĐ):</Form.Label>
                    <Form.Control
                      isInvalid={validation.price.isInvalid}
                      type="text"
                      name="price"
                      value={accessoryDetail.price}
                      onChange={handleUpdateAccessoryChange}
                    />
                    <Form.Control.Feedback type="invalid">
                      {validation.price.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formAccessoryDetailInsurance">
                    <Form.Label>Thời hạn bảo hành:</Form.Label>
                    <Form.Control
                      isInvalid={validation.insurance.isInvalid}
                      type="text"
                      name="insurance"
                      value={accessoryDetail.insurance}
                      onChange={handleUpdateAccessoryChange}
                    />
                    <Form.Control.Feedback type="invalid">
                      {validation.insurance.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group controlId="formAccessoryDetailType">
                    <Form.Label>Loại máy tính:</Form.Label>
                    <Form.Control
                      as="select"
                      name="type"
                      value={accessoryDetail.type}
                      onChange={handleUpdateAccessoryChange}
                    >
                      <option>PC</option>
                      <option>Laptop</option>
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formAccessoryDetailComponent">
                    <Form.Label>Loại linh kiện:</Form.Label>
                    <Form.Control
                      as="select"
                      name="component"
                      value={accessoryDetail.component}
                      onChange={handleUpdateAccessoryChange}
                    >
                      <option>RAM</option>
                      <option>CPU</option>
                      <option>Màn hình</option>
                      <option>PSU</option>
                      <option>Tản nhiệt</option>
                      <option>Mainboard</option>
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formAccessoryDetailSupplier_id">
                    <Form.Label>Nhà cung cấp:</Form.Label>
                    <Form.Control
                      as="select"
                      name="supplier_id"
                      value={accessoryDetail.supplier_id}
                      onChange={handleUpdateAccessoryChange}
                    >
                      <option value="62d14b772c7ff9eccc4f528d">Intel</option>
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group controlId="formAccessoryDetailDescription">
                    <Form.Label>
                      Mô tả linh kiện ({accessoryDetail.description.length}
                      /100 từ) (Bắt buộc):
                    </Form.Label>
                    <Form.Control
                      isInvalid={validation.description.isInvalid}
                      as="textarea"
                      rows={3}
                      name="description"
                      value={accessoryDetail.description}
                      onChange={handleUpdateAccessoryChange}
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
        <Card className="accessory-image-container">
          <Card.Body className="text-center">
            <Form.Group controlId="formProfileSettingAvatar">
              <Form.Label>
                <Card.Link>Tải lên ảnh linh kiện</Card.Link>
              </Form.Label>
              <Form.File
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </Form.Group>
            {isFetching || !accessoryDetail ? (
              <div className="loading">
                <Spinner animation="border" />
                <div className="loading-text">Đang tải dữ liệu...</div>
              </div>
            ) : (
              <Card.Img
                variant="bottom"
                src={imgData ? imgData : accessoryDetail.imgURL}
                onLoad={() => setImgLoading(false)}
              />
            )}
          </Card.Body>

          <Card.Footer className="accessory-button-container">
            <Row>
              <Col className="button-container">
                <Button
                  disabled={
                    isLoading ||
                    isUploadAccessoryImage ||
                    (!isChange() && !file)
                  }
                  type="submit"
                  variant="primary"
                >
                  {isLoading || isUploadAccessoryImage ? (
                    <Spinner animation="border" />
                  ) : (
                    "Cập nhật"
                  )}
                </Button>
              </Col>
            </Row>
          </Card.Footer>
        </Card>
      </Form>
    </Container>
  );
};

export default AccessoryDetail;
