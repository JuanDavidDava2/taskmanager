import express from "express";

const app = express();

const PORT = 3000;

app.use(express.json());

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

const tasks: Task[] = [];

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

app.post("/api/tasks", (req, res) => {
  const { title } = req.body;

  const newTask: Task = {
    id: tasks.length + 1,
    title,
    completed: false
  };

  tasks.push(newTask);

  res.status(201).json({
    message: "Tarea creada correctamente",
    task: newTask
  });
});

app.get("/api/tasks", (req, res) => {
  res.json(tasks);
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});