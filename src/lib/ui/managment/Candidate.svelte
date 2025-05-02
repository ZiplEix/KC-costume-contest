<script lang='ts'>
    import { votesStore } from "$lib/stores/votes";
    import { derived, type Writable } from "svelte/store";

    export let id: number;
    export let name: string;
    export let photo: string;

    export let idStore: Writable<string | null>;

    export let remove: (id: string) => void = () => {};

    const color = derived(votesStore, ($votes) => {
        return $votes[0] == String(id) || $votes[1] == String(id) ? "#f44336" : "currentColor";
    });
</script>

<div class="card bg-base-300 shadow-sm p-4">
    <img src="/api/image/{photo}" alt="canditate costume" class="rounded-lg" />
    <div class="card-body pt-4 pr-4 pl-4 pb-2 flex justify-between flex-row">
        <h2 class="card-title">{name}</h2>
        <!-- svelte-ignore a11y_consider_explicit_label -->
        <button
            on:click={() => {
                idStore.set(String(id));
                remove(String(id))
            }}
            class="flex items-center gap-2 p-2 rounded-lg bg-base-200 hover:bg-base-300"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zm2-4h2V8H9zm4 0h2V8h-2z"/></svg>
        </button>
    </div>
</div>
