<script lang="ts">
    export let size: App.Size = "md"
</script>

<div class={size}></div>

<style>
div {
    width: 100%;

    &.sm {
        margin-top: 1rem;
    }

    &.md {
        margin-top: 2rem;
    }

    &.lg {
        margin-top: 3rem;
    }

    &.xl {
        margin-top: 4rem;
    }

    &.xxl {
        margin-top: 5rem;
    }
}
</style>

