import { createRouter, createWebHistory } from "vue-router";
import Landing from "../views/Landing.vue";
import Signup from "@/views/Signup.vue";
import Login from "../views/Login.vue";
import ForgotPassword from "@/views/ForgotPassword.vue";
import { Authenticated } from "@/utils/Authentication";
import UserAccount from "@/views/UserAccount.vue";
import VerseManager from "@/views/VerseManager.vue";

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
      component: Login,
    },
    {
      path: "/auth/signup",
      name: "signup",
      component: Signup,
    },
    {
      path: "/auth/forgotPassword",
      name: "forgot-password",
      component: ForgotPassword,
    },
    {
      path: "/user/my-account",
      name: "account",
      component: UserAccount,
    },
    {
      path: "/my-verses",
      name: "verses",
      component: VerseManager,
    },
    {
      path: "/:catchAll(.*)*",
      name: "notfound",
      component: () => import("@/views/NotFound.vue"),
    },
  ],
});

router.beforeEach(async (to, _) => {
  const whereTo = await Authenticated(to.path);
  if (whereTo === to.path) return;
  else return whereTo;
});

export default router;
