<script lang="ts">
	import ReportTable from "./ReportTable.svelte"
    import type { PageData } from "./$types"


    export let data: PageData

    // $: console.log(data)
</script>

<svelte:head>
    <title>Report</title>
</svelte:head>

<h1>Report Page</h1>

<ReportTable data={data} />
