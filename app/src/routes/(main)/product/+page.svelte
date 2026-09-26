<script lang="ts">
	import DataTableGeneric from '$lib/components/DataTableGeneric.svelte';
	import { createPaginationState } from '$lib/helper';
	import { deleteProduct, getProducts } from '$lib/remote/product.remote';
	import { buttonVariants } from '$lib/components/ui/button';
	import MoreHorizontal from '@lucide/svelte/icons/more-horizontal';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { toast } from 'svelte-sonner';
	import type { productsProduct } from '$lib/server/schema';
	import ProductForm from './ProductForm.svelte';

	type Columns = keyof typeof productsProduct.$inferSelect;
	let columns: { key: Columns | 'actions'; label: string; sortable: boolean; action?: boolean }[] =
		[
			{ key: 'code', label: 'Code', sortable: true },
			{ key: 'name', label: 'Name', sortable: true },
			{ key: 'price', label: 'Price', sortable: true },
			{ key: 'typeId', label: 'Product Type', sortable: true },
			{ key: 'actions', label: 'Actions', sortable: false, action: true }
		];
	let paginationState = $state(createPaginationState<Columns>());
	let result = $derived(await getProducts(paginationState));
	let editProduct: typeof productsProduct.$inferSelect | null = $state(null);
	let deleteTarget: typeof productsProduct.$inferSelect | null = $state(null);
	let deleting = $state(false);

	async function handleDelete() {
		if (!deleteTarget) return;
		deleting = true;
		try {
			await deleteProduct(deleteTarget.id);
			toast.success('Product deleted successfully!');
			getProducts(paginationState).refresh();
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

<svelte:head><title>Products</title></svelte:head>
<h1>Products</h1>
<Card.Root class="rounded-md"
	><Card.Content
		><ProductForm submited={() => getProducts(paginationState).refresh()} /></Card.Content
	></Card.Root
>
<DataTableGeneric {result} bind:paginationState {columns}>
	{#snippet action(label, item, key)}
		<DropdownMenu.Root>
			<DropdownMenu.Trigger class={buttonVariants({ variant: 'outline', size: 'icon-sm' })}
				><MoreHorizontal /></DropdownMenu.Trigger
			>
			<DropdownMenu.Content class="w-40" align="end"
				><DropdownMenu.Group>
					<DropdownMenu.Item onSelect={() => (editProduct = item)}>Edit</DropdownMenu.Item>
					<DropdownMenu.Item variant="destructive" onSelect={() => (deleteTarget = item)}
						>Delete</DropdownMenu.Item
					>
				</DropdownMenu.Group></DropdownMenu.Content
			>
		</DropdownMenu.Root>
	{/snippet}
</DataTableGeneric>
{#if editProduct}
	<Dialog.Root
		open={editProduct != null}
		onOpenChange={(open) => {
			if (!open) editProduct = null;
		}}
	>
		<Dialog.Content class="rounded-md sm:max-w-2xl">
			{#key editProduct.id}
				<ProductForm
					product={editProduct}
					cancel={() => (editProduct = null)}
					submited={() => {
						getProducts(paginationState).refresh();
						editProduct = null;
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
	<AlertDialog.Content
		><AlertDialog.Header
			><AlertDialog.Title>Delete product?</AlertDialog.Title><AlertDialog.Description
				>This will permanently delete product "{deleteTarget?.name}". This action cannot be undone.</AlertDialog.Description
			></AlertDialog.Header
		><AlertDialog.Footer>
			<AlertDialog.Cancel disabled={deleting}>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action
				variant="destructive"
				disabled={deleting}
				onclick={(event) => {
					event.preventDefault();
					handleDelete();
				}}>Delete</AlertDialog.Action
			>
		</AlertDialog.Footer></AlertDialog.Content
	>
</AlertDialog.Root>
