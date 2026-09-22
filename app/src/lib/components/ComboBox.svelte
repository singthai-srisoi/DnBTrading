<script lang="ts">
	import CheckIcon from '@lucide/svelte/icons/check';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import { tick } from 'svelte';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';

	interface Props {
		choices: { value: any; label: string }[];
		value: any;
		placeholder?: string;
		class?: string;
	}

	let { choices, value = $bindable(), placeholder = 'Select...', class: className }: Props = $props();

	let open = $state(false);
	let triggerRef = $state<HTMLButtonElement>(null!);

	const selectedValue = $derived(choices.find((f) => f.value === value)?.label);

	// We want to refocus the trigger button when the user selects
	// an item from the list so users can continue navigating the
	// rest of the form with the keyboard.
	function closeAndFocusTrigger() {
		open = false;
		tick().then(() => {
			triggerRef.focus();
		});
	}
</script>

<Popover.Root bind:open>
	<Popover.Trigger bind:ref={triggerRef}>
		{#snippet child({ props })}
			<Button
				{...props}
				variant="outline"
				class={cn('w-full justify-between', className)}
				role="combobox"
				aria-expanded={open}
			>
				<span class="truncate">{selectedValue || placeholder}</span>
				<ChevronsUpDownIcon class="size-4 shrink-0 opacity-50" />
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class={cn('w-62.5 p-0', className)}>
		<Command.Root>
			<Command.Input placeholder="Search branch..." />
			<Command.List>
				<Command.Empty>No options found.</Command.Empty>
				<Command.Group value="choices">
					{#each choices as choice (choice.value !== undefined ? String(choice.value) : choice.label)}
						<Command.Item
							value={choice.label}
							onSelect={() => {
								value = choice.value;
								closeAndFocusTrigger();
							}}
						>
							<CheckIcon class={cn('mr-2 size-4', value !== choice.value && 'text-transparent')} />
							<span class="truncate">{choice.label}</span>
						</Command.Item>
					{/each}
				</Command.Group>
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
