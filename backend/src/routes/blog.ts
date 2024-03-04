import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { verify } from "hono/jwt";

enum ResponseStatus {
  Success = 200,
  NotFound = 404,
  AlreadyExsists = 403,
  ServorError = 500,
  UnAuthorized = 401,
}

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

blogRouter.use("/*", async (c, next) => {
  const authHeader = c.req.header("Authorization");

  if (!authHeader) {
    c.status(ResponseStatus.UnAuthorized);
    return c.json({ msg: "Access Denied" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = await verify(token, c.env.JWT_SECRET);
    c.set("userId", payload.id);
    await next();
  } catch (e) {
    c.status(ResponseStatus.UnAuthorized);
    return c.json({ msg: "Access Denied" });
  }
});

blogRouter.post("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const authorId = c.get("userId");
  try {
    const post = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: authorId,
      },
      select: {
        id: true,
      },
    });
    return c.json({ id: post.id });
  } catch (e) {
    console.log(e);
    c.status(ResponseStatus.ServorError);
    c.json({ msg: "Internal Servor Error" });
  }
});

blogRouter.put("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

  try {
    const post = await prisma.post.update({
      where: {
        id: body.id,
      },
      data: {
        title: body.title,
        content: body.content,
      },
    });
    return c.json({ id: post.id });
  } catch (e) {
    console.log(e);
    c.status(ResponseStatus.ServorError);
    return c.json({ msg: "Internal Servor Error" });
  }
});

blogRouter.get("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

  try {
    const post = await prisma.post.findFirst({
      where: {
        id: body.id,
      },
    });
    return c.json({ post });
  } catch (e) {
    console.log(e);
    c.status(ResponseStatus.ServorError);
    c.json({ msg: "Internal Servor Error" });
  }
});

blogRouter.get("/bulk", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const posts = await prisma.post.findMany();

    return c.json({ posts });
  } catch (e) {
    console.log(e);
    c.status(ResponseStatus.ServorError);
    return c.json({ msg: "Internal Servor Error" });
  }
});
