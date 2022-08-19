import React, { useState } from "react";
import { Button, Nav, Navbar, Accordion, Image } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

//Redux
//Actions
import {
  selectCurrentRole,
  selectCurrentUsername,
  setCredentials,
  setRememberMe,
} from "../../redux/slices/auth/authSlice";

//API Actions
import { useLogoutMutation } from "../../redux/slices/auth/authApiSlice";

//React-redux
import { useDispatch, useSelector } from "react-redux";

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
import {
  useGetAccountDetailByUsernameQuery,
  useViewOwnedProfileQuery,
} from "../../redux/slices/account/accountApiSlice";

import { Avatar } from "@mui/material";

const MenuBar = () => {
  //Global state
  const isAdmin = useSelector(selectCurrentRole) === "admin";
  const username = useSelector(selectCurrentUsername);

  //Local state
  const [isCollapse, setIsCollapse] = useState(false);
  const [imgLoading, setImgLoading] = useState(true);

  //API
  const [logout, { isLoading }] = useLogoutMutation();
  const { data, refetch, isFetching } = useViewOwnedProfileQuery();

  //Utilities
  const dispatch = useDispatch();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout()
        .unwrap()
        .then(async (res) => {
          await dispatch(
            setCredentials({ username: null, accessToken: null, role: "" })
          );
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
            <Nav.Item className="user-avatar">
              <Nav.Link as={Link} to="/userProfile">
                <Avatar
                  src={
                    !data?.img || imgLoading
                      ? defaultUserAvatar
                      : `http://localhost:5500/account/avatar/${data.img}`
                  }
                  onLoad={() => setImgLoading(false)}
                  sx={{
                    width: "150px",
                    height: "150px",
                    border: "1px solid #000000",
                  }}
                />
              </Nav.Link>
            </Nav.Item>
            <Nav.Item className="menu-button">
              <Nav.Link as={Link} to="/dashboard" eventKey="/dashboard">
                Dashboard
              </Nav.Link>
            </Nav.Item>
            {!isAdmin && (
              <Nav.Item className="menu-button">
                <Nav.Link as={Link} to="/booking" eventKey="/booking">
                  Lịch hẹn
                </Nav.Link>
              </Nav.Item>
            )}

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
                  Tài khoản
                  <FontAwesomeIcon
                    icon={isCollapse ? faAngleUp : faAngleDown}
                    color="#000000"
                  />
                </Nav.Link>
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="0">
                <Nav.Item className="menu-button">
                  <Nav.Link as={Link} to="/customer" eventKey="/customer">
                    Khách hàng
                  </Nav.Link>
                </Nav.Item>
              </Accordion.Collapse>

              {isAdmin ? (
                <Accordion.Collapse eventKey="0">
                  <Nav.Item className="menu-button">
                    <Nav.Link as={Link} to="/manager" eventKey="/staff">
                      Quản lí
                    </Nav.Link>
                  </Nav.Item>
                </Accordion.Collapse>
              ) : (
                <Accordion.Collapse eventKey="0">
                  <Nav.Item className="menu-button">
                    <Nav.Link as={Link} to="/staff" eventKey="/staff">
                      Nhân viên
                    </Nav.Link>
                  </Nav.Item>
                </Accordion.Collapse>
              )}
            </Accordion>

            <Nav.Item className="menu-button">
              <Nav.Link as={Link} to="/service" eventKey="/service">
                Dịch vụ
              </Nav.Link>
            </Nav.Item>

            <Nav.Item className="menu-button">
              <Nav.Link as={Link} to="/accessory" eventKey="/accessory">
                Phụ kiện
              </Nav.Link>
            </Nav.Item>

            {/* <Nav.Item className="menu-button">
              <Nav.Link as={Link} to="/schedule" eventKey="/schedule">
                Lịch làm việc
              </Nav.Link>
            </Nav.Item> */}

            <Nav.Item className="log-out-button menu-button">
              <Nav.Link onClick={handleLogout} eventKey="/logout">
                Đăng xuất
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Navbar>
      </div>
    </>
  );
};

export default MenuBar;
