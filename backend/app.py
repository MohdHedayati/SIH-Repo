from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os

app = Flask(__name__)
CORS(app) 

DB_FILE = "users.db"
SQL_FILE = "student_login.sql"

def init_db():
    """Create the DB file from .sql dump if not exists"""
    if not os.path.exists(DB_FILE):
        conn = sqlite3.connect(DB_FILE)
        with open(SQL_FILE, "r") as f:
            conn.executescript(f.read())
        conn.commit()
        conn.close()
        print(f"Database created from {SQL_FILE}")
    else:
        print("Database already exists, skipping import.")

def get_db_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"isValid": False, "message": "Missing username or password"}), 400

    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT password FROM users WHERE username = ?", (username,))
        row = cur.fetchone()
        conn.close()

        if row is None:
            return jsonify({"isValid": False, "message": "User not found"}), 404

        stored_password = row[0]

        if stored_password == password:
            # You can send back some user info too if needed
            return jsonify({
                "isValid": True,
                "message": "Login successful",
                "user": {"username": username}
            }), 200
        else:
            return jsonify({"isValid": False, "message": "Invalid password"}), 401

    except Exception as e:
        return jsonify({"isValid": False, "message": str(e)}), 500


if __name__ == "__main__":
    init_db()
    app.run(port=8000, debug=True)