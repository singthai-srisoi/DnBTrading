<script lang="ts">
	import DataTableGeneric from '$lib/components/DataTableGeneric.svelte';
	import { createPaginationState } from '$lib/helper';
	import { deleteVehicle, getVehicles } from '$lib/remote/vehicle.remote';
	import { buttonVariants } from '$lib/components/ui/button';
	import MoreHorizontal from '@lucide/svelte/icons/more-horizontal';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { toast } from 'svelte-sonner';
	import type { vehiclesVehicle } from '$lib/server/schema';
	import VehicleForm from './VehicleForm.svelte';

	type Columns = keyof typeof vehiclesVehicle.$inferSelect;

	let columns: { key: Columns | 'actions'; label: string; sortable: boolean; action?: boolean }[] =
		[
			{ key: 'regNo', label: 'Registration No.', sortable: true },
			{ key: 'model', label: 'Model', sortable: true },
			{ key: 'actions', label: 'Actions', sortable: false, action: true }
		];

	let paginationState = $state(createPaginationState<Columns>());
	let result = $derived(await getVehicles(paginationState));

	let editVehicle: typeof vehiclesVehicle.$inferSelect | null = $state(null);
	let deleteTarget: typeof vehiclesVehicle.$inferSelect | null = $state(null);
	let deleting = $state(false);

	async function handleDelete() {
		if (!deleteTarget) return;

		deleting = true;
		try {
			await deleteVehicle(deleteTarget.id);
			toast.success('Vehicle deleted successfully!');
			getVehicles(paginationState).refresh();
			deleteTarget = null;
		} catch (error) {
			toast.error(
				'Oh no! Something went wrong' + (error instanceof Error ? `: ${error.message}` : '')
			);
		} finally {
			deleting = false;
		}
	}
</script>

<svelte:head>
	<title>Vehicles</title>
</svelte:head>

<h1>Vehicles</h1>

<Card.Root class="rounded-md">
	<Card.Content>
		<VehicleForm
			submited={() => {
				getVehicles(paginationState).refresh();
			}}
		/>
	</Card.Content>
</Card.Root>

<DataTableGeneric {result} bind:paginationState {columns}>
	{#snippet action(label, item, key)}
		<DropdownMenu.Root>
			<DropdownMenu.Trigger class={buttonVariants({ variant: 'outline', size: 'icon-sm' })}>
				<MoreHorizontal />
			</DropdownMenu.Trigger>
			<DropdownMenu.Content class="w-40" align="end">
				<DropdownMenu.Group>
					<DropdownMenu.Item onSelect={() => (editVehicle = item)}>Edit</DropdownMenu.Item>
					<DropdownMenu.Item variant="destructive" onSelect={() => (deleteTarget = item)}>
						Delete
					</DropdownMenu.Item>
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	{/snippet}
</DataTableGeneric>

{#if editVehicle}
	<Dialog.Root
		open={editVehicle != null}
		onOpenChange={(open) => {
			if (!open) editVehicle = null;
		}}
	>
		<Dialog.Content class="rounded-md sm:max-w-2xl">
			{#key editVehicle.id}
				<VehicleForm
					vehicle={editVehicle}
					cancel={() => (editVehicle = null)}
					submited={() => {
						getVehicles(paginationState).refresh();
						editVehicle = null;
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
</AlertDialog.Root>
