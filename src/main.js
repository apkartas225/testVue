import Vue from "vue";
import router from "./router.js";
// import Store from "./store"
import App from "./App.vue";

Vue.config.productionTip = false;

new Vue({
  router,
  // Store,
  render: (h) => h(App),
}).$mount("#app");
