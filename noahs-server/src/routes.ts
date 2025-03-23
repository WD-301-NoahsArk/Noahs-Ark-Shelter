import { Hono } from "hono";
import { authenticate, authorize, corsTest } from "./middleware.js";
import { preprocessStaff, collections } from "./db.js";
import { ObjectId } from "mongodb";
import { join } from 'path'
import { writeFile, unlink } from 'fs/promises'
import { fileURLToPath } from 'url'
import { existsSync, mkdirSync } from 'fs'
import { google } from 'googleapis'
import fs from 'fs'
import path from 'path'
import "dotenv/config";


const app = new Hono();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is missing from environment variables!");
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const REDIRECT_URI = process.env.REDIRECT_URI
const REFRESH_TOKEN = process.env.REFRESH_TOKEN

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
)

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })

const drive = google.drive({ version: 'v3', auth: oauth2Client})

// Public Routes
app.use(corsTest);
app.get("/", (c) => c.text("API is running!"));
app.get("/staff", async (c) => c.json(await collections.staff.find().toArray()));
app.get("/animals", async (c) => c.json(await collections.animals.find().toArray()));
app.get("/events", async (c) => c.json(await collections.events.find().toArray()));
app.get('/animals/:petCode', async (c) => {
  const petCode = c.req.param("petCode") || c.req.query("petCode");

  try {
    const pet = await collections.animals.findOne({
      code: { $regex: new RegExp(`^${petCode}$`, "i") }
    });

    if (!pet) {
      return c.json({ message: "Pet not found" }, 404);
    }

    return c.json(pet);
  } catch (error) {
    console.error('Error fetching pet:', error);
    return c.json({ message: "Internal Server Error" }, 500);
  }
});

app.post("/adoptees", async (c) => {
  try {
    const body = await c.req.json();
    await collections.adoptees.insertOne(body);
    return c.json({ message: "Adoption request successful" });
  } catch (error) {
    return c.json({ message: "Internal Server Error" }, 500);
  }
});


// LogIn
app.use("*", authenticate);

app.post('/upload', async (c) => {
  const formData = await c.req.formData()
  const file = formData.get('file')

  if (!file || !(file instanceof File)) {
    return c.json({ message: 'No valid file uploaded' }, 400)
  }

  const dirPath = path.join(__dirname, 'assets', 'images')
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true })
  }

  const filePath = path.join(dirPath, file.name)
  const buffer = await file.arrayBuffer()

  try {
    await writeFile(filePath, Buffer.from(buffer))

    const res = await drive.files.create({
      requestBody: {
        name: file.name,
        mimeType: file.type,
      },
      media: {
        mimeType: file.type,
        body: fs.createReadStream(filePath)
      }
    })

    const fileId = res.data.id

    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone'
      }
    })

    await unlink(filePath)

    return c.json({
      message: 'File uploaded to Google Drive successfully',
      urlImage: `https://lh3.googleusercontent.com/d/${res.data.id}`
    })
  } catch (err) {
    console.error('Upload error:', err)
    return c.json({ message: 'Error uploading file' }, 500)
  }
})

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
