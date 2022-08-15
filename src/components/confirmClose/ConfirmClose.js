import React from "react";
import { Button, Modal } from "react-bootstrap";

//CSS
import "./ConfirmClose.css";

const ConfirmClose = ({
  showConfirmClose,
  setShowConfirmClose,
  handleClose,
}) => {
  return (
    <>
      <Modal
        show={showConfirmClose}
        onHide={() => {
          setShowConfirmClose(false);
        }}
        centered
      >
        <Modal.Header>
          <Modal.Title>Xác nhận đóng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Những thay đổi sẽ không được lưu lại, bạn vẫn muốn đóng?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowConfirmClose(false);
            }}
          >
            Hủy
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Xác nhận
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ConfirmClose;
