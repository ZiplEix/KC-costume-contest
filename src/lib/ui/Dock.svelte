<script lang="ts">
    import { goto } from "$app/navigation";
    import { dockStore, type DockName } from "$lib/stores/dock";
    import { onMount } from "svelte";

    onMount(() => {
        const currentPath = window.location.pathname;

        if (currentPath === "/") {
            dockStore.set("home");
        } else if (currentPath === "/submit") {
            dockStore.set("submit");
        } else if (currentPath === "/rules") {
            dockStore.set("rules");
        } else {
            dockStore.set("home");
        }
    });

    function onClick(dockTab: DockName) {
        dockStore.set(dockTab);

        if (dockTab === "home") {
            goto("/");
        } else if (dockTab === "submit") {
            goto("/submit");
        } else if (dockTab === "rules") {
            goto("/rules");
        } else if (dockTab === "votes") {
            goto("/votes");
        } else {
            goto("/");
        }
    }
</script>

<div class="dock flex justify-around">
    <button on:click={() => onClick("home")} class:dock-active={$dockStore === "home"}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3L2 12h3v8z" /></svg>
        <span class="dock-label">Home</span>
    </button>

    <button on:click={() => onClick("submit")} class:dock-active={$dockStore === "submit"}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2M8.5 13.5l2.5 3.01L14.5 12l4.5 6H5z" /></svg>
        <span class="dock-label">Submit application</span>
    </button>

    <button on:click={() => onClick("rules")} class:dock-active={$dockStore === "rules"}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M6 2c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm7 7V3.5L18.5 9z" /></svg>
        <span class="dock-label">rules</span>
    </button>

    <button on:click={() => onClick("votes")} class:dock-active={$dockStore === "votes"}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48"><path fill="currentColor" d="M34 9c-4.2 0-7.9 2.1-10 5.4C21.9 11.1 18.2 9 14 9C7.4 9 2 14.4 2 21c0 11.9 22 24 22 24s22-12 22-24c0-6.6-5.4-12-12-12"/></svg>
        <span class="dock-label">my votes</span>
    </button>
</div>
