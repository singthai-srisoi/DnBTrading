<script lang="ts">
	import DestinationDeleteForm from "$components/forms/DestinationDeleteForm.svelte"
	import DestinationEditForm from "$components/forms/DestinationEditForm.svelte"
	import DestinationForm from "$components/forms/DestinationForm.svelte"
	import DataGrid from "$components/molecule/datagrid/DataGrid.svelte"
	import type { PageData } from "./$types"

    export let data: PageData

</script>
<svelte:head>
    <title>Destination</title>
</svelte:head>

<DestinationForm />

<DataGrid
    columns={[
        {
            name: "id",
            label: "ID",
            hidden: true,
        },
        {
            name: "code",
            label: "Code",
        },
        {
            name: "name",
            label: "Name",
        }
    ]}

    data={data}
    actionCol={true}
    backendUrl="destinations/"
>
    <svelte:fragment let:edit let:emptyEdit slot="editForm">
        <DestinationEditForm data={edit} on:putSubmitted={emptyEdit} />
    </svelte:fragment>
    <svelte:fragment let:del let:emptyDel slot="deleteForm">
        <DestinationDeleteForm data={del} on:deleteSubmitted={emptyDel} />
    </svelte:fragment>
</DataGrid>