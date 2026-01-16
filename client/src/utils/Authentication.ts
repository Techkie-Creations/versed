import { checkAuth } from "@/api/api";

export const Authenticated = async (toRoute: string = "") => {
  const afterAuth = [
    "/auth/login",
    "/",
    "/auth/forgotPassword",
    "/auth/signup",
  ];
  const beforeAuth = ["/dashboard", "/user/my-account"];
  const results = await checkAuth();

  if (results.success && afterAuth.indexOf(toRoute) >= 0) return "/dashboard";
  else if (!results.success && beforeAuth.indexOf(toRoute) >= 0)
    return "/auth/login";
  else return toRoute;
};
