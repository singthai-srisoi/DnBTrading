<script lang="ts">
	import DataGrid from "$components/molecule/datagrid/DataGrid.svelte"
	import type { PageData } from "../$types"
	import SupplierForm from "$components/forms/SupplierForm.svelte"
	import SupplierEditForm from "$components/forms/SupplierEditForm.svelte"
	import SupplierDeleteForm from "$components/forms/SupplierDeleteForm.svelte"

	export let data: PageData
</script>
<svelte:head>
    <title>Supplier</title>
</svelte:head>

<SupplierForm />

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
	backendUrl="person/supplier/"
>
	<svelte:fragment let:edit let:emptyEdit slot="editForm">
		<SupplierEditForm data={edit} on:putSubmitted={emptyEdit} />
	</svelte:fragment>
	<svelte:fragment let:del let:emptyDel slot="deleteForm">
		<SupplierDeleteForm data={del} on:deleteSubmitted={emptyDel} />
	</svelte:fragment>
</DataGrid>