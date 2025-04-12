<script lang="ts">
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';

    const deadline = new Date(import.meta.env.VITE_END_DATE);
    const startDate = new Date(import.meta.env.VITE_START_DATE);
    const timeLeft = writable('⏳ Loading...');
    const hasStarted = writable(false);

    let interval: number;

    function formatCountdown(ms: number) {
        if (ms <= 0) return '⏰ Contest ended!';

        const days = Math.floor(ms / (1000 * 60 * 60 * 24));
        const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((ms % (1000 * 60)) / 1000);

        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }

    function updateCountdown() {
        const now = new Date().getTime();

        if (now < startDate.getTime()) {
            hasStarted.set(false);
            timeLeft.set(`Contest has not started yet! Starts at: ${startDate.toLocaleString()}`);
            return;
        }

        hasStarted.set(true);
        const diff = deadline.getTime() - now;
        timeLeft.set(formatCountdown(diff));

        if (diff <= 0) clearInterval(interval);
    }

    onMount(() => {
        updateCountdown();
        interval = setInterval(updateCountdown, 1000);
        return () => clearInterval(interval);
    });
</script>

<div id="countdown">
    <div class="items-center text-center pt-2 pb-2 pl-4 pr-4 flex gap-4">
        <h2 class="card-title">
            {#if $hasStarted}
                Contest ends in :
            {/if}
        </h2>
        <div class="text-lg font-mono font-semibold text-primary">
            {$timeLeft}
        </div>
    </div>
</div>
