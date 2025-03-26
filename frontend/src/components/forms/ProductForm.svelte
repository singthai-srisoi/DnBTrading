<script lang="ts">
    import Button from "../atoms/Button.svelte"
    import Form from "../molecule/Form.svelte"
	import NumberInput from "../molecule/inputs/NumberInput.svelte"
	import TextInput from "../molecule/inputs/TextInput.svelte"
	import SelectInputAd from "$components/molecule/inputs/SelectInputAd.svelte"

    export let action = ""

    export let type_options: App.SelectInputType = []

</script>
<Form method="post" {action} size="lg">
    <h1>Product</h1>
    <TextInput type="text" label="Code" name="code" id="product_form_field_code" required />
    <TextInput type="text" label="Name" name="name" id="product_form_field_name" required />
    <NumberInput label="Price" name="price" id="product_form_field_price" value={"0"} min={0} max={99999999999999999} />
    <!-- <SelectInput label="Type" name="type" id="product_form_field_type" choices={type_options} /> -->
    <!-- <SelectInput2 label="Type" name="type" items={type_options} id="product_form_field_type" /> -->
     <SelectInputAd label="Type" name="type" id="product_form_field_type" choices={type_options} />
    <Button type="submit" classes="primary">Submit</Button>
</Form>