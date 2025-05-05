<script lang='ts'>
    import { submissionsStore } from "$lib/stores/submissions";
    import Candidate from "$lib/ui/managment/Candidate.svelte";
    import DeleteSubmissionModal from "$lib/ui/managment/DeleteSubmissionModal.svelte";
    import axios from "axios";
    import { onMount } from "svelte";
    import { writable, type Writable } from "svelte/store";

    let selectedSubmissionId: Writable<string | null> = writable(null);

    onMount(async () => {
        try {
            const response = await axios.get("/api/submissions");

            submissionsStore.set(response.data);

            // console.log("Submissions:", response.data);
        } catch (error) {
            console.error("Error fetching submissions:", error);
        }
    });

    async function remove(id: string) {
        try {
            const response = await axios.delete(`/api/submissions/${id}`);

            if (response.status === 200) {
                submissionsStore.update((submissions) =>
                    submissions.filter((submission) => submission.id !== Number(id))
                );
            }
        } catch (error) {
            console.error("Error deleting submission:", error);
        }
    }

    function confirmDelete(id: string) {
        const modal = document.getElementById('delete-submission-modal') as HTMLDialogElement;
        modal?.showModal();
    }
</script>

<main class="p-4 mb-16">
    <DeleteSubmissionModal
        modalId="delete-submission-modal"
        onDelete={() => {
            if ($selectedSubmissionId) {
                remove($selectedSubmissionId);
            }
            selectedSubmissionId.set(null);
        }}
    />

    {#if $submissionsStore.length === 0}
        <div class="text-center">
            <h2 class="text-2xl">No submissions yet!</h2>
        </div>
    {:else}
        <div class="gap-y-4 flex flex-col">
            {#each $submissionsStore as sub (sub.id)}
                <Candidate
                    id={sub.id}
                    name={sub.name}
                    photo={sub.imageUrl}
                    voteCount={sub.voteCount}
                    remove={confirmDelete}
                    idStore={selectedSubmissionId}
                />
            {/each}
        </div>
    {/if}
</main>
