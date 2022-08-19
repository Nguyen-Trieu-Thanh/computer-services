import React, { useEffect, useState } from "react";

//Redux

//API Actions
import { useGetAccessoriesQuery } from "../../redux/slices/accessory/accessoryApiSlice";

//React-bootstrap
import { Button, Col, Form, Modal, Row, Spinner, Table } from "react-bootstrap";

//React-redux

//momentjs
import moment from "moment";

//CSS
import "./AddAccessoryToService.css";

const AddAccessoryToService = ({
  showAddAccessoryToService,
  setShowAddAccessoryToService,
  serviceDetail,
  setServiceDetail,
}) => {
  const {
    data: accessoriesData = [],
    refetch,
    isFetching,
  } = useGetAccessoriesQuery();

  //Local state
  const [accessories, setAccessories] = useState([]);

  const handleClose = () => {
    setShowAddAccessoryToService(false);
  };

  const handleAccessoriesChange = (e) => {
    let newAccessories = [...serviceDetail.accessories_id];
    let newAccessory = accessories.find((x) => x._id === e.target.value);

    newAccessory = {
      ...newAccessory,
      type: newAccessory.type,
      brandCom: serviceDetail.brand,
    };

    if (newAccessories.map((x) => x._id).includes(newAccessory._id)) {
      const index = newAccessories.map((x) => x._id).indexOf(newAccessory._id);
      newAccessories.splice(index, 1);
    } else {
      newAccessories.push(newAccessory);
    }

    setServiceDetail({
      ...serviceDetail,
      accessories_id: [...newAccessories],
    });
  };

  useEffect(() => {
    if (!isFetching) {
      setAccessories([...accessoriesData]);
    }
  }, [isFetching]);

  return (
    <>
      <Modal
        show={showAddAccessoryToService}
        onHide={handleClose}
        dialogClassName="add-accessory-to-service"
        centered
      >
        <div className="modal-content-container">
          <Modal.Header>
            <Modal.Title>Thêm phụ kiện vào dịch vụ</Modal.Title>
          </Modal.Header>
          <Modal.Body className="modal-body-container">
            {isFetching ? (
              <div className="loading">
                <Spinner animation="border" />
                <div className="loading-text">Đang tải dữ liệu...</div>
              </div>
            ) : (
              <Row>
                <Col>
                  <Form.Label>Dịch vụ bao gồm phụ kiện:</Form.Label>
                  <div className="table-container">
                    <Table bordered size="sm">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Tên phụ kiện</th>
                          <th>Giá phụ kiện</th>
                          <th>Nhà cung cấp</th>
                          <th>Loại máy tính</th>
                          <th>Hành động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {accessories.map((accessory, index) => {
                          return (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{accessory.name}</td>
                              <td>{accessory.price}</td>
                              <td>{accessory.supplier_id?.name}</td>
                              <td>{accessory.type}</td>
                              <td>
                                <Form.Check
                                  inline
                                  value={accessory._id}
                                  checked={serviceDetail.accessories_id
                                    ?.map((x) => x._id)
                                    .includes(accessory._id)}
                                  onChange={handleAccessoriesChange}
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </div>
                </Col>
              </Row>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Đóng
            </Button>
            <Button variant="primary" onClick={handleClose}>
              Xác nhận
            </Button>
          </Modal.Footer>
        </div>
      </Modal>
    </>
  );
};

export default AddAccessoryToService;
