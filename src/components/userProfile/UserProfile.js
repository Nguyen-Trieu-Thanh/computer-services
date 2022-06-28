import React from "react";

//CSS
import "./UserProfile.css";

import {
  Button,
  ButtonGroup,
  Col,
  Container,
  Dropdown,
  Form,
  InputGroup,
  Row,
  Table,
  Nav,
  Tabs,
  Tab,
} from "react-bootstrap";

//Components
import ProfileSetting from "../profileSetting/ProfileSetting";

const UserProfile = () => {
  return (
    <>
      <div className="user-profile-container">
        <Tabs defaultActiveKey="profile" id="user-profile-tabs">
          <Tab eventKey="profile" title="Hồ sơ">
            <ProfileSetting />
          </Tab>
          <Tab eventKey="password" title="Mật khẩu">
            BBB
          </Tab>
        </Tabs>
      </div>
    </>
  );
};

export default UserProfile;
