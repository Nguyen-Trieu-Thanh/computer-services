import React from "react";
import {
  Navbar,
  Nav,
  NavDropdown,
  Form,
  FormControl,
  Button,
  Row,
  Col,
} from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";

//CSS
import "./MenuBar.css";

//Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";

const MenuBar = () => {
  return (
    <>
      <div className="nav-bar">
        <Link className="user-avatar" to="/userProfile">
          <FontAwesomeIcon icon={faCircleUser} color="#000000" />
        </Link>
        <Navbar expand="lg">
          <Nav className="nav flex-column">
            <Nav.Link as={Link} to="/dashboard">
              DASHBOARD
            </Nav.Link>
            <Nav.Link as={Link} to="/booking">
              LỊCH HẸN
            </Nav.Link>
            <Nav.Link as={Link} to="/order">
              ĐƠN HÀNG
            </Nav.Link>
            <Nav.Link as={Link} to="/staff">
              NHÂN VIÊN
            </Nav.Link>
            <Nav.Link as={Link} to="/">
              ĐĂNG XUẤT
            </Nav.Link>
          </Nav>
        </Navbar>
      </div>
    </>
  );
};

export default MenuBar;
