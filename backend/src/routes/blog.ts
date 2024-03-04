import { Hono } from "hono";

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

blogRouter.post("/", (c) => {
  return c.text("blog POST route");
});

blogRouter.put("/", (c) => {
  return c.text("blog PUT route");
});

blogRouter.get("/bulk", (c) => {
  return c.text("blog GET route where id is ");
});
