<script lang="ts">
    export let label: string
    export let id: string
    export let name: string;
    export let value: string = ''
    export let required: boolean = false;
    export let disabled: boolean = false;
    export let checked: boolean = false;
    export let oninput: (e:Event) => void = () => {}
    export let onchange: (e:Event) => void = () => {}

    function HandleInput(e: Event) {
        checked = (e.target as HTMLInputElement).checked
        oninput(e)
    }
    function HandleChange(e: Event) {
        onchange(e)
    }
</script>

<div class="input-field">
    <input type="checkbox" {name} {id} {required} {disabled} {value} 
    on:input={HandleInput} 
    on:change={HandleChange}
    bind:checked={checked} />
    <label for={id}>{label}</label>
</div>

<style>
.input-field {
    position: relative;
    width: 100%;
}

/* custome checkbox style */

</style>
