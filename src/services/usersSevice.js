import axios from "axios";

export default {
	getUsers(amount = "30", delay = "0") {
		const params = {
			rows: amount,
			id: "{number|1000}",
			firstName: "{firstName}",
			delay,
			lastName: "{lastName}",
			email: "{email}",
			phone: "{phone|(xxx)xxx-xx-xx}",
			address: "{addressObject}",
			description: "{lorem|32}",
		}
		return axios.get("http://www.filltext.com/", { params })
	}
}
