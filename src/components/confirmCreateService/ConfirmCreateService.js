import React from "react";

//Redux
//Actions
import { setToast } from "../../redux/slices/toast/toastSlice";

//API Actions
import { useCreateServiceMutation } from "../../redux/slices/service/serviceApiSlice";

//React-redux
import { useDispatch } from "react-redux";

//React-bootstrap
import { Button, Col, Form, Modal, Row, Spinner, Table } from "react-bootstrap";

//CSS
import "./ConfirmCreateService.css";

const ConfirmCreateService = ({
  setShowCreateService,
  service,
  setIsRefetch,
  setShowConfirmCreateService,
  showConfirmCreateService,
}) => {
  const [createService, { isLoading }] = useCreateServiceMutation();

  const dispatch = useDispatch();

  const handleClose = () => {
    setShowConfirmCreateService(false);
    setShowCreateService(true);
  };

  const handleConfirmCreateServiceSubmit = async (e) => {
    e.preventDefault();

    try {
      await createService(service)
        .unwrap()
        .then(async (res) => {
          if (res) {
            await dispatch(
              setToast({
                show: true,
                title: "Tạo lịch hẹn",
                time: "just now",
                content: "Lịch hẹn được tạo thành công!",
                color: {
                  header: "#dbf0dc",
                  body: "#41a446",
                },
              })
            );
            await setIsRefetch(true);
            setShowConfirmCreateService(false);
          }
        });
    } catch (error) {}
  };

  return (
    <>
      <Modal
        show={showConfirmCreateService}
        onHide={handleClose}
        dialogClassName="confirm-create-service-container"
        centered
      >
        <div className="modal-content-container">
          <Modal.Header>
            <Modal.Title>Xác nhận thông tin dịch vụ</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleConfirmCreateServiceSubmit}>
            <Modal.Body className="modal-body-container">
              <Row>
                <Col>
                  <Form.Group controlId="formConfirmCreateServiceName">
                    <Form.Label>Tên dịch vụ:</Form.Label>
                    <p>{service.name}</p>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formConfirmCreateServicePrice">
                    <Form.Label>Giá dịch vụ (VNĐ):</Form.Label>
                    <p>{service.price}</p>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formConfirmCreateServiceType">
                    <Form.Label>Loại dịch vụ:</Form.Label>
                    <p>{service.type}</p>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group controlId="formConfirmCreateServiceDescription">
                    <Form.Label>Mô tả dịch vụ:</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      readOnly
                      disabled
                      name="description"
                      defaultValue={service.description}
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
                      </tbody>
                    </Table>
                  </div>
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Quay lại
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="confirm-button"
              >
                {isLoading ? <Spinner animation="border" /> : "Xác nhận"}
              </Button>
            </Modal.Footer>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default ConfirmCreateService;