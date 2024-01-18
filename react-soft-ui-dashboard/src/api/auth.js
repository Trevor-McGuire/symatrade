import axios from "./index";
import { API_SERVER } from "config/constant";

class AuthApi {
  static Login = (data) => {
    return axios.post(`${API_SERVER}users/login`, data);
  };

  static Register = (data) => {
    return axios.post(`${API_SERVER}users/register`, data);
  };
  
  static Authorize = async ({code, callback}) => {
    try {
      const response = await axios.get(`${API_SERVER}sessions/oauth/${callback}?code=${code}`);
      console.log("response", response);
      return response;
    } catch (error) {
      console.log("error", error);
    }
  };

  static Logout = (data) => {
    return axios.post(`${API_SERVER}users/logout`, data, {
      headers: { Authorization: `${data.token}` },
    });
  };
}

export default AuthApi;
