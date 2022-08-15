import React, { useState } from "react";

//Redux

//API Actions

//React-bootstrap
import { Button, Col, Form, Modal, Row, Table } from "react-bootstrap";

//React-redux

//momentjs
import moment from "moment";

//Components
import AddAccessoryToService from "../addAccessoryToService/AddAccessoryToService";

//CSS
import "./ServiceDetail.css";

const ServiceDetail = ({
  showServiceDetail,
  setShowServiceDetail,
  serviceDetail,
  setServiceDetail,
  initServiceDetail,
}) => {
  //Local state
  const [showAddAccessoryToService, setShowAddAccessoryToService] =
    useState(false);

  const handleClose = () => {
    setShowServiceDetail(false);
  };

  const isChange = () => {
    return JSON.stringify(initServiceDetail) === JSON.stringify(serviceDetail);
  };

  return (
    <>
      <Modal
        show={showServiceDetail}
        onHide={handleClose}
        dialogClassName="service-detail"
        centered
      >
        <div className="modal-content-container">
          <Modal.Header>
            <Modal.Title>CHI TIẾT DỊCH VỤ MÃ: {serviceDetail._id}</Modal.Title>
          </Modal.Header>
          <Modal.Body className="modal-body-container">
            <Form>
              <Row>
                <Col>
                  <Form.Group controlId="formServiceDetailName">
                    <Form.Label>Tên dịch vụ:</Form.Label>
                    <Form.Control
                      plaintext
                      readOnly
                      disabled
                      type="text"
                      name="name"
                      defaultValue={serviceDetail.name}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formServiceDetailPrice">
                    <Form.Label>Giá dịch vụ:</Form.Label>
                    <Form.Control
                      plaintext
                      readOnly
                      disabled
                      type="text"
                      name="price"
                      defaultValue={serviceDetail.price}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group controlId="formServiceDetailDescription">
                    <Form.Label>Mô tả dịch vụ:</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      readOnly
                      disabled
                      name="description"
                      defaultValue={serviceDetail.description}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group controlId="formServiceDetailPrice">
                    <Form.Label>Ngày tạo:</Form.Label>
                    <Form.Control
                      plaintext
                      readOnly
                      disabled
                      type="text"
                      name="price"
                      defaultValue={moment(serviceDetail.createdAt).format(
                        "MM/DD/YYYY"
                      )}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formServiceDetailPrice">
                    <Form.Label>Ngày cập nhật:</Form.Label>
                    <Form.Control
                      plaintext
                      readOnly
                      disabled
                      type="text"
                      name="price"
                      defaultValue={moment(serviceDetail.updatedAt).format(
                        "MM/DD/YYYY"
                      )}
                    />
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
                        {serviceDetail.accessories_id?.map(
                          (accessory, index) => {
                            return (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{accessory.name}</td>
                                <td>{accessory.price}</td>
                                <td>{accessory.supplier_id}</td>
                              </tr>
                            );
                          }
                        )}
                        <tr>
                          <td colSpan={4}>
                            <Button
                              variant="link"
                              size="sm"
                              onClick={() => {
                                setShowServiceDetail(false);
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
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Đóng
            </Button>
            <Button
              variant="primary"
              disabled={isChange()}
              onClick={handleClose}
            >
              Xác nhận
            </Button>
          </Modal.Footer>
        </div>
      </Modal>
      <AddAccessoryToService
        showAddAccessoryToService={showAddAccessoryToService}
        setShowAddAccessoryToService={setShowAddAccessoryToService}
        setShowServiceDetail={setShowServiceDetail}
        serviceDetail={serviceDetail}
        setServiceDetail={setServiceDetail}
      />
    </>
  );
};

export default ServiceDetail;
