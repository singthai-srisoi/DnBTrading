<script lang="ts">
	import Button from "$components/atoms/Button.svelte"
	import Card from "$components/molecule/Card.svelte"
	import DateInputAd from "$components/molecule/inputs/DateInputAd.svelte"
	import SelectInputAd from "$components/molecule/inputs/SelectInputAd.svelte"
	import { onMount } from "svelte"
	import type { PageData } from "./$types"
	import TextInput from "$components/molecule/inputs/TextInput.svelte"

	export let data: PageData
	let baseUrl = ""
    onMount(async () => { baseUrl = window.location.origin })

	let schema = data.schema
	let choices = schema.grouping.map((group: string) => ({ value: group, label: group }))

	let search_data = JSON.parse(JSON.stringify(data.data))
	async function ButtonClick() {
		let res = await fetch(`${baseUrl}/api/GetHomeDashboard`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(schema)
		})
		let data_ = await res.json()
		data.data = data_
		search_data = JSON.parse(JSON.stringify(data.data))
	}

	let search = ""

	async function Searching(e: Event) {
		let target = e.target as HTMLInputElement
		let val = target.value

		let searched = data.data.data.filter((item: any) => {
			let values = Object.values(item).join(" ").toLowerCase()
			let searchKey = val.toLowerCase()
			let includes = values.includes(searchKey)
			return includes
		})

		console.log(searched)
		await AsignData(searched)

		// if (val.length > 0) {
		// 	await AsignData(searched)
		// } else {
		// 	console.log('set default',data.data.data)
		// 	await AsignData(data.data.data)
		// }
	}

	async function AsignData(searched: {[k:string]:any}[]) {
		search_data.data = searched
	}

	$: if (schema.group_by) search_data.data = []

</script>

<svelte:head>
    <title>Home</title>
</svelte:head>

<h1>Home</h1>
<Card size="lg" classes="success">
	<SelectInputAd {choices} label="Grouping" name="grouping" id="home_page_grouping" bind:actual_value={schema.group_by} />
	<div class="flex">
		<DateInputAd label="Start Date" name="start_date" id="home_page_start_date" bind:value={schema.start_date} />
		<DateInputAd label="End Date" name="end_date" id="home_page_end_date" bind:value={schema.end_date} />
	</div>
	<Button onClick={ButtonClick} classes="success">Filter</Button>
</Card>
<div class="margin"></div>
<Card size="lg" classes="warning">
<div class="search">
	<TextInput label="Search" name="search" id="home_page_search" bind:value={search} onInput={Searching} />
	<Button classes="warning" onClick={() => {search = ""}}>Reset</Button>
</div>
{#if search_data.data && search_data.data.length > 0}
<div class="grid">
	{#each search_data.data as item}
	<Card size="free" classes="info">
		<div class="group">
			<h2>{item[schema.group_by] == "" ? "(Empty)" : item[schema.group_by]}</h2>
			<hr />
			<table>
					<tr>
						<th>Total Nett</th>
						<td>{item["nett"]}</td>
					</tr>
			</table>
		</div>
	</Card>
	
	{/each}
</div>
{/if}
</Card>

<style>
.flex {
	width: 100%;
	display: flex;
	gap: 0.3rem;
}

.margin {
	margin-top: 1rem;
}

.grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
	gap: 1rem;
}

.group {
	display: flex;
	flex-direction: column;
    /* border: 1px solid #ccc;

	padding: 0.75rem; */

	& table {
		width: 100%;
		border-collapse: collapse;

		& th, td {
			padding: 0.5rem;
			text-align: left;
		}

	}
}

.search {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 0;
    gap: 0.3rem;
}
</style>