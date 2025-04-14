<script lang="ts">
	import '../app.css';
	import 'iconify-icon'

	import Countdown from "$lib/ui/Countdown.svelte";
    import Dock from "$lib/ui/Dock.svelte";
    import Title from "$lib/ui/Title.svelte";
  import { onMount } from 'svelte';
  import { initVotes } from '$lib/stores/votes';
  import { getOrCreateDeviceId } from '$lib/utils/auth';

	let { children } = $props();

	onMount(async () => {
		await initVotes(getOrCreateDeviceId());
	})
</script>

<!-- Title -->
<Title />

<!-- Contest end in -->
<Countdown />

<!-- Page -->
{@render children()}

<!-- Dock -->
<Dock />
