<script lang="ts">
	import { createEventDispatcher } from "svelte"
    import Button from "../atoms/Button.svelte"
    import Form from "../molecule/Form.svelte"
	import TextInput from "../molecule/inputs/TextInput.svelte"
	import HiddenInput from "$components/molecule/inputs/HiddenInput.svelte"
	import DateInput from "$components/molecule/inputs/DateInput.svelte"
	import SelectInputAd from "$components/molecule/inputs/SelectInputAd.svelte"
	import NumberInput from "$components/molecule/inputs/NumberInput.svelte"
	import DateInputAd from "$components/molecule/inputs/DateInputAd.svelte"

    const dispatch = createEventDispatcher()
    function submitted(event: Event) {
        dispatch("putSubmitted")
    }

    function handleButton(event: Event) {
        console.log('submitting EditForm')
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

    /**
     * from django.db import models
from products.models import Product
from vehicles.models import Vehicle
from person.models import Person
from destinations.models import Destination

# Create your models here.
class Inventory(models.Model):
    date = models.DateField()
    vehicle = models.ForeignKey(Vehicle, on_delete=models.SET_NULL, null=True)
    driver = models.ForeignKey(
        Person, 
        on_delete=models.SET_NULL,
        null=True,
        limit_choices_to={'type': 'driver'},
        related_name='driver')
    supplier = models.ForeignKey(
        Person, 
        on_delete=models.SET_NULL,
        null=True,
        limit_choices_to={'type': 'supplier'},
        related_name='supplier')
    
    customer_ticket_no = models.CharField(max_length=100, null=True, blank=True) # customer ticket no

    supplier_qty = models.IntegerField(default=0)
    customer = models.ForeignKey(
        Person, 
        on_delete=models.SET_NULL,
        null=True,
        limit_choices_to={'type': 'customer'},
        related_name='customer')
    destination = models.ForeignKey(Destination, on_delete=models.SET_NULL, null=True)
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    ticket_no = models.CharField(max_length=100)
    do = models.CharField(max_length=100)
    weight_in = models.IntegerField(default=0)
    weight_out = models.IntegerField(default=0)

    factory_nett = models.IntegerField(default=0) # weight_in - weight_out
    nett = models.IntegerField(default=0)

    deduction = models.IntegerField(default=0)

    bucket = models.FloatField(default=0.0) # deduction / 20

    # new added fields
    # customer_ticket_no, factory_nett, bucket
    # factory_nett = weight_in - weight_out
    # bucket = deduction / 20

    remark = models.CharField(max_length=255, blank=True, null=True)
    
    def __str__(self):
        return f'{self.ticket_no} - {self.do}'

     form.nett.value = (parseFloat(form.weight_in.value)||0) - (parseFloat(form.weight_out.value)||0) - (parseFloat(form.deduction.value)||0);
    form.factory_nett.value = (parseFloat(form.weight_in.value)||0) - (parseFloat(form.weight_out.value)||0);
    form.bucket.value = (parseFloat(form.deduction.value)||0) / 20;
     */

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
        destination: {
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

    export let vehicle_options: App.SelectInputType = []
    export let driver_options: App.SelectInputType = []
    export let supplier_options: App.SelectInputType = []
    export let customer_options: App.SelectInputType = []
    // export let destination_options: App.SelectInputType = []
    export let product_options: App.SelectInputType = []

    $: {
        data.factory_nett = String((parseFloat(data.weight_in) || 0) - (parseFloat(data.weight_out) || 0))
        data.nett = String((parseFloat(data.weight_in) || 0) - (parseFloat(data.weight_out) || 0) - (parseFloat(data.deduction) || 0))
        // data.bucket = String((parseFloat(data.deduction) || 0) / 20)
        data = data
    }
</script>
<Form method="post" {action} size="lg" on:submitted={submitted}>
    <h1>Inventory</h1>
    <HiddenInput name="id" value={data.id} id="destination_form_edit_field_id"  />

    <!-- ticket no and date -->
    <TextInput type="text" label="Ticket No" name="ticket_no" id="inventory_form_field_ticket_no" value={data.ticket_no} />
    <!-- <DateInput label="Date" name="date" id="inventory_form_field_date" value={data.date} /> -->
    <DateInputAd label="Date" name="date" id="inventory_form_field_date" value={data.date} />

    <!-- vehicle -->
    <SelectInputAd label="Vehicle" name="vehicle" id="inventory_form_field_vehicle" choices={vehicle_options} actual_value={data.vehicle?.value ?? ""} />
    <!-- driver -->
    <SelectInputAd label="Driver" name="driver" id="inventory_form_field_driver" choices={driver_options} actual_value={data.driver?.value ?? ""} />

    <!-- supplier -->
    <SelectInputAd label="Supplier" name="supplier" id="inventory_form_field_supplier" choices={supplier_options} actual_value={data.supplier?.value ?? ""} />
    <TextInput type="text" label="Customer Ticket No" name="customer_ticket_no" id="inventory_form_field_customer_ticket_no" value={data.customer_ticket_no} />
    <NumberInput label="Supplier Qty" name="supplier_qty" id="inventory_form_field_supplier_qty" value={data.supplier_qty} />

    <!-- customer -->
    <SelectInputAd label="Customer" name="customer" id="inventory_form_field_customer" choices={customer_options} actual_value={data.customer?.value ?? ""} />

    <!-- product and do -->
    <SelectInputAd label="Product" name="product" id="inventory_form_field_product" choices={product_options} actual_value={data.product?.value ?? ""} />
    <TextInput type="text" label="DO" name="do" id="inventory_form_field_do" value={data.do} />

    <!-- destination -->
    <!-- <SelectInputAd label="Destination" name="destination" id="inventory_form_field_destination" choices={destination_options} actual_value={data.destination?.value ?? ""} /> -->

    <!-- weight in and weight out -->
    <NumberInput label="Weight In" name="weight_in" id="inventory_form_field_weight_in" bind:value={data.weight_in} />
    <NumberInput label="Weight Out" name="weight_out" id="inventory_form_field_weight_out" bind:value={data.weight_out} />

    <!-- factory nett and deduction and nett -->
    <NumberInput label="Factory Nett" name="factory_nett" id="inventory_form_field_factory_nett" bind:value={data.factory_nett} />
    <NumberInput label="Deduction" name="deduction" id="inventory_form_field_deduction" bind:value={data.deduction} />
    <NumberInput label="Nett" name="nett" id="inventory_form_field_nett" bind:value={data.nett} />

    <!-- bucket -->
    <NumberInput label="Bucket" name="bucket" id="inventory_form_field_bucket" bind:value={data.bucket} />

    <!-- remark -->
    <TextInput type="text" label="Remark" name="remark" id="inventory_form_field_remark" value={data.remark} />
    
    <Button type="submit" classes="primary" onClick={handleButton}>Submit</Button>
</Form>