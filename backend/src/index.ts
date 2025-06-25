import express, { Request, Response, NextFunction } from 'express'; // Importar NextFunction
import mysql, { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000; 

app.use(cors()); 
app.use(express.json()); 

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Sweet22*',
    database: process.env.DB_NAME || 'examen2_movil', 
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

let pool: mysql.Pool;


async function initializeDatabase() {
    try {
        pool = mysql.createPool(dbConfig);
        console.log('Conexión a la base de datos MySQL establecida correctamente.');
        await pool.query('SELECT 1 + 1 AS solution');
        console.log('Verificación de conexión exitosa.');
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
        process.exit(1); 
    }
}


interface Producto {
    id?: number; 
    nombre: string;
    descripcion: string;
    precio: number;
    estado: boolean; 
    categoria: string;
    url_fotografia: string;
}

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
    (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };

app.get('/productos', asyncHandler(async (req: Request, res: Response) => {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM productos');
    res.json(rows as Producto[]);
}));

app.get('/productos/:id', asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM productos WHERE id = ?', [id]);
    if (rows.length === 0) {
        return res.status(404).json({ message: 'Producto no encontrado.' });
    }
    res.json(rows[0] as Producto);
}));


app.post('/productos', asyncHandler(async (req: Request, res: Response) => {
    const { nombre, descripcion, precio, estado, categoria, url_fotografia } = req.body as Producto;

    // Validación básica
    if (!nombre || !descripcion || !precio || estado === undefined || !categoria || !url_fotografia) {
        return res.status(400).json({ message: 'Todos los campos son requeridos (nombre, descripcion, precio, estado, categoria, url_fotografia).' });
    }

    const [result] = await pool.execute(
        'INSERT INTO productos (nombre, descripcion, precio, estado, categoria, url_fotografia) VALUES (?, ?, ?, ?, ?, ?)',
        [nombre, descripcion, precio, estado, categoria, url_fotografia]
    );
    const newProductId = (result as ResultSetHeader).insertId;
    res.status(201).json({ id: newProductId, message: 'Producto creado exitosamente.' });
}));

app.put('/productos/:id', asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { nombre, descripcion, precio, estado, categoria, url_fotografia } = req.body as Producto;

    if (!nombre || !descripcion || !precio || estado === undefined || !categoria || !url_fotografia) {
        return res.status(400).json({ message: 'Todos los campos son requeridos para actualizar.' });
    }

    const [result] = await pool.execute(
        'UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, estado = ?, categoria = ?, url_fotografia = ? WHERE id = ?',
        [nombre, descripcion, precio, estado, categoria, url_fotografia, id]
    );

    if ((result as ResultSetHeader).affectedRows === 0) {
        return res.status(404).json({ message: 'Producto no encontrado o no se pudo actualizar.' });
    }
    res.json({ message: 'Producto actualizado exitosamente.' });
}));

app.delete('/productos/:id', asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const [result] = await pool.execute(
        'DELETE FROM productos WHERE id = ?',
        [id]
    );
    if ((result as ResultSetHeader).affectedRows === 0) {
        return res.status(404).json({ message: 'Producto no encontrado.' });
    }
    res.json({ message: 'Producto eliminado exitosamente.' });
}));


app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('Error en ruta:', err); 
    if (res.headersSent) { 
        return next(err);
    }
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Error interno del servidor.';
    res.status(statusCode).json({ message });
});


async function startServer() {
    await initializeDatabase(); 
    app.listen(port, () => {
        console.log(`Servidor backend escuchando en http://localhost:${port}`);
    });
}

startServer();
