<script lang="ts">
    import Button from "../atoms/Button.svelte"
    import Form from "../molecule/Form.svelte"
	import TextInput from "../molecule/inputs/TextInput.svelte"

    export let action = "?/create"

</script>
<Form method="post" {action} size="lg">
    <h1>Vehicle</h1>
    <TextInput type="text" label="Reg. No" name="reg_no" id="vehicle_form_reg_no" required />
    <TextInput type="text" label="Model" name="model" id="vehicle_form_model" required />
    <Button type="submit" classes="primary">Submit</Button>
</Form>