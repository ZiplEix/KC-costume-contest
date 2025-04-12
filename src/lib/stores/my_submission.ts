import { writable } from "svelte/store";
import type { Submission } from "./submissions";

export const mySubmissionsStore = writable<Submission>();
