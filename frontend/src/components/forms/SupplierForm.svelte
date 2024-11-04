<script lang="ts">
	import Button from "../atoms/Button.svelte"
    import Form from "../molecule/Form.svelte"
	import HiddenInput from "../molecule/inputs/HiddenInput.svelte"
	import TextInput from "../molecule/inputs/TextInput.svelte"

    export let action = "?/create"

</script>
<Form method="post" {action} size="lg">
    <h1>Supplier</h1>
    <TextInput type="text" label="Code" name="code" id="supplier_form_field_code" />
    <TextInput type="text" label="Name" name="name" id="supplier_form_field_name" />
    <TextInput type="text" label="Phone" name="phone" id="supplier_form_field_phone" />
    <TextInput type="text" label="IC" name="ic" id="supplier_form_field_ic" />
    <HiddenInput type="hidden" name="type" id="supplier_form_field_type" value="supplier" />
    <Button type="submit" classes="primary">Submit</Button>
</Form>