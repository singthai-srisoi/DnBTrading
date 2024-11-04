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
        code: "",
        name: "",
    }

</script>
<Form method="post" {action} size="lg" on:submitted={submitted}>
    <h1>Product Type</h1>
    <TextInput type="text" label="Code" name="" id="product_form_edit_field_code_display" required value={data.code} disabled />
    <HiddenInput name="code" value={data.code} id="product_form_edit_field_code" />
    <TextInput type="text" label="Name" name="name" id="product_form_edit_field_name" required value={data.name} />
    <Button type="submit" classes="primary" onClick={handleButton}>Submit</Button>
</Form>