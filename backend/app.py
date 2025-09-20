from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

DB_FILE = "quiz.db"

def get_db_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row  
    return conn

def init_db():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
    CREATE TABLE IF NOT EXISTS quiz_results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        question TEXT,
        answer TEXT,
        correct BOOLEAN
    )
    """)
    conn.commit()
    conn.close()

init_db()

@app.route("/ping", methods=["GET"])
def ping():
    return jsonify({"message": "Backend is working with SQLite!"})

@app.route("/submit", methods=["POST"])
def submit_result():
    data = request.json
    username = data.get("username")
    question = data.get("question")
    answer = data.get("answer")
    correct = data.get("correct")

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("INSERT INTO quiz_results (username, question, answer, correct) VALUES (?, ?, ?, ?)",
                (username, question, answer, correct))
    conn.commit()
    conn.close()

    return jsonify({"status": "success", "message": "Result saved!"})

@app.route("/results", methods=["GET"])
def get_results():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM quiz_results")
    rows = cur.fetchall()
    conn.close()

    results = [dict(row) for row in rows]
    return jsonify(results)

if __name__ == "__main__":
    app.run(debug=True)
