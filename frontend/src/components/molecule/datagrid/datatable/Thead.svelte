<script lang="ts">
	import Th from "./Th.svelte"

    export let columns: DataGrid.column[]
    export let actionCol: boolean = false
</script>

<thead>
    <tr>
        {#if actionCol}
            <Th>Action</Th>            
        {/if}
        {#each columns as col}
            <Th hidden={col.hidden??false}>{col.label}</Th>
        {/each}
    </tr>
</thead>
