<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import * as Field from '$lib/components/ui/field/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import { insertVehicle, updateVehicle } from '$lib/remote/vehicle.remote';
	import { untrack } from 'svelte';
	import { toast } from 'svelte-sonner';
	import type { vehiclesVehicle } from '$lib/server/schema';

	interface Props {
		vehicle?: typeof vehiclesVehicle.$inferSelect | null;
		submited?: (data: unknown) => void;
		cancel?: () => void;
	}

	let {
		vehicle = {
			id: 0,
			regNo: '',
			model: ''
		},
		submited,
		cancel
	}: Props = $props();

	let editForm = $derived(updateVehicle.for(vehicle?.id ?? 0));
	let formFunction = $derived(vehicle?.id ? editForm : insertVehicle);
	const fieldId = $props.id();

	$effect(() => {
		if (!vehicle) return;

		const { id, regNo, model } = vehicle;
		const currentForm = formFunction;
		untrack(() => currentForm.fields.set({ ...(id ? { id } : {}), regNo, model }));
	});

	const successMessage = $derived(
		vehicle?.id ? 'Vehicle updated successfully!' : 'Vehicle created successfully!'
	);
	const fieldLegend = $derived(vehicle?.id ? 'Update Vehicle' : 'Create Vehicle');
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
				'Oh no! Something went wrong' + (error instanceof Error ? `: ${error.message}` : ''),
				{ duration: Infinity, closeButton: true }
			);
			console.log(error);
		}
	})}
>
	{#if vehicle && vehicle.id}
		<input {...editForm.fields.id.as('hidden', vehicle.id)} />
	{/if}

	<Field.Group class="gap-2">
		<Field.Legend>{fieldLegend}</Field.Legend>

		<Field.Field class="grid grid-cols-8 gap-2">
			<Field.Label for={`${fieldId}-reg-no`}>Registration No.</Field.Label>
			<Input
				id={`${fieldId}-reg-no`}
				autocomplete="off"
				{...formFunction.fields.regNo.as('text')}
				placeholder="Enter registration number"
				class="col-span-7"
			/>
			{#each formFunction.fields.regNo.issues() as issue}
				<Field.Error>{issue.message}</Field.Error>
			{/each}
		</Field.Field>

		<Field.Field class="grid grid-cols-8 gap-2">
			<Field.Label for={`${fieldId}-model`}>Model</Field.Label>
			<Input
				id={`${fieldId}-model`}
				autocomplete="off"
				{...formFunction.fields.model.as('text')}
				placeholder="Enter vehicle model"
				class="col-span-7"
			/>
			{#each formFunction.fields.model.issues() as issue}
				<Field.Error>{issue.message}</Field.Error>
			{/each}
		</Field.Field>

		<Field.Field orientation="responsive">
			<Button type="submit">Submit</Button>
			<Button type="button" variant="outline" onclick={cancel}>Cancel</Button>
		</Field.Field>
	</Field.Group>
</form>
