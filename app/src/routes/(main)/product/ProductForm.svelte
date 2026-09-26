<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import * as Field from '$lib/components/ui/field/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import { insertProduct, updateProduct } from '$lib/remote/product.remote';
	import { listProductTypeOptions } from '$lib/remote/productType.remote';
	import { untrack } from 'svelte';
	import { toast } from 'svelte-sonner';
	import type { productsProduct } from '$lib/server/schema';
	import ComboBox from '$lib/components/ComboBox.svelte';
	import { value } from 'valibot';

	interface Props {
		product?: typeof productsProduct.$inferSelect | null;
		submited?: (data: unknown) => void;
		cancel?: () => void;
	}

	let {
		product = { id: 0, code: '', name: '', price: 0, typeId: '' },
		submited,
		cancel
	}: Props = $props();

	const productTypes = $derived(await listProductTypeOptions());
	let editForm = $derived(updateProduct.for(product?.id ?? 0));
	let formFunction = $derived(product?.id ? editForm : insertProduct);
	const fieldId = $props.id();

	let productTypeId_ = $state();
	let productTypeOptionsQuery = async () => {
		let branches = await listProductTypeOptions();
		let options = branches.map((branch) => ({
			value: branch.code,
			label: `${branch.code} ${branch.name}`
		}));
		return [
			{
				value: '',
				label: 'Select product type...'
			},
			...options
		];
	};
	let productTypeOptions = $derived(await productTypeOptionsQuery());

	$effect(() => {
		if (!product) return;
		const { id, code, name, price, typeId } = product;
		const currentForm = formFunction;
		untrack(() =>
			currentForm.fields.set({ ...(id ? { id } : {}), code, name, price, typeId: typeId ?? '' })
		);
		productTypeId_ = typeId ?? undefined;
	});

	const successMessage = $derived(
		product?.id ? 'Product updated successfully!' : 'Product created successfully!'
	);
	const fieldLegend = $derived(product?.id ? 'Update Product' : 'Create Product');
</script>

<form
	{...formFunction.enhance(async (form) => {
		try {
			if (await form.submit()) {
				form.element.reset();
				productTypeId_ = undefined;
				submited?.(form);
				toast.success(successMessage);
			} else {
				toast.error('Invalid data!');
			}
		} catch (error) {
			toast.error(
				'Oh no! Something went wrong' + (error instanceof Error ? `: ${error.message}` : '')
			);
		}
	})}
>
	{#if product?.id}
		<input {...editForm.fields.id.as('hidden', product.id)} />
	{/if}

	<Field.Group class="gap-2">
		<Field.Legend>{fieldLegend}</Field.Legend>
		<Field.Field class="grid grid-cols-8 gap-2">
			<Field.Label for={`${fieldId}-code`}>Code</Field.Label>
			<Input
				id={`${fieldId}-code`}
				autocomplete="off"
				{...formFunction.fields.code.as('text')}
				placeholder="Enter code"
				class="col-span-7"
			/>
			{#each formFunction.fields.code.issues() as issue}
				<Field.Error>{issue.message}</Field.Error>
			{/each}
		</Field.Field>
		<Field.Field class="grid grid-cols-8 gap-2">
			<Field.Label for={`${fieldId}-name`}>Name</Field.Label>
			<Input
				id={`${fieldId}-name`}
				autocomplete="off"
				{...formFunction.fields.name.as('text')}
				placeholder="Enter name"
				class="col-span-7"
			/>
			{#each formFunction.fields.name.issues() as issue}
				<Field.Error>{issue.message}</Field.Error>
			{/each}
		</Field.Field>
		<Field.Field class="grid grid-cols-8 gap-2">
			<Field.Label for={`${fieldId}-price`}>Price</Field.Label>
			<Input
				id={`${fieldId}-price`}
				min="0"
				{...formFunction.fields.price.as('number')}
				placeholder="Enter price"
				class="col-span-7"
			/>
			{#each formFunction.fields.price.issues() as issue}
				<Field.Error>{issue.message}</Field.Error>
			{/each}
		</Field.Field>
		<Field.Field class="grid grid-cols-6 gap-2">
			<Field.Label for={`${fieldId}-expensesItemId`}>Expense Item</Field.Label>
			<input {...formFunction.fields.typeId.as('text')} value={productTypeId_ ?? ''} hidden />
			<ComboBox
				choices={productTypeOptions}
				bind:value={productTypeId_}
				placeholder="Select expense item..."
				class="col-span-5"
			/>
			{#each formFunction.fields.typeId.issues() as issue}
				<Field.Error>{issue.message}</Field.Error>
			{/each}
		</Field.Field>
		<Field.Field orientation="responsive">
			<Button type="submit">Submit</Button>
			<Button type="button" variant="outline" onclick={cancel}>Cancel</Button>
		</Field.Field>
	</Field.Group>
</form>
