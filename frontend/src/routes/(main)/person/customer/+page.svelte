<script lang="ts">
	import CustomerForm from "$components/forms/CustomerForm.svelte"
	import CustomerEditForm from "$components/forms/CustomerEditForm.svelte"
	import CustomerDeleteForm from "$components/forms/CustomerDeleteForm.svelte"
	import DataGrid from "$components/molecule/datagrid/DataGrid.svelte"
	import type { PageData } from "../$types"

	export let data: PageData

</script>
<svelte:head>
    <title>Customer</title>
</svelte:head>

<CustomerForm />


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
	backendUrl="person/customer/"
>
	<svelte:fragment let:edit let:emptyEdit slot="editForm">
		<CustomerEditForm data={edit} on:putSubmitted={emptyEdit} />
	</svelte:fragment>
	<svelte:fragment let:del let:emptyDel slot="deleteForm">
		<CustomerDeleteForm data={del} on:deleteSubmitted={emptyDel} />
	</svelte:fragment>
</DataGrid>