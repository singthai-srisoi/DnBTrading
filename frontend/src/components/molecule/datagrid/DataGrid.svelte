<script lang="ts">
	import Table from "./datatable/Table.svelte"
	import Modal from "../Modal.svelte"
	import Button from "$components/atoms/Button.svelte"
	import TextInput from "../inputs/TextInput.svelte"
	import { onMount } from "svelte"
	import Card from "../Card.svelte"

    export let data: {[k:string]:any}
    export let columns: DataGrid.column[]
    export let dataKey: string = "results"
    export let actionCol: boolean = false
    export let edit: {[key:string]:any} = {}
    export let del: {[key:string]:any} = {}
    export let backendUrl: string = ""
    export let search: string = ""

    let baseUrl = ""
    onMount(() => {
        baseUrl = window.location.origin
    })

    let searchForm: HTMLFormElement | null = null


    let IsEditEmpty = false
    let IsDelEmpty = false

    let prev = async () => {
        const url = new URL(data["previous"])
        await load(url.pathname+url.search)
    }
    let next = async () => {
        const url = new URL(data["next"])
        await load(url.pathname+url.search)
    }

    async function load(nextUrl: string) {
        const res = await fetch(`${baseUrl}/api/GetGridData`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({pathname: nextUrl})
        })
        data = await res.json()
    }

    async function searchLoad(e: Event) {
        e.preventDefault()
        if (!searchForm) return

        // check button type
        const button = e.target as HTMLButtonElement
        if (button.type === "button") {
            search = ""
        }

        const formData = new FormData(searchForm)
        const obj = Object.fromEntries(formData.entries())
        const param = Object.keys(obj).map(key => key + "=" + obj[key]).join("&")
        const pathname = `${backendUrl}?${param}`

        const res = await fetch(`${baseUrl}/api/GetGridData`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({pathname})
        })
        data = await res.json()
    }

    function emptyEdit() {
        edit = {}
    }

    function emptyDel() {
        del = {}
    }

    let currPage = 1

    // $: console.log({IsEditEmpty})
    $: IsEditEmpty = JSON.stringify(edit) === "{}"
    $: IsDelEmpty = JSON.stringify(del) === "{}"
    $: if (data["next"] && !data["previous"]) {
        currPage = 1
    } else if (data["next"] && data["previous"]) {
        currPage = Number(new URL(data["next"]).searchParams.get("page")) - 1
    } else if (!data["next"] && data["previous"]) {
        currPage = Math.ceil(Number(data["count"]) / 10)
    }

</script>

<Card size="lg" style="margin-top: 1rem !important; margin-bottom: 1rem !important;" classes="info">
<div class="datagrid">
    <div class="head">
        <form bind:this={searchForm}>
            <slot name="searchForm" {search} />
            <TextInput name="search" label="Search" id="search_input" bind:value={search} />
            <Button classes="success" type="submit" onClick={searchLoad}>Search</Button>
            <Button classes="warning" type="button" onClick={searchLoad}>Reset</Button>
        </form>
    </div>
    {#if data[dataKey]?.length > 0}    
    
    <div class="table">
        <Table {columns} data={data[dataKey]} {actionCol} bind:edit={edit} bind:del={del}  />
    </div>
    

    <div class="foot">
        <div class="info">
            <p>Page [{currPage}] of {Math.ceil(Number(data["count"]) / 10)} pages</p>

        </div>
        <div class="pagination">
            <ul>
                {#if data["previous"]}
                    <li>
                        <Button classes="success" onClick={prev}>prev</Button>
                    </li>
                {/if}
                {#if data["next"]}
                    <li>
                        <Button classes="success" onClick={next}>next</Button>
                    </li>
                {/if}
            </ul>
        </div>
    </div>
    {:else}
    <p>No data</p>
    {/if}
</div>
</Card>

{#if !IsEditEmpty}
<Modal showModal={!IsEditEmpty} on:close={emptyEdit}>
    <slot name="editForm" {edit} {emptyEdit} />
</Modal>
{/if}
{#if !IsDelEmpty}
<Modal showModal={!IsDelEmpty} on:close={emptyDel}>
    <slot name="deleteForm" {del} {emptyDel} />
</Modal>
{/if}




<style>
.datagrid {
    /* margin-top: 6px !important;
    margin-bottom: 6px !important;
    max-width: 100%;
    border: 1px solid #d1d1d1;
    background-color: white;
    width: 100%;

    overflow-y: scroll;

    padding: 1.5rem; */

    overflow: auto;
}

.foot {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;

    & .pagination {
        & ul {
            display: flex;
            list-style: none;
            padding: 0;
            margin: 0;

            & li {
                margin: 0 0.5rem;
            }
        }
    }
}
.head form {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 0;
    gap: 0.3rem;
}

.table {
    max-width: 100%;
    width: 100%;
    overflow: auto;
}
</style>
