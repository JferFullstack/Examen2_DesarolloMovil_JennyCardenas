// miAppProductos-backend/src/index.ts
import express, { Request, Response } from 'express';
import mysql, { RowDataPacket, ResultSetHeader } from 'mysql2/promise'; // Importar RowDataPacket y ResultSetHeader
import cors from 'cors';
import dotenv from 'dotenv';

// Cargar variables de entorno del archivo .env
dotenv.config();

const app = express();
const port = process.env.PORT || 3000; // Puerto del servidor, por defecto 3000

// Middleware
app.use(cors()); // Habilita CORS para permitir solicitudes desde el frontend
app.use(express.json()); // Habilita el parsing de JSON en las solicitudes

// Configuración de la conexión a la base de datos MySQL
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'productos_db', // Asegúrate de que esta DB exista
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

let pool: mysql.Pool;

// Función para inicializar la conexión a la base de datos
async function initializeDatabase() {
    try {
        pool = mysql.createPool(dbConfig);
        console.log('Conexión a la base de datos MySQL establecida correctamente.');
        // Opcional: Verificar la conexión ejecutando una consulta simple
        await pool.query('SELECT 1 + 1 AS solution');
        console.log('Verificación de conexión exitosa.');
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
        process.exit(1); // Salir de la aplicación si no se puede conectar a la DB
    }
}

// Interfaz para el modelo de Producto
interface Producto {
    id?: number; // Opcional para cuando se crea un nuevo producto
    nombre: string;
    descripcion: string;
    precio: number;
    estado: boolean; // true para Disponible, false para No disponible
    categoria: string;
    url_fotografia: string;
}

// Rutas de la API

// GET /productos: Obtiene una lista de productos
app.get('/productos', async (req: Request, res: Response) => {
    try {
        // Se especifica RowDataPacket[] como tipo genérico para la consulta SELECT,
        // y luego se aserta el resultado a Producto[]
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM productos');
        res.json(rows as Producto[]); // Asertar a Producto[]
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener productos.' });
    }
});

// GET /productos/:id: Obtiene un producto por ID (para el detalle)
app.get('/productos/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        // Similarmente, se especifica RowDataPacket[] y luego se aserta a Producto
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM productos WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Producto no encontrado.' });
        }
        res.json(rows[0] as Producto); // Asertar el primer elemento a Producto
    } catch (error) {
        console.error(`Error al obtener producto con ID ${id}:`, error);
        res.status(500).json({ message: 'Error interno del servidor al obtener producto.' });
    }
});

// POST /productos: Crea un nuevo producto
app.post('/productos', async (req: Request, res: Response) => {
    const { nombre, descripcion, precio, estado, categoria, url_fotografia } = req.body as Producto;

    // Validación básica
    if (!nombre || !descripcion || !precio || estado === undefined || !categoria || !url_fotografia) {
        return res.status(400).json({ message: 'Todos los campos son requeridos (nombre, descripcion, precio, estado, categoria, url_fotografia).' });
    }

    try {
        // El tipo ResultSetHeader ya se maneja correctamente al importar
        const [result] = await pool.execute(
            'INSERT INTO productos (nombre, descripcion, precio, estado, categoria, url_fotografia) VALUES (?, ?, ?, ?, ?, ?)',
            [nombre, descripcion, precio, estado, categoria, url_fotografia]
        );
        const newProductId = (result as ResultSetHeader).insertId;
        res.status(201).json({ id: newProductId, message: 'Producto creado exitosamente.' });
    } catch (error) {
        console.error('Error al crear producto:', error);
        res.status(500).json({ message: 'Error interno del servidor al crear producto.' });
    }
});

// PUT /productos/:id: Actualiza un producto (si fuera necesario, aunque el examen pide DELETE)
// Esto se incluye como referencia, no es estrictamente requerido por las instrucciones iniciales.
app.put('/productos/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { nombre, descripcion, precio, estado, categoria, url_fotografia } = req.body as Producto;

    if (!nombre || !descripcion || !precio || estado === undefined || !categoria || !url_fotografia) {
        return res.status(400).json({ message: 'Todos los campos son requeridos para actualizar.' });
    }

    try {
        // El tipo ResultSetHeader ya se maneja correctamente al importar
        const [result] = await pool.execute(
            'UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, estado = ?, categoria = ?, url_fotografia = ? WHERE id = ?',
            [nombre, descripcion, precio, estado, categoria, url_fotografia, id]
        );

        if ((result as ResultSetHeader).affectedRows === 0) {
            return res.status(404).json({ message: 'Producto no encontrado o no se pudo actualizar.' });
        }
        res.json({ message: 'Producto actualizado exitosamente.' });
    } catch (error) {
        console.error(`Error al actualizar producto con ID ${id}:`, error);
        res.status(500).json({ message: 'Error interno del servidor al actualizar producto.' });
    }
});

// DELETE /productos/:id: Elimina un producto por ID
app.delete('/productos/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        // El tipo ResultSetHeader ya se maneja correctamente al importar
        const [result] = await pool.execute(
            'DELETE FROM productos WHERE id = ?',
            [id]
        );
        // affectedRows indica cuántas filas fueron afectadas por la operación DELETE
        if ((result as ResultSetHeader).affectedRows === 0) {
            return res.status(404).json({ message: 'Producto no encontrado.' });
        }
        res.json({ message: 'Producto eliminado exitosamente.' });
    } catch (error) {
        console.error(`Error al eliminar producto con ID ${id}:`, error);
        res.status(500).json({ message: 'Error interno del servidor al eliminar producto.' });
    }
});

// Iniciar el servidor
async function startServer() {
    await initializeDatabase(); // Asegurarse de que la DB esté conectada antes de iniciar el servidor
    app.listen(port, () => {
        console.log(`Servidor backend escuchando en http://localhost:${port}`);
    });
}

startServer();
