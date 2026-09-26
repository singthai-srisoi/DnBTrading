<script lang="ts">
	import DataTableGeneric from '$lib/components/DataTableGeneric.svelte';
	import { createPaginationState } from '$lib/helper';
	import { deleteInventory, getInventories } from '$lib/remote/inventory.remote';
	import MoreHorizontal from '@lucide/svelte/icons/more-horizontal';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { getLocalTimeZone, today, CalendarDate } from '@internationalized/date';
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import { RangeCalendar } from '$lib/components/ui/range-calendar/index.js';
	import type { ColumnDef } from '$lib/components/DataTableGeneric.svelte';

	import { toast } from 'svelte-sonner';
	import type { inventoriesInventory } from '$lib/server/schema';
	// import VehicleForm from './VehicleForm.svelte';

	type Columns = keyof typeof inventoriesInventory.$inferSelect;
	// Date	Vehicle	Driver	Supplier	Customer Ticket No	Supplier Qty	Customer	Product	Ticket No	DO	Weight In	Weight Out	Factory Nett	Nett	Deduction	Bucket	Remark	Unit
	// let columns: { key: Columns | 'actions'; label: string; sortable: boolean; action?: boolean }[] =
	let columns: ColumnDef<typeof inventoriesInventory>[] = [
		{ key: 'date', label: 'Date', sortable: true },
		{
			key: 'vehicleId',
			label: 'Vehicle',
			sortable: true,
			value: (item: any) => (item.vehicleRegNo ? `${item.vehicleRegNo}` : '-')
		},
		{ key: 'driverId', label: 'Driver', sortable: true, value: (item: any) => (item.driverName ? `${item.driverName}` : '-') },
		{ key: 'supplierId', label: 'Supplier', sortable: true, value: (item: any) => (item.supplierName ? `${item.supplierName}` : '-') },
		{ key: 'customerTicketNo', label: 'Customer Ticket No', sortable: true },
		{ key: 'supplierQty', label: 'Supplier Qty', sortable: true },
		{ key: 'customerId', label: 'Customer', sortable: true, value: (item: any) => (item.customerName ? `${item.customerName}` : '-') },
		{ key: 'productId', label: 'Product', sortable: true },
		{ key: 'ticketNo', label: 'Ticket No', sortable: true },
		{ key: 'do', label: 'DO', sortable: true },
		{ key: 'weightIn', label: 'Weight In', sortable: true },
		{ key: 'weightOut', label: 'Weight Out', sortable: true },
		{ key: 'factoryNett', label: 'Factory Nett', sortable: true },
		{ key: 'nett', label: 'Nett', sortable: true },
		{ key: 'deduction', label: 'Deduction', sortable: true },
		{ key: 'bucket', label: 'Bucket', sortable: true },
		{ key: 'remark', label: 'Remark', sortable: true },
		{ key: 'unit', label: 'Unit', sortable: true },
		{ key: 'actions', label: 'Actions', sortable: false, action: true }
	];
	let firstDayOfThisMonth = new CalendarDate(
		today(getLocalTimeZone()).year,
		today(getLocalTimeZone()).month,
		1
	);
	let paginationState = $state(
		createPaginationState<Columns>(
			{},
			{
				startDate: firstDayOfThisMonth.toString(),
				endDate: today(getLocalTimeZone()).toString()
			}
		)
	);
	let result = $derived(await getInventories(paginationState));

	let editInventory: typeof inventoriesInventory.$inferSelect | null = $state(null);
	let deleteTarget: typeof inventoriesInventory.$inferSelect | null = $state(null);
	let deleting = $state(false);

	async function handleDelete() {
		if (!deleteTarget) return;

		deleting = true;
		try {
			await deleteInventory(deleteTarget.id);
			toast.success('Vehicle deleted successfully!');
			getInventories(paginationState).refresh();
			deleteTarget = null;
		} catch (error) {
			toast.error(
				'Oh no! Something went wrong' + (error instanceof Error ? `: ${error.message}` : '')
			);
		} finally {
			deleting = false;
		}
	}

	let dateRangeOpen = $state(false);
	let dateRange = $state({
		// CalendarDate from  paginationState
		start: firstDayOfThisMonth,
		end: today(getLocalTimeZone())
	});
</script>

<svelte:head>
	<title>Vehicles</title>
</svelte:head>

<h1>Vehicles</h1>

<!-- <Card.Root class="rounded-md">
	<Card.Content>
		<VehicleForm
			submited={() => {
				getVehicles(paginationState).refresh();
			}}
		/>
	</Card.Content>
</Card.Root> -->

<DataTableGeneric {result} bind:paginationState {columns}>
	{#snippet filters(paginationState)}
		<Popover.Root bind:open={dateRangeOpen}>
			<Popover.Trigger id="start-date">
				{#snippet child({ props })}
					<Button {...props} variant="outline" class="w-48 justify-between font-normal">
						{dateRange.start?.toDate(getLocalTimeZone()).toLocaleDateString()} - {dateRange.end
							?.toDate(getLocalTimeZone())
							.toLocaleDateString()}
						<ChevronDownIcon />
					</Button>
				{/snippet}
			</Popover.Trigger>
			<Popover.Content class="w-auto overflow-hidden p-0" align="start">
				<RangeCalendar
					bind:value={dateRange}
					captionLayout="dropdown"
					class="rounded-md border"
					onValueChange={(e) => {
						if (!e.start || !e.end) return;
						paginationState.startDate = e.start.toString();
						paginationState.endDate = e.end.toString();
						dateRangeOpen = false;
					}}
					maxValue={today(getLocalTimeZone())}
				/>
			</Popover.Content>
		</Popover.Root>
	{/snippet}
	{#snippet action(label, item, key)}
		<DropdownMenu.Root>
			<DropdownMenu.Trigger class={buttonVariants({ variant: 'outline', size: 'icon-sm' })}>
				<MoreHorizontal />
			</DropdownMenu.Trigger>
			<DropdownMenu.Content class="w-40" align="end">
				<DropdownMenu.Group>
					<DropdownMenu.Item onSelect={() => (editInventory = item)}>Edit</DropdownMenu.Item>
					<DropdownMenu.Item variant="destructive" onSelect={() => (deleteTarget = item)}>
						Delete
					</DropdownMenu.Item>
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	{/snippet}
</DataTableGeneric>

<!-- {#if editInventory}
	<Dialog.Root
		open={editInventory != null}
		onOpenChange={(open) => {
			if (!open) editInventory = null;
		}}
	>
		<Dialog.Content class="rounded-md sm:max-w-2xl">
			{#key editInventory.id}
				<VehicleForm
					vehicle={editInventory}
					cancel={() => (editInventory = null)}
					submited={() => {
						getVehicles(paginationState).refresh();
						editInventory = null;
					}}
				/>
			{/key}
		</Dialog.Content>
	</Dialog.Root>
{/if}

<AlertDialog.Root
	open={deleteTarget != null}
	onOpenChange={(open) => {
		if (!open) deleteTarget = null;
	}}
>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Delete vehicle?</AlertDialog.Title>
			<AlertDialog.Description>
				This will permanently delete vehicle "{deleteTarget?.regNo}". This action cannot be undone.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel disabled={deleting}>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action
				variant="destructive"
				disabled={deleting}
				onclick={(event) => {
					event.preventDefault();
					handleDelete();
				}}
			>
				Delete
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root> -->
