<script lang="ts">
	import DriverForm from "$components/forms/DriverForm.svelte"
	import DataGrid from "$components/molecule/datagrid/DataGrid.svelte"
	import DriverDeleteForm from "$components/forms/DriverDeleteForm.svelte"
	import DriverEditForm from "$components/forms/DriverEditForm.svelte"
	import type { PageData } from "../$types"

	export let data: PageData
</script>
<svelte:head>
    <title>Driver</title>
</svelte:head>

<DriverForm />

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
		},
		{
			name: "phone",
			label: "Phone",
		},
		{
			name: "ic",
			label: "IC",
		},
		{
			name: "type",
			label: "Type",
			hidden: true,
		}
	]}

	{data}
	actionCol={true}
	backendUrl="person/driver/"
>
	<svelte:fragment let:edit let:emptyEdit slot="editForm">
		<DriverEditForm data={edit} on:putSubmitted={emptyEdit} />
	</svelte:fragment>
	<svelte:fragment let:del let:emptyDel slot="deleteForm">
		<DriverDeleteForm data={del} on:deleteSubmitted={emptyDel} />
	</svelte:fragment>
</DataGrid>