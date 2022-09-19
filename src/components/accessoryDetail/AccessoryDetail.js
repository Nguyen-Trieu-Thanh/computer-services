import React from "react";
import { useParams, Navigate, useLocation } from "react-router-dom";
import {
  useDeleteAccessoryMutation,
  useGetAccessoryDetailQuery,
  useRestoreAccessoryMutation,
} from "../../redux/slices/accessory/accessoryApiSlice";

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

import suppliers from "../../datas/suppliers";

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
  const [deleteAccessory, { isLoading: isDeleteAccessoryLoading }] =
    useDeleteAccessoryMutation();
  const [restoreAccessory, { isLoading: isRestoreAccessoryLoading }] =
    useRestoreAccessoryMutation();

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

  const [showDelete, setShowDelete] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState("");

  const [showRestore, setShowRestore] = useState(false);
  const [confirmRestore, setConfirmRestore] = useState("");

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
            message: "Giá linh kiện chỉ được chứa số",
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
      if (value.length > 200) {
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

    if (accessoryDetail.name.trim() !== accessoryDetail.name) {
      setValidation({
        ...validation,
        name: {
          message: "Tên linh kiện không hợp lệ",
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

    if (accessoryDetail.insurance.trim() !== accessoryDetail.insurance) {
      setValidation({
        ...validation,
        insurance: {
          message: "Thời hạn bảo hành không hợp lệ",
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
                    title: "Cập nhật linh kiện",
                    time: "just now",
                    content: "Linh kiện được cập nhật thành công",
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
                  title: "Cập nhật linh kiện",
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
                  title: "Cập nhật linh kiện",
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
                            title: "Cập nhật linh kiện",
                            time: "just now",
                            content: "Linh kiện được cập nhật thành công",
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
                          title: "Cập nhật linh kiện",
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
                          title: "Cập nhật linh kiện",
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
                    title: "Cập nhật linh kiện",
                    time: "just now",
                    content: "Linh kiện được cập nhật thành công",
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
                title: "Cập nhật linh kiện",
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
                title: "Cập nhật linh kiện",
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

  const handleConfirmDeleteChange = (e) => {
    const value = e.target.value;
    setConfirmDelete(value);
  };

  const handleDeleteAccessorySubmit = async (e) => {
    try {
      await deleteAccessory(accessoryDetail)
        .unwrap()
        .then(async (res) => {
          if (res) {
            setConfirmDelete("");
            setShowDelete(false);
            dispatch(
              setToast({
                show: true,
                title: "Ngưng linh kiện",
                time: "just now",
                content: "Linh kiện đã ngưng hoạt động",
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
              title: "Ngưng linh kiện",
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
              title: "Ngưng linh kiện",
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

  const handleRestoreAccessorySubmit = async (e) => {
    try {
      await restoreAccessory(accessoryDetail)
        .unwrap()
        .then(async (res) => {
          if (res) {
            setConfirmRestore("");
            setShowRestore(false);
            dispatch(
              setToast({
                show: true,
                title: "Kích hoạt linh kiện",
                time: "just now",
                content: "Linh kiện đã hoạt động trở lại",
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
              title: "Kích hoạt linh kiện",
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
              title: "Kích hoạt linh kiện",
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
    <>
      <Container fluid className="accessory-detail-container">
        {accessoryDetail?.deleted && (
          <Card body className="accessory-info-container">
            <Card.Text>
              Linh kiện này đã ngưng hoạt động. Bạn có muốn kích hoạt lại?
            </Card.Text>
            <Button
              disabled={isFetching || !accessoryDetail?.deleted}
              variant="success"
              onClick={() => setShowRestore(true)}
            >
              Kích hoạt lại
            </Button>
          </Card>
        )}
        <Form onSubmit={handleUpdateAccessorySubmit}>
          <Card body className="accessory-info-container">
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
                      <Form.Label>Tên linh kiện:</Form.Label>
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
                      <Form.Label>Giá linh kiện (VNĐ):</Form.Label>
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
                        <option>Nguồn</option>
                        <option>Main</option>
                        <option>RAM</option>
                        <option>Ổ cứng</option>
                        <option>CPU</option>
                        <option>Màn hình</option>
                        <option>Tản nhiệt</option>
                        <option>Bàn phím</option>
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="formAccessoryDetailSupplier_id">
                      <Form.Label>Nhà cung cấp:</Form.Label>
                      <Form.Control
                        as="select"
                        name="supplier_id"
                        value={accessoryDetail.supplier_id._id}
                        onChange={handleUpdateAccessoryChange}
                      >
                        {/* <option value="62d14b772c7ff9eccc4f528d">Intel</option> */}
                        {suppliers.map((supplier, index) => {
                          return (
                            <option key={index} value={supplier._id}>
                              {supplier.name}
                            </option>
                          );
                        })}
                      </Form.Control>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group controlId="formAccessoryDetailDescription">
                      <Form.Label>
                        Mô tả linh kiện ({accessoryDetail.description.length}
                        /200 từ) (bắt buộc):
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
                  <Card.Link style={{ cursor: "pointer" }}>
                    Tải lên ảnh linh kiện
                  </Card.Link>
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

                  <Button
                    disabled={isFetching || accessoryDetail?.deleted}
                    className="mr-2"
                    style={{ width: "140px" }}
                    variant="outline-danger"
                    onClick={() => setShowDelete(true)}
                  >
                    Ngưng linh kiện
                  </Button>
                </Col>
              </Row>
            </Card.Footer>
          </Card>
        </Form>
      </Container>
      <Modal
        show={showDelete}
        onHide={() => {
          setShowDelete(false);
        }}
        centered
        dialogClassName="accessory-modal"
      >
        <Modal.Header>
          <Modal.Title>Xác nhận ngưng linh kiện</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Linh kiện sẽ không tiếp tục hoạt động nữa. <br />
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
            disabled={isDeleteAccessoryLoading || confirmDelete !== "DELETE"}
            style={{ width: "100px" }}
            variant="primary"
            onClick={handleDeleteAccessorySubmit}
          >
            {isDeleteAccessoryLoading ? (
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
        dialogClassName="accessory-modal"
      >
        <Modal.Header>
          <Modal.Title>Xác nhận kích hoạt lại linh kiện</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Linh kiện sẽ tiếp tục hoạt động trở lại. <br />
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
            disabled={isRestoreAccessoryLoading || confirmRestore !== "RESTORE"}
            style={{ width: "100px" }}
            variant="primary"
            onClick={handleRestoreAccessorySubmit}
          >
            {isRestoreAccessoryLoading ? (
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

export default AccessoryDetail;
