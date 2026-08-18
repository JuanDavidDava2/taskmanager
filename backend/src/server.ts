import express from "express";
import db from "./database";

const app = express();

const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "API funcionando correctamente"
  });
});

app.get("/api/hello", (req, res) => {
  res.json({
    message: "Hola desde mi API"
  });
});

app.get("/api/tasks", (req, res) => {
  const tasks = db
    .prepare("SELECT * FROM tasks ORDER BY id DESC")
    .all();

  res.json(tasks);
});

app.post("/api/tasks", (req, res) => {
  const { title } = req.body;

  if (!title || typeof title !== "string") {
    res.status(400).json({
      message: "El título es obligatorio"
    });

    return;
  }

  const result = db
    .prepare(`
      INSERT INTO tasks (title, completed)
      VALUES (?, ?)
    `)
    .run(title, 0);

  const newTask = db
    .prepare("SELECT * FROM tasks WHERE id = ?")
    .get(result.lastInsertRowid);

  res.status(201).json(newTask);
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});