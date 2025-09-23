import mysql.connector

# Connect to MySQL server
conn = mysql.connector.connect(
    host="localhost",       
    user="root",            
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
        dob DATE NOT NULL,
        password VARCHAR(50) NOT NULL
    )
""")

dummy_data = [
    (1001, "aarav01", "Aarav Sharma", "Aarav@123", "2007-05-14"),
    (1002, "diya02", "Diya Verma", "Diya#456", "2008-08-22"),
    (1003, "rohan03", "Rohan Patel", "Rohan$789", "2007-01-17"),
    (1004, "ananya04", "Ananya Nair", "Ananya@321", "2008-12-03"),
    (1005, "ishaan05", "Ishaan Reddy", "Ishaan#654", "2007-07-29"),
    (1006, "meera06", "Meera Mehta", "Meera$987", "2008-03-11"),
    (1007, "karan07", "Karan Singh", "Karan@741", "2007-09-05"),
    (1008, "sanya08", "Sanya Kapoor", "Sanya#852", "2008-11-18"),
    (1009, "vivaan09", "Vivaan Iyer", "Vivaan$963", "2007-04-25"),
    (1010, "priya10", "Priya Chopra", "Priya@159", "2008-06-07")
]

# Insert data
cursor.executemany("""
    INSERT INTO users (uid, uname, name, password, dob)
    VALUES (%s, %s, %s, %s,%s)
""", dummy_data)

conn.commit()

cursor.close()
conn.close()