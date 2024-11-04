<script lang="ts">
	import ProductTypeDeleteForm from "$components/forms/ProductTypeDeleteForm.svelte"
	import ProductTypeEditForm from "$components/forms/ProductTypeEditForm.svelte"
    import ProductTypeForm from "$components/forms/ProductTypeForm.svelte"
	import DataGrid from "$components/molecule/datagrid/DataGrid.svelte"
	import type { PageData } from "./$types"

    export let data: PageData

</script>

<svelte:head>
    <title>Product Type</title>
</svelte:head>

<ProductTypeForm />

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
    {data}
    actionCol={true}
    backendUrl="product-types/"
>
    <svelte:fragment let:edit let:emptyEdit slot="editForm" >
        <ProductTypeEditForm data={edit} on:putSubmitted={emptyEdit} />
    </svelte:fragment>
    <svelte:fragment let:del let:emptyDel slot="deleteForm" >
        <ProductTypeDeleteForm data={del} on:deleteSubmitted={emptyDel} />
    </svelte:fragment>
</DataGrid>
