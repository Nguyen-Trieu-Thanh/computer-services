import React from "react";
import { Container, Row, Col, Form, InputGroup, Button } from "react-bootstrap";

//CSS
import "./ProfileSetting.css";

const ProfileSetting = () => {
  return (
    <>
      <div className="profile-setting-container">
        <Container fluid>
          <Form>
            <Row>
              <Col>
                <Form.Group controlId="formProfileSettingFirstName">
                  <Form.Label>Họ</Form.Label>
                  <Form.Control type="text" value="" />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="formProfileSettingLastName">
                  <Form.Label>Tên</Form.Label>
                  <Form.Control type="text" value="" />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group controlId="formProfileSettingEmail">
                  <Form.Label>Email</Form.Label>
                  <InputGroup>
                    <Form.Control type="text" value="" />
                    <InputGroup.Append>
                      <InputGroup.Text id="profile-setting-email-addon">
                        @gmail.com
                      </InputGroup.Text>
                    </InputGroup.Append>
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="formProfileSettingPhone">
                  <Form.Label>Số điện thoại</Form.Label>
                  <Form.Control type="text" value="" />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group controlId="formProfileSettingPhone">
                  <Form.Label>Địa chỉ</Form.Label>
                  <Form.Control type="text" value="" />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Button className="form-button" variant="primary" type="submit">
                  LƯU THAY ĐỔI
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>
    </>
  );
};

export default ProfileSetting;
