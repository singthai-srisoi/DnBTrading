<script lang="ts">
    export let type: "button" | "submit" | "reset" = "button";
    export let classes: App.StyleClass = "primary";
    export let disabled = false;
    export let onClick: ((e:Event) => void) | (() => {}) = () => {};

</script>

<button
    {type}
    {disabled}
    class={classes}
    on:click={onClick}
>
    <slot />
</button>

<style>
button {
    position: relative;
    padding: 6px;
    border-radius: 0 !important;
    border: 1px solid transparent;
    background-color: #999;
    cursor: pointer;
    transition: background-color 0.15s ease-in-out;

    &:hover {
        background-color: #dadada;
    }

    &:focus {
        outline: none;
        border: 1px solid #1a1a1a;
    }

    &.primary {
        color: white;
        background-color: var(--color-primary);
        &:hover {
            background-color: var(--color-primary-dark);
        }
        &:disabled {
            background-color: var(--color-primary-light);
            &:hover {
                background-color: var(--color-primary-light);
            }
        }
    }



    &.success {
        color: white;
        background-color: var(--color-success);
        &:hover {
            background-color: var(--color-success-dark);
        }
        &:disabled {
            background-color: var(--color-success-light);
            &:hover {
                background-color: var(--color-success-light);
            }
        }
    }

    &.info {
        color: white;
        background-color: var(--color-info);
        &:hover {
            background-color: var(--color-info-dark);
        }
        &:disabled {
            background-color: var(--color-info-light);
            &:hover {
                background-color: var(--color-info-light);
            }
        }
    }

    &.danger {
        color: white;
        background-color: var(--color-danger);
        &:hover {
            background-color: var(--color-danger-dark);
        }
        &:disabled {
            background-color: var(--color-danger-light);
            &:hover {
                background-color: var(--color-danger-light);
            }
        }
    }

    &.warning {
        color: white;
        background-color: var(--color-warning);
        &:hover {
            background-color: var(--color-warning-dark);
        }
        &:disabled {
            background-color: var(--color-warning-light);
            &:hover {
                background-color: var(--color-warning-light);
            }
        }
    }
}
</style>