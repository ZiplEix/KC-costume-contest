import type { RequestHandler } from "./$types";
import jwt from 'jsonwebtoken';
import { parse } from 'cookie';
import { SECRET_MANAGMENT_PASSWORD, SECRET_JWT_SECRET } from '$env/static/private';
import { verifyToken } from "$lib/utils/verify_token";

export const GET: RequestHandler = async ({ request }) => {
    const cookies = parse(request.headers.get('cookie') || '');
    const token = cookies.token;

    const resTok = verifyToken(token, SECRET_JWT_SECRET);
    if (resTok instanceof Response) {
        return resTok;
    }

    return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}

export const POST: RequestHandler = async ({ request }) => {
    const body = await request.json();

    const { password } = body;

    if (!password) {
        return new Response(JSON.stringify({ error: "Missing password" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    if (password !== SECRET_MANAGMENT_PASSWORD) {
        return new Response(JSON.stringify({ error: "Invalid password" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }

    const token = jwt.sign(
        { role: 'admin' },
        SECRET_JWT_SECRET,
        { expiresIn: '1h' }
    );

    const cookie = `token=${token}; HttpOnly; Path=/; Max-Age=3600; SameSite=Strict; Secure`;

    return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: {
            'Set-Cookie': cookie,
            'Content-Type': 'application/json'
        }
    });
}
