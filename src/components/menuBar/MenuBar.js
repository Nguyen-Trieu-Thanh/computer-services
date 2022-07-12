import React from "react";
import { Button, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";

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
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const MenuBar = () => {
  //API
  const [logout, { isLoading }] = useLogoutMutation();

  //Utilities
  const dispatch = useDispatch();

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
            <Nav.Link as={Link} to="/customer">
              KHÁCH HÀNG
            </Nav.Link>
            <Nav.Link as={Link} to="/staff">
              NHÂN VIÊN
            </Nav.Link>
            <Nav.Link onClick={handleLogout}>ĐĂNG XUẤT</Nav.Link>
          </Nav>
        </Navbar>
      </div>
    </>
  );
};

export default MenuBar;
