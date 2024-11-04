<script lang="ts">
	import Tr from "./Tr.svelte"

    export let data: {[k:string]:any}[]
    export let columns: DataGrid.column[]

    export let actionCol: boolean = false
    export let edit: {[key:string]:any} = {}
    export let del: {[key:string]:any} = {}

</script>

<tbody>
    {#each data as row}
        <Tr {row} {columns} {actionCol} bind:edit={edit} bind:del={del} />
    {/each}
</tbody>