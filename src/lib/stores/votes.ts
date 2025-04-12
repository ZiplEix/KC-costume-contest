import { writable } from "svelte/store";

function getInitialVotes(): string[] {
    if (typeof localStorage !== "undefined") {
        return localStorage.getItem("votes")?.split(":") || ["0", "0"];
    }

    return ["0", "0"];
}

const votesStore = writable<string[]>(getInitialVotes());

votesStore.subscribe((value) => {
    if (typeof localStorage !== "undefined") {
        localStorage.setItem("votes", value.join(":"));
    }
})

export { votesStore };
