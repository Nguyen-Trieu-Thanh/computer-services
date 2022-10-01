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

import { useLocation } from "react-router-dom";

//CSS
import "./CreateBooking.css";
import { useEffect } from "react";
import ScheduleForBooking from "../scheduleForBooking/ScheduleForBooking";

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
    time: moment()
      .set({
        hour: 8,
        minute: 0,
        second: 0,
        millisecond: 0,
      })
      .format(),
    status: "Đã tiếp nhận",
    phonenum: "",
  });
  const [validation, setValidation] = useState({
    phonenum: {
      message: "",
      isInvalid: false,
      isValid: false,
    },
    cus_name: {
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
    slot: {
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
  const [slot, setSlot] = useState(0);
  const [showScheduleForBooking, setShowScheduleForBooking] = useState(false);

  const { state } = useLocation();

  const handleCreateBookingChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    if (name === "phonenum") {
      if (value === "") {
        setBooking({ ...booking, [name]: value });
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
          setBooking({ ...booking, [name]: value });
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
            setBooking({ ...booking, [name]: value });
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
            setBooking({
              ...booking,
              [name]: value,
            });
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

    if (name === "cus_name") {
      const nameRegex =
        /^[A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]*(?:[ ][A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]*)*$/;
      if (value !== "" && !nameRegex.test(value)) {
        setBooking({ ...booking, [name]: value });
        setValidation({
          ...validation,
          cus_name: {
            message: "Họ và tên khách hàng không hợp lệ",
            isInvalid: true,
          },
        });
        return;
      } else {
        setBooking({ ...booking, [name]: value });
        setValidation({
          ...validation,
          cus_name: {
            message: "",
            isInvalid: false,
          },
        });
      }
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
        if (slot == 1) {
          setBooking({
            ...booking,
            time: moment(value)
              .set({
                hour: 8,
                minute: 0,
                second: 0,
                millisecond: 0,
              })
              .format(),
          });

          setValidation({
            ...validation,
            time: {
              message: "Ngày không được nhỏ hơn ngày hôm nay",
              isInvalid: true,
            },
          });
          return;
        }

        if (slot == 2) {
          setBooking({
            ...booking,
            time: moment(value)
              .set({
                hour: 9,
                minute: 30,
                second: 0,
                millisecond: 0,
              })
              .format(),
          });

          setValidation({
            ...validation,
            time: {
              message: "Ngày không được nhỏ hơn ngày hôm nay",
              isInvalid: true,
            },
          });
          return;
        }

        if (slot == 3) {
          setBooking({
            ...booking,
            time: moment(value)
              .set({
                hour: 11,
                minute: 0,
                second: 0,
                millisecond: 0,
              })
              .format(),
          });

          setValidation({
            ...validation,
            time: {
              message: "Ngày không được nhỏ hơn ngày hôm nay",
              isInvalid: true,
            },
          });
          return;
        }

        if (slot == 4) {
          setBooking({
            ...booking,
            time: moment(value)
              .set({
                hour: 12,
                minute: 30,
                second: 0,
                millisecond: 0,
              })
              .format(),
          });

          setValidation({
            ...validation,
            time: {
              message: "Ngày không được nhỏ hơn ngày hôm nay",
              isInvalid: true,
            },
          });
          return;
        }

        if (slot == 5) {
          setBooking({
            ...booking,
            time: moment(value)
              .set({
                hour: 14,
                minute: 0,
                second: 0,
                millisecond: 0,
              })
              .format(),
          });

          setValidation({
            ...validation,
            time: {
              message: "Ngày không được nhỏ hơn ngày hôm nay",
              isInvalid: true,
            },
          });
          return;
        }

        if (slot == 6) {
          setBooking({
            ...booking,
            time: moment(value)
              .set({
                hour: 15,
                minute: 30,
                second: 0,
                millisecond: 0,
              })
              .format(),
          });

          setValidation({
            ...validation,
            time: {
              message: "Ngày không được nhỏ hơn ngày hôm nay",
              isInvalid: true,
            },
          });
          return;
        }

        if (slot == 7) {
          setBooking({
            ...booking,
            time: moment(value)
              .set({
                hour: 17,
                minute: 0,
                second: 0,
                millisecond: 0,
              })
              .format(),
          });

          setValidation({
            ...validation,
            time: {
              message: "Ngày không được nhỏ hơn ngày hôm nay",
              isInvalid: true,
            },
          });
          return;
        }

        if (slot == 8) {
          setBooking({
            ...booking,
            time: moment(value)
              .set({
                hour: 18,
                minute: 30,
                second: 0,
                millisecond: 0,
              })
              .format(),
          });

          setValidation({
            ...validation,
            time: {
              message: "Ngày không được nhỏ hơn ngày hôm nay",
              isInvalid: true,
            },
          });
          return;
        }
        return;
      } else {
        if (slot == 1) {
          setBooking({
            ...booking,
            time: moment(value)
              .set({
                hour: 8,
                minute: 0,
                second: 0,
                millisecond: 0,
              })
              .format(),
          });
          setValidation({
            ...validation,
            time: {
              message: "",
              isInvalid: false,
            },
            slot: {
              message: "",
              isInvalid: false,
            },
          });
          return;
        }

        if (slot == 2) {
          setBooking({
            ...booking,
            time: moment(value)
              .set({
                hour: 9,
                minute: 30,
                second: 0,
                millisecond: 0,
              })
              .format(),
          });
          setValidation({
            ...validation,
            time: {
              message: "",
              isInvalid: false,
            },
            slot: {
              message: "",
              isInvalid: false,
            },
          });
          return;
        }

        if (slot == 3) {
          setBooking({
            ...booking,
            time: moment(value)
              .set({
                hour: 11,
                minute: 0,
                second: 0,
                millisecond: 0,
              })
              .format(),
          });
          setValidation({
            ...validation,
            time: {
              message: "",
              isInvalid: false,
            },
            slot: {
              message: "",
              isInvalid: false,
            },
          });
          return;
        }

        if (slot == 4) {
          setBooking({
            ...booking,
            time: moment(value)
              .set({
                hour: 12,
                minute: 30,
                second: 0,
                millisecond: 0,
              })
              .format(),
          });
          setValidation({
            ...validation,
            time: {
              message: "",
              isInvalid: false,
            },
            slot: {
              message: "",
              isInvalid: false,
            },
          });
          return;
        }

        if (slot == 5) {
          setBooking({
            ...booking,
            time: moment(value)
              .set({
                hour: 14,
                minute: 0,
                second: 0,
                millisecond: 0,
              })
              .format(),
          });
          setValidation({
            ...validation,
            time: {
              message: "",
              isInvalid: false,
            },
            slot: {
              message: "",
              isInvalid: false,
            },
          });
          return;
        }

        if (slot == 6) {
          setBooking({
            ...booking,
            time: moment(value)
              .set({
                hour: 15,
                minute: 30,
                second: 0,
                millisecond: 0,
              })
              .format(),
          });
          setValidation({
            ...validation,
            time: {
              message: "",
              isInvalid: false,
            },
            slot: {
              message: "",
              isInvalid: false,
            },
          });
          return;
        }

        if (slot == 7) {
          setBooking({
            ...booking,
            time: moment(value)
              .set({
                hour: 17,
                minute: 0,
                second: 0,
                millisecond: 0,
              })
              .format(),
          });
          setValidation({
            ...validation,
            time: {
              message: "",
              isInvalid: false,
            },
            slot: {
              message: "",
              isInvalid: false,
            },
          });
          return;
        }

        if (slot == 8) {
          setBooking({
            ...booking,
            time: moment(value)
              .set({
                hour: 18,
                minute: 30,
                second: 0,
                millisecond: 0,
              })
              .format(),
          });
          setValidation({
            ...validation,
            time: {
              message: "",
              isInvalid: false,
            },
            slot: {
              message: "",
              isInvalid: false,
            },
          });
          return;
        }
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
    if (booking.phonenum === "") {
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

    const phonenumRegex = /^(?:\d+|)$/;
    if (!phonenumRegex.test(booking.phonenum)) {
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
      if (booking.phonenum.length > 10) {
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

    try {
      await getAccountByUsername(booking.phonenum)
        .unwrap()
        .then((res) => {
          if (res) {
            if (res.role === "customer") {
              setBooking({
                ...booking,
                acc_id: res._id,
                cus_name:
                  booking.cus_name === ""
                    ? res.user_id?.name
                    : booking.cus_name,
              });
              setValidation({
                ...validation,
                phonenum: {
                  message: "",
                  isInvalid: false,
                  isValid: true,
                },
                cus_name: {
                  message: "",
                  isInvalid: false,
                },
              });
            } else {
              setBooking({ ...booking, acc_id: "", cus_name: "" });
              setValidation({
                ...validation,
                phonenum: {
                  message: "Tài khoản không hợp lệ",
                  isInvalid: true,
                  isValid: false,
                },
              });
            }
          } else {
            setBooking({ ...booking, acc_id: "", cus_name: "" });
            setValidation({
              ...validation,
              phonenum: {
                message: "Tài khoản không tồn tại",
                isInvalid: true,
                isValid: false,
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
              message: error.data.message ? error.data.message : error.data,
              isInvalid: true,
              isValid: false,
            },
          });
        } else {
          setBooking({ ...booking, acc_id: "", cus_name: "" });
          setValidation({
            ...validation,
            phonenum: {
              message: "Đã xảy ra lỗi. Xin thử lại sau",
              isInvalid: true,
              isValid: false,
            },
          });
        }
      }
    }
  };

  let items = [];
  for (
    let i = 0;
    i < servicesData.filter((service) => !service.deleted).length;
    i += 4
  ) {
    items.push(
      <Row key={i}>
        {servicesData
          .filter((service) => !service.deleted)
          .slice(i, i + 4)
          .map((service, index) => {
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

  const checkIsDateAndSlotSameOrAfter = () => {
    if (moment(booking.time).isSame(moment(), "day")) {
      if (slot == 1) {
        return moment().format("Hmm") < 800;
      }

      if (slot == 2) {
        return moment().format("Hmm") < 930;
      }

      if (slot == 3) {
        return moment().format("Hmm") < 1100;
      }

      if (slot == 4) {
        return moment().format("Hmm") < 1230;
      }

      if (slot == 5) {
        return moment().format("Hmm") < 1400;
      }

      if (slot == 6) {
        return moment().format("Hmm") < 1530;
      }

      if (slot == 7) {
        return moment().format("Hmm") < 1700;
      }

      if (slot == 8) {
        return moment().format("Hmm") < 1830;
      }
    }

    return true;
  };

  const handleConfirmBookingSubmit = (e) => {
    e.preventDefault();
    if (booking.phonenum === "") {
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

    if (!validation.phonenum.isValid) {
      if (!validation.phonenum.isInvalid) {
        setValidation({
          ...validation,
          phonenum: {
            message: "Xin hãy kiểm tra số điện thoại",
            isInvalid: true,
            isValid: false,
          },
        });
      }
      return;
    }

    if (booking.cus_name === "") {
      setValidation({
        ...validation,
        cus_name: {
          message: "Họ và tên khách hàng không được để trống",
          isInvalid: true,
          isValid: false,
        },
      });
      return;
    }

    if (booking.time === "Invalid date") {
      setValidation({
        ...validation,
        time: {
          message: "Xin hãy chọn ngày",
          isInvalid: true,
        },
        slot: {
          message: "",
          isInvalid: false,
        },
      });
      return;
    }

    if (moment(booking.time).isBefore(moment(), "day")) {
      setValidation({
        ...validation,
        time: {
          message: "Ngày hẹn không được nhỏ hơn ngày hôm nay",
          isInvalid: true,
        },
        slot: {
          message: "",
          isInvalid: false,
        },
      });
      return;
    }

    if (slot == 0) {
      setValidation({
        ...validation,
        time: {
          message: "",
          isInvalid: false,
        },
        slot: {
          message: "Xin hãy chọn slot",
          isInvalid: true,
        },
      });
      return;
    }

    if (!checkIsDateAndSlotSameOrAfter()) {
      setValidation({
        ...validation,
        time: {
          message: "",
          isInvalid: false,
        },
        slot: {
          message: "Đã quá thời gian slot hẹn",
          isInvalid: true,
        },
      });
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
      validation.phonenum.isValid &&
      !validation.phonenum.isInvalid &&
      !validation.cus_name.isInvalid &&
      !validation.description.isInvalid &&
      !validation.time.isInvalid &&
      !validation.slot.isInvalid &&
      !validation.street.isInvalid
    ) {
      setShowConfirmCreateBooking(true);
      return;
    }
  };

  const handleSlotChange = (e) => {
    const value = e.target.value;
    setValidation({
      ...validation,
      slot: {
        message: "",
        isInvalid: false,
      },
    });

    if (value == 1) {
      setBooking({
        ...booking,
        time: moment(booking.time)
          .set({
            hour: 8,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .format(),
      });
      setSlot(value);
      return;
    }

    if (value == 2) {
      setBooking({
        ...booking,
        time: moment(booking.time)
          .set({
            hour: 9,
            minute: 30,
            second: 0,
            millisecond: 0,
          })
          .format(),
      });
      setSlot(value);
      return;
    }

    if (value == 3) {
      setBooking({
        ...booking,
        time: moment(booking.time)
          .set({
            hour: 11,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .format(),
      });
      setSlot(value);
      return;
    }

    if (value == 4) {
      setBooking({
        ...booking,
        time: moment(booking.time)
          .set({
            hour: 12,
            minute: 30,
            second: 0,
            millisecond: 0,
          })
          .format(),
      });
      setSlot(value);
      return;
    }

    if (value == 5) {
      setBooking({
        ...booking,
        time: moment(booking.time)
          .set({
            hour: 14,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .format(),
      });
      setSlot(value);
      return;
    }

    if (value == 6) {
      setBooking({
        ...booking,
        time: moment(booking.time)
          .set({
            hour: 15,
            minute: 30,
            second: 0,
            millisecond: 0,
          })
          .format(),
      });
      setSlot(value);
      return;
    }

    if (value == 7) {
      setBooking({
        ...booking,
        time: moment(booking.time)
          .set({
            hour: 17,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .format(),
      });
      setSlot(value);
      return;
    }

    if (value == 8) {
      setBooking({
        ...booking,
        time: moment(booking.time)
          .set({
            hour: 18,
            minute: 30,
            second: 0,
            millisecond: 0,
          })
          .format(),
      });
      setSlot(value);
      return;
    }
  };

  const checkSlotValue = () => {
    if (slot == 0) {
      return "Xin hãy chọn slot";
    }
    if (slot == 1) {
      return "1: 08:00 - 09:30";
    }
    if (slot == 2) {
      return "2: 09:30 - 11:00";
    }
    if (slot == 3) {
      return "3: 11:00 - 12:30";
    }
    if (slot == 4) {
      return "4: 12:30 - 14:00";
    }
    if (slot == 5) {
      return "5: 14:00 - 15:30";
    }
    if (slot == 6) {
      return "6: 15:30 - 17:00";
    }
    if (slot == 7) {
      return "7: 17:00 - 18:30";
    }
    if (slot == 8) {
      return "8: 18:30 - 20:00";
    }
  };

  useEffect(() => {
    if (state) {
      const { bookingDetailFromOrder } = state;
      setBooking({
        acc_id: bookingDetailFromOrder.acc_id._id,
        cus_name: bookingDetailFromOrder.cus_name,
        services: [...bookingDetailFromOrder.services],
        description: bookingDetailFromOrder.description,
        type: "Sửa tại nhà",
        cus_address: {
          city: "Thành phố Hồ Chí Minh",
          district: bookingDetailFromOrder.cus_address.district,
          ward: bookingDetailFromOrder.cus_address.ward,
          street: bookingDetailFromOrder.cus_address.street,
        },
        time: moment().format(),
        status: "Đã tiếp nhận",
        phonenum: bookingDetailFromOrder.phonenum,
      });
    }
  }, [state]);

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
        <Form noValidate onSubmit={handleConfirmBookingSubmit}>
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
                        isValid={validation.phonenum.isValid}
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
                      {validation.phonenum.isInvalid && (
                        <Form.Control.Feedback type="invalid">
                          {validation.phonenum.message}
                        </Form.Control.Feedback>
                      )}
                      {validation.phonenum.isValid && (
                        <Form.Control.Feedback>
                          Kiểm tra thành công
                        </Form.Control.Feedback>
                      )}
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formCreateBookingCustomerName">
                    <Form.Label>Họ và tên khách hàng:</Form.Label>
                    <Form.Control
                      // readOnly
                      isInvalid={validation.cus_name.isInvalid}
                      type="text"
                      name="cus_name"
                      value={booking.cus_name}
                      onChange={handleCreateBookingChange}
                    />
                    <Form.Control.Feedback type="invalid">
                      {validation.cus_name.message}
                    </Form.Control.Feedback>
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
                <Col>
                  <Form.Group controlId="formCreateBookingSlot">
                    <Form.Label>Slot hẹn:</Form.Label>
                    {/* <Form.Control
                      disabled
                      isInvalid={validation.slot.isInvalid}
                      as="select"
                      value={slot}
                      onChange={handleSlotChange}
                    >
                      <option value="1">1: 08:00 - 09:30</option>
                      <option value="2">2: 09:30 - 11:00</option>
                      <option value="3">3: 11:00 - 12:30</option>
                      <option value="4">4: 12:30 - 14:00</option>
                      <option value="5">5: 14:00 - 15:30</option>
                      <option value="6">6: 15:30 - 17:00</option>
                      <option value="7">7: 17:00 - 18:30</option>
                      <option value="8">8: 18:30 - 20:00</option>
                    </Form.Control> */}
                    <Form.Control
                      disabled
                      isInvalid={validation.slot.isInvalid}
                      value={checkSlotValue()}
                      onChange={handleSlotChange}
                    />
                    <Form.Control.Feedback type="invalid">
                      {validation.slot.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col className="d-flex flex-row-reverse">
                  <Button onClick={() => setShowScheduleForBooking(true)}>
                    Chọn ngày hẹn
                  </Button>
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
      <ScheduleForBooking
        showScheduleForBooking={showScheduleForBooking}
        setShowScheduleForBooking={setShowScheduleForBooking}
        booking={booking}
        setBooking={setBooking}
        slot={slot}
        setSlot={setSlot}
        validation={validation}
        setValidation={setValidation}
      />
    </>
  );
};

export default CreateBooking;
