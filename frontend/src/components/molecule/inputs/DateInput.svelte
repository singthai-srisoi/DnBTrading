<script lang="ts">
    export let id: string
    export let label: string
    export let placeholder: string = "";
    export let name: string;
    export let required: boolean = false;
    export let disabled: boolean = false;
    export let autocomplete: string = "off";
    export let classes: App.StyleClass = "";

    export let value: string = "";
    export let valueDate: Date | string = value == "" ? new Date() : new Date(value);
    export let min: string = "";
    export let max: string= "";

    let textInput: HTMLInputElement | null = null
    let dateInput: HTMLInputElement | null = null
    const handleFocus = (e: Event) => {
        e.preventDefault()
        if (!dateInput || !e.currentTarget) return
        dateInput.showPicker()
    }

    let handlerDateFormat = (date: Date | string): string => {
        if (!date || typeof date == "string") return ""
        return Intl.DateTimeFormat("en-GB").format(date)
    }
    
    let handleDateChange = (e: Event) => {
        if (!e.currentTarget) return
        const target = e.currentTarget as HTMLInputElement
        valueDate = new Date(target.value)
        value = handlerDateFormat(valueDate)
        textInput?.blur()
    }

    
    let handleInput = (e: Event) => {
        if (!e.currentTarget) return
        const target = e.currentTarget as HTMLInputElement
        valueDate = value == "" ? new Date() : new Date(value)
        // console.log(valueDate)
        // console.log("validateDate", validateDate())
        if (!validateDate()) {
            target.classList.add("danger")
        } else {
            target.classList.remove("danger")
        }
    }

    let handleKeyDown = (e: KeyboardEvent) => {
        if (!e.currentTarget) return
        const currentKey = e.key
        const target = e.currentTarget as HTMLInputElement

        if (currentKey.length > 1) return
        if (target.value.length == 2) {
            value += "/"
        } else if (target.value.length == 5) {
            value += "/"
        }
    }

    let validateDate = () => {
        if (valueDate == "Invalid Date") return false
        return true
    }

    value = handlerDateFormat(valueDate);

    
    
</script>

<div class="input-field">
    <input 
        type="text"
        {placeholder}
        {required}
        {autocomplete}
        bind:value={value}
        {disabled}
        class={classes}
        on:focus={handleFocus}
        on:input={handleInput}
        on:keydown={handleKeyDown}
        bind:this={textInput}
    >
    <label for={id}>{label}</label>
    <input 
        type="date" 
        {name}
        {min}
        {max}
        bind:this={dateInput} 
        class="hidden" 
        on:change={handleDateChange}
    />
</div>


<style>
div {
    position: relative;
    display: flex;
    flex-direction: column;
}
.hidden {
    position: absolute;
    height: 27px;
    width: 0;
    padding: 0;
    margin: 0;
    border: 0;
}
input {
    position: relative;
    /* width: 250px; */
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

.input-field input:focus ~ label, input:not(:placeholder-shown) ~ label {
    top: 0;
    font-weight: 400;
    padding: 0 5px;
    background-color: white;
}
</style>