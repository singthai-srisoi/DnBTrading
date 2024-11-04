<script lang="ts">
    import Button from "../atoms/Button.svelte"
    import Form from "../molecule/Form.svelte"
	import TextInput from "../molecule/inputs/TextInput.svelte"

    export let action = "?/create"

</script>
<Form method="post" {action} size="lg">
    <h1>Destination</h1>
    <TextInput type="text" label="Code" name="code" id="destination_form_reg_no" required />
    <TextInput type="text" label="Name" name="name" id="destination_form_model" required />
    <Button type="submit" classes="primary">Submit</Button>
</Form>