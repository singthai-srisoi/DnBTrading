<script lang="ts">
    import Button from "../atoms/Button.svelte"
    import Form from "../molecule/Form.svelte"
	import TextInput from "../molecule/inputs/TextInput.svelte"

    export let action = "?/create"

</script>
<Form method="post" {action} size="lg">
    <h1>Product Type</h1>
    <TextInput type="text" label="Code" name="code" id="product_form_field_code" required />
    <TextInput type="text" label="Name" name="name" id="product_form_field_name" required />
    <Button type="submit" classes="primary">Submit</Button>
</Form>