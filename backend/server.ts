import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { Client } from "https://deno.land/x/mysql@v2.12.0/mod.ts";
import { validateUser, editPass } from "./loginAuth.ts";
import { makeAcc } from "./newACC.ts";

if (!String.prototype.replaceAll) {
  String.prototype.replaceAll = function(search, replace) {
    return this.split(search).join(replace);
  };
}

const client = await new Client().connect({
    hostname: "localhost",
    username: "root",
    db: "student_db",
    password: "avi691610"
});

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

export const handler = async (req: Request): Promise<Response> => {
    //CORS preflight stuff
    if (req.method === 'OPTIONS') {
        return new Response(null, {
            headers: new Headers(corsHeaders)
        });
    }


    if (req.method === 'POST' && new URL(req.url).pathname === '/login') {
        try {
            const { username, password } = await req.json()

            const authResult = await validateUser(client, username, password);

            const headers = new Headers(corsHeaders);
            headers.set('Content-Type', 'application/json');

            //return authentication result
            return new Response(JSON.stringify(authResult.data), {
                headers,
                status: authResult.status
            });
        } catch (error) {
            const headers = new Headers(corsHeaders);
            headers.set('Content-Type', 'application/json');

            return new Response(JSON.stringify({
                message: "Login Failed",
                error: "Check your password or username"
            }), {
                headers,
                status: 500
            });
        }
    }

    if (req.method === 'POST' && new URL(req.url).pathname === '/edit') {
        try {
            const {username, password, npass} = await req.json();

            const Data = await editPass(client, username, password, npass);

            const headers = new Headers(corsHeaders);
            headers.set('Content-Type', 'application/json');

            //return authentication result
            return new Response(JSON.stringify(Data.data), {
                headers,
                status: Data.status
            });
        } catch (error) {
            const headers = new Headers(corsHeaders);
            headers.set('Content-Type', 'application/json');

            return new Response(JSON.stringify({
                message: "Failed to update data",
                error: "Invalid Request"
            }), {
                headers,
                status: 500
            });
        }
    }
    if (req.method === 'POST' && new URL(req.url).pathname === '/createAcc') {
        try {
            const {name,username,dob, password} = await req.json();

            const Data = await makeAcc(client,name,username,dob, password);

            const headers = new Headers(corsHeaders);
            headers.set('Content-Type', 'application/json');

            //return authentication result
            return new Response(JSON.stringify(Data.data), {
                headers,
                status: Data.status
            });
        } catch (error) {
            console.log(error);
            const headers = new Headers(corsHeaders);
            headers.set('Content-Type', 'application/json');

            return new Response(JSON.stringify({
                message: "Failed to update data",
                error: "Invalid Request"
            }), {
                headers,
                status: 500
            });
        }
    }

    // 404 Not Found
    return new Response(JSON.stringify({ message: "Not Found" }), {
        headers: new Headers(corsHeaders),
        status: 404
    });
};

serve(handler, { port: 8000 });