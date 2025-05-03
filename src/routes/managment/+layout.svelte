<script lang='ts'>
    import Countdown from '$lib/ui/Countdown.svelte';
    import Dock from '$lib/ui/managment/Dock.svelte';
    import Title from '$lib/ui/managment/Title.svelte';
    import { onMount } from 'svelte';
    import '../../app.css';
    import 'iconify-icon'
  import axios from 'axios';
  import { goto } from '$app/navigation';

    onMount(async () => {
        try {
            await axios.get('/api/auth');
        } catch (error: any) {
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                goto('/managment');
            } else {
                console.error("Unexected error:", error);
            }
        }
    });

    let { children } = $props();
</script>

<svelte:head>
    <title>Korea Club Costume Contest Managment</title>
</svelte:head>

<Title />

<Countdown />

{@render children()}

<Dock />
