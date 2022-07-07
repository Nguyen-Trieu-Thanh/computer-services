import axios from "axios";
import roleEnum from "../../../enums/roleEnum";

//URL
import { url } from "../../../url";

export function requestGetBookings(params) {
  //Fecth API
  return axios
    .get(url + "/booking" + "/all")
    .then((response) => ({ response }))
    .catch((error) => ({ error }));
}

export function requestCreateBooking(params) {
  const booking = { ...params[0] };
  //Fecth API
  return axios
    .post(
      url + "/booking" + "/create",
      {
        cus_name: booking.cus_name,
        services: booking.services,
        description: booking.description,
        type: booking.type,
        cus_address: booking.cus_address,
        time: booking.time,
        status: booking.status,
        phonenum: booking.phonenum,
        cus_id: "62a2c44b5a9810fa40ae483f",
      },
      {
        headers: { token: "bearer " + localStorage.getItem("token") },
      }
    )
    .then((response) => ({ response }))
    .catch((error) => ({ error }));
}
