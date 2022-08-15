import React, { useEffect, useState } from "react";

//Redux
//Actions

//API Actions
import { useGetAccessoriesQuery } from "../../redux/slices/accessory/accessoryApiSlice";

//React-redux

//React-bootstrap
import {
  Button,
  OverlayTrigger,
  Spinner,
  Table,
  Tooltip,
} from "react-bootstrap";

//CSS
import "./ManageAccessory.css";

//Components
import ConfirmCreateAccessory from "../confirmCreateAccessory/ConfirmCreateAccessory";
import CreateAccessory from "../createAccessory/CreateAccessory";

//Icons
import { faPenToSquare, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//momentjs
import moment from "moment";

const ManageAccessory = () => {
  const {
    data: accessoriesData = [],
    refetch,
    isFetching,
  } = useGetAccessoriesQuery();

  //Local state
  const [accessories, setAccessories] = useState([]);
  const [accessory, setAccessory] = useState({
    name: "",
    price: "",
    description: "",
    insurance: "",
    supplier_id: "Intel",
  });
  const [showCreateAccessory, setShowCreateAccessory] = useState(false);
  const [showConfirmCreateAccessory, setShowConfirmCreateAccessory] =
    useState(false);
  const [isRefetch, setIsRefetch] = useState(false);

  useEffect(() => {
    if (isRefetch) {
      refetch();
      setIsRefetch(false);
    }
  }, [isRefetch]);

  useEffect(() => {
    if (!isFetching) {
      setAccessories([...accessoriesData].reverse().slice(0, 10));
    }
  }, [isFetching]);

  if (isFetching) {
    return (
      <>
        <div className="loading mt-3">
          <Spinner animation="border" />
          <div className="loading-text">Đang tải dữ liệu...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="manage-accessory-container">
        <div className="button-container">
          <Button
            variant="primary"
            onClick={() => {
              setShowCreateAccessory(true);
            }}
          >
            TẠO PHỤ KIỆN <FontAwesomeIcon icon={faPlus} color="" />
          </Button>
        </div>
        <div className="table-container">
          <Table bordered hover size="sm">
            <thead>
              <tr>
                <th>#</th>
                <th>TÊN PHỤ KIỆN</th>
                <th>GIÁ PHỤ KIỆN (VNĐ)</th>
                <th>THỜI HẠN BẢO HÀNH</th>
                <th>NHÀ CUNG CẤP</th>
                <th>NGÀY THÊM MỚI (MM/DD/YYYY)</th>
                <th style={{ width: "200px" }}>HÀNH ĐỘNG</th>
              </tr>
            </thead>
            <tbody>
              {accessories.map((accessory, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{accessory.name}</td>
                    <td>{accessory.price}</td>
                    <td>{accessory.insurance}</td>
                    <td>{accessory.supplier_id?.name}</td>
                    <td>{moment(accessory.updatedAt).format("MM/DD/YYYY")}</td>
                    <td>
                      <OverlayTrigger
                        placement="bottom"
                        delay={{ show: 200, hide: 100 }}
                        overlay={
                          <Tooltip
                            className="accessory-edit-button"
                            id="edit-button-tooltip"
                          >
                            CHI TIẾT
                          </Tooltip>
                        }
                      >
                        <Button
                          variant="primary"
                          onClick={() => {
                            // setShowAccessoryDetail(true);
                            // setAccessoryDetail({ ...accessory });
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faPenToSquare}
                            color="#ffffff"
                          />
                        </Button>
                      </OverlayTrigger>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      </div>
      <CreateAccessory
        showCreateAccessory={showCreateAccessory}
        setShowCreateAccessory={setShowCreateAccessory}
        accessory={accessory}
        setAccessory={setAccessory}
        setShowConfirmCreateAccessory={setShowConfirmCreateAccessory}
      />
      <ConfirmCreateAccessory
        setShowCreateAccessory={setShowCreateAccessory}
        accessory={accessory}
        setIsRefetch={setIsRefetch}
        setShowConfirmCreateAccessory={setShowConfirmCreateAccessory}
        showConfirmCreateAccessory={showConfirmCreateAccessory}
      />
    </>
  );
};

export default ManageAccessory;
