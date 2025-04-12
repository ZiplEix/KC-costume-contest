<script lang="ts">
	import '../app.css';
	import 'iconify-icon'

	import Countdown from "$lib/ui/Countdown.svelte";
    import Dock from "$lib/ui/Dock.svelte";
    import Title from "$lib/ui/Title.svelte";

	let { children } = $props();
</script>

<!-- Title -->
<Title />

<!-- Contest end in -->
<Countdown />

<!-- Page -->
{@render children()}

<!-- Dock -->
<Dock />
