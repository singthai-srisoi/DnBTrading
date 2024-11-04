<script lang="ts">
	import Tbody from "./Tbody.svelte"
    import Thead from "./Thead.svelte"

    export let data: {[k:string]:any}[]
    export let columns: DataGrid.column[]

    export let actionCol: boolean = false
    export let edit: {[key:string]:any} = {}
    export let del: {[key:string]:any} = {}

    const keys = Object.keys(data[0])
</script>

<table>
    <Thead {columns} {actionCol} />
    <Tbody {data} {columns} {actionCol} bind:edit={edit} bind:del={del} />
</table>

<style>
table {
    clear: both;
    margin-top: 6px !important;
    margin-bottom: 6px !important;
    max-width: none !important;
    border: 1px solid #d1d1d1;
    background-color: transparent;
    width: 100%;
    border-spacing: 0;
    border-collapse: collapse;

    & th, td {
        border: 1px solid #d1d1d1;
        padding: 5px;
    }

    & th {
        background-color: #f1f1f1;
        font-weight: 500;
    }

    & tr:hover {
        background-color: #cccccc;
    }

}
</style>