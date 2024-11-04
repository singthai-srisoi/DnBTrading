<script>
    export let colspan = 1
    export let data_col = ""
    export let hidden = false
    export let align = "left"
</script>

<td {colspan} data-col={data_col} {hidden} style="text-align: {align};">
    <slot />
</td>