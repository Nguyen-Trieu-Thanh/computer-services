import React from "react";
import {
  Navbar,
  Nav,
  NavDropdown,
  Form,
  FormControl,
  Button,
} from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";

//CSS
import "./MenuBar.css";

const MenuBar = () => {
  return (
    <>
      <Navbar className="nav-bar" expand="lg">
        <Navbar.Brand as={Link} to="/booking">
          Computer services
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <Nav.Link as={Link} to="/booking">
              Booking
            </Nav.Link>
            <Nav.Link as={Link} to="/order">
              Order
            </Nav.Link>
            <Nav.Link as={Link} to="/staff">
              Staff
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
};

export default MenuBar;
