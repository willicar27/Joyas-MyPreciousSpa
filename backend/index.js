import "dotenv/config";
import express from "express";
import cors from "cors";
import { inventarioJoyas } from "./controllers/joyas.controller.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
    console.log(`servidor Encendido en el puerto http://localhost:${PORT}`);
});

app.get('/inventario', async (req, res) => {
    const queryStrings = req.query;
    try {
    const joyas = await inventarioJoyas.obtenerJoyas(queryStrings);
    const HATEOAS = await inventarioJoyas.prepararHATEOAS(joyas);
    return res.json(HATEOAS);
    }catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error interno en la ruta GET"})
    }
})

app.use((req, res) => {
    res.status(404).send("Esta ruta no existe.")
})