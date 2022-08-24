import React, { useState } from "react";

//Redux
//Actions
import { setToast } from "../../redux/slices/toast/toastSlice";

//API Actions

//React-redux
import { useDispatch } from "react-redux";

//CSS
import "./CreateAccessory.css";

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
import ConfirmCreateAccessory from "../confirmCreateAccessory/ConfirmCreateAccessory";
import {
  useCreateAccessoryMutation,
  useUploadAccessoryImageMutation,
} from "../../redux/slices/accessory/accessoryApiSlice";
import { useNavigate } from "react-router-dom";

import suppliers from "../../datas/suppliers";

const CreateAccessory = () => {
  const [createAccessory, { isLoading }] = useCreateAccessoryMutation();
  const [uploadAccessoryImage, { isLoading: isUploadAccessoryImage }] =
    useUploadAccessoryImageMutation();

  //Local state
  const [showConfirmCreateAccessory, setShowConfirmCreateAccessory] =
    useState(false);
  const [accessory, setAccessory] = useState({
    name: "",
    price: "",
    description: "",
    insurance: "",
    supplier_id: "62d14b772c7ff9eccc4f528d",
    type: "PC",
    component: "RAM",
  });
  const [file, setFile] = useState("");
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
  const navigate = useNavigate();

  const handleCreateAccessoryChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    if (name === "name") {
      setAccessory({ ...accessory, [name]: value });
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
        setAccessory({ ...accessory, [name]: value });
        setValidation({
          ...validation,
          price: {
            message: "Giá linh kiện chỉ được chứa số",
            isInvalid: true,
          },
        });
        return;
      } else {
        setAccessory({ ...accessory, [name]: value });
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
      setAccessory({ ...accessory, [name]: value });
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
      setAccessory({ ...accessory, [name]: value });
      return;
    }

    if (name === "component") {
      setAccessory({ ...accessory, [name]: value });
      return;
    }

    if (name === "supplier_id") {
      setAccessory({ ...accessory, [name]: value });
      return;
    }

    if (name === "description") {
      if (value.length > 200) {
        setAccessory({ ...accessory, [name]: value });
        setValidation({
          ...validation,
          description: {
            message: "Số lượng từ vượt quá giới hạn",
            isInvalid: true,
          },
        });
        return;
      } else {
        setAccessory({ ...accessory, [name]: value });
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
      if (
        e.target.files[0].type === "image/png" ||
        e.target.files[0].type === "image/jpeg" ||
        e.target.files[0].type === "image/jpg"
      ) {
        setFile(e.target.files[0]);
        const reader = new FileReader();
        reader.addEventListener("load", () => {
          setImgData(reader.result);
        });
        reader.readAsDataURL(e.target.files[0]);
      } else {
        dispatch(
          setToast({
            show: true,
            title: "Tải lên ảnh linh kiện",
            time: "just now",
            content:
              "Ảnh chỉ nhận định dạng .png, .jpg hoặc .jpeg. Xin hãy thử lại",
            color: {
              header: "#ffcccc",
              body: "#e60000",
            },
          })
        );
      }
    }
  };

  const handleCreateAccessorySubmit = async (e) => {
    e.preventDefault();
    if (accessory.name === "") {
      setValidation({
        ...validation,
        name: {
          message: "Tên linh kiện không được để trống",
          isInvalid: true,
        },
      });
      return;
    }

    if (accessory.name.trim() !== accessory.name) {
      setValidation({
        ...validation,
        name: {
          message: "Tên linh kiện không hợp lệ",
          isInvalid: true,
        },
      });
      return;
    }

    if (accessory.price === "") {
      setValidation({
        ...validation,
        price: {
          message: "Giá linh kiện không được để trống",
          isInvalid: true,
        },
      });
      return;
    }

    if (accessory.insurance === "") {
      setValidation({
        ...validation,
        insurance: {
          message: "Thời hạn bảo hành không được để trống",
          isInvalid: true,
        },
      });
      return;
    }

    if (accessory.insurance.trim() !== accessory.insurance) {
      setValidation({
        ...validation,
        insurance: {
          message: "Thời hạn bảo hành không hợp lệ",
          isInvalid: true,
        },
      });
      return;
    }

    if (accessory.description === "") {
      setValidation({
        ...validation,
        description: {
          message: "Mô tả linh kiện không được để trống",
          isInvalid: true,
        },
      });
      return;
    }

    if (!file) {
      dispatch(
        setToast({
          show: true,
          title: "Tạo linh kiện",
          time: "just now",
          content: "Linh kiện bắt buộc phải có ảnh",
          color: {
            header: "#ffcccc",
            body: "#e60000",
          },
        })
      );
      return;
    }

    if (
      !validation.name.isInvalid &&
      !validation.price.isInvalid &&
      !validation.insurance.isInvalid &&
      !validation.description.isInvalid
    ) {
      try {
        await createAccessory(accessory)
          .unwrap()
          .then(async (res) => {
            if (res) {
              if (file) {
                const formData = new FormData();
                formData.append("img", file);
                try {
                  await uploadAccessoryImage({ id: res._id, body: formData })
                    .unwrap()
                    .then((imgRes) => {
                      if (imgRes) {
                        dispatch(
                          setToast({
                            show: true,
                            title: "Tạo linh kiện",
                            time: "just now",
                            content: "Linh kiện được tạo thành công",
                            color: {
                              header: "#dbf0dc",
                              body: "#41a446",
                            },
                          })
                        );
                        setFile();
                        setImgData();
                        navigate("/accessory-detail/" + res._id);
                      }
                    });
                } catch (error) {
                  if (error) {
                    if (error.data) {
                      dispatch(
                        setToast({
                          show: true,
                          title: "Tạo linh kiện",
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
                          title: "Tạo linh kiện",
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
                    title: "Tạo linh kiện",
                    time: "just now",
                    content: "Linh kiện được tạo thành công",
                    color: {
                      header: "#dbf0dc",
                      body: "#41a446",
                    },
                  })
                );
                navigate("/accessory-detail/" + res._id);
              }
            }
          });
      } catch (error) {
        if (error) {
          if (error.data) {
            dispatch(
              setToast({
                show: true,
                title: "Tạo linh kiện",
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
                title: "Tạo linh kiện",
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

  return (
    <>
      <Container fluid className="create-accessory-container">
        <Form onSubmit={handleCreateAccessorySubmit}>
          <Card body className="accessory-info-container ">
            <Row>
              <Col>
                <Card.Title>Thông tin linh kiện được tạo</Card.Title>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group controlId="formCreateAccessoryName">
                  <Form.Label>Tên linh kiện:</Form.Label>
                  <Form.Control
                    isInvalid={validation.name.isInvalid}
                    type="text"
                    name="name"
                    value={accessory.name}
                    onChange={handleCreateAccessoryChange}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validation.name.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="formCreateAccessoryPrice">
                  <Form.Label>Giá linh kiện (VNĐ):</Form.Label>
                  <Form.Control
                    isInvalid={validation.price.isInvalid}
                    type="text"
                    name="price"
                    value={accessory.price}
                    onChange={handleCreateAccessoryChange}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validation.price.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="formCreateAccessoryInsurance">
                  <Form.Label>Thời hạn bảo hành:</Form.Label>
                  <Form.Control
                    isInvalid={validation.insurance.isInvalid}
                    type="text"
                    name="insurance"
                    value={accessory.insurance}
                    onChange={handleCreateAccessoryChange}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validation.insurance.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group controlId="formCreateAccessoryType">
                  <Form.Label>Loại máy tính:</Form.Label>
                  <Form.Control
                    as="select"
                    name="type"
                    value={accessory.type}
                    onChange={handleCreateAccessoryChange}
                  >
                    <option>PC</option>
                    <option>Laptop</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="formCreateAccessoryComponent">
                  <Form.Label>Loại linh kiện:</Form.Label>
                  <Form.Control
                    as="select"
                    name="component"
                    value={accessory.component}
                    onChange={handleCreateAccessoryChange}
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
                <Form.Group controlId="formCreateAccessorySupplier_id">
                  <Form.Label>Nhà cung cấp:</Form.Label>
                  <Form.Control
                    as="select"
                    name="supplier_id"
                    value={accessory.supplier_id}
                    onChange={handleCreateAccessoryChange}
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
                <Form.Group controlId="formCreateAccessoryDescription">
                  <Form.Label>
                    Mô tả linh kiện ({accessory.description.length}/200 từ) (bắt
                    buộc):
                  </Form.Label>
                  <Form.Control
                    isInvalid={validation.description.isInvalid}
                    as="textarea"
                    rows={3}
                    name="description"
                    value={accessory.description}
                    onChange={handleCreateAccessoryChange}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validation.description.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
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
              <Card.Img
                variant="bottom"
                src={imgData}
                onLoad={() => setImgLoading(false)}
              />
            </Card.Body>

            <Card.Footer className="accessory-button-container">
              <Row>
                <Col className="button-container">
                  <Button
                    disabled={isLoading || isUploadAccessoryImage}
                    type="submit"
                    variant="primary"
                  >
                    {isLoading || isUploadAccessoryImage ? (
                      <Spinner animation="border" />
                    ) : (
                      "Tạo linh kiện"
                    )}
                  </Button>
                </Col>
              </Row>
            </Card.Footer>
          </Card>
        </Form>
      </Container>
      {/* <ConfirmCreateAccessory
        accessory={accessory}
        setShowConfirmCreateAccessory={setShowConfirmCreateAccessory}
        showConfirmCreateAccessory={showConfirmCreateAccessory}
        imgData={imgData}
      /> */}
    </>
  );
};

export default CreateAccessory;
