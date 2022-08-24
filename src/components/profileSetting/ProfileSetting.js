import React, { useEffect, useRef, useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  InputGroup,
  Button,
  Spinner,
  Card,
  Image,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import {
  useViewOwnedProfileQuery,
  useUpdateProfileAccountMutation,
  useGetAvatarQuery,
  useUpdateImgProfileAccountMutation,
} from "../../redux/slices/account/accountApiSlice";
import moment from "moment";

//Actions
import { setToast } from "../../redux/slices/toast/toastSlice";

//React-redux
import { useDispatch } from "react-redux";

//Images
import defaultUserAvatar from "../../images/default-user-avatar.jpg";

import { Avatar } from "@mui/material";

//CSS
import "./ProfileSetting.css";

const ProfileSetting = () => {
  const { data: profileData, refetch, isFetching } = useViewOwnedProfileQuery();
  const [updateProfileAccount, { isLoading }] =
    useUpdateProfileAccountMutation();

  const [updateImage, { isLoading: isUpdateImageLoading }] =
    useUpdateImgProfileAccountMutation();

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
    phonenum: {
      message: "",
      isInvalid: false,
    },
    email: {
      message: "",
      isInvalid: false,
    },
  });
  const [file, setFile] = useState("");
  const [imgData, setImgData] = useState();
  const [imgLoading, setImgLoading] = useState(true);

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
      setValidation({
        ...validation,
        birth: {
          message: "",
          isInvalid: false,
        },
      });
      return;
    }

    if (name === "phonenum") {
      if (value === "") {
        setProfile({ ...profile, [name]: value });
        setValidation({
          ...validation,
          phonenum: {
            message: "Số điện thoại không được để trống",
            isInvalid: true,
            isValid: false,
          },
        });
        return;
      } else {
        const phonenumRegex = /^(?:\d+|)$/;
        if (!phonenumRegex.test(value)) {
          setProfile({ ...profile, [name]: value });
          setValidation({
            ...validation,
            phonenum: {
              message: "Số điện thoại chỉ được chứa số",
              isInvalid: true,
              isValid: false,
            },
          });
          return;
        } else {
          if (value.length > 10) {
            setProfile({ ...profile, [name]: value });
            setValidation({
              ...validation,
              phonenum: {
                message: "Số điện thoại không được vượt quá 10 số",
                isInvalid: true,
                isValid: false,
              },
            });
            return;
          } else {
            setProfile({ ...profile, [name]: value });
            setValidation({
              ...validation,
              phonenum: {
                message: "",
                isInvalid: false,
                isValid: false,
              },
            });
          }
        }
      }
      return;
    }

    if (name === "email") {
      if (value === "") {
        setProfile({ ...profile, [name]: value });
        setValidation({
          ...validation,
          email: {
            message: "Email không được để trống",
            isInvalid: true,
            isValid: false,
          },
        });
        return;
      } else {
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (!emailRegex.test(value)) {
          setProfile({ ...profile, [name]: value });
          setValidation({
            ...validation,
            email: {
              message: "Email không hợp lệ",
              isInvalid: true,
              isValid: false,
            },
          });
          return;
        } else {
          setProfile({ ...profile, [name]: value });
          setValidation({
            ...validation,
            email: {
              message: "",
              isInvalid: false,
              isValid: false,
            },
          });
        }
      }
      return;
    }
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

    if (profile.birth === "Invalid date") {
      setValidation({
        ...validation,
        birth: {
          message: "Xin hãy chọn ngày",
          isInvalid: true,
        },
      });
      return;
    }

    if (profile.phonenum === "") {
      setValidation({
        ...validation,
        phonenum: {
          message: "Số điện thoại không được để trống",
          isInvalid: true,
          isValid: false,
        },
      });
      return;
    }

    if (profile.email === "") {
      setValidation({
        ...validation,
        email: {
          message: "Email không được để trống",
          isInvalid: true,
          isValid: false,
        },
      });
      return;
    }

    if (
      !validation.name.isInvalid &&
      !validation.phonenum.isInvalid &&
      !validation.birth.isInvalid &&
      !validation.email.isInvalid
    ) {
      try {
        await updateProfileAccount(profile)
          .unwrap()
          .then(async (res) => {
            if (res) {
              if (file) {
                const formData = new FormData();
                formData.append("img", file);
                try {
                  await updateImage(formData)
                    .unwrap()
                    .then((imgRes) => {
                      if (imgRes) {
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
                        setFile();
                        setImgData();
                        refetch();
                      }
                    });
                } catch (error) {
                  if (error) {
                    if (error.data) {
                      dispatch(
                        setToast({
                          show: true,
                          title: "Cập nhật hồ sơ",
                          time: "just now",
                          content: error.data,
                          color: {
                            header: "#ffcccc",
                            body: "#e60000",
                          },
                        })
                      );
                      refetch();
                    } else {
                      dispatch(
                        setToast({
                          show: true,
                          title: "Cập nhật hồ sơ",
                          time: "just now",
                          content: "Đã xảy ra lỗi. Xin thử lại sau",
                          color: {
                            header: "#ffcccc",
                            body: "#e60000",
                          },
                        })
                      );
                    }
                  }
                }
              } else {
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
            }
          });
      } catch (error) {
        if (error) {
          if (error.data) {
            dispatch(
              setToast({
                show: true,
                title: "Cập nhật hồ sơ",
                time: "just now",
                content: error.data,
                color: {
                  header: "#ffcccc",
                  body: "#e60000",
                },
              })
            );
            refetch();
          } else {
            dispatch(
              setToast({
                show: true,
                title: "Cập nhật hồ sơ",
                time: "just now",
                content: "Đã xảy ra lỗi. Xin thử lại sau",
                color: {
                  header: "#ffcccc",
                  body: "#e60000",
                },
              })
            );
          }
        }
      }
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      if (
        e.target.files[0].type === "image/png" ||
        e.target.files[0].type === "image/jpeg" ||
        e.target.files[0].type === "image/jpg"
      ) {
        setFile(e.target.files[0]);
        const reader = new FileReader();
        reader.addEventListener("load", () => {
          setImgData(reader.result);
        });
        reader.readAsDataURL(e.target.files[0]);
      } else {
        dispatch(
          setToast({
            show: true,
            title: "Tải lên ảnh đại diện",
            time: "just now",
            content:
              "Ảnh chỉ nhận định dạng .png, .jpg hoặc .jpeg. Xin hãy thử lại",
            color: {
              header: "#ffcccc",
              body: "#e60000",
            },
          })
        );
      }
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
          <Form noValidate onSubmit={handleProfileSubmit}>
            <Row>
              <Col>
                <Row>
                  <Col>
                    <Card.Title>Thông tin cá nhân</Card.Title>
                  </Col>
                </Row>
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
                        isInvalid={validation.birth.isInvalid}
                        type="date"
                        name="birth"
                        value={moment(profile.birth).format("YYYY-MM-DD")}
                        onChange={handleProfileChange}
                      />
                      <Form.Control.Feedback type="invalid">
                        {validation.birth.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group controlId="formProfileSettingPhonenum">
                      <Form.Label>Số điện thoại:</Form.Label>
                      <Form.Control
                        isInvalid={validation.phonenum.isInvalid}
                        type="text"
                        name="phonenum"
                        value={profile.phonenum}
                        onChange={handleProfileChange}
                      />
                      <Form.Control.Feedback type="invalid">
                        {validation.phonenum.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="formProfileSettingEmail">
                      <Form.Label>Email:</Form.Label>
                      <Form.Control
                        isInvalid={validation.email.isInvalid}
                        type="text"
                        name="email"
                        value={profile.email}
                        onChange={handleProfileChange}
                      />
                      <Form.Control.Feedback type="invalid">
                        {validation.email.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Button
                      disabled={isLoading || isUpdateImageLoading}
                      className="save-button"
                      variant="primary"
                      type="submit"
                    >
                      {isLoading || isUpdateImageLoading ? (
                        <Spinner animation="border" />
                      ) : (
                        "Lưu thay đổi"
                      )}
                    </Button>
                  </Col>
                </Row>
              </Col>
              <Col xs={4}>
                <Row>
                  <Col>
                    <Card.Title>Ảnh đại diện</Card.Title>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group
                      controlId="formProfileSettingAvatar"
                      className="image-container"
                    >
                      <OverlayTrigger
                        placement="bottom"
                        overlay={
                          <Tooltip
                            className="avatar-edit-button"
                            id="avatar-tooltip"
                          >
                            Tải lên ảnh mới
                          </Tooltip>
                        }
                      >
                        <Form.Label>
                          <Avatar
                            src={
                              imgData
                                ? imgData
                                : !profile.imgURL || imgLoading
                                ? defaultUserAvatar
                                : profile.imgURL
                            }
                            onLoad={() => setImgLoading(false)}
                            sx={{
                              width: "30vh",
                              height: "30vh",
                              border: "1px solid #000000",
                            }}
                          />
                        </Form.Label>
                      </OverlayTrigger>
                      <Form.File
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: "none" }}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
};

export default ProfileSetting;
