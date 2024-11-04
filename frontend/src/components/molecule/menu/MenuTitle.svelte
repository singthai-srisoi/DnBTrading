<script lang="ts">
    export let text = "Menu Item"
    export let classes: "active" | "" = ""
    export let notice_class: App.StyleClass = ""

    let classList = ["menu-header", classes].join(" ")
    let noticeClassList = ["notice", notice_class].join(" ")
</script>

<div class={classList}>
    <span class="text">{text}</span>
</div>

<style>
.menu-header {
    display: block;
    width: 100%;
    padding: 10px 12px;
    background-color: rgb(57, 68, 100);

    & span {
        color: var(--color-menu-text);
        font-weight: 500 !important;
        width: 100%;
        border-left: 5px solid transparent;
        margin-right: 1px;
        
    }
}
</style>