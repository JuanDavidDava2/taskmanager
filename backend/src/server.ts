import express from "express";
import db from "./database";
import cors from "cors";

const app = express();

const PORT = 3000;

app.use(cors());
app.use(express.json());

function formatTask(task: any) {
  return {
    id: task.id,
    title: task.title,
    completed: Boolean(task.completed)
  };
}

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

  res.json(tasks.map(formatTask));
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

  res.status(201).json(formatTask(newTask));
});

app.patch("/api/tasks/:id", (req, res) => {
  const taskId = Number(req.params.id);
  const { title, completed } = req.body;

  const existingTask = db
    .prepare("SELECT * FROM tasks WHERE id = ?")
    .get(taskId) as {
      id: number;
      title: string;
      completed: number;
    } | undefined;

  if (!existingTask) {
    res.status(404).json({
      message: "Tarea no encontrada"
    });

    return;
  }

  if (title !== undefined) {
    db.prepare(`
      UPDATE tasks
      SET title = ?
      WHERE id = ?
    `).run(title, taskId);
  }

  if (completed !== undefined) {
    db.prepare(`
      UPDATE tasks
      SET completed = ?
      WHERE id = ?
    `).run(completed ? 1 : 0, taskId);
  }

  const updatedTask = db
    .prepare("SELECT * FROM tasks WHERE id = ?")
    .get(taskId);

  res.json(formatTask(updatedTask));
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});