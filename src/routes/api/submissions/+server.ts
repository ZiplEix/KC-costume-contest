import { Database } from "$lib/server/database";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async () => {
    const submissions = await Database.getAllSubmissions();

    const response = submissions.map((submission) => ({
        id: submission.id,
        name: submission.name,
        imageUrl: submission.imageurl,
        voteCount: submission.voteCount,
        createdAt: submission.created_at,
    }));

    return new Response(JSON.stringify(response), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}

// export const DELETE: RequestHandler = async ({ request }) => {
//     const body = await request.json();

//     const { userId } = body;

//     if (!userId) {
//         return new Response(JSON.stringify({ error: 'Missing userId' }), {
//             status: 400,
//             headers: { 'Content-Type': 'application/json' }
//         });
//     }

//     const submission = await Database.getSubmissionByUserId(userId);

//     if (!submission) {
//         return new Response(JSON.stringify({ error: 'Submission not found' }), {
//             status: 404,
//             headers: { 'Content-Type': 'application/json' }
//         });
//     }

//     const filePath = `uploads/${submission.imageurl}`;
//     if (fs.existsSync(filePath)) {
//         fs.unlinkSync(filePath);
//     } else {
//         console.error(`File not found: ${filePath}`);
//     }

//     await Database.deleteSubmissionByUserId(userId);

//     return new Response(JSON.stringify({ message: 'Submission deleted successfully' }), {
//         status: 200,
//         headers: { 'Content-Type': 'application/json' }
//     });
// }
