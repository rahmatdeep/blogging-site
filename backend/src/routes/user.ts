import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign } from "hono/jwt";
import { signinInput, signupInput } from "@rahmatdeep/blogging-app-common";
import authMiddleWare from "../middleware/auth";
import { hashPassword } from "../utils/hash";

enum ResponseStatus {
  Success = 200,
  NotFound = 404,
  Forbidden = 403,
  ServorError = 500,
  InvalidCredentials = 401,
}

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

userRouter.post("/signup", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

  const hashedPassword = await hashPassword(body.password);

  if (!hashedPassword) {
    return;
  }

  const { success } = signupInput.safeParse(body);
  if (!success) {
    c.status(ResponseStatus.InvalidCredentials);
    return c.json({ msg: "Invalid Inputs" });
  }
  try {
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: hashedPassword.hashedPassword,
        name: body.name,
      },
    });
    const token = await sign({ id: user.id }, c.env.JWT_SECRET);

    return c.json({ jwt: token });
  } catch (e) {
    c.status(ResponseStatus.InvalidCredentials);
    return c.json({ msg: "A user with this email already exsists" });
  }
});

userRouter.post("/signin", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const hashedPassword = await hashPassword(body.password);
  const { success } = signinInput.safeParse(body);
  if (!success) {
    c.status(ResponseStatus.InvalidCredentials);
    return c.json({ msg: "Invalid Inputs" });
  }
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
        password: hashedPassword?.hashedPassword,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      c.status(ResponseStatus.NotFound);
      return c.json({ msg: "User not found" });
    }

    const token = await sign({ id: user.id }, c.env.JWT_SECRET);

    return c.json({ jwt: token });
  } catch (e) {
    console.log(e);
    c.status(ResponseStatus.ServorError);
    return c.json({ msg: "Internal Servor Error" });
  }
});

userRouter.use("/*", authMiddleWare);

userRouter.get("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const userId = c.get("userId");
  console.log(userId);
  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
      select: {
        name: true,
        id: true,
        bio: true,
      },
    });
    user.name === null ? (user.name = "Anonymous") : null;
    return c.json(user);
  } catch (e) {
    console.log(e);
    c.status(ResponseStatus.NotFound);
    return c.json({ msg: "user not found" });
  }
});

userRouter.put("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const userId = c.get("userId");
  const body = await c.req.json();
  console.log(userId);
  try {
    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name: body.name,
        bio: body.bio,
      },
    });
    return c.json(user);
  } catch (e) {
    console.log(e);
    c.status(ResponseStatus.NotFound);
    return c.json({ msg: "user not found" });
  }
});
