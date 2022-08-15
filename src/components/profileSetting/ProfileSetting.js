import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  InputGroup,
  Button,
  Spinner,
  Card,
} from "react-bootstrap";
import {
  useViewOwnedProfileQuery,
  useUpdateProfileAccountMutation,
} from "../../redux/slices/account/accountApiSlice";
import moment from "moment";

//Actions
import { setToast } from "../../redux/slices/toast/toastSlice";

//React-redux
import { useDispatch } from "react-redux";

//CSS
import "./ProfileSetting.css";

const ProfileSetting = () => {
  const { data: profileData, refetch, isFetching } = useViewOwnedProfileQuery();
  const [updateProfileAccount, { isLoading }] =
    useUpdateProfileAccountMutation();

  //Local state
  const [profile, setProfile] = useState();
  const [validation, setValidation] = useState({
    name: {
      message: "",
      isInvalid: false,
    },
    birth: {
      message: "",
      isInvalid: false,
    },
    phoenum: {
      message: "",
      isInvalid: false,
    },
    email: {
      message: "",
      isInvalid: false,
    },
  });
  const dispatch = useDispatch();

  const handleProfileChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    if (name === "name") {
      const nameRegex =
        /^[A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]*(?:[ ][A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]*)*$/;
      if (!nameRegex.test(value)) {
        setProfile({ ...profile, [name]: value });
        setValidation({
          ...validation,
          name: {
            message: "Họ và tên không hợp lệ",
            isInvalid: true,
          },
        });
        return;
      } else {
        setProfile({ ...profile, [name]: value });
        setValidation({
          ...validation,
          name: {
            message: "",
            isInvalid: false,
          },
        });
      }
      return;
    }

    if (name === "birth") {
      setProfile({ ...profile, [name]: moment(value).format() });
      return;
    }

    setProfile({ ...profile, [name]: value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    if (profile.name === "") {
      setValidation({
        ...validation,
        name: {
          message: "Họ và tên không được để trống",
          isInvalid: true,
        },
      });
      return;
    }
    try {
      await updateProfileAccount(profile)
        .unwrap()
        .then((res) => {
          if (res) {
            dispatch(
              setToast({
                show: true,
                title: "Cập nhật hồ sơ",
                time: "just now",
                content: "Hồ sơ được cập nhật thành công",
                color: {
                  header: "#dbf0dc",
                  body: "#41a446",
                },
              })
            );
            refetch();
          }
        });
    } catch (error) {}
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      // handleImageUpload(e.target.files[0]);
      // console.log(e.target.files[0]);
    }
  };

  useEffect(() => {
    if (!isFetching) {
      setProfile({ ...profileData });
    }
  }, [isFetching]);

  if (isFetching || !profile) {
    return (
      <>
        <div className="loading mt-3">
          <Spinner animation="border" />
          <div className="loading-text">Đang tải dữ liệu...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Card className="profile-setting-container">
        <Card.Body>
          <Form onSubmit={handleProfileSubmit}>
            <Row>
              <Col>
                <Form.Group controlId="formProfileSettingUsername">
                  <Form.Label>Họ và tên:</Form.Label>
                  <Form.Control
                    isInvalid={validation.name.isInvalid}
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleProfileChange}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validation.name.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="formProfileSettingBirth">
                  <Form.Label>Ngày sinh:</Form.Label>
                  <Form.Control
                    type="date"
                    name="birth"
                    value={moment(profile.birth).format("YYYY-MM-DD")}
                    onChange={handleProfileChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group controlId="formProfileSettingPhonenum">
                  <Form.Label>Số điện thoại:</Form.Label>
                  <Form.Control
                    type="text"
                    name="phonenum"
                    value={profile.phonenum}
                    onChange={handleProfileChange}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="formProfileSettingEmail">
                  <Form.Label>Email:</Form.Label>
                  <Form.Control
                    type="text"
                    name="email"
                    value={profile.email}
                    onChange={handleProfileChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            {/* <Row>
              <Col>
                <Form.Group>
                  <Form.File
                    accept="image/*"
                    type="file"
                    id="formProfileSettingImage"
                    label="Example file input"
                    onChange={handleImageChange}
                  />
                </Form.Group>
              </Col>
            </Row> */}
            <Row>
              <Col>
                <Button
                  disabled={isLoading}
                  className="save-button"
                  variant="primary"
                  type="submit"
                >
                  {isLoading ? <Spinner animation="border" /> : "Lưu thay đổi"}
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
};

export default ProfileSetting;
