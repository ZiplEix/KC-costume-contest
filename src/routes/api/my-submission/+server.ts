import { Database } from '$lib/server/database';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ request }) => {
    const deviceId = request.headers.get('X-Device-ID');
    if (!deviceId) {
        return new Response(JSON.stringify({ error: 'Missing device ID' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const submission = await Database.getSubmissionByUserId(deviceId);

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
