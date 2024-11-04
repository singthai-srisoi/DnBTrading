<script lang="ts">
	import Input from "../../atoms/Input.svelte"

    export let id: string
    export let placeholder: string = "";
    export let name: string;
    export let type: string = "hidden";
    export let required: boolean = false;
    export let disabled: boolean = false;
    export let autocomplete: string = "off";
    export let classes: App.StyleClass = "";

    export let value = "";
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
    />
</div>

