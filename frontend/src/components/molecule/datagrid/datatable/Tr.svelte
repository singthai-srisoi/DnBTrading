<script lang="ts">
	import Button from "$components/atoms/Button.svelte"
import Td from "./Td.svelte"

    export let row: {[k:string]:any} = {}
    export let columns: DataGrid.column[]

    export let actionCol: boolean = false
    export let edit: {[key:string]:any} = {}
    export let del: {[key:string]:any} = {}

    export let editAction = () => {
        edit = row
    }

    export let delAction = () => {
        del = row
    }


</script>

<tr>
    {#if actionCol}
        <Td hidden={false} align="center">
            <Button onClick={editAction} classes="info">Edit</Button>
            <Button onClick={delAction} classes="danger">Delete</Button>
        </Td>
    {/if}
    {#each columns as col}
        <Td data_col={col.label} hidden={col.hidden??false}>
            {#if col.details}
                {row[col.name]?.label??""}
            {:else}
                {row[col.name]??""}
            {/if}
            
        </Td>
    {/each}
</tr>


