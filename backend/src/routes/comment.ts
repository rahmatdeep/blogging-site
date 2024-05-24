import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import authMiddleWare from "../middleware/auth";

enum ResponseStatus {
  Success = 200,
  NotFound = 404,
  Forbidden = 403,
  ServerError = 500,
  InvalidCredentials = 401,
  BadRequest = 400,
}

export const commentRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
    postId: string;
  };
}>();

commentRouter.use("/*", authMiddleWare);

commentRouter.get("/:postId", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const postId = c.req.param("postId");

  try {
    const comments = await prisma.comment.findMany({
      where: {
        postId: postId,
        published: true,
      },
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return c.json({ comments });
  } catch (e) {
    console.error(e);
    c.status(ResponseStatus.ServerError);
    return c.json({ msg: "Error while fetching comments" });
  }
});

commentRouter.post("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

  if (!body || !body.content) {
    c.status(ResponseStatus.BadRequest);
    return c.json({ msg: "Missing or empty comment" });
  }
  const authorId = c.get("userId");

  if (!authorId) {
    c.status(ResponseStatus.BadRequest);
    return c.json({ msg: "Missing userId header" });
  }

  try {
    const comment = await prisma.comment.create({
      data: {
        content: body.content,
        authorId,
        postId: body.postId,
        published: true,
      },
      select: {
        id: true,
      },
    });
    return c.json({ id: comment.id });
  } catch (e) {
    console.log(e);
    c.status(ResponseStatus.ServerError);
    return c.json({ msg: "Error while creating comment" });
  }
});

commentRouter.delete("/:commentId", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const commentId = c.req.param("commentId");

  try {
    const existingComment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });

    if (!existingComment) {
      c.status(ResponseStatus.NotFound);
      return c.json({ msg: "Comment not found" });
    }

    const authorId = c.get("userId");
    if (existingComment.authorId !== authorId) {
      c.status(ResponseStatus.Forbidden);
      return c.json({ msg: "You are not authorized to delete this comment" });
    }

    const updatedComment = await prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        published: false,
      },
    });

    return c.json({ msg: "Comment deleted successfully", updatedComment });
  } catch (e) {
    console.error(e);
    c.status(ResponseStatus.ServerError);
    return c.json({ msg: "Error while deleting comment" });
  }
});
