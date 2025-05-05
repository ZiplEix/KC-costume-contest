<script lang='ts'>
    import { votesStore } from "$lib/stores/votes";
    import { derived } from "svelte/store";

    export let id: number;
    export let name: string;
    export let photo: string;

    export let vote: (id: string) => void = () => {};

    const color = derived(votesStore, ($votes) => {
        return $votes[0] == String(id) || $votes[1] == String(id) ? "#f44336" : "currentColor";
    });
</script>

<div class="card bg-base-300 shadow-sm p-4">
    <img src="/api/image/{photo}" alt="canditate costume" class="rounded-lg" />
    <div class="card-body pt-4 pr-4 pl-4 pb-2 flex justify-between flex-row">
        <h2 class="card-title">{name}</h2>
        <!-- svelte-ignore a11y_consider_explicit_label -->
        <button on:click={() => vote(String(id))} class="flex items-center gap-2 p-2 rounded-lg bg-base-200 hover:bg-base-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48"><path fill="{$color}" d="M34 9c-4.2 0-7.9 2.1-10 5.4C21.9 11.1 18.2 9 14 9C7.4 9 2 14.4 2 21c0 11.9 22 24 22 24s22-12 22-24c0-6.6-5.4-12-12-12"/></svg>
        </button>
    </div>
</div>
