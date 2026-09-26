<script lang="ts">
	import DataTableGeneric from '$lib/components/DataTableGeneric.svelte';
	import { createPaginationState } from '$lib/helper';
	import { getPerson, deletePerson } from '$lib/remote/person.remote';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import MoreHorizontal from '@lucide/svelte/icons/more-horizontal';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import type { personPerson } from '$lib/server/schema';
	// import BranchInsertForm from './BranchInsertForm.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { toast } from 'svelte-sonner';
	import PersonForm from '../PersonForm.svelte';

	type columns = keyof typeof personPerson.$inferSelect;

	// Define column definitions
	let columns: { key: columns | 'actions'; label: string; sortable: boolean; action?: boolean }[] =
		[
			{ key: 'code', label: 'Code', sortable: true },
			{ key: 'name', label: 'Name', sortable: true },
			{ key: 'phone', label: 'Phone', sortable: true },
			{ key: 'ic', label: 'IC', sortable: true },
			{ key: 'type', label: 'Type', sortable: true },
			{ key: 'actions', label: 'Actions', sortable: false, action: true }
		];

	let paginationState = $state(
		createPaginationState<columns, { type: 'customer' | 'driver' | 'supplier' }>(
			{},
			{ type: 'customer' }
		)
	);
	let result = $derived(await getPerson(paginationState));

	let editPerson: typeof personPerson.$inferSelect | null = $state(null);
	let deleteTarget: typeof personPerson.$inferSelect | null = $state(null);
	let deleting = $state(false);

	async function handleDelete() {
		if (!deleteTarget) return;
		deleting = true;
		try {
			await deletePerson(deleteTarget.id);
			toast.success('Branch deleted successfully!');
			getPerson(paginationState).refresh();
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
	<title>Customer</title>
</svelte:head>

<h1>Customer</h1>

<Card.Root class="rounded-md">
	<Card.Content>
		<PersonForm
			type={paginationState.type}
			submited={() => {
				getPerson(paginationState).refresh();
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
				<!-- <DropdownMenu.Label>Actions</DropdownMenu.Label> -->
				<DropdownMenu.Group>
					<DropdownMenu.Item onSelect={() => (editPerson = item)}>Edit</DropdownMenu.Item>
					<DropdownMenu.Item variant="destructive" onSelect={() => (deleteTarget = item)}>
						Delete
					</DropdownMenu.Item>
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	{/snippet}
</DataTableGeneric>

{#if editPerson}
	<Dialog.Root
		open={editPerson != null}
		onOpenChange={(open) => {
			if (!open) editPerson = null;
		}}
	>
		<Dialog.Content class="rounded-md sm:max-w-2xl">
			{#key editPerson.id}
				<PersonForm
					type={paginationState.type}
					person={editPerson}
					cancel={() => (editPerson = null)}
					submited={() => {
						getPerson(paginationState).refresh();
						editPerson = null;
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
			<AlertDialog.Title>Delete branch?</AlertDialog.Title>
			<AlertDialog.Description>
				This will permanently delete branch "{deleteTarget?.name}". This action cannot be undone.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel disabled={deleting}>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action
				variant="destructive"
				disabled={deleting}
				onclick={(e) => {
					e.preventDefault();
					handleDelete();
				}}
			>
				Delete
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
