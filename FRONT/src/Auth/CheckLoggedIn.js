import { getAccessToken } from "../helpers/access_token";
import instance, { setAxiosToken } from "../helpers/axios";

const checkLoggedIn = async () => {
  try {
    const response = await instance.get("/users");
    return response.status === 200;
  } catch (error) {
    console.error("Error checking logged in status:", error);
    return false;
  }
};

const VerAuth = async () => {
  try {
    const response = await instance.get("/user");
    return response.status === 200;
  } catch (error) {
    console.error("Error checking logged in status:", error);
    return false;
  }
};

/**
 * Checks if a user is logged in.
 * @param {function} setIsAuthorized - A setter function from a useState hook
 *                                     that sets the value of the 'isAuthorized'
 *                                     state to the result of the check.
 */
export default function isLoggedIn(setIsAuthorized) {
  const checkAuth = async () => {
    const access_token = getAccessToken(); // Always gets the latest token value
    setAxiosToken(access_token);
    const authorized = await VerAuth();
    setIsAuthorized(authorized);
  };
  checkAuth();
}
