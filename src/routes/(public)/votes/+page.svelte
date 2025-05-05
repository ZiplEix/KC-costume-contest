<script lang='ts'>
    import { submissionsStore, type Submission } from "$lib/stores/submissions";
    import { votesStore } from "$lib/stores/votes";
    import Candidate from "$lib/ui/public/Candidate.svelte";
    import { vote } from "$lib/utils/vote";
    import { onMount } from "svelte";
  import { derived } from "svelte/store";

    const votedSubmissions = derived(
        [votesStore, submissionsStore],
        ([$votes, $submissions]) =>
            $votes
                .map((id) => $submissions.find((s) => s.id === Number(id)))
                .filter((s): s is Submission => s !== undefined)
    );
</script>

<main class="p-4 flex flex-col gap-y-4 mb-16">
    {#if $votedSubmissions.length === 0}
        <h2 class="text-2xl">You have not voted yet.</h2>
    {:else}
        <h2 class="text-2xl">Your votes</h2>

        {#each $votedSubmissions as sub}
            <Candidate
                id={sub.id}
                name={sub.name}
                photo={sub.imageUrl}
                vote={vote}
            />
        {/each}
    {/if}
</main>
