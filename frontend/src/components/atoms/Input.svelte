<script lang="ts">
    export let id: string = ""
    export let placeholder: string = ""
    export let name: string = ""
    export let type: string = "text"
    export let required: boolean = false
    export let disabled: boolean = false
    export let autocomplete: string = "off"
    export let classes: App.StyleClass = ""

    export let min = 0;
    export let max = 100;
    export let step = 1;

    export let value = ""

    export let onfocus: (e: Event) => void = () => {}
    export let onblur: (e: Event) => void = () => {}
    export let onkeydown: (e: KeyboardEvent) => void = () => {}
    export let onclick: (e: MouseEvent) => void = () => {}
    export let oninput: (e: Event) => void = () => {}


    const handleInput = (e: Event) => {
        if (!e.currentTarget) return
        const target = e.currentTarget as HTMLInputElement
        value = target.value
        oninput(e)
    };
</script>

<input 
    {id}
    {type}
    {name}
    {placeholder}
    {required}
    {autocomplete}
    {value}
    {disabled}
    {min}
    {max}
    {step}
    class={classes}
    on:input={handleInput}
    on:focus={onfocus}
    on:blur={onblur}
    on:keydown={onkeydown}
    on:click={onclick}
/>

<style>
input {
    position: relative;
    width: 100%;
    font-size: 0.9rem;
    padding: 5px;
    border-radius: 0 !important;
    border: 1px solid #ccc;
    transition: border-color 0.15s ease-in-out;

    &:hover {
        border-color: #dadada;
    }

    &:focus {
        outline: none;
        border-color: #007bff;
    }

    &.success {
        border-color: var(--color-success);
        &:hover, &:focus {
            border-color: var(--color-success-dark);
        }
        &:disabled {
            border-color: var(--color-success-light);
            &:hover {
                border-color: var(--color-success-light);
            }
        }
    }

    &.danger {
        border-color: var(--color-danger);
        &:hover, &:focus {
            border-color: var(--color-danger-dark);
        }
        &:disabled {
            border-color: var(--color-danger-light);
            &:hover {
                border-color: var(--color-danger-light);
            }
        }
    }

    &.warning {
        border-color: var(--color-warning);
        &:hover, &:focus {
            border-color: var(--color-warning-dark);
        }
        &:disabled {
            border-color: var(--color-warning-light);
            &:hover {
                border-color: var(--color-warning-light);
            }
        }
    }

    &.info {
        border-color: var(--color-info);
        &:hover, &:focus {
            border-color: var(--color-info-dark);
        }
        &:disabled {
            border-color: var(--color-info-light);
            &:hover {
                border-color: var(--color-info-light);
            }
        }
    }

    &.primary {
        border-color: var(--color-primary);
        &:hover, &:focus {
            border-color: var(--color-primary-dark);
        }
        &:disabled {
            border-color: var(--color-primary-light);
            &:hover {
                border-color: var(--color-primary-light);
            }
        }
    }

    &.disabled {
        background-color: #f8f9fa;
        border-color: #f8f9fa;
        color: #6c757d;
        cursor: not-allowed;
    }
}

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
</style>

