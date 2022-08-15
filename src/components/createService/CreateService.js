import React, { useState } from "react";

//Redux

//React-redux

//React-bootstrap
import { Button, Col, Form, Modal, Row, Table } from "react-bootstrap";

//Components
import AddAccessoryToService from "../addAccessoryToService/AddAccessoryToService";
import ConfirmClose from "../confirmClose/ConfirmClose";

//CSS
import "./CreateService.css";

const CreateService = ({
  showCreateService,
  setShowCreateService,
  service,
  setService,
  setShowConfirmCreateService,
  services,
}) => {
  //Local state
  const [showAddAccessoryToService, setShowAddAccessoryToService] =
    useState(false);
  const [showConfirmClose, setShowConfirmClose] = useState(false);
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

  const handleClose = () => {
    setShowConfirmClose(false);
    setShowCreateService(false);
    setService({
      name: "",
      description: "",
      price: "",
      type: "Thay thế",
      accessories_id: [],
      hasAccessory: false,
    });
    setValidation({
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
  };

  const handleCreateServiceChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    if (name === "name") {
      const isServiceExist =
        services.find((service) => service.name === value) !== undefined;

      if (isServiceExist) {
        setService({ ...service, [name]: value });
        setValidation({
          ...validation,
          name: {
            message: "Dịch vụ đã tồn tại",
            isInvalid: true,
          },
        });
        return;
      } else {
        setService({ ...service, [name]: value });
        setValidation({
          ...validation,
          name: {
            message: "",
            isInvalid: false,
          },
        });
      }
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
      setShowCreateService(false);
      setShowConfirmCreateService(true);
    }
  };

  return (
    <>
      <Modal
        show={showCreateService}
        onHide={() => {
          setShowConfirmClose(true);
        }}
        dialogClassName="create-service-container"
        centered
      >
        <div className="modal-content-container">
          <Modal.Header>
            <Modal.Title>Tạo dịch vụ</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleConfirmCreateServiceSubmit}>
            <Modal.Body className="modal-body-container">
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
              <Row>
                <Col>
                  <Form.Label>Dịch vụ bao gồm phụ kiện:</Form.Label>
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
                        {service.accessories_id?.map((accessory, index) => {
                          return (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{accessory.name}</td>
                              <td>{accessory.price}</td>
                              <td>{accessory.supplier_id}</td>
                            </tr>
                          );
                        })}
                        <tr>
                          <td colSpan={4}>
                            <Button
                              variant="link"
                              size="sm"
                              onClick={() => {
                                setShowCreateService(false);
                                setShowAddAccessoryToService(true);
                              }}
                            >
                              Thêm / Xóa phụ kiện
                            </Button>
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowConfirmClose(true);
                }}
              >
                Đóng
              </Button>
              <Button type="submit" variant="primary">
                Tạo phụ kiện
              </Button>
            </Modal.Footer>
          </Form>
        </div>
      </Modal>
      <AddAccessoryToService
        showAddAccessoryToService={showAddAccessoryToService}
        setShowAddAccessoryToService={setShowAddAccessoryToService}
        setShowServiceDetail={setShowCreateService}
        serviceDetail={service}
        setServiceDetail={setService}
      />
      <ConfirmClose
        showConfirmClose={showConfirmClose}
        setShowConfirmClose={setShowConfirmClose}
        handleClose={handleClose}
      />
    </>
  );
};

export default CreateService;
