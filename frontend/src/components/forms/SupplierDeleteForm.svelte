<script lang="ts">
	import { createEventDispatcher } from "svelte"
    import Button from "../atoms/Button.svelte"
    import Form from "../molecule/Form.svelte"
	import HiddenInput from "$components/molecule/inputs/HiddenInput.svelte"

    const dispatch = createEventDispatcher()
    function submitted(event: Event) {
        dispatch("deleteSubmitted")
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

    export let action = "?/delete"
    export let data: { [key: string]: any; } = {
        id: "",
    }

</script>
<Form method="post" {action} size="lg" on:submitted={submitted}>
    <h2>Are you sure you want to delete?</h2>
    <HiddenInput name="id" value={data.id} id="supplier_form_delete_field_id" />
    <Button type="submit" classes="primary" onClick={handleButton}>Delete</Button>
</Form>