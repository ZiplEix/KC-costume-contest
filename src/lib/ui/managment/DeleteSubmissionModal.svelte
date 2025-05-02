<script lang='ts'>
    export let modalId: string;

    export let onDelete: () => void;
</script>

<dialog id="{modalId}" class="modal">
    <div class="modal-box">
        <h3 class="text-lg font-bold">Delete submission</h3>
        <p class="py-4">Are you sure you want to delete this submission ?</p>
        <div class="modal-action">
            <form method="dialog">
                <button class="btn">Cancel</button>
                <button class="btn bg-amber-500 text-black" on:click={() => {
                    onDelete()}
                }>Delete</button>
            </form>
        </div>
    </div>
    <form method="dialog" class="modal-backdrop">
        <button>close</button>
    </form>
</dialog>
