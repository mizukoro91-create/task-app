const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const path = require("path");

require("dotenv").config({ path: path.join(__dirname, "../.env") });

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false}
);

app.get("/", (req, res) => {
  res.send("server ok");
});

app.get("/tasks", async (req, res) => {
  app.delete("/tasks/:id", async (req, res) => {

  const { id } = req.params;

  try {

    await pool.query(
      "DELETE FROM tasks WHERE id = $1",
      [id]
    );

    res.json({
      message: "削除成功"
    });

  } catch (err) {

    console.log(err);

  }
  app.put("/tasks/:id", async (req, res) => {

    const { id } = req.params;
    const { title } = req.body;

    try {

      await pool.query(
        "UPDATE tasks SET title = $1 WHERE id = $2",
        [title, id]
      );

      res.json({
        message: "更新成功"
      });

    } catch (err) {

      console.log(err);

    }

  });

});

  try {

    const result = await pool.query(
      "SELECT * FROM tasks ORDER BY id DESC"
    );

    res.json(result.rows);

  } catch (err) {

    console.log(err);

  }

});

app.post("/tasks", async (req, res) => {

  const { title } = req.body;

  try {

    await pool.query(
      "INSERT INTO tasks (title) VALUES ($1)",
      [title]
    );

    res.json({
      message: "追加成功"
    });

  } catch (err) {

    console.log(err);

  }

});

app.listen(3000, () => {
  console.log("server start");
});