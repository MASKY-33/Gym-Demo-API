# (Database initialisatie):
# Dit bestand regelt puur de verbinding met je database en maakt de tabel permanent aan


import os
import sqlite3




# --- DATABASE EN AUTH CONFIGURATIE ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "gym_database.db")



# --- SQLITE DATABASE INITIALISATIE ---
def init_db():
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    cursor = conn.cursor()
    # Maakt een permanente tabel aan voor je sportschoolleden
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS gym_members (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            naam TEXT NOT NULL,
            age INTEGER NOT NULL,
            email TEXT NOT NULL,
            is_active INTEGER DEFAULT 1,
            created_at TEXT NOT NULL
        )
    """)
    conn.commit()
    return conn

db_conn = init_db()