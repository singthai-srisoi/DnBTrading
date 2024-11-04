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
        code: "",
        name: "",
        phone: "",
        ic: "",
    }

</script>
<Form method="post" {action} size="lg" on:submitted={submitted}>
    <h1>Customer</h1>
    <HiddenInput name="id" value={data.id} id="customer_form_edit_field_id" />
    <TextInput type="text" label="Code" name="code" id="customer_form_edit_field_code" required value={data.code} />
    <TextInput type="text" label="Name" name="name" id="customer_form_edit_field_name" required value={data.name} />
    <TextInput type="text" label="Phone" name="phone" id="customer_form_edit_field_phone" required={false} value={data.phone} />
    <TextInput type="text" label="IC" name="ic" id="customer_form_edit_field_ic" required={false} value={data.ic} />
    <HiddenInput type="hidden" name="type" id="customer_form_edit_field_type" value="customer" />    
    <Button type="submit" classes="primary" onClick={handleButton}>Submit</Button>
</Form>