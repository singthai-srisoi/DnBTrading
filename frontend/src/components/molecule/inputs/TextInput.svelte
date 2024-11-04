<script lang="ts">
	import Input from "../../atoms/Input.svelte"

    export let label: string
    export let id: string
    export let placeholder: string = "";
    export let name: string;
    export let type: string = "text";
    export let required: boolean = false;
    export let disabled: boolean = false;
    export let autocomplete: string = "off";
    export let classes: App.StyleClass = "";

    export let onInput: (e:Event) => void = () => {}

    export let value = "";

    function HandleInput(e: Event) {
        if (!e.currentTarget) return
        const target = e.currentTarget as HTMLInputElement
        value = target.value
        onInput(e)
    }
</script>

<div class="input-field">
    <Input
        {id}
        {type}
        {name}
        {placeholder}
        {required}
        {autocomplete}
        bind:value={value}
        {disabled}
        {classes}
        oninput={HandleInput}
    />
    <label for={id}>{label}</label>
</div>

<style>
.input-field {
    position: relative;
    width: 100%;

    & input:focus ~ label, input:not(:placeholder-shown) ~ label {
        top: 0;
        font-weight: 400;
        padding: 0 5px;
        background-color: white;
    }
}
.input-field label{
    position: absolute;
    top: 50%;
    left: 5px;
    padding: 0 5px;
    font-size: 0.9rem;
    transform: translateY(-50%);
    color: var(--color-dark-text, #333);
    pointer-events: none;
    transition: 0.3s;
}
</style>
