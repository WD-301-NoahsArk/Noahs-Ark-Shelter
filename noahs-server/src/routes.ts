import { Hono } from "hono";
import { authenticate, authorize, corsTest } from "./middleware.js";
import { preprocessStaff, collections } from "./db.js";
import { ObjectId } from "mongodb";
import "dotenv/config";


const app = new Hono();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is missing from environment variables!");
}

// Public Routes
app.use(corsTest);
app.get("/", (c) => c.text("API is running!"));
app.get("/staff", async (c) => c.json(await collections.staff.find().toArray()));
app.get("/animals", async (c) => c.json(await collections.animals.find().toArray()));
app.get("/events", async (c) => c.json(await collections.events.find().toArray()));

// LogIn
app.use("*", authenticate);

// CRUD STAFF
app.post("/staff", authorize(["admin"]), async (c) => {
  try {
    const data = await c.req.json();
    const [staffMember, err] = preprocessStaff(data);

    if (err) {
      return c.json({
        message: "Invalid staff data",
        error: err
      }, 400)
    }
    
    const existingUser = await collections.staff.findOne({ email: staffMember!.email });
    if (existingUser) {
      return c.json({ message: "Staff already exists!" }, 400);
    }
    
    const result = await collections.staff.insertOne(staffMember!);
    return c.json({ message: "Staff created!", id: result.insertedId }, 201);
  } catch (error) {
    console.error("Error processing staff request:", error);
    return c.json({ message: "Server error occurred" }, 500);
  }
});

app.put("/staff/:id", authorize(["admin"]), async (c) => {
  const { id } = c.req.param();
  const data = await c.req.json();
  await collections.staff.updateOne({ _id: new ObjectId(id) }, { $set: data });
  return c.json({ message: "Staff updated!" });
});

app.delete("/staff/:id", authorize(["admin"]), async (c) => {
  const id = c.req.param("id");

  const staff = await collections.staff.findOne({ _id: new ObjectId(id) });
  if (!staff) {
    return c.json({ message: "Staff not found!" }, 404);
  }

  await collections.staff.deleteOne({ _id: new ObjectId(id) });

  return c.json({ message: "Staff deleted!" }, 200);
});

// CRUD ANIMALS
app.post("/animals", authorize(["admin", "staff"]), async (c) => {
  const data = await c.req.json();
  const result = await collections.animals.insertOne(data);
  return c.json({ message: "Animal added!", id: result.insertedId }, 201);
});

app.put("/animals/:id", authorize(["admin", "staff"]), async (c) => {
  const { id } = c.req.param();
  const data = await c.req.json();
  await collections.animals.updateOne({ _id: new ObjectId(id) }, { $set: data });
  return c.json({ message: "Animal updated!" });
});

app.delete("/animals/:id", authorize(["admin", "staff"]), async (c) => {
  const { id } = c.req.param();
  await collections.animals.deleteOne({ _id: new ObjectId(id) });
  return c.json({ message: "Animal deleted!" });
});

//CRUD EVENTS
app.post("/events", authorize(["admin", "staff"]), async (c) => {
  const data = await c.req.json();
  const result = await collections.events.insertOne(data);
  return c.json({ message: "Event added!", id: result.insertedId }, 201);
});

app.get("/events/:id", async (c) => {
  const { id } = c.req.param();
  const event = await collections.events.findOne({ _id: new ObjectId(id) });
  if (!event) {
    return c.json({ message: "Event not found!" }, 404);
  }
  return c.json(event);
});

app.put("/events/:id", authorize(["admin", "staff"]), async (c) => {
  const { id } = c.req.param();
  const data = await c.req.json();
  await collections.events.updateOne({ _id: new ObjectId(id) }, { $set: data });
  return c.json({ message: "Event updated!" });
});

app.delete("/events/:id", authorize(["admin", "staff"]), async (c) => {
  const { id } = c.req.param();
  await collections.events.deleteOne({ _id: new ObjectId(id) });
  return c.json({ message: "Event deleted!" });
});

//CRUD ADOPTEE
app.post("/adoptees", async (c) => {
  const data = await c.req.json();
  const result = await collections.adoptees.insertOne(data);
  return c.json({ message: "Adoptee request added!", id: result.insertedId }, 201);
});

app.get("/adoptees", authorize(["admin", "staff"]), async (c) => {
  const adoptees = await collections.adoptees.find().toArray();
  return c.json(adoptees);
});

app.put("/adoptees/:id", authorize(["admin", "staff"]), async (c) => {
  const { id } = c.req.param();
  const data = await c.req.json();
  await collections.adoptees.updateOne({ _id: new ObjectId(id) }, { $set: data });
  return c.json({ message: "Adoptee info updated!" });
});

app.delete("/adoptees/:id", authorize(["admin"]), async (c) => {
  const { id } = c.req.param();
  await collections.adoptees.deleteOne({ _id: new ObjectId(id) });
  return c.json({ message: "Adoptee request deleted!" });
});

// get /admin
app.use(corsTest);
app.get("/admin", authorize(["admin"]), async (c) => {
  return c.json({ message: true });
});

export default app;
