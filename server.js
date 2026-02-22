require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const Call = require("./models/Call");

const app = express();

app.use(cors());
app.use(express.json());

// Conectar MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB conectado"))
    .catch(err => console.log(err));


// 🔐 Webhook de ERLC
app.post("/erlc-webhook", async (req, res) => {

    const apiKey = req.headers["oQPLcrDzEUFMyvfqdJQL-PJDRWWHtKGBRMKhYiKQdDBaFAlxYIieTxEgQUQGR"];

    if (apiKey !== process.env.ERLC_SECRET) {
        return res.sendStatus(403);
    }

    const data = req.body;

    await procesarDatosERLC(data);

    res.sendStatus(200);
});


// Procesar eventos
async function procesarDatosERLC(data) {

    // EJEMPLO si la API envía callCreated
    if (data.eventType === "callCreated") {

        await Call.create({
            callId: data.callId,
            type: data.callType,
            department: data.department,
            location: data.location
        });

        console.log("Nuevo llamado registrado:", data.callId);
    }

    if (data.eventType === "callEnded") {

        await Call.updateOne(
            { callId: data.callId },
            { status: "closed" }
        );

        console.log("Llamado cerrado:", data.callId);
    }
}


// Endpoint para ver llamados activos
app.get("/calls", async (req, res) => {

    const calls = await Call.find({ status: "active" });

    res.json(calls);
});


app.listen(process.env.PORT, () =>
    console.log("Servidor corriendo en puerto", process.env.PORT)
);