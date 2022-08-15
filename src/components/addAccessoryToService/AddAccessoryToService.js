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
  setShowServiceDetail,
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
    setShowServiceDetail(true);
  };

  const handleAccessoriesChange = (e) => {
    let newAccessories = [...serviceDetail.accessories_id];
    let newAccessory = accessories.find((x) => x._id === e.target.value);

    newAccessory = {
      ...newAccessory,
      supplier_id: newAccessory.supplier_id._id,
    };

    if (newAccessories.map((x) => x._id).includes(newAccessory._id)) {
      const index = newAccessories.indexOf(newAccessory);
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
      setAccessories([...accessoriesData].reverse().slice(0, 10));
    }
  }, [isFetching]);

  // if (isFetching) {
  //   return (
  //     <>
  //       <div className="loading mt-3">
  //         <Spinner animation="border" />
  //         <div className="loading-text">Đang tải dữ liệu...</div>
  //       </div>
  //     </>
  //   );
  // }

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
                          <th>TÊN PHỤ KIỆN</th>
                          <th>GIÁ PHỤ KIỆN</th>
                          <th>NHÀ CUNG CẤP</th>
                          <th>HÀNH ĐỘNG</th>
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
