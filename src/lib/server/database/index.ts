import sqlite3 from "sqlite3";

export class Database {
    private static dbPath = "database.sqlite";
    private static db: sqlite3.Database;

    public static async init(): Promise<void> {

        if (!this.db) {
            try {
                this.db = new sqlite3.Database(this.dbPath);
                console.log('Logger initialized');
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
        const query = `SELECT * FROM submission`;

        try {
            return await this.query(query);
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

    public static async deleteSubmission(id: string): Promise<void> {
        const query = `DELETE FROM submission WHERE id = ?`;

        try {
            await this.run(query, [id]);
        } catch (error) {
            console.error("Error deleting submission:", error);
            throw error;
        }
    }

    public static async registerVote(submissionId: number, type: "vote" | "unvote"): Promise<void> {
        const increment = type === "vote" ? 1 : -1;

        const query = `
            UPDATE submission
            SET votecount = MAX(0, votecount + ?)
            WHERE id = ?
        `;

        try {
            await this.query(query, [increment, submissionId]);
        } catch (error) {
            console.error(`Error registering ${type} for submission ${submissionId}:`, error);
            throw error;
        }
    }
}

Database.init()

process.on("SIGINT", async () => {
    console.log('Closing Database connection');
    await Database.close();
    process.exit(0);
});
