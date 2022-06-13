import React from "react";
import { Outlet } from "react-router-dom";

//Components
import MenuBar from "../menuBar/MenuBar";

//CSS
import "./Layout.css";

const Layout = () => {
  return (
    <>
      <MenuBar />
      <div className="page">
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
