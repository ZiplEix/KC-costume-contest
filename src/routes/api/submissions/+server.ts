import { Database } from "$lib/server/database";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async () => {
    const submissions = await Database.getAllSubmissions();

    const response = submissions.map((submission) => ({
        id: submission.id,
        name: submission.name,
        imageUrl: submission.imageurl,
        voteCount: submission.votecount,
    }));

    return new Response(JSON.stringify(response), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}
