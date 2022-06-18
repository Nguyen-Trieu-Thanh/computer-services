import React from "react";

//React-bootstrap
import { Card } from "react-bootstrap";

//CSS
import "./Dashboard.css";

//Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleUp,
  faAngleDown,
  faPlus,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";

const Dashboard = () => {
  return (
    <>
      <div className="dashboard-page-title">DASHBOARD</div>
      <div className="dashboard-container">
        <Card className="dashboard-card">
          <Card.Header className="dashboard-card-header">
            <div>Lịch Hẹn</div>
            <div className="profit">
              <FontAwesomeIcon icon={faPlus} size="xs" />
              <span>6%</span>
              <FontAwesomeIcon icon={faAngleUp} />
            </div>
          </Card.Header>
          <Card.Body className="dashboard-card-body">
            <Card.Title>25</Card.Title>
            <Card.Text>Lịch Hẹn Mới</Card.Text>
          </Card.Body>
        </Card>

        <Card className="dashboard-card">
          <Card.Header className="dashboard-card-header">
            <div>Order</div>
            <div className="loss">
              <FontAwesomeIcon icon={faMinus} size="xs" />
              <span>3%</span>
              <FontAwesomeIcon icon={faAngleDown} />
            </div>
          </Card.Header>
          <Card.Body className="dashboard-card-body">
            <Card.Title>25</Card.Title>
            <Card.Text>Order Mới</Card.Text>
          </Card.Body>
        </Card>

        <Card className="dashboard-card">
          <Card.Header className="dashboard-card-header">
            <div>Placeholder</div>
            <div className="profit">
              <FontAwesomeIcon icon={faPlus} size="xs" />
              <span>12%</span>
              <FontAwesomeIcon icon={faAngleUp} />
            </div>
          </Card.Header>
          <Card.Body className="dashboard-card-body">
            <Card.Title>25</Card.Title>
            <Card.Text>Placeholder Mới</Card.Text>
          </Card.Body>
        </Card>
      </div>
    </>
  );
};

export default Dashboard;
