//Inicializar mi base de datos
export async function initializeDatabase(db) {
  //crear tabla patiente
  await db.execAsync(`
            CREATE TABLE IF NOT EXISTS products  (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                sku TEXT NOT NULL UNIQUE,
                category TEXT,
                price REAL NOT NULL DEFAULT 0,
                stock INTEGER NOT NULL DEFAULT 0,
                minStock INTEGER NOT NULL DEFAULT 0,
                notes TEXT
            );
        `);
}
