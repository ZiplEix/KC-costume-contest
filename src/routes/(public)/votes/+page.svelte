<script lang='ts'>
    import { submissionsStore, type Submission } from "$lib/stores/submissions";
    import { votesStore } from "$lib/stores/votes";
    import Candidate from "$lib/ui/Candidate.svelte";
    import { vote } from "$lib/utils/vote";
    import { onMount } from "svelte";

    let vote1: Submission | null = null;
    let vote2: Submission | null = null;

    onMount(() => {
        try {
            const vote1Id = $votesStore[0];
            const vote2Id = $votesStore[1];

            if (vote1Id !== "0") {
                vote1 = $submissionsStore.find((submission) => submission.id === Number(vote1Id)) || null;
            }

            if (vote2Id !== "0") {
                vote2 = $submissionsStore.find((submission) => submission.id === Number(vote2Id)) || null;
            }
        } catch (error) {
            console.error("Error fetching votes:", error);
        }
    });
</script>

<main class="p-4 flex flex-col gap-y-4 mb-16">
    {#if $votesStore[0] === "0" && $votesStore[1] === "0"}
        <h2 class="text-2xl">You have not voted yet.</h2>
    {:else}
        <h2 class="text-2xl">Your votes</h2>

        {#if vote1}
            <Candidate
                id={vote1.id}
                name={vote1.name}
                photo={vote1.imageUrl}
                voteCount={vote1.voteCount}
                vote={vote}
            />
        {/if}

        {#if vote2}
            <Candidate
                id={vote2.id}
                name={vote2.name}
                photo={vote2.imageUrl}
                voteCount={vote2.voteCount}
                vote={vote}
            />
        {/if}
    {/if}



</main>
