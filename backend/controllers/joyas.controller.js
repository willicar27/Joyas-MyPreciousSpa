
import { pool } from '../Database/connection.js';
import format from 'pg-format';

const obtenerJoyas = async ({ limits = 10, order_by = "precio_ASC", page = 2 }) => {
    const [campo, direccion] = order_by.split("_");
    const offset = (page -1) * limits;
    const formattedQuery = format('SELECT * FROM inventario order by %I %s LIMIT %s OFFSET %s', campo, direccion, limits, offset);

    const { rows: inventario } = await pool.query(formattedQuery);
    return inventario;
};

const prepararHATEOAS = (inventario) => {
    
    const results = inventario.map((m) => {
        return {
            nombre: m.nombre,
            href: `/inventario/joyas/${m.id}`,
        }
    }).slice(0, 10);
    const totalJoyas = inventario.length;
    const HATEOAS = {
        totalJoyas,
        results
    }
    return HATEOAS
};

export const inventarioJoyas = {
    obtenerJoyas, 
    prepararHATEOAS
}