<script lang="ts">
    import DateInput from "$components/molecule/inputs/DateInput.svelte"
    import DateInputAd from "$components/molecule/inputs/DateInputAd.svelte"
	import NumberInput from "$components/molecule/inputs/NumberInput.svelte"
	import SelectInputAd from "$components/molecule/inputs/SelectInputAd.svelte"
    import Button from "../atoms/Button.svelte"
    import Form from "../molecule/Form.svelte"
	import TextInput from "../molecule/inputs/TextInput.svelte"

    export let action = "?/create"

    export let vehicle_options: App.SelectInputType = []
    export let driver_options: App.SelectInputType = []
    export let supplier_options: App.SelectInputType = []
    export let customer_options: App.SelectInputType = []
    export let product_options: App.SelectInputType = []

    let nett = ""
    let factory_nett = ""
    let bucket = ""

    let weight_in = ""
    let weight_out = ""
    let deduction = ""

    $: {
        nett = String((parseFloat(weight_in) || 0) - (parseFloat(weight_out) || 0) - (parseFloat(deduction) || 0))
        factory_nett = String((parseFloat(weight_in) || 0) - (parseFloat(weight_out) || 0))
        // bucket = String((parseFloat(deduction) || 0) / 20)
    }
</script>
<Form method="post" {action} size="lg">
    <h1>Inventory</h1>
    <TextInput type="text" label="Ticket No" name="ticket_no" id="inventory_form_field_ticket_no" />
    <!-- <DateInput label="Date" name="date" id="inventory_form_field_date" /> -->
    <DateInputAd label="Date" name="date" id="inventory_form_field_date" />

    <SelectInputAd label="Vehicle" name="vehicle" id="inventory_form_field_vehicle" choices={vehicle_options} />
    <SelectInputAd label="Driver" name="driver" id="inventory_form_field_driver" choices={driver_options} />

    <SelectInputAd label="Supplier" name="supplier" id="inventory_form_field_supplier" choices={supplier_options} />
    <TextInput type="text" label="Customer Ticket No" name="customer_ticket_no" id="inventory_form_field_customer_ticket_no" />
    <NumberInput label="Supplier Qty" name="supplier_qty" id="inventory_form_field_supplier_qty" />

    <SelectInputAd label="Customer" name="customer" id="inventory_form_field_customer" choices={customer_options} />

    <SelectInputAd label="Product" name="product" id="inventory_form_field_product" choices={product_options} />
    <TextInput type="text" label="DO" name="do" id="inventory_form_field_do" />


    <NumberInput label="Weight In" name="weight_in" id="inventory_form_field_weight_in" bind:value={weight_in} />
    <NumberInput label="Weight Out" name="weight_out" id="inventory_form_field_weight_out" bind:value={weight_out} />

    <NumberInput label="Factory Nett" name="factory_nett" id="inventory_form_field_factory_nett" bind:value={factory_nett} />
    <NumberInput label="Deduction" name="deduction" id="inventory_form_field_deduction" bind:value={deduction} />
    <NumberInput label="Nett" name="nett" id="inventory_form_field_nett" bind:value={nett} />

    <NumberInput label="Bucket" name="bucket" id="inventory_form_field_bucket" bind:value={bucket} step={0.01} />

    <TextInput type="text" label="Remark" name="remark" id="inventory_form_field_remark" />
    

    <Button type="submit" classes="primary">Submit</Button>
</Form>