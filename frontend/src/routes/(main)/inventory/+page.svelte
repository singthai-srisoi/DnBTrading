<script lang="ts">
	import InventoryForm from "$components/forms/InventoryForm.svelte"
    import InventoryEditForm from "$components/forms/InventoryEditForm.svelte"
    import DataGrid from "$components/molecule/datagrid/DataGrid.svelte"
	import type { PageData } from "./$types"
	import InventoryDeleteForm from "$components/forms/InventoryDeleteForm.svelte"
	import DateInputAd from "$components/molecule/inputs/DateInputAd.svelte"

    export let data: PageData

    function DatetoYYYYMMDD(date: Date) {
        return date.toLocaleDateString('en-CA')
        // .toISOString().split('T')[0]
    }
    // start date to be first day of the month
    // end date be today
    let end_date_ = new Date()
    let start_date_ = new Date(end_date_.getFullYear(), end_date_.getMonth(), 1)

    let start_date = "",
        end_date = ""
    
    start_date = DatetoYYYYMMDD(start_date_)
    end_date = DatetoYYYYMMDD(end_date_)

    // $: console.log({start_date_, start_date, end_date})
    

</script>
<svelte:head>
    <title>Ineventory</title>
</svelte:head>
<InventoryForm 
    vehicle_options={data.vehicle_options}
    driver_options={data.driver_options}
    supplier_options={data.supplier_options}
    customer_options={data.customer_options}
    destination_options={data.destination_options}
    product_options={data.product_options}
/>

<DataGrid
    columns={[
        {
            name: "id",
            label: "ID",
            hidden: true,
        },
        {
            name: "date",
            label: "Date",
        },
        {
            name: "vehicle",
            label: "Vehicle",
            details: true,
        },
        {
            name: "driver",
            label: "Driver",
            details: true,
        },
        {
            name: "supplier",
            label: "Supplier",
            details: true,
        },
        {
            name: "customer_ticket_no",
            label: "Customer Ticket No",
        },
        {
            name: "supplier_qty",
            label: "Supplier Qty",
        },
        {
            name: "customer",
            label: "Customer",
            details: true,
        },
        {
            name: "destination",
            label: "Destination",
            details: true,
        },
        {
            name: "product",
            label: "Product",
            details: true,
        },
        {
            name: "ticket_no",
            label: "Ticket No",
        },
        {
            name: "do",
            label: "DO",
        },
        {
            name: "weight_in",
            label: "Weight In",
        },
        {
            name: "weight_out",
            label: "Weight Out",
        },
        {
            name: "factory_nett",
            label: "Factory Nett",
        },
        {
            name: "nett",
            label: "Nett",
        },
        {
            name: "deduction",
            label: "Deduction",
        },
        {
            name: "bucket",
            label: "Bucket",
        },
        {
            name: "remark",
            label: "Remark",
        }
    ]}

    {data}
    backendUrl="inventories/"
    actionCol={true}
>
<svelte:fragment slot="searchForm">
<DateInputAd name="start_date" label="Start Date" bind:value={start_date} id="start_date_search" />
<DateInputAd name="end_date" label="End Date" bind:value={end_date} id="end_date_search" />
</svelte:fragment>
<svelte:fragment let:edit let:emptyEdit slot="editForm">
    <InventoryEditForm data={edit} on:putSubmitted={emptyEdit} 
        vehicle_options={data.vehicle_options}
        driver_options={data.driver_options}
        supplier_options={data.supplier_options}
        customer_options={data.customer_options}
        destination_options={data.destination_options}
        product_options={data.product_options}
    />
</svelte:fragment>
<svelte:fragment let:del let:emptyDel slot="deleteForm">
    <InventoryDeleteForm data={del} on:deleteSubmitted={emptyDel} />
</svelte:fragment>
</DataGrid>
