import Vue from "vue"
import {ValidationProvider, ValidationObserver, extend} from "vee-validate"
import {required, regex} from "vee-validate/dist/rules"

extend("required", {...required, message: "This field is required"})
extend("regex", {...regex, message: "Enter the correct format"})
Vue.component("ValidationProvider", ValidationProvider)
Vue.component("ValidationObserver", ValidationObserver)
