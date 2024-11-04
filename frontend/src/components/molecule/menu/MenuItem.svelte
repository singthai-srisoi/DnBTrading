<script lang="ts">
	import { onMount } from "svelte"

    export let icon = "🏠"
    export let href = "#"
    export let text = "Menu Item"
    export let classes: "active" | "" = ""
    export let notice: string = "."
    export let notice_class: App.StyleClass = ""
    export let active = false

    let classList = ["menu-item", classes].join(" ")
    let aClassList = active ? "active" : ""
    let noticeClassList = ["notice", notice_class].join(" ")

    // console.log("active of", text, active)
</script>

<div class={classList}>
    <a {href} class={aClassList}>
        <i>{icon}</i>
        <span class="text">{text}</span>
        <span class={noticeClassList}>{notice}</span>
    </a>
</div>

<style>
.menu-item {
    display: block;
    width: 100%;
    overflow-x: hidden;

    & a {
        overflow: hidden;
        color: var(--color-menu-text);
        font-weight: 400 !important;
        text-decoration: none;
        display: block !important;
        width: 100%;
        border-left: 3px solid transparent;
        padding: 5px 12px;
        margin-right: 1px;
        display: block;
        background-color: transparent;

        &:hover {
            background-color: var(--color-menu-hover);
            color: var(--color-light);
        }

        & .notice {
            float: right !important;
        }

        &.active {
            background-color: black;
            color: var(--color-light);
            border-left-color: var(--color-primary);
        }
    }
}
</style>