import { type RouteConfig, route } from "@react-router/dev/routes";

export default [
  route("/", "routes/dashboard/dashboard.tsx", [
    route("/", "routes/dashboard/home.tsx"),
    route("/vocabulary", "routes/dashboard/vocabulary/list.tsx"),
  ]),
  route("/signup", "routes/auth/signup.tsx"),
  route("/login", "routes/auth/login.tsx"),
] satisfies RouteConfig;
