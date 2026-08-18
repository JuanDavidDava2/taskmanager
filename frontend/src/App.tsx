import { useEffect, useState } from "react";
import "./App.css";

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/api/tasks")
      .then((response) => response.json())
      .then((data) => {
        setTasks(data);
      })
      .catch((error) => {
        console.error("Error al obtener tareas:", error);
      });
  }, []);

  const createTask = async () => {
    if (!newTaskTitle.trim()) {
      return;
    }

    const response = await fetch("http://localhost:3000/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: newTaskTitle,
      }),
    });

    const newTask = await response.json();

    setTasks((currentTasks) => [newTask, ...currentTasks]);
    setNewTaskTitle("");
  };

  const toggleTask = async (task: Task) => {
    const response = await fetch(
      `http://localhost:3000/api/tasks/${task.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completed: !task.completed,
        }),
      }
    );

    const updatedTask = await response.json();

    setTasks((currentTasks) =>
      currentTasks.map((currentTask) =>
        currentTask.id === updatedTask.id ? updatedTask : currentTask
      )
    );
  };

  const startEditing = (task: Task) => {
    setEditingTaskId(task.id);
    setEditingTitle(task.title);
  };

  const saveEdit = async (taskId: number) => {
    if (!editingTitle.trim()) {
      return;
    }

    const response = await fetch(
      `http://localhost:3000/api/tasks/${taskId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editingTitle,
        }),
      }
    );

    const updatedTask = await response.json();

    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      )
    );

    setEditingTaskId(null);
    setEditingTitle("");
  };

  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = tasks.length - completedTasks;

  return (
    <div className="app">
      <main className="container">
        {/* Encabezado */}
        <header className="header">
          <div>
            <p className="eyebrow">TASK MANAGER</p>
            <h1>Mis tareas</h1>
            <p className="subtitle">
              Organiza tus pendientes y mantén el control de tu día.
            </p>
          </div>

          <div className="header-icon">✓</div>
        </header>

        {/* Estadísticas */}
        <section className="stats">
          <div className="stat-card">
            <span className="stat-number">{tasks.length}</span>
            <span className="stat-label">Total</span>
          </div>

          <div className="stat-card pending">
            <span className="stat-number">{pendingTasks}</span>
            <span className="stat-label">Pendientes</span>
          </div>

          <div className="stat-card completed">
            <span className="stat-number">{completedTasks}</span>
            <span className="stat-label">Completadas</span>
          </div>
        </section>

        {/* Crear tarea */}
        <section className="create-card">
          <div className="create-title">
            <span>➕</span>
            <div>
              <h2>Nueva tarea</h2>
              <p>Agrega algo que quieras completar.</p>
            </div>
          </div>

          <div className="input-row">
            <input
              type="text"
              placeholder="¿Qué necesitas hacer?"
              value={newTaskTitle}
              onChange={(event) => setNewTaskTitle(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  createTask();
                }
              }}
            />

            <button className="add-button" onClick={createTask}>
              Agregar tarea
            </button>
          </div>
        </section>

        {/* Lista */}
        <section className="tasks-section">
          <div className="section-header">
            <div>
              <h2>Mis tareas</h2>
              <p>
                {tasks.length === 0
                  ? "No tienes tareas todavía."
                  : `${tasks.length} ${
                      tasks.length === 1 ? "tarea" : "tareas"
                    } en tu lista`}
              </p>
            </div>
          </div>

          <div className="task-list">
            {tasks.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">✓</div>
                <h3>Todo está limpio</h3>
                <p>Agrega tu primera tarea para comenzar.</p>
              </div>
            ) : (
              tasks.map((task) => (
                <div
                  className={`task-card ${
                    task.completed ? "task-completed" : ""
                  }`}
                  key={task.id}
                >
                  <input
                    className="checkbox"
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task)}
                  />

                  {editingTaskId === task.id ? (
                    <div className="edit-area">
                      <input
                        className="edit-input"
                        type="text"
                        value={editingTitle}
                        onChange={(event) =>
                          setEditingTitle(event.target.value)
                        }
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            saveEdit(task.id);
                          }
                        }}
                        autoFocus
                      />

                      <div className="edit-buttons">
                        <button
                          className="save-button"
                          onClick={() => saveEdit(task.id)}
                        >
                          Guardar
                        </button>

                        <button
                          className="cancel-button"
                          onClick={() => {
                            setEditingTaskId(null);
                            setEditingTitle("");
                          }}
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="task-content">
                        <span className="task-title">{task.title}</span>

                        <span className="task-status">
                          {task.completed ? "Completada" : "Pendiente"}
                        </span>
                      </div>

                      <button
                        className="edit-button"
                        onClick={() => startEditing(task)}
                      >
                        ✏️ Editar
                      </button>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </section>

        <footer>
          <span>Task Manager</span>
          <span>React + Node.js + SQLite</span>
        </footer>
      </main>
    </div>
  );
}

export default App;