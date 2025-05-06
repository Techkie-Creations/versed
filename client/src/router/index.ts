import { createRouter, createWebHistory } from "vue-router";
import Landing from "../views/Landing.vue";
import Signup from "@/views/Signup.vue";
import NotFound from "@/views/NotFound.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "landing",
      component: Landing,
    },
    {
      path: "/auth/login",
      name: "login",
      component: Signup,
    },
    {
      path: "/:catchAll(.*)",
      name: "notfound",
      component: NotFound,
    },
  ],
});

export default router;
