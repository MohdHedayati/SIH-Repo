import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { Client } from "https://deno.land/x/mysql@v2.12.0/mod.ts";

const PASSWORD="Pratyush";

const client = await new Client().connect({
  hostname: "localhost",
  username: "root",
  db: "sih",
  password: PASSWORD,
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export const handler = async (req: Request): Promise<Response> => {
  const url = new URL(req.url);
  const headers = new Headers(corsHeaders);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers });
  }

  try {
    if (req.method === "POST" && url.pathname === "/login") {
      const body = await req.json();
      return new Response(JSON.stringify({ message: "Login endpoint hit", body }), {
        headers,
        status: 200,
      });
    }


    return new Response(JSON.stringify({ error: "Not Found" }), {
      headers,
      status: 404,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      headers,
      status: 500,
    });
  }
};

serve(handler, { port: 8000 });
console.log("🚀 Server running on http://localhost:8000");