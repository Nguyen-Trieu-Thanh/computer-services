import axios from "axios";
import roleEnum from "../../../enums/roleEnum";

export function requestGetLogin(params) {
  //Fecth API
  const url = "https://jsonplaceholder.typicode.com/todos/1";

  return axios
    .get(url)
    .then((response) => ({ response }))
    .catch((error) => ({ error }));
}
