<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import * as Field from '$lib/components/ui/field/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import { insertPerson, updatePerson } from '$lib/remote/person.remote';
	import { untrack } from 'svelte';
	import { toast } from 'svelte-sonner';
	import type { personPerson } from '$lib/server/schema';

	interface Props {
		type: 'customer' | 'driver' | 'supplier';
		person?: typeof personPerson.$inferSelect;
		submited?: (data: any) => void;
		cancel?: () => void;
	}
	let {
		type,
		person = {
			id: 0,
			name: '',
			code: '',
			phone: '',
			ic: '',
			type: type
		},
		submited,
		cancel
	}: Props = $props();
	let editForm = $derived(updatePerson.for(person.id));
	let formFunction = $derived(person.id ? editForm : insertPerson);
	const fieldId = $props.id();

	$effect(() => {
		let { id, name, code, phone, ic } = person;
		phone = phone ?? '';
		ic = ic ?? '';
		const currentForm = formFunction;
		untrack(() => currentForm.fields.set({ ...(id ? { id } : {}), name, code, phone, ic, type }));
	});
	let successMessage = $derived(
		person && person.id ? `${type} updated successfully!` : `${type} created successfully!`
	);
	let fieldLegend = $derived(person && person.id ? `Update ${type}` : `Create ${type}`);
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
	{#if person && person.id}
		<input {...editForm.fields.id.as('hidden', person.id)} />
	{/if}
	<input {...formFunction.fields.type.as('hidden', type)} />
	<Field.Group class="gap-2">
		<Field.Legend>{fieldLegend}</Field.Legend>

		<Field.Field class="grid grid-cols-8 gap-2">
			<Field.Label for={`${fieldId}-code`}>Code</Field.Label>
			<Input
				id={`${fieldId}-code`}
				autocomplete="off"
				{...formFunction.fields.code.as('text')}
				placeholder="Enter Code"
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
				placeholder="Enter Name"
				class="col-span-7"
			/>
			{#each formFunction.fields.name.issues() as issue}
				<Field.Error>{issue.message}</Field.Error>
			{/each}
		</Field.Field>

		<Field.Field class="grid grid-cols-8 gap-2">
			<Field.Label for={`${fieldId}-phone`}>Phone</Field.Label>
			<Input
				id={`${fieldId}-phone`}
				autocomplete="off"
				{...formFunction.fields.phone.as('text')}
				placeholder="Enter Phone Number"
				class="col-span-7"
			/>
			{#each formFunction.fields.phone.issues() as issue}
				<Field.Error>{issue.message}</Field.Error>
			{/each}
		</Field.Field>

		<Field.Field class="grid grid-cols-8 gap-2">
			<Field.Label for={`${fieldId}-ic`}>IC</Field.Label>
			<Input
				id={`${fieldId}-ic`}
				autocomplete="off"
				{...formFunction.fields.ic.as('text')}
				placeholder="Enter IC Number"
				class="col-span-7"
			/>
			{#each formFunction.fields.ic.issues() as issue}
				<Field.Error>{issue.message}</Field.Error>
			{/each}
		</Field.Field>

		<!-- <Field.Separator /> -->
		<Field.Field orientation="responsive">
			<Button type="submit">Submit</Button>
			<Button type="button" variant="outline" onclick={cancel}>Cancel</Button>
		</Field.Field>
	</Field.Group>
</form>
