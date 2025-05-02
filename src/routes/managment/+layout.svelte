<script lang='ts'>
  import Countdown from '$lib/ui/Countdown.svelte';
  import Dock from '$lib/ui/managment/Dock.svelte';
  import Title from '$lib/ui/managment/Title.svelte';
    import '../../app.css';
    import 'iconify-icon'

    let { children } = $props();
</script>

<svelte:head>
    <title>Korea Club Costume Contest Managment</title>
</svelte:head>

<Title />

<Countdown />

{@render children()}

<Dock />
