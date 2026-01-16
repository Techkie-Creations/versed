import { createRouter, createWebHistory } from "vue-router";
import Landing from "../views/Landing.vue";
import Signup from "@/views/Signup.vue";
import Login from "../views/Login.vue";
import ForgotPassword from "@/views/ForgotPassword.vue";
import { Authenticated } from "@/utils/Authentication";
import UserAccount from "@/views/UserAccount.vue";
import VerseManager from "@/views/VerseManager.vue";
import NotFound from "@/views/NotFound.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "landing",
      component: Landing,
      meta: {
        name: "before",
      },
    },
    {
      path: "/auth/login",
      name: "login",
      component: Login,
      meta: {
        name: "before",
      },
    },
    {
      path: "/auth/signup",
      name: "signup",
      component: Signup,
      meta: {
        name: "before",
      },
    },
    {
      path: "/auth/forgotPassword",
      name: "forgot-password",
      component: ForgotPassword,
      meta: {
        name: "before",
      },
    },
    {
      path: "/user/my-account",
      name: "account",
      component: UserAccount,
      meta: {
        name: "after",
      },
    },
    {
      path: "/my-verses",
      name: "verses",
      component: VerseManager,
      meta: {
        name: "after",
      },
    },
    {
      path: "/:catchAll(.*)*",
      name: "notfound",
      component: NotFound,
    },
  ],
});

router.beforeEach(async (to, _) => {
  const whereTo = await Authenticated(to.path);
  if (whereTo === to.path) return;
  if (whereTo === "notfound") {
    console.log("notfound");
    return router.push({ path: "/:catchAll(.*)*" });
  } else return router.push({ path: whereTo });
});

export default router;
