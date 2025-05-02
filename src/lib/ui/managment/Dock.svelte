<script lang="ts">
    import { goto } from "$app/navigation";
    import { managmentDockStore, type ManagmentDockName } from "$lib/stores/dock";
    import { onMount } from "svelte";

    onMount(() => {
        const currentPath = window.location.pathname;

        if (currentPath === "/managment") {
            managmentDockStore.set("dashboard");
        } else if (currentPath === "/managment/submit") {
            managmentDockStore.set("submit");
        } else {
            managmentDockStore.set("dashboard");
        }
    });

    function onClick(dockTab: ManagmentDockName) {
        managmentDockStore.set(dockTab);

        if (dockTab === "dashboard") {
            goto("/managment/dashboard");
        } else if (dockTab === "submit") {
            goto("/managment/submit");
        } else {
            goto("/managment/dashboard");
        }
    }
</script>

<div class="dock flex justify-around">
    <button on:click={() => onClick("dashboard")} class:dock-active={$managmentDockStore === "dashboard"}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M13 9V3h8v6zM3 13V3h8v10zm10 8V11h8v10zM3 21v-6h8v6z"/></svg>
        <span class="dock-label">Dashboard</span>
    </button>

    <button on:click={() => onClick("submit")} class:dock-active={$managmentDockStore === "submit"}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M11 13H6q-.425 0-.712-.288T5 12t.288-.712T6 11h5V6q0-.425.288-.712T12 5t.713.288T13 6v5h5q.425 0 .713.288T19 12t-.288.713T18 13h-5v5q0 .425-.288.713T12 19t-.712-.288T11 18z"/></svg>
        <span class="dock-label">Submit</span>
    </button>
</div>
