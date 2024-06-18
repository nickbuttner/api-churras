require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const { Model, raw } = require("objection");
const { User } = require("./models/User");
const { BBQ } = require("./models/BBQ");
const knexConfig = require("./knexfile");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

app.use(cors());
app.use(bodyParser.json());

const knex = require("knex")(knexConfig);

Model.knex(knex);

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

const verifyToken = async (token, opts) => {
  return await jwt.verify(token, process.env.JWT_SECRET, opts);
};

const checkForToken = async (req) => {
  if (!req.headers.hasOwnProperty("authorization")) {
    return { error: "No authorization header found" };
  }

  const auth = req.headers.authorization.split(" ");
  if (auth[0] == "Bearer" && auth[1]) {
    try {
      const token = await verifyToken(auth[1]);
      return { error: null, token };
    } catch (error) {
      return { error: error.message };
    }
  }

  return { error: "No token found" };
};

app.post("/login", async (req, res) => {
  try {
    const user = await User.query().findOne({ email: req.body.email });

    if (!user) return res.json({ error: "Invalid credentials" });

    if (bcrypt.compareSync(req.body.password, user.password)) {
      return res.json({
        token: generateToken(user.id),
        name: user.name,
        id: user.id,
      });
    }
  } catch (error) {
    return { error: error.message };
  }

  return res.json({ error: "Invalid credentials" });
});

app.get("/bbqs", async (req, res) => {
  const auth = await checkForToken(req);

  if (auth.error) {
    return res.json({ error: auth.error });
  }

  try {
    const bbqs = await User.relatedQuery("bbqs")
      .for(auth.token.id)
      .withGraphFetched("guests");
    if (bbqs) {
      return res.json({ bbqs });
    }

    return res.json({ error: "User not found" });
  } catch (error) {
    return res.json({ error: error.message });
  }
});

app.post("/bbqs", async (req, res) => {
  const auth = await checkForToken(req);

  if (auth.error) {
    return res.json({ error: auth.error });
  }

  try {
    const bbq = await User.relatedQuery("bbqs").for(auth.token.id).insert({
      name: req.body.name,
      date: req.body.date,
      suggested_value: req.body.suggested_value,
      suggested_value_without_beverage:
        req.body.suggested_value_without_beverage,
    });
    if (bbq) {
      return res.json({ bbq });
    }

    return res.json({ error: "User not found" });
  } catch (error) {
    return res.json({ error: error.message });
  }
});

app.patch("/bbqs/:id", async (req, res) => {
  const auth = await checkForToken(req);

  if (auth.error) {
    return res.json({ error: auth.error });
  }

  try {
    const bbq = await BBQ.query().upsertGraph(
      { id: req.params.id, ...req.body },
      { relate: ["guests"] }
    );

    if (bbq) {
      return res.json({ bbq });
    }

    return res.json({ error: "BBQ not found" });
  } catch (error) {
    return res.json({ error: error.message });
  }
});

app.delete("/bbqs/:id", async (req, res) => {
  const auth = await checkForToken(req);

  if (auth.error) {
    return res.json({ error: auth.error });
  }

  try {
    const deleted = await BBQ.query().delete().where({
      id: req.params.id,
      organizer_id: auth.token.id,
    });

    if (deleted) {
      return res.json({ bbq: { id: req.params.id } });
    }

    return res.json({ error: "BBQ not deleted" });
  } catch (error) {
    return res.json({ error: error.message });
  }
});

app.listen(process.env.PORT || 3001, function () {
  console.log("running...");
});
