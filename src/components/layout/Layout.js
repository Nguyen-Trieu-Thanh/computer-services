import React, { useState } from "react";
import { Outlet } from "react-router-dom";

//Redux
//Actions
import { setToast } from "../../redux/slices/toast/toastSlice";

//React-redux
import { useDispatch, useSelector } from "react-redux";

//React bootstrap
import { Card, Toast } from "react-bootstrap";

//Components
import MenuBar from "../menuBar/MenuBar";

//CSS
import "./Layout.css";

const Layout = () => {
  //Global state
  const toast = useSelector((state) => state.toast);
  const dispatch = useDispatch();

  const handleToastClose = () => {
    dispatch(setToast({ ...toast, show: false }));
  };

  return (
    <>
      <Toast
        show={toast.show}
        onClose={handleToastClose}
        delay={3000}
        autohide
        animation={false}
      >
        <Toast.Header style={{ backgroundColor: toast.color.header }}>
          <strong className="mr-auto">{toast.title}</strong>
          <small>{toast.time}</small>
        </Toast.Header>
        <Toast.Body
          style={{ backgroundColor: toast.color.body, color: "#ffffff" }}
        >
          {toast.content}
        </Toast.Body>
      </Toast>
      <MenuBar />
      <div className="page">
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
