<script lang="ts">
    export let classes: App.StyleClass = ""
    export let size: App.Size = "md"
    export let style: string = ""

    

    let classList = ["card", classes, size].join(" ")
</script>

<div class={classList} {style}>
    <slot />
</div>

<style>
    .card {
        background-color: var(--color-white, #fff);
        border-radius: 0 !important;
        border: 1px solid #ccc;
        border-top: 5px solid var(--color-primary, #007bff);
        /* padding: 1rem; */

        display: grid;
        grid-template-rows: 1fr;
        row-gap: 0.7rem;

        &.primary {
            border-top-color: var(--color-primary, #007bff);
        }

        &.success {
            border-top-color: var(--color-success, #28a745);
        }

        &.danger {
            border-top-color: var(--color-danger, #dc3545);
        }

        &.warning {
            border-top-color: var(--color-warning, #ffc107);
        }

        &.info {
            border-top-color: var(--color-info, #17a2b8);
        }

        &.free {
            /* free size */
            padding: 0.5rem;
        }

        &.sm {
            padding: 0.5rem;
            width: 300px;
        }

        &.md {
            padding: 1rem;
            width: 500px;
        }

        &.lg {
            padding: 1.5rem;
            width: 100%;
            /* overflow-x: scroll;
            overflow-y: hidden; */
        }

        &.xl {
            padding: 2rem;
            width: 100%;
        }

        &.xxl {
            padding: 2.5rem;
            width: 100%;
        }
    }
</style>