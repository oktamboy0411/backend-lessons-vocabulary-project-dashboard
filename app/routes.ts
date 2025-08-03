import { type RouteConfig, route } from "@react-router/dev/routes";

export default [
  route("/", "routes/dashboard/dashboard.tsx", [
    route("/", "routes/dashboard/home.tsx"),

    route("/vocabulary", "routes/dashboard/vocabulary/list.tsx"),
    route("/vocabulary/update/:id", "routes/dashboard/vocabulary/update.tsx"),
    route("/vocabulary/create", "routes/dashboard/vocabulary/create.tsx"),

    route("/section", "routes/dashboard/section/list.tsx"),
    route("/section/create", "routes/dashboard/section/create.tsx"),
    route("/section/update/:id", "routes/dashboard/section/update.tsx"),

    route("/category", "routes/dashboard/category/list.tsx"),
    route("/category/create", "routes/dashboard/category/create.tsx"),
    route("/category/update/:id", "routes/dashboard/category/update.tsx"),

    route("/word", "routes/dashboard/word/list.tsx"),
    route("/word/create", "routes/dashboard/word/create.tsx"),
    route("/word/update/:id", "routes/dashboard/word/update.tsx"),
  ]),
  route("/signup", "routes/auth/signup.tsx"),
  route("/login", "routes/auth/login.tsx"),
] satisfies RouteConfig;
