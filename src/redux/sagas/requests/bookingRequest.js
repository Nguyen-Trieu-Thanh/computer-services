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
