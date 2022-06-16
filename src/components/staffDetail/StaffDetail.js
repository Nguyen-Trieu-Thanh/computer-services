import React from "react";

//React-bootstrap
import { Button, Modal } from "react-bootstrap";

//CSS
import "./StaffDetail.css";

const StaffDetail = ({ showStaffDetail, setShowStaffDetail, staffDetail }) => {
  const handleClose = () => {
    setShowStaffDetail(false);
  };

  return (
    <>
      <Modal
        size="lg"
        show={showStaffDetail}
        onHide={handleClose}
        dialogClassName="order-detail"
      >
        <div className="modal-content-container">
          <Modal.Header closeButton={true}>
            <Modal.Title>Staff No. {staffDetail.number}</Modal.Title>
          </Modal.Header>
          <div className="modal-body-container">
            <Modal.Body>Staff ID: {staffDetail.id}</Modal.Body>
            <Modal.Body>Staff Name: {staffDetail.name}</Modal.Body>
          </div>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleClose}>
              Save Changes
            </Button>
          </Modal.Footer>
        </div>
      </Modal>
    </>
  );
};

export default StaffDetail;
