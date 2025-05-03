import fs from 'fs';

import { Database } from '$lib/server/database';
import type { RequestHandler } from '@sveltejs/kit';
import { parse } from 'cookie';
import { SECRET_JWT_SECRET } from '$env/static/private';
import { verifyToken } from '$lib/utils/verify_token';

export const GET: RequestHandler = async ({ params }) => {
    const id = params.id;

    if (!id) {
        return new Response(JSON.stringify({ error: 'Missing or invalid fields' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const submission = await Database.getSubmissionById(id);

    if (!submission) {
        return new Response(JSON.stringify({ error: 'Submission not found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const response = {
        id: submission.id,
        name: submission.name,
        imageUrl: submission.imageurl,
        voteCount: submission.votecount
    };

    return new Response(JSON.stringify(response), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}

export const DELETE: RequestHandler = async ({ request, params }) => {
    const cookies = parse(request.headers.get('cookie') || '');
    const token = cookies.token;

    const resTok = verifyToken(token, SECRET_JWT_SECRET);
    if (resTok instanceof Response) {
        return resTok;
    }

    const id = params.id;

    if (!id) {
        return new Response(JSON.stringify({ error: 'Missing or invalid fields' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const submission = await Database.getSubmissionById(id);

    if (!submission) {
        return new Response(JSON.stringify({ error: 'Submission not found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const filePath = `uploads/${submission.imageurl}`;
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    } else {
        console.error(`File not found: ${filePath}`);
    }

    await Database.deleteSubmissionById(id);

    return new Response(JSON.stringify({ message: 'Submission deleted successfully' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}
