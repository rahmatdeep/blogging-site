import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import authMiddleWare from "../middleware/auth";
import {
  createPostInput,
  updatePostInput,
} from "@rahmatdeep/blogging-app-common";

enum ResponseStatus {
  Success = 200,
  NotFound = 404,
  Forbidden = 403,
  ServorError = 500,
  InvalidCredentials = 401,
}

export const postRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

postRouter.use("/*", authMiddleWare);

postRouter.post("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const { success } = createPostInput.safeParse(body);
  if (!success) {
    c.status(ResponseStatus.InvalidCredentials);
    return c.json({ msg: "Invalid Inputs" });
  }
  const authorId = c.get("userId");
  try {
    const post = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: authorId,
        published: true,
      },
      select: {
        id: true,
      },
    });
    return c.json({ id: post.id });
  } catch (e) {
    console.log(e);
    c.status(ResponseStatus.ServorError);
    return c.json({ msg: "Error while creating post" });
  }
});

postRouter.get("/bulk", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const page = c.req.query("page") || "1";
  const size = c.req.query("size") || "10";

  const pageNumber = parseInt(page, 10);
  const pageSize = parseInt(size, 10);

  const skip = (pageNumber - 1) * pageSize;
  const take = pageSize;

  try {
    const posts = await prisma.post.findMany({
      where: {
        published: true,
      },
      orderBy: {
        createdOn: "desc",
      },
      skip,
      take,
      select: {
        content: true,
        title: true,
        id: true,
        createdOn: true,
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    const totalCount = await prisma.post.count({
      where: {
        published: true,
      },
    });

    return c.json({
      posts,
      pagination: {
        pageNumber,
        pageSize,
        total: totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    });
  } catch (e) {
    console.log(e);
    c.status(ResponseStatus.ServorError);
    return c.json({ msg: "Error while fetching post" });
  }
});

postRouter.get("/:id", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const id = c.req.param("id");

  try {
    const post = await prisma.post.findFirst({
      where: {
        id: id,
      },
      select: {
        id: true,
        title: true,
        content: true,
        createdOn: true,
        author: {
          select: {
            name: true,
            id: true,
            bio: true,
          },
        },
      },
    });
    return c.json({ post });
  } catch (e) {
    console.log(e);
    c.status(ResponseStatus.ServorError);
    c.json({ msg: "error while fetching posts" });
  }
});

postRouter.put("/:id", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

  const id = c.req.param("id");
  const authorId = c.get("userId");
  body.id = id;
  console.log(body);
  console.log(`author id ${authorId}`);
  const { success } = updatePostInput.safeParse(body);
  if (!success) {
    c.status(ResponseStatus.InvalidCredentials);
    return c.json({ msg: "Invalid Inputs" });
  }

  try {
    const post = await prisma.post.update({
      where: {
        id: id,
        authorId: authorId,
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
    return c.json({ msg: "Error while updating post" });
  }
});

postRouter.delete("/:id", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const id = c.req.param("id");

  const authorId = c.get("userId");
  console.log(authorId);
  try {
    const post = await prisma.post.update({
      where: {
        id: id,
        authorId: authorId,
      },
      data: {
        published: false,
      },
    });
    return c.json({ msg: "post deleted" });
  } catch (e) {
    console.log(e);
    c.status(ResponseStatus.ServorError);
    c.json({ msg: "error while deleting posts" });
  }
});
