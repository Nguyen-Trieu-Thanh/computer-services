import React from "react";

//React-bootstrap
import { Button, Modal } from "react-bootstrap";

//CSS
import "./BookingDetail.css";

const BookingDetail = ({
  showBookingDetail,
  setShowBookingDetail,
  bookingDetail,
}) => {
  const handleClose = () => {
    setShowBookingDetail(false);
  };

  return (
    <>
      <Modal
        size="lg"
        show={showBookingDetail}
        onHide={handleClose}
        dialogClassName="booking-detail"
      >
        <div className="modal-content-container">
          <Modal.Header closeButton={true}>
            <Modal.Title>Booking No. {bookingDetail.number}</Modal.Title>
          </Modal.Header>
          <div className="modal-body-container">
            <Modal.Body>Booking ID: {bookingDetail.id}</Modal.Body>
            <Modal.Body>Booking name: {bookingDetail.name}</Modal.Body>
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

export default BookingDetail;
