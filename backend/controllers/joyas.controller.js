
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

const joyasConFiltros = async ({ precio_max, precio_min, categoria, metal }) => {
    let filtros = [];
    const values = [];

    const agregarFiltro = (campo, comparador, valor) => {
        values.push(valor);
        const { length } = filtros;
        filtros.push(` ${campo} ${comparador} $${length +1}`);
    };

    if (precio_max) agregarFiltro('precio', '<=', precio_max);
    if (precio_min) agregarFiltro('precio', '>=', precio_min);
    if (categoria) agregarFiltro('categoria', '=', categoria);
    if (metal) agregarFiltro('metal', '=', metal);

    let consulta = "SELECT * FROM inventario";
    if (filtros.length > 0) {
        filtros = filtros.join(" AND ");
        consulta += `WHERE ${filtros}`;
    };

    const { rows: inventario } = await pool.query(consulta, values);
    return inventario
}

export const inventarioJoyas = {
    obtenerJoyas, 
    prepararHATEOAS,
    joyasConFiltros
}