import React, { useState } from "react";

import {
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
  Spinner,
} from "react-bootstrap";

//API Actions
import { useGetAccountByUsernameMutation } from "../../redux/slices/account/accountApiSlice";
import { useGetServicesQuery } from "../../redux/slices/service/serviceApiSlice";

//momentjs
import moment from "moment";

//Data
import districts from "../../datas/HoChiMinhCityDistricts";

//Components
import ConfirmCreateBooking from "../confirmCreateBooking/ConfirmCreateBooking";

//CSS
import "./CreateBooking.css";

const CreateBooking = () => {
  const [getAccountByUsername, { isLoading }] =
    useGetAccountByUsernameMutation();

  const {
    data: servicesData = [],
    refetch: servicesRefetch,
    isFetching: isServiceFetching,
  } = useGetServicesQuery();

  //Local state
  const [booking, setBooking] = useState({
    acc_id: "",
    cus_name: "",
    services: [],
    description: "",
    type: "Sửa tại nhà",
    cus_address: {
      city: "Thành phố Hồ Chí Minh",
      district: "Quận 1",
      ward: "Phường Tân Định",
      street: "",
    },
    time: moment().format(),
    status: "Đã tiếp nhận",
    phonenum: "",
  });
  const [validation, setValidation] = useState({
    phonenum: {
      message: "",
      isInvalid: false,
    },
    description: {
      message: "",
      isInvalid: false,
    },
    time: {
      message: "",
      isInvalid: false,
    },
    street: {
      message: "",
      isInvalid: false,
    },
  });
  const [showConfirmCreateBooking, setShowConfirmCreateBooking] =
    useState(false);

  const handleCreateBookingChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    if (name === "phonenum") {
      const phonenumRegex = /^(?:\d+|)$/;

      if (!phonenumRegex.test(value)) {
        setBooking({ ...booking, [name]: value });
        setValidation({
          ...validation,
          phonenum: {
            message: "Số điện thoại chỉ được chứa số",
            isInvalid: true,
          },
        });
        return;
      } else {
        if (value.length > 10) {
          setBooking({ ...booking, [name]: value });
          setValidation({
            ...validation,
            phonenum: {
              message: "Số điện thoại không được vượt quá 10 số",
              isInvalid: true,
            },
          });
          return;
        } else {
          setBooking({
            ...booking,
            [name]: value,
          });
          setValidation({
            ...validation,
            phonenum: {
              message: "",
              isInvalid: false,
            },
          });
        }
      }
      return;
    }

    if (name === "description") {
      if (value.length > 200) {
        setBooking({ ...booking, [name]: value });
        setValidation({
          ...validation,
          description: {
            message: "Số lượng từ vượt quá giới hạn",
            isInvalid: true,
          },
        });
        return;
      } else {
        setBooking({ ...booking, [name]: value });
        setValidation({
          ...validation,
          description: {
            message: "",
            isInvalid: false,
          },
        });
      }
    }

    if (name === "time") {
      if (moment(value).isBefore(moment().format("YYYY-MM-DD"))) {
        setBooking({ ...booking, [name]: moment(value).format() });
        setValidation({
          ...validation,
          time: {
            message: "Ngày không được nhỏ hơn ngày hôm nay",
            isInvalid: true,
          },
        });
        return;
      } else {
        setBooking({ ...booking, [name]: moment(value).format() });
        setValidation({
          ...validation,
          time: {
            message: "",
            isInvalid: false,
          },
        });
      }
    }
  };

  const handleCreateBookingAddressChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    if (name === "district") {
      const ward = districts.find((district) => district.name === value)
        .wards[0].name;
      setBooking({
        ...booking,
        cus_address: { ...booking.cus_address, [name]: value, ward: ward },
      });
      return;
    }

    if (name === "street") {
      setBooking({
        ...booking,
        cus_address: { ...booking.cus_address, [name]: value },
      });
      setValidation({
        ...validation,
        street: {
          message: "",
          isInvalid: false,
        },
      });
      return;
    }

    setBooking({
      ...booking,
      cus_address: { ...booking.cus_address, [name]: value },
    });
  };

  const handleCreateBookingServiceChange = (e) => {
    let newServices = [...booking.services];
    const value = e.target.value;

    if (newServices.includes(value)) {
      const index = newServices.indexOf(value);
      newServices.splice(index, 1);
    } else {
      newServices.push(value);
    }

    setBooking({
      ...booking,
      services: [...newServices],
    });
  };

  const handleGetAccountByUsername = async () => {
    try {
      await getAccountByUsername(booking.phonenum)
        .unwrap()
        .then((res) => {
          if (res) {
            setBooking({
              ...booking,
              acc_id: res._id,
              cus_name: res.user_id?.name,
            });
            setValidation({
              ...validation,
              phonenum: {
                message: "",
                isInvalid: false,
              },
            });
          } else {
            setBooking({ ...booking, acc_id: "", cus_name: "" });
            setValidation({
              ...validation,
              phonenum: {
                message: "Tài khoản không tồn tại",
                isInvalid: true,
              },
            });
          }
        });
    } catch (error) {
      if (error) {
        if (error.data) {
          setBooking({ ...booking, acc_id: "", cus_name: "" });
          setValidation({
            ...validation,
            phonenum: {
              message: error.data,
              isInvalid: true,
            },
          });
        } else {
          setBooking({ ...booking, acc_id: "", cus_name: "" });
          setValidation({
            ...validation,
            phonenum: {
              message: "Đã xảy ra lỗi. Xin thử lại sau",
              isInvalid: true,
            },
          });
        }
      }
    }
  };

  let items = [];
  for (let i = 0; i < servicesData.length; i += 4) {
    items.push(
      <Row key={i}>
        {servicesData.slice(i, i + 4).map((service, index) => {
          return (
            <Form.Group
              className="service-checkbox-container"
              key={index}
              controlId={"formCreateBookingService-" + i + index}
            >
              <Col>
                <Form.Check
                  className="service-checkbox"
                  inline
                  label={service.name}
                  value={service.name}
                  checked={booking.services.includes(service.name)}
                  onChange={handleCreateBookingServiceChange}
                />
              </Col>
            </Form.Group>
          );
        })}
      </Row>
    );
  }

  const handleConfirmBookingSubmit = (e) => {
    e.preventDefault();
    if (booking.phonenum === "") {
      setValidation({
        ...validation,
        phonenum: {
          message: "Số điện thoại không được để trống",
          isInvalid: true,
        },
      });
      return;
    }

    if (booking.cus_name === "") {
      if (
        validation.phonenum.isInvalid &&
        validation.phonenum.message === "Tài khoản không tồn tại"
      ) {
        setValidation({
          ...validation,
          phonenum: {
            message: "Xin hãy nhập số điện thoại đúng",
            isInvalid: true,
          },
        });
        return;
      } else {
        setValidation({
          ...validation,
          phonenum: {
            message: "Xin hãy kiểm tra số điện thoại",
            isInvalid: true,
          },
        });
      }
      return;
    }

    if (booking.cus_address.street === "") {
      setValidation({
        ...validation,
        street: {
          message: "Số nhà và tên đường không được để trống",
          isInvalid: true,
        },
      });
      return;
    }

    if (
      !validation.phonenum.isInvalid &&
      !validation.description.isInvalid &&
      !validation.time.isInvalid &&
      !validation.street.isInvalid
    ) {
      setShowConfirmCreateBooking(true);
      return;
    }
  };

  if (isServiceFetching) {
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
      <Container fluid className="create-booking-container">
        <Form onSubmit={handleConfirmBookingSubmit}>
          <Card className="booking-info-container ">
            <Card.Body>
              <Row>
                <Col>
                  <Card.Title>Thông tin lịch hẹn</Card.Title>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group controlId="formCreateBookingPhoneNumber">
                    <Form.Label>Số điện thoại:</Form.Label>
                    <InputGroup>
                      <Form.Control
                        isInvalid={validation.phonenum.isInvalid}
                        type="text"
                        name="phonenum"
                        value={booking.phonenum}
                        onChange={handleCreateBookingChange}
                      />
                      <InputGroup.Append>
                        <Button
                          variant="primary"
                          onClick={handleGetAccountByUsername}
                          className="check-phonenumber-button"
                        >
                          {isLoading ? (
                            <Spinner animation="border" />
                          ) : (
                            "Kiểm tra"
                          )}
                        </Button>
                      </InputGroup.Append>
                      <Form.Control.Feedback type="invalid">
                        {validation.phonenum.message}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formCreateBookingCustomerName">
                    <Form.Label>Họ và tên khách hàng:</Form.Label>
                    <Form.Control
                      readOnly
                      type="text"
                      name="cus_name"
                      value={booking.cus_name}
                      onChange={handleCreateBookingChange}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formCreateBookingTime">
                    <Form.Label>Ngày hẹn:</Form.Label>
                    <Form.Control
                      disabled
                      isInvalid={validation.time.isInvalid}
                      type="date"
                      name="time"
                      value={moment(booking.time).format("YYYY-MM-DD")}
                      onChange={handleCreateBookingChange}
                    />
                    <Form.Control.Feedback type="invalid">
                      {validation.time.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group controlId="formCreateBookingAddress">
                    <Form.Label>Địa chỉ khách hàng:</Form.Label>
                    <InputGroup>
                      <Form.Control
                        isInvalid={validation.street.isInvalid}
                        type="text"
                        placeholder="Số nhà và tên đường"
                        name="street"
                        value={booking.cus_address.street}
                        onChange={handleCreateBookingAddressChange}
                      />

                      <Form.Control
                        as="select"
                        name="ward"
                        value={booking.cus_address.ward}
                        onChange={handleCreateBookingAddressChange}
                      >
                        {districts
                          .find(
                            (district) =>
                              district.name === booking.cus_address.district
                          )
                          .wards.map((ward, index) => {
                            return (
                              <option key={index} value={ward.name}>
                                {ward.name}
                              </option>
                            );
                          })}
                      </Form.Control>
                      <Form.Control
                        as="select"
                        name="district"
                        value={booking.cus_address.district}
                        onChange={handleCreateBookingAddressChange}
                      >
                        {districts.map((district, index) => {
                          return (
                            <option key={index} value={district.name}>
                              {district.name}
                            </option>
                          );
                        })}
                      </Form.Control>
                      <InputGroup.Prepend>
                        <InputGroup.Text>Thành phố Hồ Chí Minh</InputGroup.Text>
                      </InputGroup.Prepend>
                      <Form.Control.Feedback type="invalid">
                        {validation.street.message}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group controlId="formCreateBookingDescription">
                    <Form.Label>
                      Mô tả lịch hẹn ({booking.description.length}/200 từ)
                      (không bắt buộc):
                    </Form.Label>
                    <Form.Control
                      isInvalid={validation.description.isInvalid}
                      as="textarea"
                      rows={5}
                      name="description"
                      value={booking.description}
                      onChange={handleCreateBookingChange}
                    />
                    <Form.Control.Feedback type="invalid">
                      {validation.description.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Row>
                    <Col>
                      <Form.Label>Dịch vụ:</Form.Label>
                    </Col>
                  </Row>
                  {/* <Row>
                    {servicesData.map((service, index) => {
                      return (
                        <Form.Group
                          key={index}
                          controlId={"formCreateBookingService-" + index}
                        >
                          <Col>
                            <Form.Check
                              inline
                              label={service.name}
                              value={service.name}
                              checked={booking.services.includes(service.name)}
                              onChange={handleCreateBookingServiceChange}
                            />
                          </Col>
                        </Form.Group>
                      );
                    })}
                  </Row> */}
                  {items.map((item, index) => {
                    return item;
                  })}
                </Col>
              </Row>
            </Card.Body>
            <Card.Footer>
              <Row>
                <Col className="button-container">
                  <Button disabled={isLoading} type="submit" variant="primary">
                    Tạo lịch hẹn
                  </Button>
                </Col>
              </Row>
            </Card.Footer>
          </Card>
        </Form>
      </Container>
      <ConfirmCreateBooking
        booking={booking}
        setBooking={setBooking}
        setShowConfirmCreateBooking={setShowConfirmCreateBooking}
        showConfirmCreateBooking={showConfirmCreateBooking}
        servicesData={servicesData}
      />
    </>
  );
};

export default CreateBooking;
