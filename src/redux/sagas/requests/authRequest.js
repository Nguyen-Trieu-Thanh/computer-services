import axios from "axios";
import roleEnum from "../../../enums/roleEnum";

//URL
import { url } from "../../../url";

export function requestGetLogin(params) {
  //Fecth API
  return axios
    .post(
      url + "/auth" + "/login",
      {
        username: params[0],
        password: params[1],
      },
      {
        withCredentials: true,
      }
    )
    .then((response) => ({ response }))
    .catch((error) => ({ error }));
}

export function requestGetRefreshAccessToken(params) {
  //Fecth API
  return axios
    .post(
      url + "/auth" + "/refresh",
      {},
      {
        // headers: {
        //   Cookie: document.cookie,
        // },
        withCredentials: true,
      }
    )
    .then((response) => ({ response }))
    .catch((error) => ({ error }));
}
