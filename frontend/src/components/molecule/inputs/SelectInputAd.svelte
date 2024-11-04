<script lang="ts">
	import { onMount } from "svelte"
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

    export let onInput: (e:Event) => void = (e) => {
        InputBehavior(e)
    }
    export let nullable = true
    export let value = ""
    export let actual_value = ""
    export let label_text = ""
    export let choices: App.SelectInputType = []
    if (nullable) choices = [{value: "", label: "-- No value --"}, ...choices]
    let default_choices = choices


    //#region show or hide choices
    let show_choices = false
    async function showChoices() { 
        show_choices = true
        // console.log("showing")
        if(!choiceDiv) return
        const buttons = choiceDiv?.querySelectorAll("button")
        buttons.forEach((button) =>  button.classList.remove("focus"))
        if (buttons.length > 0) buttons[0].classList.add("focus")
    }
    async function hideChoices() { 
        show_choices = false 
        // console.log("hiding")
    }
    onMount(async () => {
        document.addEventListener('click', async (e) => {
            if (e.target !== document.getElementById(id)) {
                // console.log({choosen}, "off click")
                await hideChoices()
                await ReAssignValue()
                choosen = true
            }
        })
    })
    async function onInputClick(e:MouseEvent) {
        await showChoices()
        // console.log({choosen}, "on click")
        if (choosen) {
            await cursorFirstChar(e)
        }
    }
    //#endregion

    let choosen = false
    async function filterChoices(e:Event) {
        choices = default_choices.filter(choice => choice.label.toLowerCase().includes(value.toLowerCase()))
    }

    async function cursorFirstChar(e:Event) {
        const target = e.target as HTMLInputElement
        target.setSelectionRange(0, 0)
    }

    async function ReSearch(e:Event) {
        const target = e.target as HTMLInputElement
        let firstChar = target.value[0] ?? ""
        value = firstChar
    }

    async function ReAssignValue() {
        const choice = default_choices.find(choice => choice.value === actual_value)
        value = choice?.label ?? ""
        choosen = true
        await ResetChoices()
    }
    async function ResetChoices() {
        choices = default_choices
    }

    async function InputBehavior(e:Event) {
        if (choosen) {
            choosen = false
            await ResetChoices()
            await ReSearch(e)
        } else {
            await filterChoices(e)
        }
    }

    let choiceDiv: HTMLDivElement | null = null
    async function InputKeydown(e:KeyboardEvent) {
        if (e.key === "Delete" && choosen) {
            e.preventDefault()
        }

        // travel up and down
        if (!choiceDiv) return
        if (e.key === "ArrowDown") {
            e.preventDefault()
            const buttons = choiceDiv.querySelectorAll("button")
            const button = choiceDiv.querySelector("button.focus") as HTMLButtonElement
            const index = Array.from(buttons).indexOf(button)
            const next_index = index + 1 > buttons.length - 1 ? 0 : index + 1
            buttons.item(next_index).classList.add("focus")
            // remove focus from the current button
            buttons.forEach((button, i) => {
                if (i !== next_index) button.classList.remove("focus")
            })
            // console.log({index, buttons})
        } else if (e.key === "ArrowUp") {
            e.preventDefault()
            const buttons = choiceDiv.querySelectorAll("button")
            const button = choiceDiv.querySelector("button.focus") as HTMLButtonElement
            const index = Array.from(buttons).indexOf(button)
            const next_index = index - 1 < 0 ? buttons.length - 1 : index - 1
            buttons.item(next_index).classList.add("focus")
            // remove focus from the current button
            buttons.forEach((button, i) => {
                if (i !== next_index) button.classList.remove("focus")
            })
            button.classList.remove("focus")
            // console.log({index, buttons})
        } else if (e.key === "Enter") {
            e.preventDefault()
            const button = choiceDiv.querySelector("button.focus") as HTMLButtonElement
            button.click()
            await hideChoices()
        } else if (e.key === "Escape") {
            e.preventDefault()
            await hideChoices()
        }
    }

    ReAssignValue()

    

</script>

<div class="input-field">
    <Input
        {id}
        {type}
        {placeholder}
        {required}
        {autocomplete}
        bind:value={value}
        {disabled}
        {classes}
        oninput={onInput}
        onclick={onInputClick}
        onkeydown={InputKeydown}
    />
    <label for={id}>{label}</label>

    <div class="choices" class:show={show_choices} class:hide={!show_choices} bind:this={choiceDiv}>
        {#each choices as choice}
            <button 
                type="button"
                data-value={choice.value}
                on:click={async () => {
                    actual_value = choice.value
                    value = choice.label
                    choosen = true
                    label_text = choice.label
                    await hideChoices()
                    show_choices = false
                }}
                class:selected={choice.value === actual_value}
            >{choice.label}</button>
        {/each}
    </div>

    <input type="hidden" name={name} value={actual_value}>
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

.choices {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background-color: white;
    border: 1px solid var(--color-border, #ccc);
    border-radius: 0 !important;
    display: none;
    z-index: 100;
    overflow: hidden;
    max-height: 200px;
    overflow-y: auto;
    transition: 0.3s;

    & button {
        width: 100%;
        padding: 0.5rem;
        text-align: left;
        border: none;
        background-color: white;
        cursor: pointer;
        transition: 0.3s;

        &:hover {
            background-color: var(--color-primary-light, #f0f0f0);
        }

        &.selected {
            background-color: var(--color-primary-light, #f0f0f0);
        }

        &.focus {
            background-color: #d1dbf0;
        }
    }

    &.show {
        display: block;
    }

    &.hide {
        display: none;
    }
}
</style>