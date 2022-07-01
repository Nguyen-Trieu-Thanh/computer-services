import axios from "axios";

//URL
import { url } from "../../../url";

export function requestGetAccounts(params) {
  //Fecth API
  return axios
    .get(url + "/account" + "/all", {
      headers: { token: "bearer " + localStorage.getItem("token") },
    })
    .then((response) => ({ response }))
    .catch((error) => ({ error }));
}
