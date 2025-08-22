import { checkAuth } from "@/api/api";
import router from "@/router";

export const Authenticated = async (toRoute: string = "") => {
  const afterAuth = [
    ...router
      .getRoutes()
      .filter((item) => item.meta.name === "before")
      .map((item) => item.path),
    "/:catchAll(.*)*",
  ];
  const beforeAuth = [
    ...router
      .getRoutes()
      .filter((item) => item.meta.name === "after")
      .map((item) => item.path),
    "/:catchAll(.*)*",
  ];
  const results = await checkAuth();

  if (afterAuth.indexOf(toRoute) === -1 && beforeAuth.indexOf(toRoute) === -1)
    return "notfound";
  if (
    results.success &&
    afterAuth.indexOf(toRoute) >= 0 &&
    toRoute !== "/:catchAll(.*)*"
  )
    return "/user/my-account";
  else if (
    !results.success &&
    beforeAuth.indexOf(toRoute) >= 0 &&
    toRoute !== "/:catchAll(.*)*"
  )
    return "/auth/login";
  else return toRoute;
};
