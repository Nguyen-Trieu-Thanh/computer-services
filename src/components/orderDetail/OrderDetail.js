import React from "react";

//React-bootstrap
import { Button, Modal } from "react-bootstrap";

//CSS
import "./OrderDetail.css";

const OrderDetail = ({ showOrderDetail, setShowOrderDetail, orderDetail }) => {
  const handleClose = () => {
    setShowOrderDetail(false);
  };
  return (
    <>
      <Modal
        size="lg"
        show={showOrderDetail}
        onHide={handleClose}
        dialogClassName="order-detail"
      >
        <div className="modal-content-container">
          <Modal.Header closeButton={true}>
            <Modal.Title>Booking No. {orderDetail.number}</Modal.Title>
          </Modal.Header>
          <div className="modal-body-container">
            <Modal.Body>Order ID: {orderDetail.id}</Modal.Body>
            <Modal.Body>Order Booking ID: {orderDetail.bookingId}</Modal.Body>
            <Modal.Body>Order Staff ID: {orderDetail.staffId}</Modal.Body>
            <Modal.Body>Order name: {orderDetail.name}</Modal.Body>
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

export default OrderDetail;
