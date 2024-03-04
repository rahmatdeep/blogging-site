import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign } from "hono/jwt";
import { userRouter } from "./routes/user";
import { blogRouter } from "./routes/blog";

enum ResponseStatus {
  Success = 200,
  NotFound = 404,
  AlreadyExsists = 403,
  ServorError = 500,
}

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>().basePath("/api/v1");

app.route("/user", userRouter);
app.route("/blog", blogRouter);

export default app;
