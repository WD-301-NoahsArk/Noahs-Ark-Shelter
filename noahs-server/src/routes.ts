import { Hono } from "hono";
import { authenticate, authorize } from "./middleware.js";
import { collections } from "./db.js";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import "dotenv/config";
import client from "./db.js";


const app = new Hono();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is missing from environment variables!");
}

// Public Routes
app.get("/", (c) => c.text("API is running!"));
app.get("/staff", async (c) => c.json(await collections.staff.find().toArray()));
app.get("/animals", async (c) => c.json(await collections.animals.find().toArray()));
app.get("/events", async (c) => c.json(await collections.events.find().toArray()));

// LogIn
app.use("*", authenticate);

app.post("/login", async (c) => {
  const { email, password } = await c.req.json();
  console.log("Login attempt for email:", email);

  const user = await collections.staff.findOne({ email });
  if (!user) {
    console.log("User not found!");
    return c.json({ message: "Invalid credentials" }, 401);
  }

  console.log("User found:", user.email);

  if (!user.password) {
    console.error("User password is missing in DB!");
    return c.json({ message: "Invalid credentials" }, 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  console.log("Password match status:", isMatch);

  if (!isMatch) {
    console.log("Passwords do NOT match!");
    return c.json({ message: "Invalid credentials" }, 401);
  }

  const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });
  console.log("JWT Token generated");

  return c.json({ token });
});

// CRUD STAFF
app.post("/staff", authorize(["admin"]), async (c) => {
  const data = await c.req.json();
  const staffMember: Staff | null = client.preprocessStaff(data); // Validate and preprocess data

  if (!staffMember) {
    return c.json({ message: "Invalid staff data" }, 400);
  }

  const existingUser  = await collections.staff.findOne({ email: staffMember.email });
  if (existingUser ) {
    return c.json({ message: "Staff already exists!" }, 400);
  }

  const result = await collections.staff.insertOne(staffMember);
  return c.json({ message: "Staff created!", id: result.insertedId }, 201);
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
app.get("/admin", authorize(["admin"]), async (c) => {
  return c.json({ message: "Welcome, Admin!" });
});

export default app;
function preprocessStaff(data: any) {
  throw new Error("Function not implemented.");
}

