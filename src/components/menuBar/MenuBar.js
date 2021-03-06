import React, { useState } from "react";
import { Button, Nav, Navbar, Accordion, Image } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

//Redux
//Actions
import {
  setCredentials,
  setRememberMe,
} from "../../redux/slices/auth/authSlice";

//API Actions
import { useLogoutMutation } from "../../redux/slices/auth/authApiSlice";

//React-redux
import { useDispatch } from "react-redux";

//CSS
import "./MenuBar.css";

//Icons
import {
  faCircleUser,
  faAngleDown,
  faAngleLeft,
  faAngleUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//Images
import defaultUserAvatar from "../../images/default-user-avatar.jpg";

const MenuBar = () => {
  //Local state
  const [isCollapse, setIsCollapse] = useState(false);

  //API
  const [logout, { isLoading }] = useLogoutMutation();

  //Utilities
  const dispatch = useDispatch();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout()
        .unwrap()
        .then(async (res) => {
          await dispatch(setCredentials({ username: null, accessToken: null }));
          await dispatch(setRememberMe({ rememberMe: false }));
          await localStorage.setItem("rememberMe", false);
        });
    } catch (error) {}
  };

  return (
    <>
      <div className="nav-bar">
        <Navbar expand="lg">
          <Nav className="nav flex-column" activeKey={location.pathname}>
            <Nav.Item>
              <div className="user-avatar">
                <Link to="/userProfile">
                  <Image src={defaultUserAvatar} roundedCircle fluid />
                </Link>
              </div>
            </Nav.Item>
            <Nav.Item className="menu-button">
              <Nav.Link as={Link} to="/dashboard" eventKey="/dashboard">
                Dashboard
              </Nav.Link>
            </Nav.Item>

            <Nav.Item className="menu-button">
              <Nav.Link as={Link} to="/booking" eventKey="/booking">
                L???ch h???n
              </Nav.Link>
            </Nav.Item>

            <Nav.Item className="menu-button">
              <Nav.Link as={Link} to="/order" eventKey="/order">
                ????n h??ng
              </Nav.Link>
            </Nav.Item>

            <Accordion>
              <Accordion.Toggle
                className="menu-button"
                as={Nav.Item}
                eventKey="0"
                onClick={() => {
                  setIsCollapse(!isCollapse);
                }}
              >
                <Nav.Link>
                  T??i kho???n
                  <FontAwesomeIcon
                    icon={isCollapse ? faAngleUp : faAngleDown}
                    color="#000000"
                  />
                </Nav.Link>
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="0">
                <Nav.Item className="menu-button">
                  <Nav.Link as={Link} to="/customer" eventKey="/customer">
                    Kh??ch h??ng
                  </Nav.Link>
                </Nav.Item>
              </Accordion.Collapse>
              <Accordion.Collapse eventKey="0">
                <Nav.Item className="menu-button">
                  <Nav.Link as={Link} to="/staff" eventKey="/staff">
                    Nh??n vi??n
                  </Nav.Link>
                </Nav.Item>
              </Accordion.Collapse>
            </Accordion>

            <Nav.Item className="menu-button">
              <Nav.Link as={Link} to="/service" eventKey="/service">
                D???ch v???
              </Nav.Link>
            </Nav.Item>

            <Nav.Item className="menu-button">
              <Nav.Link as={Link} to="/accessory" eventKey="/accessory">
                Ph??? ki???n
              </Nav.Link>
            </Nav.Item>

            <Nav.Item className="log-out-button menu-button">
              <Nav.Link onClick={handleLogout} eventKey="/logout">
                ????ng xu???t
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Navbar>
      </div>
    </>
  );
};

export default MenuBar;
