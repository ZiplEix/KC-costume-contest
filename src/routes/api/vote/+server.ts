import { Database } from "$lib/server/database";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request }) => {
    const body = await request.json();

    const { type, id } = body;

    console.log("Received vote request:", { type, id });

    if (!type || !id) {
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

    const submissionId = parseInt(id.toString(), 10);
    if (isNaN(submissionId)) {
        console.error("Invalid submission ID:", id);
        return new Response(JSON.stringify({ error: "Invalid submission ID" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    await Database.registerVote(submissionId, type as "vote" | "unvote");

    console.log(`Vote ${type} registered for submission ID ${submissionId}`);

    return new Response(JSON.stringify({ message: "Vote received!" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}
