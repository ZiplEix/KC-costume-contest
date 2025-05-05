import sqlite3 from "sqlite3";

export class Database {
    private static dbPath = "database.sqlite";
    private static db: sqlite3.Database;

    public static async init(): Promise<void> {

        if (!this.db) {
            try {
                this.db = new sqlite3.Database(this.dbPath);
                console.log('Database initialized');
            } catch (error: any) {
                console.error('Failed to initialize Logger:', error);
                throw error;
            }
        }
    }

    public static async query(query: string, params: any[] = []): Promise<any[]> {
        return new Promise((resolve, reject) => {
            this.db.all(query, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    public static async run(query: string, params: any[] = []): Promise<number> {
        return new Promise((resolve, reject) => {
            this.db.run(query, params, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            });
        });
    }

    public static async close(): Promise<void> {
        if (this.db) {
            this.db.close();
        }
    }

    public static async registerSubmission(name: string, imageUrl: string): Promise<number> {
        const query = `INSERT INTO submission (name, imageurl) VALUES (?, ?)`;

        try {
            const insertedId = await this.run(query, [name, imageUrl]);
            return insertedId;
        } catch (error) {
            console.error("Error registering submission:", error);
            throw error;
        }
    }

    public static async getAllSubmissions(): Promise<any[]> {
        const query = `
            SELECT
                s.id,
                s.name,
                s.imageurl,
                s.created_at,
                COUNT(v.id) as voteCount
            FROM submission s
            LEFT JOIN vote v ON v.submissionid = s.id
            GROUP BY s.id
        `;

        try {
            const res = await this.query(query);
            return res
        } catch (error) {
            console.error("Error fetching submissions:", error);
            throw error;
        }
    }

    public static async getSubmissionById(id: string): Promise<any> {
        const query = `SELECT * FROM submission WHERE id = ?`;

        try {
            const rows = await this.query(query, [id]);
            return rows[0];
        } catch (error) {
            console.error("Error fetching submission by ID:", error);
            throw error;
        }
    }

    public static async getSubmissionByUserId(userid: string): Promise<any> {
        const query = `SELECT * FROM submission WHERE userid = ?`;

        try {
            const rows = await this.query(query, [userid]);
            return rows[0];
        } catch (error) {
            console.error("Error fetching submission by User ID:", error);
            throw error;
        }
    }

    public static async deleteSubmissionById(id: string): Promise<void> {
        const deleteVotesQuery = `DELETE FROM vote WHERE submissionid = ?`
        const deleteSubmissionQuery = `DELETE FROM submission WHERE id = ?`;

        try {
            await this.run(deleteSubmissionQuery, [id]);
            await this.run(deleteVotesQuery, [id]);
        } catch (error) {
            console.error("Error deleting submission and votes:", error);
            throw error;
        }
    }

    public static async deleteSubmissionByUserId(userid: string): Promise<void> {
        const query = `DELETE FROM submission WHERE userid = ?`;

        try {
            await this.run(query, [userid]);
        } catch (error) {
            console.error("Error deleting submission by User ID:", error);
            throw error;
        }
    }

    public static async getVotesByDeviceId(deviceId: string): Promise<any[]> {
        const query = `SELECT * FROM vote WHERE userid = ?`;

        try {
            return await this.query(query, [deviceId]);
        } catch (error) {
            console.error("Error fetching votes by Device ID:", error);
            throw error;
        }
    }

    // public static async registerVote(submissionId: number, type: "vote" | "unvote", userId: string): Promise<void> {
    //     if (type === "vote") {
    //         // Vérifie le nombre de votes existants pour cet utilisateur
    //         const existingVotes = await this.query(
    //             `SELECT COUNT(*) as count FROM vote WHERE userid = ?`,
    //             [userId]
    //         );
    //         console.log("Existing votes:", existingVotes);

    //         if (existingVotes[0].count >= 2) {
    //             throw new Error("User has already voted for 2 submissions.");
    //         }

    //         // Vérifie s’il n’a pas déjà voté pour cette submission
    //         const alreadyVoted = await this.query(
    //             `SELECT 1 FROM vote WHERE userid = ? AND submissionid = ?`,
    //             [userId, submissionId]
    //         );
    //         console.log("Already voted:", alreadyVoted);

    //         if (alreadyVoted.length > 0) {
    //             throw new Error("User has already voted for this submission.");
    //         }

    //         await this.run(
    //             `INSERT INTO vote (submissionid, userid) VALUES (?, ?)`,
    //             [submissionId, userId]
    //         ).catch((error) => {
    //             console.error("Error inserting vote:", error);
    //             throw error;
    //         });

    //     } else if (type === "unvote") {
    //         // Supprime le vote
    //         await this.db.run(
    //             `DELETE FROM vote WHERE submissionid = ? AND userid = ?`,
    //             [submissionId, userId]
    //         );
    //     }
    // }

    public static async registerVote(submissionId: number, type: "vote" | "unvote", userId: string): Promise<void> {
        if (type === "vote") {
            const alreadyVoted = await this.query(
                `SELECT 1 FROM vote WHERE userid = ? AND submissionid = ?`,
                [userId, submissionId]
            );

            if (alreadyVoted.length > 0) {
                throw new Error("User has already voted for this submission.");
            }

            await this.run(
                `INSERT INTO vote (submissionid, userid) VALUES (?, ?)`,
                [submissionId, userId]
            );
        } else if (type === "unvote") {
            await this.run(
                `DELETE FROM vote WHERE submissionid = ? AND userid = ?`,
                [submissionId, userId]
            );
        }
    }

}

Database.init()

process.on("SIGINT", async () => {
    console.log('Closing Database connection');
    await Database.close();
    process.exit(0);
});
