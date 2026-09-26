<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import * as Field from '$lib/components/ui/field/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import { insertProductType, updateProductType } from '$lib/remote/productType.remote';
	import { untrack } from 'svelte';
	import { toast } from 'svelte-sonner';
	import type { productsProducttype } from '$lib/server/schema';

	interface Props {
		productType?: typeof productsProducttype.$inferSelect | null;
		submited?: (data: unknown) => void;
		cancel?: () => void;
	}

	let { productType = { code: '', name: '' }, submited, cancel }: Props = $props();

	let editForm = $derived(updateProductType.for(productType?.code ?? ''));
	let formFunction = $derived(productType?.code ? editForm : insertProductType);
	const fieldId = $props.id();

	$effect(() => {
		if (!productType) return;
		const { code, name } = productType;
		const currentForm = formFunction;
		untrack(() => currentForm.fields.set({ code, name }));
	});

	const successMessage = $derived(
		productType?.code ? 'Product type updated successfully!' : 'Product type created successfully!'
	);
	const fieldLegend = $derived(productType?.code ? 'Update Product Type' : 'Create Product Type');
</script>

<form
	{...formFunction.enhance(async (form) => {
		try {
			if (await form.submit()) {
				form.element.reset();
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
	<Field.Group class="gap-2">
		<Field.Legend>{fieldLegend}</Field.Legend>
		<Field.Field class="grid grid-cols-8 gap-2">
			<Field.Label for={`${fieldId}-code`}>Code</Field.Label>
			<Input
				id={`${fieldId}-code`}
				autocomplete="off"
				readonly={Boolean(productType?.code)}
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
		<Field.Field orientation="responsive">
			<Button type="submit">Submit</Button>
			<Button type="button" variant="outline" onclick={cancel}>Cancel</Button>
		</Field.Field>
	</Field.Group>
</form>
