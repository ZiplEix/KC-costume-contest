<script lang="ts">
    import { mySubmissionsStore } from "$lib/stores/my_submission";
    import { votesStore } from "$lib/stores/votes";
    import Candidate from "$lib/ui/Candidate.svelte";
    import DeleteSubmissionModal from "$lib/ui/DeleteSubmissionModal.svelte";
    import axios from "axios";
    import { onMount } from "svelte";
    import { writable } from "svelte/store";

    let name = '';
    let photo: File | null = null;
    let consent = false;

    let submissionId = writable<string>("0");

    onMount(async () => {
        const storedId = localStorage.getItem("submissionId");
        if (storedId) {
            submissionId.set(storedId);

            const response = await axios.get(`/api/submissions/${storedId}`);
            if (response.data) {
                mySubmissionsStore.set(response.data);
            } else {
                alert("No submission found with the given ID.");
                submissionId.set("0");
                localStorage.removeItem("submissionId");
            }
        }
    });

    const handleSubmit = async (event: Event) => {
        event.preventDefault();

        if (!name || !photo || !consent) {
            alert("Please fill out all fields and give your consent.");
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("photo", photo);
        formData.append("consent", String(consent));

        if (localStorage.getItem("submissionId")) {
            alert("You have already submitted a costume. You can only submit one.\nPlease delete your previous submission to submit a new one.");
            return;
        }

        try {
            const response = await axios.post("/api/submit", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            localStorage.setItem("submissionId", response.data.id);

            mySubmissionsStore.set({
                id: response.data.id,
                name: name,
                imageUrl: response.data.url,
                voteCount: 0,
            });
            submissionId.set(response.data.id);
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("There was an error submitting your form. Please try again.");
        }
    };

    async function deleteSubmission(id: string) {
        try {
            const response = await axios.delete(`/api/submissions/${id}`);

            localStorage.removeItem("submissionId");
            submissionId.set("0");

            votesStore.update((currentVotes) => {
                const newVotes = [...currentVotes];
                const index = newVotes.indexOf(id);
                if (index !== -1) {
                    newVotes[index] = "0";
                }
                return newVotes;
            });
        } catch (error) {
            console.error("Error deleting submission:", error);
            alert("There was an error deleting your submission. Please try again.");
        }
    }

    async function compressImage(file: File, maxHeight = 1080, quality = 0.8): Promise<File> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const reader = new FileReader();

            reader.onload = (e) => {
                if (!e.target?.result) return reject("Failed to read image");
                img.src = e.target.result as string;
            };

            img.onload = () => {
                const canvas = document.createElement("canvas");

                const scaleFactor = maxHeight / img.height;
                canvas.height = maxHeight;
                canvas.width = img.width * scaleFactor;

                const ctx = canvas.getContext("2d");
                if (!ctx) return reject("Canvas context error");

                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                canvas.toBlob((blob) => {
                    if (!blob) return reject("Compression failed");

                    const compressedFile = new File([blob], file.name, {
                        type: "image/jpeg",
                        lastModified: Date.now(),
                    });

                    resolve(compressedFile);
                }, "image/jpeg", quality);
            };

            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }


</script>

<main class="p-4">
    {#if $submissionId !== "0" && $mySubmissionsStore}
        <DeleteSubmissionModal
            modalId="delete-submission-modal"
            submissionId={$submissionId}
            onDelete={deleteSubmission}
        />
        <div class="flex flex-col gap-4 mb-16">
            <h2 class="text-2xl">Your submission</h2>
            <p class="text-lg">You have already submitted a costume. You can only submit one.</p>
            <p class="text-lg">If you want to submit a new one, please delete your previous submission.</p>
            <Candidate
                id={$mySubmissionsStore.id}
                name={$mySubmissionsStore.name}
                photo={$mySubmissionsStore.imageUrl}
                voteCount={$mySubmissionsStore.voteCount}
                vote={() => {}}
            />
            <button class="btn bg-amber-500 w-full text-black" on:click={() => {
                const modal = document.getElementById('delete-submission-modal') as HTMLDialogElement;
                modal?.showModal();
            }}>Delete submission</button>
        </div>
    {:else}
        <form on:submit={handleSubmit} class="form gap-y-4 flex flex-col mb-16">
            <h2 class="text-2xl">Submit your costume to the contest</h2>

            <!-- Name -->
            <fieldset class="fieldset">
                <legend class="fieldset-legend text-lg">Name</legend>
                <input
                    type="text"
                    class="input w-full"
                    placeholder="Name"
                    bind:value={name}
                    required
                />
            </fieldset>

            <!-- Photo -->
            <fieldset class="fieldset">
                <legend class="fieldset-legend text-lg">Choose the photo to submit</legend>
                <input
                    type="file"
                    accept="image/*"
                    class="file-input w-full"
                    required
                    on:change={async (e) => {
                        const files = (e.target as HTMLInputElement).files;
                        // photo = files && files.length > 0 ? files[0] : null;
                        if (files && files.length > 0) {
                            const original = files[0];

                            try {
                                photo = await compressImage(original, 1080, 0.8);
                            } catch (error) {
                                console.error("Error compressing image:", error);
                                alert("There was an error compressing your image. Please try again.");
                            }
                        } else {
                            photo = null;
                        }
                    }}
                />
            </fieldset>

            <!-- Consent -->
            <fieldset class="fieldset">
                <label class="fieldset-label text-lg flex items-center gap-2">
                    <input
                        type="checkbox"
                        class="checkbox checkbox-primary"
                        bind:checked={consent}
                        required
                    />
                    I consent to my photo being made public
                </label>
            </fieldset>

            <!-- Submit -->
            <button type="submit" class="btn btn-primary">Submit</button>
        </form>
    {/if}
</main>
