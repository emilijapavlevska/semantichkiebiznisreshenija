const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

app.use(cors());

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

app.get('/recipes', async (req, res) => {
  try {
    await client.connect();
    const db = client.db("RecipeDB");
    const collection = db.collection("recipes");

    const ingredient = req.query.ingredient;
    const category = req.query.category;

    let query = {};

    if (ingredient && category) {
      query = {
        ingredients: { $elemMatch: { $regex: ingredient, $options: "i" } },
        category: category
      };
    } else if (ingredient) {
      query = {
        ingredients: { $elemMatch: { $regex: ingredient, $options: "i" } }
      };
    } else if (category) {
      query = { category: category };
    }

    const recipes = await collection.find(query, { projection: { _id: 0 } }).toArray();
    res.json(recipes);

  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching recipes");
  } finally {
    await client.close();
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
