<div class="main">
    <slot />
</div>

<style>
    .main {
        min-height: 100dvh;
        /* width: 100vw; */
        background-color: var(--color-light);

        display: grid;
        place-items: center;
        padding: 0;
        margin: 0;
    }
</style>