<script lang="ts">
	import Button from "$components/atoms/Button.svelte"
    import Card from "$components/molecule/Card.svelte"
	import CheckBoxInput from "$components/molecule/inputs/CheckBoxInput.svelte"
	import DateInputAd from "$components/molecule/inputs/DateInputAd.svelte"
	import Table from "$components/molecule/table/Table.svelte"
	import { onMount } from "svelte"

    export let data: {[k: string]: any}

    let baseUrl = ""
    onMount(async () => {
        baseUrl = window.location.origin

    })

    //#region Scheme
    function FieldsToColumns(fields: string[]) {
        let columns = []
        for (let field of fields) {
            columns.push({
                name: field,
                label: field,
                details: false,
                hidden: field === 'id'
            })
        }
        return columns
    }
    let scheme = data['scheme']

    let end_date = new Date()
    let start_date = new Date(end_date.getFullYear(), end_date.getMonth(), 1)

    scheme['start_date'] = start_date
    //#endregion

    //#region HandleClick
    async function getData() {
        const res = await fetch(`${baseUrl}/api/GetReport`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(scheme)
        })
        data.data = await res.json()
    }

    async function HandleClick() {
        // console.log('clicked')
        await getData()
    }
    //#endregion
    
    //#region Group By
    let group_by_div: HTMLDivElement | null = null

    async function OnInputGroupBy(e: Event) {
        let target = e.target as HTMLInputElement
        let name = target.getAttribute('name')

        if (target.checked) {
            scheme['group_by'] = name
        } else {
            scheme['group_by'] = ""
        }
        
        // console.log(target.getAttribute('name'))
        if (!group_by_div) return

        let checkboxes: NodeListOf<HTMLInputElement> = group_by_div.querySelectorAll(`input[type="checkbox"]:not(#${"group-by-filte"+name})`)

        for (let checkbox of checkboxes) {
            checkbox.checked = false
        }
    }
    //#endregion

    //#region Filter Options
    let options = data['options']
    async function OnFilterInput(e: Event) {
        let target = e.target as HTMLInputElement
        let name = target.getAttribute('name')
        if (!name) return
        // console.log('triggered prod')
        if (!target.checked) {
            scheme['filter_obj'][name] = [...scheme['filter_obj'][name], Number(target.value)]
        } else {
            scheme['filter_obj'][name] = scheme['filter_obj'][name].filter((value: number) => value !== Number(target.value))
        }
    }

    //#endregion

    //#region Filter Columns
    // let columns = scheme['fields']
    // async function OnFieldsrInput(e: Event) {
    //     let target = e.target as HTMLInputElement
    //     let name = target.getAttribute('name')
    //     if (!name) return
    //     // console.log('triggered prod')
    //     if (!target.checked) {
    //         // pop out the field
    //         scheme['fields'] = scheme['fields'].filter((value: string) => value !== name)
    //     } else {
    //         scheme['fields'] = [...scheme['fields'], name]
    //     }
    // }

    //#endregion
    
    //#region Export
    async function PDFButton() {
        const res = await fetch(`${baseUrl}/api/GetReport/pdf`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(scheme)
        })
        if (!res.ok) {
            alert('Failed to generate PDF')
            return
        }
        const blob = await res.blob()
        // check if window.URL is supported
        if (!window.URL) {
            alert('Your browser is not supported')
            return
        }
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'report.pdf'
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
    }

    async function CSVButton() {
        const res = await fetch(`${baseUrl}/api/GetReport/csv`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(scheme)
        })
        if (!res.ok) {
            alert('Failed to generate CSV')
            return
        }
        const blob = await res.blob()
        // check if window.URL is supported
        if (!window.URL) {
            alert('Your browser is not supported')
            return
        }
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'report.csv'
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
    }
    //#endregion

    // $: console.log(scheme)
    // $: console.log(Object.keys(options))
</script>

<Card size="lg">
<!-- scheme -->
<div class="grid">
    <div class="date-filter filter-group">
        <h2>Date</h2>
        <DateInputAd label="start_date" name="start_date" id="filter_start_date" bind:value={scheme.start_date} />
        <DateInputAd label="end_date" name="end_date" id="filter_end_date" bind:value={scheme.end_date} />
    </div>
    <div class="group-by-filter filter-group" bind:this={group_by_div}>
        <h2>Grouping</h2>
        {#each scheme['grouping'] as group }
            <CheckBoxInput label={group} id={"group-by-filte"+group} name={group} oninput={OnInputGroupBy} />
        {/each}
    </div>
    <!-- fields -->
    <!-- <div class="fields-filter filter-group">
        <h2>Fields</h2>
        {#each columns as field }
            <CheckBoxInput label={field} id={"fields-filter"+field} name={field} checked={true} oninput={OnFieldsrInput} />
        {/each}
    </div> -->
    <div class="product_options filter-group">
        <h2>Product</h2>
        {#each options['product_options'] as option }
            <CheckBoxInput value={option.value} label={option.label} id={"product_options"+option} name={"product"} checked={true} onchange={OnFilterInput} />
        {/each}
    </div>
    <div class="customer_options filter-group">
        <h2>Customer</h2>
        {#each options['customer_options'] as option }
            <CheckBoxInput value={option.value} label={option.label} id={"customer_options"+option} name={"customer"} checked={true} onchange={OnFilterInput} />
        {/each}
    </div>

    <div class="supplier_options filter-group">
        <h2>Supplier</h2>
        {#each options['supplier_options'] as option }
            <CheckBoxInput value={option.value} label={option.label} id={"supplier_options"+option} name={"supplier"} checked={true} onchange={OnFilterInput} />
        {/each}
    </div>

    <div class="driver_options filter-group">
        <h2>Driver</h2>
        {#each options['driver_options'] as option }
            <CheckBoxInput value={option.value} label={option.label} id={"driver_options"+option} name={"driver"} checked={true} onchange={OnFilterInput} />
        {/each}
    </div>


    <div class="vehicle_options filter-group">
        <h2>Vehicle</h2>
        {#each options['vehicle_options'] as option }
            <CheckBoxInput value={option.value} label={option.label} id={"vehicle_options"+option} name={"vehicle"} checked={true} onchange={OnFilterInput} />
        {/each}
    </div>
</div>
<Button onClick={HandleClick}>Filter</Button>
</Card>

<Card size="lg" style="margin-top: 1rem !important; margin-bottom: 1rem !important;" classes="info">
    <div class="contain">
    {#if data.data == undefined || data.data.data.length == 0}
        <p>No data</p>
    {:else}
        <div class="export">
            <Button onClick={PDFButton}>PDF</Button>
            <Button onClick={CSVButton}>CSV</Button>
        </div>

        <Table id="report_table" data={data?.data?.data} />

        <div class="export">
            <Button onClick={PDFButton}>PDF</Button>
            <Button onClick={CSVButton}>CSV</Button>
        </div>
    {/if}
    </div>
    
</Card>

<style>
    .contain {
        width: 100%;
        overflow-x: auto;
    }

    .filter-group {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        border: 1px solid #ccc;
        padding: 1rem;

        max-height: 300px;
        overflow-y: auto;

        /* h2 sticky */
        & h2 {
            position: sticky;
            top: 0;
            background-color: white;
            z-index: 1;
        }
    }

    .grid {
        /* grid with 2 column */
        display: grid;
        grid-template-columns: 1fr 1fr;
        column-gap: 1rem;
        row-gap: 0.7rem;

    }
</style>