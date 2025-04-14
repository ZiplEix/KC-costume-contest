import axios from "axios";
import { get, writable } from "svelte/store";

export async function initVotes(deviceId: string): Promise<void> {
    try {
        const response = await axios.get(`/api/vote`, {
            headers: {
                'X-Device-ID': deviceId
            }
        })

        if (Array.isArray(response.data)) {
            let newVotes = response.data.map((vote: string) => vote.toString());
            votesStore.set(newVotes);
        }

        if (get(votesStore).length === 0) {
            votesStore.set(["0", "0"]);
        } else if (get(votesStore).length < 2) {
            const currentVotes = get(votesStore);
            const newVotes = [...currentVotes, "0"];
            votesStore.set(newVotes);
        }
    } catch (error) {}
}

const votesStore = writable<string[]>(["0", "0"]);

votesStore.subscribe((value) => {
    // update in db
})

export { votesStore };
