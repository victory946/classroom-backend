import express from "express";
import { db } from "./db";
import { demoUsers } from "./schema";
import { eq } from "drizzle-orm";

const app = express();
const PORT = 8000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the classroom backend!" });
});

// Example endpoint to get all users
app.get("/users", async (req, res) => {
  try {
    const users = await db.select().from(demoUsers);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Example endpoint to create a user
app.post("/users", async (req, res) => {
  try {
    const { name, email } = req.body;
    const [newUser] = await db
      .insert(demoUsers)
      .values({ name, email })
      .returning();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: "Failed to create user" });
  }
});

// Example endpoint to update a user
app.put("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    const [updatedUser] = await db
      .update(demoUsers)
      .set({ name, email })
      .where(eq(demoUsers.id, parseInt(id)))
      .returning();
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Failed to update user" });
  }
});

// Example endpoint to delete a user
app.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.delete(demoUsers).where(eq(demoUsers.id, parseInt(id)));
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
