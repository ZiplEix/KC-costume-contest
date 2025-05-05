import axios from "axios";
import { get, writable } from "svelte/store";

export async function initVotes(deviceId: string): Promise<void> {
    try {
        const response = await axios.get(`/api/vote`, {
            headers: {
                'X-Device-ID': deviceId
            }
        });

        if (Array.isArray(response.data)) {
            const newVotes = response.data.map((vote: string) => vote.toString());
            votesStore.set(newVotes);
        }

        console.log("Votes initialized:", get(votesStore));
    } catch (error) {
        console.error("Error initializing votes:", error);
    }
}

const votesStore = writable<string[]>([]);

votesStore.subscribe((value) => {
    // update in db
})

export { votesStore };
