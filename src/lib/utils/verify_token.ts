import jwt from 'jsonwebtoken';

export function verifyToken(tokenString: string, secret: string): Response | void {
    if (!tokenString) {
        return new Response(JSON.stringify({ error: "Unauthorized: missing token"}), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        jwt.verify(tokenString, secret);
    } catch (error: any) {
        console.log("Invalid JWT:", error.message);
        return new Response(JSON.stringify({ error: "Unauthorized: invalid token"}), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    return;
}
