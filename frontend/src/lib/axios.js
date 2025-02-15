import axios from "axios";

const axiosInstance = axios.create({
	baseURL:"https://megamart-wt6l.onrender.com/api",
	withCredentials: true, // send cookies to the server
});

export default axiosInstance;
