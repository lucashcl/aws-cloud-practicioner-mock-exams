import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
   index("routes/home.tsx"),
   route("exam/:id", "routes/exam.tsx")
] satisfies RouteConfig;
