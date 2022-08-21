import React from "react";
import { useParams } from "react-router-dom";
import { useGetAccountDetailByIdQuery } from "../../redux/slices/account/accountApiSlice";

//React-bootstrap
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  OverlayTrigger,
  Pagination,
  Row,
  Spinner,
  Table,
  Tooltip,
} from "react-bootstrap";

//CSS
import "./ManagerDetail.css";

const ManagerDetail = () => {
  const { account_id } = useParams();

  const {
    data: managerDetailData,
    refetch,
    isFetching,
  } = useGetAccountDetailByIdQuery(account_id);

  console.log(managerDetailData);

  return <Container fluid className="customer-detail-container"></Container>;
};

export default ManagerDetail;
