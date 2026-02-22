require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// Mongo
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Mongo conectado"))
  .catch(err => console.log(err));

// Webhook
app.post("/erlc-webhook", (req, res) => {
    const apiKey = req.headers["oQPLcrDzEUFMyvfqdJQL-PJDRWWHtKGBRMKhYiKQdDBaFAlxYIieTxEgQUQGR"];

    if (apiKey !== process.env.ERLC_SECRET) {
        return res.sendStatus(403);
    }

    console.log("Datos ERLC:", req.body);

    res.sendStatus(200);
});

// Endpoint test
app.get("/ping", (req, res) => {
    res.json({ status: "ok" });
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Servidor iniciado");
});