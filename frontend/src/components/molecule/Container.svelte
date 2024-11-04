<script lang="ts">
    export let align: "center" | "flex-start" | "flex-end" | "space-between" | "space-around" = "center";
    let classList = ["container", align].join(" ");
</script>

<div class={classList}>
    <slot />
</div>

<style>
    .container {
        width: 100%;
        max-width: 100%;
        margin: 0 auto;
        padding: 1rem 3rem;
        background: none;
        display: flex;
        flex-direction: column;

        &.center {
            align-items: center;
        }

        &.flex-start {
            align-items: flex-start;
        }

        &.flex-end {
            align-items: flex-end;
        }

        &.space-between {
            justify-content: space-between;
        }

        &.space-around {
            justify-content: space-around;
        }
    }
</style>