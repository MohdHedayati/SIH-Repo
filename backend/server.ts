import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { Client } from "https://deno.land/x/mysql@v2.12.1/mod.ts";

// --- Database and Questions Setup ---
console.log("Connecting to database...");
const client = await new Client().connect({
    hostname: "localhost",
    username: "root",
    db: "student_db",
    password: "avi691610" // IMPORTANT: Make sure this is your correct MySQL password
});
console.log("Database connection successful.");

console.log("Loading questions.json...");
const questionsJson = await Deno.readTextFile("./questions.json");
const allQuestions = JSON.parse(questionsJson);
console.log("Questions loaded successfully.");

// --- Helper Functions ---
function corr_dob(dob: string): string {
    const parts = dob.split("-");
    if (parts.length !== 3) { throw new Error("Invalid date format. Use DD-MM-YYYY"); }
    const [day, month, year] = parts;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

// --- Main Server Logic ---
const handler = async (req: Request): Promise<Response> => {
    const url = new URL(req.url);
    const path = url.pathname;
    const headers = new Headers({
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json"
    });
    if (req.method === "OPTIONS") { return new Response(null, { status: 204, headers }); }

    console.log(`Request received: ${req.method} ${path}`);

    // --- ROUTE 1: Get a specific question ---
    const questionRouteMatch = path.match(/^\/api\/question\/(\d+)$/);
    if (req.method === "GET" && questionRouteMatch) {
        const questionId = parseInt(questionRouteMatch[1], 10);
        const question = allQuestions.find(q => q.id === questionId);
        if (question) { return new Response(JSON.stringify(question), { status: 200, headers }); }
        else { return new Response(JSON.stringify({ error: "Question not found" }), { status: 404, headers }); }
    }

    // --- ROUTE 2: Handle user login ---
    if (path.includes("login") && req.method === "POST") {
        try {
            const body = await req.json();
            // ** THE FIX IS HERE: We check for 'uname' OR 'username' **
            const username = body.uname || body.username;

            console.log(`LOGIN ATTEMPT - User: '${username}', Pass: '${body.password}'`);
            
            const results = await client.query(
                `SELECT uname, uid, name FROM USERS WHERE uname = ? AND password = ?`,
                [username, body.password]
            );

            console.log(`LOGIN QUERY - Found ${results.length} matching users.`);

            if (results.length > 0) {
                const user = results[0];
                return new Response(JSON.stringify({ message: "Login Successful", isValid: true, user }), { status: 200, headers });
            } else {
                return new Response(JSON.stringify({ message: "Invalid Credentials :/", isValid: false }), { status: 401, headers });
            }
        } catch (e) {
            console.error("LOGIN ERROR:", e);
            return new Response(JSON.stringify({ error: "Server error during login" }), { status: 500, headers });
        }
    }

    // --- ROUTE 3: Handle new account creation ---
    if (path.includes("createAcc") && req.method === "POST") {
        try {
            const body = await req.json();
            // ** THE FIX IS HERE: We check for 'uname' OR 'username' **
            const username = body.uname || body.username;

            console.log(`CREATE ACCOUNT ATTEMPT - User: '${username}'`);

            const existingUser = await client.query(`SELECT name FROM USERS WHERE uname = ?`, [username]);
            if (existingUser.length > 0) {
                console.log("CREATE ACCOUNT - User already exists.");
                return new Response(JSON.stringify({ message: "Username already exists", isValid: false }), { status: 409, headers });
            }

            const formattedDob = corr_dob(body.dob);
            const nuidResult = await client.query(`SELECT MAX(uid) AS max_uid FROM users;`);
            const newUid = (nuidResult[0].max_uid || 1000) + 1;

            await client.query(
                `INSERT INTO users (uid, uname, name, password, dob) VALUES (?, ?, ?, ?, ?);`,
                [newUid, username, body.name, body.password, formattedDob]
            );
            
            console.log(`CREATE ACCOUNT - Success! User '${username}' created with UID ${newUid}.`);
            return new Response(JSON.stringify({ message: "Account Added Succesfully", isValid: true, user: { name: body.name, uid: newUid, user: username } }), { status: 200, headers });
        } catch (e) {
            console.error("CREATE ACCOUNT ERROR:", e);
            return new Response(JSON.stringify({ error: "Failed to create account" }), { status: 500, headers });
        }
    }

    console.log(`No route matched for ${path}.`);
    return new Response(JSON.stringify({ message: "Endpoint not found" }), { status: 404, headers });
};

// --- Start the Server ---
console.log("Starting server on http://localhost:8000");
await serve(handler, { port: 8000 });