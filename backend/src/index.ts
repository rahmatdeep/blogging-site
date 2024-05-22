import { Hono } from "hono";
import { userRouter } from "./routes/user";
import { postRouter } from "./routes/post";
import { cors } from "hono/cors";
import { commentRouter } from "./routes/comment";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>().basePath("/api/v1");

app.use("/*", cors());
app.route("/user", userRouter);
app.route("/post", postRouter);
app.route("/comment", commentRouter);

export default app;
