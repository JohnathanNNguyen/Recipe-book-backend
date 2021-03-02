// Express is the Node framework that we're using to make our endpoints and middleware
const express = require("express");

//body parser is to transfer the data to your end point
// parses the JSON from incoming post and put request
const bodyParser = require("body-parser");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
// cors is needed to give us the ability to connect
const cors = require("cors");

// // NEW: MySQL database driver
const mysql = require("mysql2/promise");
// creates an instance of express that we use to use our api
const app = express();
// We import and immediately load the `.env` file
require("dotenv").config();

const port = process.env.PORT;

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

app.use(async function mysqlConnection(req, res, next) {
  try {
    req.db = await pool.getConnection();
    req.db.connection.config.namedPlaceholders = true;

    // Traditional mode ensures not null is respected for unsupplied fields, ensures valid JavaScript dates, etc.
    await req.db.query('SET SESSION sql_mode = "TRADITIONAL"');
    await req.db.query(`SET time_zone = '-8:00'`);

    await next();

    req.db.release();
  } catch (err) {
    // If anything downstream throw an error, we must release the connection allocated for the request
    console.log(err);
    if (req.db) req.db.release();
    throw err;
  }
});

app.use(cors());
app.use(bodyParser.json());




app.get("/recipes", async function (req, res) => {
  try{
    const [recipes] = await req.db.query{
      `Select * FROM recipe`,
      {
        
      }
    }
  }
  req.db.query("Select * FROM recipe", (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send(result);
  });
});

// Post saved recipes
app.post("/save", async function (req, res) {
  try {
    const recipes = await req.db.query(
      `INSERT INTO recipe (user_id, recipe_id, name, image, video, ingredient, instructions) VALUES (:user_id, :recipe_id, :name, :image, :video, :ingredient, :instructions)`,
      {
        user_id: req.body.user_id,
        recipe_id: req.body.recipe_id,
        name: req.body.name,
        image: req.body.image,
        video: req.body.video,
        ingredient: req.body.ingredient,
        instructions: req.body.instructions,
      }
    );
    res.json(recipes);
  } catch (err) {
    console.log("post/", err);
  }
});

// delete recipes
app.delete("/delete"),
  async function (req, res) {
    const [recipes] = await req.db.query(
      `
  DELETE FROM recipe WHERE recipe_id = :recipe_id
  `,
      {
        recipe_id: req.body.recipe_id,
      }
    );
    res.json(recipe);
  };

app.listen(port, () =>
  console.log(`Demo app listening at http://localhost:${port}`)
);
