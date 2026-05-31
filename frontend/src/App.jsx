import "./App.css";
import { useEffect, useState } from "react";

function App() {

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  const getTasks = () => {

    fetch("/tasks")
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
      });

  };

  useEffect(() => {
    getTasks();
  }, []);

  const addTask = async () => {

    await fetch("/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
      }),
    });

    setTitle("");

    getTasks();
  };

  const deleteTask = async (id) => {

    setTimeout(async () => {

      await fetch(`/tasks/${id}`, {
        method: "DELETE",
      });

      getTasks();
    }, 800);
  };

  const updateTask = async (id, oldTitle) => {

  const newTitle = prompt("新しいタスク名", oldTitle);

  if (!newTitle) return;

  await fetch(`/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: newTitle,
    }),
  });

  getTasks();
  };

  return (
  <div className="container">

    <h1>タスク管理アプリ</h1>
    <p>
      タスクのタイトルを入力して「追加」ボタンを押してください。
    </p>

    <div class="task-add">

    <input
      class="text-input"
      type="text"
      value={title}
      placeholder="例）買い物"
      onChange={(e) => setTitle(e.target.value)}
    />

    <button 
      class="add-button"
      onClick={addTask}>
      追加
    </button>

    </div>
    <div class="tasks">
    {tasks.map((task) => (
      <div className="task" key={task.id}>
        <div>
          <input
            class="checkbox"
            type="checkbox"
            onChange={() => deleteTask(task.id)}
          />

          {task.title}
        </div>

        <button
          class="edit-button"
          onClick={() => updateTask(task.id, task.title)}
        >
          編集
        </button>

      </div>
    ))}
    
    </div>

  </div>
  );
}

export default App;