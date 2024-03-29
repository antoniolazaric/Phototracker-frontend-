import Vue from "vue";
import App from "./App.vue";
import "./plugins/bootstrap-vue";
import router from "./router";
import axios from "axios";

import VueSweetalert2 from "vue-sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

Vue.use(VueSweetalert2);

Vue.config.productionTip = false;

const base = axios.create({
  baseURL: "https://phototracker-backend.onrender.com/",
});
Vue.prototype.$http = base;
Vue.config.productionTip = false;

new Vue({
  router,

  render: (h) => h(App),
}).$mount("#app");
