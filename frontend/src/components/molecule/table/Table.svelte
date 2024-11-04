<script lang="ts">
	// import Thead from "./Thead.svelte"
    // import Tbody from "./Tbody.svelte"
    export let id: string

    export let data: {[k:string]:any}[]
    let keys = Object.keys(data[0])
</script>

{#if data && data.length > 0}
<table {id}>
    <!-- <Thead {data} />
    <Tbody {data} /> -->
    <thead>
        <tr>
            {#each keys as key}
                <th>{key}</th>
            {/each}
        </tr>
    </thead>
    <tbody>
        {#each data as row}
            <tr>
                {#each keys as key}
                    <td>{row[key]}</td>
                {/each}
            </tr>
        {/each}
    </tbody>
</table>
{:else}
<p>No data</p>
{/if}
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