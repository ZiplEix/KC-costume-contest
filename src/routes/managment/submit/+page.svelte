<script lang="ts">
    import { mySubmissionsStore } from "$lib/stores/my_submission";
    import axios from "axios";
    import { getOrCreateDeviceId, markDeviceIdAsSent } from "$lib/utils/auth";
    import { writable } from "svelte/store";

    let name = '';
    let photo: File | null = null;
    let loader = writable<boolean>(false);

    const handleSubmit = async (event: Event) => {
        event.preventDefault();

        loader.set(true);

        if (!name || !photo) {
            alert("Please fill out all fields.");
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("photo", photo);

        const deviceId = getOrCreateDeviceId();
        formData.append("deviceId", deviceId);

        try {
            const response = await axios.post("/api/submit", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            mySubmissionsStore.set({
                id: response.data.id,
                userid: getOrCreateDeviceId(),
                name: name,
                imageUrl: response.data.url,
                voteCount: 0,
            });

            markDeviceIdAsSent();

            alert("Costume submitted successfully!");

            // Reset form
            name = '';
            photo = null;
            (document.querySelector("input[type='file']") as HTMLInputElement).value = '';
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("There was an error submitting the form. Please try again.");
        } finally {
            loader.set(false);
        }
    };

    async function compressImage(
        file: File,
        maxHeight = 1080,
        initialQuality = 0.8,
        maxSize = 524288, // 512 KB
        minQuality = 0.4,
        qualityStep = 0.1
    ): Promise<File> {
        let quality = initialQuality;

        while (quality >= minQuality) {
            const compressedFile = await compressOnce(file, maxHeight, quality);
            if (compressedFile.size <= maxSize) {
                return compressedFile;
            }

            quality -= qualityStep;
        }

        return await compressOnce(file, maxHeight, minQuality);
    }

    function compressOnce(file: File, maxHeight: number, quality: number): Promise<File> {
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
    <form on:submit={handleSubmit} class="form gap-y-4 flex flex-col mb-16">
        <h2 class="text-2xl">Submit a costume to the contest</h2>

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
                    if (files && files.length > 0) {
                        const original = files[0];

                        try {
                            photo = await compressImage(original, 1080, 0.8);
                        } catch (error) {
                            console.error("Error compressing image:", error);
                            alert(`There was an error compressing your image. Please try again.\n${error}`);
                        }
                    } else {
                        photo = null;
                    }
                }}
            />
        </fieldset>

        <!-- Submit -->
        <button
            type="submit"
            class="btn btn-primary mt-4"
            disabled={$loader}
        >
            {#if $loader}
                <span class="loading loading-spinner loading-sm"></span>
            {:else}
                Submit
            {/if}
        </button>
    </form>
</main>
