// server.ts
import { serve } from "https://deno.land/std@0.203.0/http/server.ts";

interface Question {
  id: number;
  text: string;
}

const client = await new Client().connect({
    hostname: "localhost",
    username: "root",
    db: "student_db",
    password: "avi691610"
});

const users: { [username: string]: string } = {}; // username -> password
const questions: Question[] = [
  { id: 1, text: "What is your name?" },
  { id: 2, text: "How old are you?" },
  { id: 3, text: "What is your favorite color?" },
];
const answers: Answer[] = [];

// Helper: send JSON
function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    },
  });
}

serve(async (req: Request) => {
  const { pathname } = new URL(req.url);

  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  // Auth: register
  if (pathname === "/api/register" && req.method === "POST") {
    const { username, password } = await req.json();
    if (users[username]) {
      return jsonResponse({ error: "User already exists" }, 400);
    }
    users[username] = password;
    return jsonResponse({ success: true, message: "User registered" });
  }

  // Auth: login
  if (pathname === "/api/login" && req.method === "POST") {
    const { username, password } = await req.json();
    if (users[username] && users[username] === password) {
      return jsonResponse({ success: true, message: "Login successful" });
    }
    return jsonResponse({ error: "Invalid credentials" }, 401);
  }

  // Questions
  if (pathname === "/api/questions" && req.method === "GET") {
    return jsonResponse(questions);
  }

  // Submit answers
  if (pathname === "/api/answers" && req.method === "POST") {
    const body = await req.json();
    answers.push(body);
    console.log("Received answers:", answers);
    return jsonResponse({ success: true, message: "Answers saved" });
  }

  // Default
  return new Response("Not found", { status: 404 });
});
