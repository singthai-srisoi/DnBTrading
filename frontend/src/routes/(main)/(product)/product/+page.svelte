<script lang="ts">
	import type { PageData } from "./$types"
    import ProductForm from "$components/forms/ProductForm.svelte"
    import ProductEditForm from "$components/forms/ProductEditForm.svelte";
    import ProductDeleteForm from "$components/forms/ProductDeleteForm.svelte";
    import DataGrid from "$components/molecule/datagrid/DataGrid.svelte";

    export let data: PageData
</script>

<svelte:head>
    <title>Product</title>
</svelte:head>

<ProductForm action="?/create" type_options={data.options} />

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
            name: "price",
            label: "Price",
        }, 
        {
            name: "type",
            label: "Type",
            details: true,
        }
    ]}
    {data}
    actionCol={true}
    backendUrl="products/"
    
>
    <svelte:fragment let:edit let:emptyEdit slot="editForm">
        <ProductEditForm data={edit} on:putSubmitted={emptyEdit} type_options={data.options} />
    </svelte:fragment>
    <svelte:fragment let:del let:emptyDel slot="deleteForm">
        <ProductDeleteForm data={del} on:deleteSubmitted={emptyDel} />
    </svelte:fragment>
</DataGrid>

