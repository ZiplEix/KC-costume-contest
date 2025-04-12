import { submissionsStore } from "$lib/stores/submissions";
import { votesStore } from "$lib/stores/votes";
import axios from "axios";

export async function vote(id: string) {
    let voteType: "vote" | "unvote" | null = null;
    const mySubmission = localStorage.getItem("submissionId");

    if (mySubmission && id === mySubmission) {
        alert("You cannot vote for your own submission.");
        return;
    }

    votesStore.update((currentVotes) => {
        const newVotes = [...currentVotes];

        if (newVotes.includes(id)) {
            // Un-vote
            const index = newVotes.indexOf(id);
            newVotes[index] = "0";
            submissionsStore.update((subs) => {
                const index = subs.findIndex((sub) => sub.id === Number(id));
                if (index !== -1) {
                    subs[index].voteCount -= 1;
                }
                return subs;
            });
            voteType = "unvote";
        } else if (newVotes.includes("0")) {
            // Add vote
            const emptyIndex = newVotes.indexOf("0");
            newVotes[emptyIndex] = id;
            submissionsStore.update((subs) => {
                const index = subs.findIndex((sub) => sub.id === Number(id));
                if (index !== -1) {
                    subs[index].voteCount += 1;
                }
                return subs;
            });
            voteType = "vote";
        } else {
            alert("You can only vote for two candidates.");
        }

        return newVotes;
    });

    if (voteType) {
        try {
            await axios.post("/api/vote", { id, type: voteType });
        } catch (error) {
            console.error("Error submitting vote:", error);
        }
    }
}
