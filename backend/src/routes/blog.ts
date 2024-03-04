import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

enum ResponseStatus {
  Success = 200,
  NotFound = 404,
  AlreadyExsists = 403,
  ServorError = 500,
}

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

blogRouter.use("/*", async (c, next) => {
  await next();
});

blogRouter.post("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

  try {
    const post = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: "1",
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
