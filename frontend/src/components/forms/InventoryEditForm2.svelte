<script lang="ts">
	import { createEventDispatcher } from "svelte"
    import Button from "../atoms/Button.svelte"
    import Form from "../molecule/Form.svelte"
	import TextInput from "../molecule/inputs/TextInput.svelte"
	import HiddenInput from "$components/molecule/inputs/HiddenInput.svelte"
	import SelectInputAd from "$components/molecule/inputs/SelectInputAd.svelte"
    import NumberInput from "$components/molecule/inputs/NumberInput.svelte"
    import DateInputAd from "$components/molecule/inputs/DateInputAd.svelte"

    export let vehicle_options: App.SelectInputType = []
    export let driver_options: App.SelectInputType = []
    export let supplier_options: App.SelectInputType = []
    export let customer_options: App.SelectInputType = []
    export let product_options: App.SelectInputType = []

    const dispatch = createEventDispatcher()
    function submitted(event: Event) {
        dispatch("putSubmitted")
    }

    function handleButton(event: Event) {
        event.preventDefault()
        const button = event.currentTarget as HTMLButtonElement
        button.focus()
        const enterKeyEvent = new KeyboardEvent("keydown", {
            key: "Enter",
            code: "Enter",
            keyCode: 13,
            charCode: 13,
            bubbles: true
        })
        button.dispatchEvent(enterKeyEvent)
    }

    export let action = "?/update"
    export let data: { [key: string]: any; } = {
        id: "",
        date: "",
        vehicle: {
            label: "",
            value: "",
        },
        driver: {
            label: "",
            value: "",
        },
        supplier: {
            label: "",
            value: "",
        },
        customer_ticket_no: "",
        supplier_qty: 0,
        customer: {
            label: "",
            value: "",
        },
        product: {
            label: "",
            value: "",
        },
        ticket_no: "",
        do: "",
        weight_in: 0,
        weight_out: 0,
        factory_nett: 0,
        nett: 0,
        deduction: 0,
        bucket: 0.0,
        remark: "",
    }

    $: {
        data.factory_nett = String((parseFloat(data.weight_in) || 0) - (parseFloat(data.weight_out) || 0))
        data.nett = String((parseFloat(data.weight_in) || 0) - (parseFloat(data.weight_out) || 0) - (parseFloat(data.deduction) || 0))
        // data.bucket = String((parseFloat(data.deduction) || 0) / 20)
        data = data
    }

</script>
<Form method="post" {action} size="lg" on:submitted={submitted}>
    <h1>Inventory</h1>
    <HiddenInput name="id" value={data.id} id="inventory_form_edit_field_id" />
    <TextInput type="text" label="Ticket No" name="ticket_no" id="inventory_form_edit_field_ticket_no" value={data.ticket_no} />
    <DateInputAd label="Date" name="date" id="inventory_form_edit_field_date" value={data.date} />
    <SelectInputAd label="Vehicle" name="vehicle" id="inventory_form_edit_field_vehicle" choices={vehicle_options} actual_value={data.vehicle?.value??""} />
    <SelectInputAd label="Driver" name="driver" id="inventory_form_edit_field_driver" choices={driver_options} actual_value={data.driver?.value??""} />
    <SelectInputAd label="Supplier" name="supplier" id="inventory_form_edit_field_supplier" choices={supplier_options} actual_value={data.supplier?.value??""} />
    <TextInput type="text" label="Customer Ticket No" name="customer_ticket_no" id="inventory_form_edit_field_customer_ticket_no" value={data.customer_ticket_no} />
    <NumberInput label="Supplier Qty" name="supplier_qty" id="inventory_form_edit_field_supplier_qty" value={data.supplier_qty} />

    <SelectInputAd label="Customer" name="customer" id="inventory_form_edit_field_customer" choices={customer_options} actual_value={data.customer?.value??""} />
    <SelectInputAd label="Product" name="product" id="inventory_form_edit_field_product" choices={product_options} actual_value={data.product?.value??""} />
    <TextInput type="text" label="DO" name="do" id="inventory_form_edit_field_do" value={data.do} />

    <NumberInput label="Weight In" name="weight_in" id="inventory_form_edit_field_weight_in" bind:value={data.weight_in} />
    <NumberInput label="Weight Out" name="weight_out" id="inventory_form_edit_field_weight_out" bind:value={data.weight_out} />

    <NumberInput label="Factory Nett" name="factory_nett" id="inventory_form_edit_field_factory_nett" bind:value={data.factory_nett} />
    <NumberInput label="Deduction" name="deduction" id="inventory_form_edit_field_deduction" bind:value={data.deduction} />
    <NumberInput label="Nett" name="nett" id="inventory_form_edit_field_nett" bind:value={data.nett} />
    <NumberInput label="Bucket" name="bucket" id="inventory_form_edit_field_bucket" bind:value={data.bucket} step={0.01} />

    <TextInput type="text" label="Remark" name="remark" id="inventory_form_edit_field_remark" value={data.remark} />
    <Button type="submit" classes="primary" onClick={handleButton}>Submit</Button>
</Form>