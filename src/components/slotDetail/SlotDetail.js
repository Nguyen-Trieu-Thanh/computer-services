import React from "react";

//React-bootstrap
import { Button, Modal, Form, Row, Col, Spinner, Table } from "react-bootstrap";

//CSS
import "./SlotDetail.css";

const SlotDetail = ({ slotDetail, showSlotDetail, setShowSlotDetail }) => {
  const handleClose = () => {
    setShowSlotDetail(false);
  };
  return (
    <Modal
      show={showSlotDetail}
      onHide={handleClose}
      dialogClassName="slot-detail"
      centered
    >
      <div className="modal-content-container">
        <Modal.Header>
          <Modal.Title>
            Danh sách nhân viên làm việc tại slot {slotDetail.slot} ({slotDetail.date})
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-container">
          <Table bordered>
            <thead>
              <tr>
                <th>#</th>
                <th>Tên nhân viên</th>
                <th>Số điện thoại</th>
              </tr>
            </thead>
            <tbody>
              {slotDetail.work_slots.map((work_slot, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{work_slot.staff_id.user_id.name}</td>
                    <td>{work_slot.staff_id.user_id.phonenum}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
        </Modal.Footer>
      </div>
    </Modal>
  );
};

export default SlotDetail;
