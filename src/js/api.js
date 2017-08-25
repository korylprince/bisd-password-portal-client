/*global API_BASE*/

import axios from "axios";

export default {
    requestCredentials: function(student) {
        var promise = axios.get(API_BASE + "/students", {params: student});
        return promise;
    }
};
