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
    }

</script>
<Form method="post" {action} size="lg" on:submitted={submitted}>
    <h1>Destination</h1>
    <HiddenInput name="id" value={data.id} id="destination_form_edit_field_id" />
    <TextInput type="text" label="Code" name="code" id="destination_form_edit_field_code" required value={data.code} />
    <TextInput type="text" label="Name" name="name" id="destination_form_edit_field_name" required value={data.name} />
    <Button type="submit" classes="primary" onClick={handleButton}>Submit</Button>
</Form>