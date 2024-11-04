<script lang="ts">
	import VehicleDeleteForm from "$components/forms/VehicleDeleteForm.svelte"
    import VehicleEditForm from "$components/forms/VehicleEditForm.svelte"
    import VehicleForm from "$components/forms/VehicleForm.svelte"
	import DataGrid from "$components/molecule/datagrid/DataGrid.svelte"
	import type { PageData } from "./$types"

    export let data: PageData
</script>
<svelte:head>
    <title>Vehicle</title>
</svelte:head>

<VehicleForm />

<DataGrid
    columns={[
        {
            name: "id",
            label: "ID",
            hidden: true,
        },
        {
            name: "reg_no",
            label: "Reg. No",
        },
        {
            name: "model",
            label: "Model",
        }
    ]}

    data={data}
    actionCol={true}
    backendUrl="vehicles/"
>
    <svelte:fragment let:edit let:emptyEdit slot="editForm">
        <VehicleEditForm data={edit} on:putSubmitted={emptyEdit} />
    </svelte:fragment>
    <svelte:fragment let:del let:emptyDel slot="deleteForm">
        <VehicleDeleteForm data={del} on:deleteSubmitted={emptyDel} />
    </svelte:fragment>
</DataGrid>