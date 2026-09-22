<!--
DataTableGeneric.svelte is a generic data table component that can be used to display any type of data in a tabular format.
It supports pagination, sorting, and searching.
The component is designed to be flexible and reusable, allowing developers to easily integrate it into their Svelte applications.

Example Usage
<script lang="ts">
	import DataTableGeneric from '$lib/components/DataTableGeneric.svelte'
	import { createPaginationState } from '$lib/helper';
	import { getBranches } from '$lib/remote/branch.remote';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { branches } from '$lib/server/schema';

	// get the type of the columns from the schema
	type columns = keyof typeof branches.$inferSelect

	// Define column definitions, add in the actions column for the action buttons if needed
	let columns: { key: columns | 'actions', label: string, sortable: boolean, action?: boolean }[] = [
		{ key: 'name', label: 'Branch Name', sortable: true },
		{ key: 'code', label: 'Branch Code', sortable: true },
		{ key: 'actions', label: 'Actions', sortable: false }
	]

	// Create a pagination state using createPaginationState with the type of the columns
	let paginationState = $state(createPaginationState<columns>())
	// Fetch the data using the getBranches function and the pagination state
	let result = $derived(await getBranches(paginationState))
</script>

<DataTableGeneric {result} {paginationState} {columns}>
    {#snippet action(label, item, key)}
        <Button
            variant={"outline"}
            size={"sm"}
            onclick={() => alert(`Edit item ${item.id}`)}
        >
            Edit
        </Button>
    {/snippet}
</DataTableGeneric>
-->
<script lang="ts" module>
	import type { PgTable } from 'drizzle-orm/pg-core';
	import type { InferSelectModel } from 'drizzle-orm';

	export type ColumnDef<T extends PgTable> = {
		key: string;
		label: string;
		sortable: boolean;
		action?: boolean;
		value?: (item: InferSelectModel<T>) => any;
	};
</script>

<script lang="ts" generics="T extends PgTable, K extends string[]">
	import * as Table from '$lib/components/ui/table';
	import { Button } from './ui/button';
	import ArrowUpIcon from '@lucide/svelte/icons/arrow-up';
	import Input from '$lib/components/ui/input/input.svelte';
	import * as Card from '$lib/components/ui/card/index.js';

	import type { PaginateResult, PaginationState } from '$lib/helper/pagination';
	import type { Snippet } from 'svelte';

	interface Props {
		result: PaginateResult<T>;
		paginationState: PaginationState<K[number]>;
		columns: ColumnDef<T>[];
		filters?: Snippet<[paginationState: PaginationState<K[number]>]>;
		action: Snippet<[label: string, item: InferSelectModel<T>, key: K[number]]>;
	}

	let {
		result,
		paginationState = $bindable<PaginationState<K[number]>>(),
		columns,
		filters,
		action
	}: Props = $props();

	let setOrder = (column: K[number]) => {
		if (paginationState.orderBy === column) {
			paginationState.orderDir = paginationState.orderDir === 'asc' ? 'desc' : 'asc';
		} else {
			paginationState.orderBy = column;
			paginationState.orderDir = 'asc';
		}
	};
</script>

<Card.Root class="gap-1 rounded-md p-2 shadow-none">
	<Card.Header class="p-2">
		<div class="flex items-center gap-2">
			<Input placeholder="Search branches..." bind:value={paginationState.search} class="w-2xs" />
			{@render filters?.(paginationState)}
			<Button
				variant="destructive"
				onclick={() => (paginationState.search = '')}
				disabled={paginationState.search === '' || paginationState.search === undefined}
				>Clear</Button
			>
		</div>
	</Card.Header>
	<Card.Content class="p-2">
		<Table.Root>
			<Table.Header>
				<Table.Row>
					{#each columns as column}
						<Table.Head class="w-max-25">
							<Button
								class="w-full justify-start"
								variant={'ghost'}
								onclick={async () => {
									console.log(`clicked button "${column.key}"`);
									if (column.sortable) {
										setOrder(column.key as K[number]);
									}
								}}
							>
								{column.label}
								{#if column.sortable && paginationState.orderBy === column.key && paginationState.orderDir === 'asc'}
									<ArrowUpIcon class="ml-2 h-4 w-4" />
								{:else if column.sortable && paginationState.orderBy === column.key && paginationState.orderDir === 'desc'}
									<ArrowUpIcon class="ml-2 h-4 w-4 rotate-180" />
								{/if}
							</Button>
						</Table.Head>
					{/each}
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each result.items as item}
					<Table.Row>
						{#each columns as column}
							<Table.Cell>
								{#if column.action}
									{@render action(column.label, item, column.key)}
								{:else if column.value}
									{column.value(item)}
								{:else}
									{item[column.key]}
								{/if}
							</Table.Cell>
						{/each}
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</Card.Content>
	<Card.Footer>
		<div class="flex w-full items-center justify-between">
			<p class="text-sm text-muted-foreground">
				Showing {result.items.length} of {result.total} results
			</p>
			<div class="flex gap-2">
				<Button
					variant={'outline'}
					size={'sm'}
					disabled={paginationState.page <= 1}
					onclick={() => (paginationState.page = paginationState.page - 1)}
				>
					Previous
				</Button>
				<Button
					variant={'outline'}
					size={'sm'}
					disabled={paginationState.page >= Math.ceil(result.total / paginationState.limit)}
					onclick={() => (paginationState.page = paginationState.page + 1)}
				>
					Next
				</Button>
			</div>
		</div>
	</Card.Footer>
</Card.Root>
