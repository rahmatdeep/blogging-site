import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign } from "hono/jwt";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>().basePath("/api/v1");

enum ResponseStatus {
  Success = 200,
  NotFound = 404,
  AlreadyExsists = 403,
  ServorError = 500,
}

app.post("/signup", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  try {
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password,
      },
    });
    const token = await sign({ id: user.id }, c.env.JWT_SECRET);

    return c.json({ jwt: token });
  } catch (e) {
    c.status(ResponseStatus.AlreadyExsists);
    return c.json({ msg: "A user with this email already exsists" });
  }
});

app.post("/signin", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
        password: body.password,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      c.status(ResponseStatus.NotFound);
      return c.json({ error: "User not found" });
    }

    const token = await sign({ id: user.id }, c.env.JWT_SECRET);

    return c.json({ jwt: token });
  } catch (e) {
    console.log(e);
    c.status(ResponseStatus.ServorError);
    return c.json({ msg: "Internal Servor Error" });
  }
});

app.post("/blog", (c) => {
  return c.text("blog POST route");
});

app.put("/blog", (c) => {
  return c.text("blog PUT route");
});

app.get("/blog/:id", (c) => {
  let id = c.req.param("id");
  return c.text("blog GET route where id is " + id);
});
export default app;
