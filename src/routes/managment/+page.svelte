<script lang='ts'>
    import { goto } from "$app/navigation";
    import axios from "axios";
    import { writable } from "svelte/store";

    let password ='';
    let errorMessage = writable<string>('');

    let loading = writable(false);

    async function connexion(event: Event) {
        event.preventDefault();

        loading.set(true);

        try {
            const response = await axios.post('/api/auth', { password }, { withCredentials: true });

            if (response.status === 200) {
                localStorage.setItem('token', response.data.token);
                goto('/managment/dashboard');
            }
        } catch (error: any) {
            errorMessage.set(error.response.data.error);
        } finally {
            loading.set(false);
        }
    }
</script>

<main>
    <div class="grid h-96 place-items-center">
        <div class="flex flex-col items-center space-y-4">
            <h1 class="text-3xl font-bold mb-16">Connexion</h1>
            <form class="flex flex-col items-center space-y-4">
                <input
                    type="password"
                    placeholder="Password"
                    autocomplete="current-password"
                    class="input input-bordered input-primary w-full max-w-xs"
                    id="password"
                    name="password"
                    bind:value={password}
                />
                <div id="error-message" class="text-red-500">{$errorMessage}</div>
                <button type="submit" class="btn btn-primary" on:click={connexion}>Connexion</button>
            </form>
        </div>
    </div>
</main>
