import mysql.connector

# Connect to MySQL server
conn = mysql.connector.connect(
    host="localhost",       # change if needed
    user="root",            # your MySQL username
    password="Pratyush"   # your MySQL password
)

cursor = conn.cursor()

# Create database
cursor.execute("CREATE DATABASE IF NOT EXISTS student_db")
cursor.execute("USE student_db")

cursor.execute("""
    DROP table if exists users
""")
# Create students table
cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        uid INT PRIMARY KEY,
        uname VARCHAR(50) UNIQUE NOT NULL,
        name VARCHAR(100) NOT NULL,
        password VARCHAR(50) NOT NULL
    )
""")

# Hardcoded dummy data
dummy_data = [
    (1001, "aarav01", "Aarav Sharma", "Aarav@123"),
    (1002, "diya02", "Diya Verma", "Diya#456"),
    (1003, "rohan03", "Rohan Patel", "Rohan$789"),
    (1004, "ananya04", "Ananya Nair", "Ananya@321"),
    (1005, "ishaan05", "Ishaan Reddy", "Ishaan#654"),
    (1006, "meera06", "Meera Mehta", "Meera$987"),
    (1007, "karan07", "Karan Singh", "Karan@741"),
    (1008, "sanya08", "Sanya Kapoor", "Sanya#852"),
    (1009, "vivaan09", "Vivaan Iyer", "Vivaan$963"),
    (1010, "priya10", "Priya Chopra", "Priya@159")
]

# Insert data
cursor.executemany("""
    INSERT INTO users (uid, uname, name, password)
    VALUES (%s, %s, %s, %s)
""", dummy_data)

conn.commit()

cursor.close()
conn.close()