import axios from "axios";
import roleEnum from "../../../enums/roleEnum";

export function requestGetLogin(params) {
  //Fecth API

  if (params[0] === "manager@gmail.com" && params[1] === "123") {
    return roleEnum.MANAGER;
  }

  if (params[0] === "admin@gmail.com" && params[1] === "123") {
    return roleEnum.ADMIN;
  }

  return 0;
}
