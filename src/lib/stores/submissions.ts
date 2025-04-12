import { writable } from "svelte/store";

export type Submission = {
    id: number;
    name: string;
    imageUrl: string;
    voteCount: number;
}

export const submissionsStore = writable<Submission[]>([]);
