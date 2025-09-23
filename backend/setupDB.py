import mysql.connector

# Connect to MySQL server
conn = mysql.connector.connect(
    host="localhost",       
    user="root",            
    password="avi691610"   # your MySQL password
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
        dob DATE NOT NULL,
        password VARCHAR(50) NOT NULL
    )
""")

dummy_data = [
    (1001, "aarav01", "Aarav Sharma", "2007-05-14", "Aarav@123"),
    (1002, "diya02", "Diya Verma", "2008-08-22", "Diya#456"),
    (1003, "rohan03", "Rohan Patel", "2007-01-17", "Rohan$789"),
    (1004, "ananya04", "Ananya Nair", "2008-12-03", "Ananya@321"),
    (1005, "ishaan05", "Ishaan Reddy", "2007-07-29", "Ishaan#654"),
    (1006, "meera06", "Meera Mehta", "2008-03-11", "Meera$987"),
    (1007, "karan07", "Karan Singh", "2007-09-05", "Karan@741"),
    (1008, "sanya08", "Sanya Kapoor", "2008-11-18", "Sanya#852"),
    (1009, "vivaan09", "Vivaan Iyer", "2007-04-25", "Vivaan$963"),
    (1010, "priya10", "Priya Chopra", "2008-06-07", "Priya@159")
]

try:
    # Insert data
    cursor.executemany("""
        INSERT INTO users (uid, uname, name, dob, password)
        VALUES (%s, %s, %s, %s, %s)
    """, dummy_data)
except Exception as e:
    print("Insert error:", e)

conn.commit()

cursor.close()
conn.close()