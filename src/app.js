import "../node_modules/vue-material/dist/vue-material.css";
import "./style/app.styl";

import Vue from "vue";
import VueMaterial from "vue-material";
import VeeValidate from "vee-validate";

import {Validator} from "vee-validate";
import moment from "moment";
Validator.installDateTimeValidators(moment);

Vue.use(VueMaterial);
Vue.use(VeeValidate);

Vue.material.registerTheme("default", {
    primary: "blue",
    accent: "pink",
    warn: "red",
    background: "white"
});

import main from "./components/main.vue";

var App = Vue.extend(main);
new App().$mount("#app");

export default App;
