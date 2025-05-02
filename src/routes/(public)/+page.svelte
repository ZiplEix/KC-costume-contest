<script lang='ts'>
    import { submissionsStore } from "$lib/stores/submissions";
    import Candidate from "$lib/ui/public/Candidate.svelte";
    import { vote } from "$lib/utils/vote";
    import axios from "axios";
    import { onMount } from "svelte";

    onMount(async () => {
        try {
            const response = await axios.get("/api/submissions");

            submissionsStore.set(response.data);
        } catch (error) {
            console.error("Error fetching submissions:", error);
        }
    });
</script>

<main class="p-4 mb-16">
    {#if $submissionsStore.length === 0}
        <div class="text-center">
            <h2 class="text-2xl">No submissions yet!</h2>
            <p class="text-lg">Be the first to submit your costume!</p>
        </div>
    {:else}
        <div class="gap-y-4 flex flex-col">
            {#each $submissionsStore as sub (sub.id)}
                <Candidate
                    id={sub.id}
                    name={sub.name}
                    photo={sub.imageUrl}
                    voteCount={sub.voteCount}
                    vote={vote}
                />
            {/each}
        </div>
    {/if}
</main>
