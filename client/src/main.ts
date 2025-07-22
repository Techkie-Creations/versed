import { createApp } from "vue";
import router from "./router";
import "./style.css";
import App from "@/App.vue";
import "primeicons/primeicons.css";
import PrimeVue from "primevue/config";
import Tooltip from "primevue/tooltip";
import Aura from "@primevue/themes/aura";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

const app = createApp(App);

app.use(router);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      cssLayer: {
        name: "primevue",
        order: "tailwind-base, primeui, primevue, tailwind-utilities;",
      },
      darkModeSelector: ".dark",
    },
  },
});
app.directive("tooltip", Tooltip);
app.use(Toast, {
  transition: "Vue-Toastification__bounce",
  maxToasts: 2,
  newestOnTop: true,
});

app.mount("#app");
