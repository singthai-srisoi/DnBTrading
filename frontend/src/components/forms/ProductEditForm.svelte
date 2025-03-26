<script lang="ts">
	import HiddenInput from "$components/molecule/inputs/HiddenInput.svelte"
	import { createEventDispatcher } from "svelte"
    import Button from "../atoms/Button.svelte"
    import Form from "../molecule/Form.svelte"
	import NumberInput from "../molecule/inputs/NumberInput.svelte"
	import TextInput from "../molecule/inputs/TextInput.svelte"
	import SelectInputAd from "$components/molecule/inputs/SelectInputAd.svelte"

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
        price: 0,
        type: null,
    }
    export let type_options: App.SelectInputType = []

</script>
<Form method="post" {action} size="lg" on:submitted={submitted}>
    <h1>Product</h1>
    <HiddenInput name="id" value={data.id} id="product_form_edit_field_id" />
    <TextInput type="text" label="Code" name="code" id="product_form_edit_field_code" required value={data.code} />
    <TextInput type="text" label="Name" name="name" id="product_form_edit_field_name" required value={data.name} />
    <NumberInput label="Price" name="price" id="product_form_edit_field_price" min={0} max={99999999999999999} value={data.price?.toString()} />
    <SelectInputAd label="Type" name="type" id="product_form_edit_field_type" choices={type_options} actual_value={data.type?.value ?? ''} />

    <Button type="submit" classes="primary" onClick={handleButton}>Submit</Button>
</Form>