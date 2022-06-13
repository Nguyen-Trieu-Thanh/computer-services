import React from "react";
import {
  Navbar,
  Nav,
  NavDropdown,
  Form,
  FormControl,
  Button,
} from "react-bootstrap";

//CSS
import "./MenuBar.css";

const MenuBar = () => {
  return (
    <>
      <Navbar className="nav-bar" expand="lg">
        <Navbar.Brand href="/home">Computer Services</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <Nav.Link href="">Booking</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
};

export default MenuBar;
