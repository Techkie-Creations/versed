import { checkAuth } from "@/api/api";
import type { userData } from "./Types";

export const Authenticated = async (schema: "route" | "navbar") => {
  const results = await checkAuth();
  if (schema === "route") return results.success;
  if (schema === "navbar") {
    if (!results.success) return false;
    const userInfo: userData = {
      name: results.name,
      avatar: results.avatar,
      isAuth: results.success,
    };
    return userInfo;
  }
};
