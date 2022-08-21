import React from "react";

//Redux
//Actions
import { setToast } from "../../redux/slices/toast/toastSlice";

//API Actions
import { useCreateAccessoryMutation } from "../../redux/slices/accessory/accessoryApiSlice";

//React-redux
import { useDispatch } from "react-redux";

//React-bootstrap
import { Button, Col, Form, Image, Modal, Row, Spinner } from "react-bootstrap";

//CSS
import "./ConfirmCreateAccessory.css";

const ConfirmCreateAccessory = ({
  accessory,
  setShowConfirmCreateAccessory,
  showConfirmCreateAccessory,
  imgData,
}) => {
  const [createAccessory, { isLoading }] = useCreateAccessoryMutation();

  const dispatch = useDispatch();

  const handleClose = () => {
    setShowConfirmCreateAccessory(false);
  };

  const handleConfirmAccessorySubmit = async (e) => {
    e.preventDefault();

    try {
      await createAccessory(accessory)
        .unwrap()
        .then((res) => {
          if (res) {
            dispatch(
              setToast({
                show: true,
                title: "Tạo phụ kiện",
                time: "just now",
                content: "Phụ kiện được tạo thành công",
                color: {
                  header: "#dbf0dc",
                  body: "#41a446",
                },
              })
            );
            setShowConfirmCreateAccessory(false);
          }
        });
    } catch (error) {
      if (error) {
        if (error.data) {
          dispatch(
            setToast({
              show: true,
              title: "Tạo phụ kiện",
              time: "just now",
              content: error.data,
              color: {
                header: "#ffcccc",
                body: "#e60000",
              },
            })
          );
          setShowConfirmCreateAccessory(false);
        } else {
          dispatch(
            setToast({
              show: true,
              title: "Tạo phụ kiện",
              time: "just now",
              content: "Đã xảy ra lỗi. Xin thử lại sau",
              color: {
                header: "#ffcccc",
                body: "#e60000",
              },
            })
          );
          setShowConfirmCreateAccessory(false);
        }
      }
    }
  };

  return (
    <>
      <Modal
        show={showConfirmCreateAccessory}
        onHide={handleClose}
        dialogClassName="confirm-create-accessory-container"
        centered
      >
        <div className="modal-content-container">
          <Modal.Header>
            <Modal.Title>TẠO PHỤ KIỆN</Modal.Title>
          </Modal.Header>
          <Modal.Body className="modal-body-container">
            <Form>
              <Row>
                <Col>
                  <Form.Group controlId="formConfirmCreateAccessoryName">
                    <Form.Label>Tên phụ kiện:</Form.Label>
                    <Form.Control
                      plaintext
                      readOnly
                      disabled
                      type="text"
                      name="name"
                      defaultValue={accessory.name}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formConfirmCreateAccessoryInsurance">
                    <Form.Label>Thời gian bảo hành:</Form.Label>
                    <Form.Control
                      plaintext
                      readOnly
                      disabled
                      type="text"
                      name="insurance"
                      defaultValue={accessory.insurance}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formConfirmCreateAccessoryPrice">
                    <Form.Label>Giá tiền (VNĐ):</Form.Label>
                    <Form.Control
                      plaintext
                      readOnly
                      disabled
                      type="text"
                      name="price"
                      defaultValue={accessory.price}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formConfirmCreateAccessorySupplier_id">
                    <Form.Label>Nhà phân phối:</Form.Label>
                    <Form.Control
                      plaintext
                      readOnly
                      disabled
                      type="text"
                      name="supplier_id"
                      value={accessory.supplier_id}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group controlId="formConfirmCreateBookingDescription">
                    <Form.Label>Mô tả phụ kiện:</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      readOnly
                      disabled
                      name="description"
                      defaultValue={accessory.description}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="text-center">
                <Col>
                  <h3>Ảnh linh kiện</h3>
                </Col>
                <Col>
                  <Image src={imgData} />
                </Col>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Đóng
            </Button>
            <Button
              type="submit"
              variant="primary"
              onClick={handleConfirmAccessorySubmit}
            >
              {isLoading ? <Spinner animation="border" /> : "Xác nhận"}
            </Button>
          </Modal.Footer>
        </div>
      </Modal>
    </>
  );
};

export default ConfirmCreateAccessory;
