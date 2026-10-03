<script lang="ts">
	import ComboBox from '$lib/components/ComboBox.svelte';
	import { listPersonOptions, insertDriverInstance } from '$lib/remote/person.remote';
	import type { CommandState } from 'bits-ui';

	interface Props {
		type: 'driver' | 'supplier';
		value?: number;
	}

	let { type, value = $bindable() }: Props = $props();

	let personOptionsQuery = async () => {
		let persons = await listPersonOptions({ type });
		return persons.map((person) => ({
			value: person.id,
			label: `${person.code} - ${person.name}`
		}));
	};
	let personOptions = $derived(await personOptionsQuery());
	let commandState = $state<Readonly<CommandState>>();
	// $inspect(commandState);
</script>

<ComboBox
	choices={personOptions}
	enterNavigation
	allowEmpty={false}
	bind:value
	placeholder={`Select ${type.charAt(0).toUpperCase() + type.slice(1)}`}
	class="col-span-5"
	bind:commandState
	emptyText={`Enter to add new driver: ${commandState?.search ?? ''}`}
	onkeydown={async (event) => {
		if (
			event.key !== 'Enter' ||
			event.isComposing ||
			event.keyCode === 229 ||
			event.shiftKey ||
			event.ctrlKey ||
			event.altKey ||
			event.metaKey
		)
			return;
		if (!commandState || commandState.filtered.count > 0) return;
        if (!commandState.search) return;
		// console.log(commandState.search);
		let res = await insertDriverInstance({ value: commandState.search, type });
		await listPersonOptions({ type }).refresh();
		value = res.id;
	}}
/>
