import axios from "axios";

const instance = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
    withCredentials: true,
});

export const setAxiosToken = (access_token) => {
    instance.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
};

export default instance;
