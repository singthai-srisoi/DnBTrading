<script>
    export let hide = false;
</script>

<div class="menu" class:hide={hide} class:show={!hide} data-sveltekit-reload>
    <slot />
</div>



<style>
.menu {
	display: flex;
    flex-direction: column;
	justify-content: flex-start;
	align-items: flex-start;
	/* padding: 1rem 3rem; */
	background: var(--color-menu-item);
	color: var(--color-menu-text);

    outline: limegreen solid 1px;

    width: 230px;
    min-width: 230px;
    overflow: hidden;
    transition: width 0.5s ease-in-out;

    &.hide {
        width: 0;
        min-width: 0;
    }

    &.show {
        width: 230px;
        min-width: 230px;
    } 
}
</style>