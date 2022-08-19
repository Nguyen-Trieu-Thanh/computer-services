import React, { useState } from "react";

//Redux

//React-redux

//React-bootstrap
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  Row,
  Table,
} from "react-bootstrap";

//Components
import AddAccessoryToService from "../addAccessoryToService/AddAccessoryToService";
import ConfirmClose from "../confirmClose/ConfirmClose";
import ConfirmCreateService from "../confirmCreateService/ConfirmCreateService";

//CSS
import "./CreateService.css";

const CreateService = () => {
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
  const [service, setService] = useState({
    name: "",
    description: "",
    price: "",
    type: "Thay thế",
    brand: "Asus",
    accessories_id: [],
    hasAccessory: false,
  });

  const [showConfirmCreateService, setShowConfirmCreateService] =
    useState(false);

  const handleCreateServiceChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    if (name === "name") {
      setService({ ...service, [name]: value });
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
        setService({ ...service, [name]: value });
        setValidation({
          ...validation,
          price: {
            message: "Giá dịch vụ chỉ được chứa chữ số",
            isInvalid: true,
          },
        });
        return;
      } else {
        setService({ ...service, [name]: value });
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
      setService({ ...service, [name]: value });
      return;
    }

    if (name === "brand") {
      setService({ ...service, [name]: value });
      return;
    }

    if (name === "description") {
      if (value.length > 100) {
        setService({ ...service, [name]: value });
        setValidation({
          ...validation,
          description: {
            message: "Số lượng từ vượt quá giới hạn",
            isInvalid: true,
          },
        });
        return;
      } else {
        setService({ ...service, [name]: value });
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

  const handleConfirmCreateServiceSubmit = (e) => {
    e.preventDefault();
    if (service.name === "") {
      setValidation({
        ...validation,
        name: {
          message: "Tên dịch vụ không được để trống",
          isInvalid: true,
        },
      });
      return;
    }

    if (service.price === "") {
      setValidation({
        ...validation,
        price: {
          message: "Giá dịch vụ không được để trống",
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
      setShowConfirmCreateService(true);
    }
  };

  return (
    <>
      <Container fluid className="create-service-container">
        <Form onSubmit={handleConfirmCreateServiceSubmit}>
          <Card body className="service-info-container">
            <Row>
              <Col>
                <Card.Title>Thông tin dịch vụ được tạo</Card.Title>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group controlId="formCreateServiceName">
                  <Form.Label>Tên dịch vụ:</Form.Label>
                  <Form.Control
                    isInvalid={validation.name.isInvalid}
                    type="text"
                    name="name"
                    value={service.name}
                    onChange={handleCreateServiceChange}
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
                    value={service.price}
                    onChange={handleCreateServiceChange}
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
                    value={service.type}
                    onChange={handleCreateServiceChange}
                  >
                    <option>Thay thế</option>
                    <option>Vệ sinh</option>
                    <option>Cài đặt</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="formCreateServiceType">
                  <Form.Label>Hãng:</Form.Label>
                  <Form.Control
                    as="select"
                    name="brand"
                    value={service.brand}
                    onChange={handleCreateServiceChange}
                  >
                    <option>Asus</option>
                    <option>MSI</option>
                    <option>Razer</option>
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group controlId="formCreateServiceDescription">
                  <Form.Label>
                    Mô tả dịch vụ ({service.description.length}/100 từ) (không
                    bắt buộc):
                  </Form.Label>
                  <Form.Control
                    isInvalid={validation.description.isInvalid}
                    as="textarea"
                    rows={3}
                    name="description"
                    value={service.description}
                    onChange={handleCreateServiceChange}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validation.description.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
          </Card>
          <Card body className="service-table-container">
            <Row>
              <Col>
                <Card.Title>Dịch vụ bao gồm phụ kiện</Card.Title>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="table-container">
                  <Table bordered size="sm">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>TÊN PHỤ KIỆN</th>
                        <th>GIÁ PHỤ KIỆN</th>
                        <th>NHÀ CUNG CẤP</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan={4}>
                          <Button
                            variant="link"
                            size="sm"
                            onClick={() => {
                              setShowAddAccessoryToService(true);
                            }}
                          >
                            Thêm / Xóa phụ kiện
                          </Button>
                        </td>
                      </tr>
                      {service.accessories_id?.map((accessory, index) => {
                        return (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{accessory.name}</td>
                            <td>{accessory.price}</td>
                            <td>{accessory.supplier_id?.name}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
              </Col>
            </Row>
          </Card>
          <Card body className="service-button-container">
            <Row>
              <Col className="button-container">
                <Button type="submit" variant="primary">
                  Tạo dịch vụ
                </Button>
              </Col>
            </Row>
          </Card>
        </Form>
      </Container>
      <AddAccessoryToService
        showAddAccessoryToService={showAddAccessoryToService}
        setShowAddAccessoryToService={setShowAddAccessoryToService}
        serviceDetail={service}
        setServiceDetail={setService}
      />
      <ConfirmCreateService
        service={service}
        setShowConfirmCreateService={setShowConfirmCreateService}
        showConfirmCreateService={showConfirmCreateService}
      />
    </>
  );
};

export default CreateService;
