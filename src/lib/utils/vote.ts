import { submissionsStore } from "$lib/stores/submissions";
import { votesStore } from "$lib/stores/votes";
import axios from "axios";
import { get } from "svelte/store";

// export async function vote(id: string) {
//     let voteType: "vote" | "unvote" | null = null;
//     const saveCurrentVotes = get(votesStore);

//     votesStore.update((currentVotes) => {
//         const newVotes = [...currentVotes];

//         // console.log("Current votes:", newVotes);

//         if (newVotes.includes(id)) {
//             // Un-vote
//             const index = newVotes.indexOf(id);
//             newVotes[index] = "0";
//             submissionsStore.update((subs) => {
//                 const index = subs.findIndex((sub) => sub.id === Number(id));
//                 if (index !== -1) {
//                     subs[index].voteCount -= 1;
//                 }
//                 return subs;
//             });
//             voteType = "unvote";
//         } else if (newVotes.includes("0")) {
//             // Add vote
//             const emptyIndex = newVotes.indexOf("0");
//             newVotes[emptyIndex] = id;
//             submissionsStore.update((subs) => {
//                 const index = subs.findIndex((sub) => sub.id === Number(id));
//                 if (index !== -1) {
//                     subs[index].voteCount += 1;
//                 }
//                 return subs;
//             });
//             voteType = "vote";
//         } else {
//             alert("You can only vote for two candidates.");
//         }

//         return newVotes;
//     });

//     if (voteType) {
//         try {
//             await axios.post("/api/vote", { id, type: voteType }, {
//                 headers: {
//                     "X-Device-ID": localStorage.getItem("deviceId"),
//                 },
//             });
//         } catch (error) {
//             console.error("Error submitting vote:", error);
//             // Rollback to previous state
//             votesStore.set(saveCurrentVotes);
//             submissionsStore.update((subs) => {
//                 const index = subs.findIndex((sub) => sub.id === Number(id));
//                 if (index !== -1) {
//                     if (voteType === "vote") {
//                         subs[index].voteCount -= 1;
//                     } else {
//                         subs[index].voteCount += 1;
//                     }
//                 }
//                 return subs;
//             });
//         }
//     }

//     // console.log("newVotes:", get(votesStore));
// }

export async function vote(id: string) {
    let voteType: "vote" | "unvote" | null = null;
    const saveCurrentVotes = get(votesStore);

    votesStore.update((currentVotes) => {
        const newVotes = [...currentVotes];

        if (newVotes.includes(id)) {
            // remove the vote
            const index = newVotes.indexOf(id);
            newVotes.splice(index, 1);
            voteType = "unvote";

            submissionsStore.update((subs) => {
                const index = subs.findIndex((sub) => sub.id === Number(id));
                if (index !== -1) {
                    subs[index].voteCount -= 1;
                }
                return subs;
            });
        } else {
            // add vote
            newVotes.push(id);
            voteType = "vote";

            submissionsStore.update((subs) => {
                const index = subs.findIndex((sub) => sub.id === Number(id));
                if (index !== -1) {
                    subs[index].voteCount += 1;
                }
                return subs;
            });
        }

        return newVotes;
    });

    if (voteType) {
        try {
            await axios.post("/api/vote", { id, type: voteType }, {
                headers: {
                    "X-Device-ID": localStorage.getItem("deviceId"),
                },
            });
        } catch (error) {
            console.error("Error submitting vote:", error);
            // Rollback to previous state
            votesStore.set(saveCurrentVotes);
            submissionsStore.update((subs) => {
                const index = subs.findIndex((sub) => sub.id === Number(id));
                if (index !== -1) {
                    if (voteType === "vote") {
                        subs[index].voteCount -= 1;
                    } else {
                        subs[index].voteCount += 1;
                    }
                }
                return subs;
            });
        }
    }
}
