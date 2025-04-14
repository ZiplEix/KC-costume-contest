import { Database } from "$lib/server/database";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request }) => {
    const body = await request.json();

    const { type, id } = body;
    const userId = request.headers.get('X-Device-ID');

    console.log("Received vote request:", { type, id, userId });

    if (!userId) {
        return new Response(JSON.stringify({ error: 'Missing device ID' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    } else if (!type || !id) {
        console.error("Missing type or id in request body");
        return new Response(JSON.stringify({ error: "Missing or invalid fields" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    } else if (type !== "vote" && type !== "unvote") {
        console.error("Invalid vote type:", type);
        return new Response(JSON.stringify({ error: "Invalid vote type" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    const submission = await Database.getSubmissionById(id);
    console.log("Submission:", submission);
    if (submission && submission.userid === userId) {
        // cannot vote for your own submission
        console.error("User cannot vote for their own submission");
        return new Response(JSON.stringify({ error: "User cannot vote for their own submission" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    const submissionId = parseInt(id.toString(), 10);
    if (isNaN(submissionId)) {
        console.error("Invalid submission ID:", id);
        return new Response(JSON.stringify({ error: "Invalid submission ID" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    await Database.registerVote(submissionId, type as "vote" | "unvote", userId);

    console.log(`Vote ${type} registered for submission ID ${submissionId} by user ID ${userId}`);

    return new Response(JSON.stringify({ message: "Vote received!" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}

export const GET: RequestHandler = async ({ request }) => {
    const deviceId = request.headers.get('X-Device-ID');
    if (!deviceId) {
        return new Response(JSON.stringify({ error: 'Missing device ID' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const votes = await Database.getVotesByDeviceId(deviceId);

    const response = votes.map(vote => vote.submissionid);

    return new Response(JSON.stringify(response), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}
