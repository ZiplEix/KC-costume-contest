import { writable } from "svelte/store";

export type Submission = {
    id: number;
    name: string;
    imageUrl: string;
    voteCount: number;
    userid: string;
}

export const submissionsStore = writable<Submission[]>([]);
