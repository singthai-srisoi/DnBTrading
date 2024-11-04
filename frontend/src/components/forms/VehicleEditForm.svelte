<script lang="ts">
	import { createEventDispatcher } from "svelte"
    import Button from "../atoms/Button.svelte"
    import Form from "../molecule/Form.svelte"
	import TextInput from "../molecule/inputs/TextInput.svelte"
	import HiddenInput from "$components/molecule/inputs/HiddenInput.svelte"

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
        reg_no: "",
        model: "",
    }

</script>
<Form method="post" {action} size="lg" on:submitted={submitted}>
    <h1>Vehicle</h1>
    <HiddenInput name="id" value={data.id} id="vehicle_form_edit_field_id" />
    <TextInput type="text" label="Reg. No" name="reg_no" id="vehicle_form_edit_field_reg_no" required value={data.reg_no} />
    <TextInput type="text" label="Model" name="model" id="vehicle_form_edit_field_model" required value={data.model} />
    <Button type="submit" classes="primary" onClick={handleButton}>Submit</Button>
</Form>