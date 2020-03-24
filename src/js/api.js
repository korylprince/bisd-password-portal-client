/* global API_BASE */

import axios from "axios"

const api = {
    get_passwd(first_name, last_name, birth_date, ssn) {
        return axios.post(`${API_BASE}/passwd`, {first_name, last_name, birth_date, ssn})
    },
}

export default api
