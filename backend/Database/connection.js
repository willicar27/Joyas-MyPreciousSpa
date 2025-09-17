import pkg from "pg";
import "dotenv/config";
const { Pool } = pkg;

export const pool = new Pool ({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
    allowExitOnIdle: true,
});

try {
    await pool.query("SELECT NOW()");
    console.log("Base de datos conectada");
} catch (error) {
    console.log(error);
};