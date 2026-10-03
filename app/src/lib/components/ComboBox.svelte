<script lang="ts">
	import CheckIcon from '@lucide/svelte/icons/check';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import { tick } from 'svelte';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';
	import type { CommandState } from 'bits-ui';

	type choice = { value: any; label: string };

	interface Props {
		id?: string;
		choices: choice[];
		value: any;
		placeholder?: string;
		class?: string;
		enterNavigation?: boolean;
		allowEmpty?: boolean;
		emptyText?: string;
		commandState?: Readonly<CommandState>;
		onStateChange?: (state: Readonly<CommandState>) => void;
		oninput?: (
			event: Event & {
				currentTarget: EventTarget & HTMLInputElement;
			}
		) => void;
		onkeydown?: (
			event: KeyboardEvent & {
				currentTarget: EventTarget & HTMLInputElement;
			}
		) => void;
	}

	let {
		id,
		choices,
		value = $bindable(),
		placeholder = 'Select...',
		class: className,
		emptyText = 'No options found',
		enterNavigation = false,
		allowEmpty = false,
		commandState = $bindable(),
		onStateChange,
		oninput,
		onkeydown
	}: Props = $props();

	let open = $state(false);
	let triggerRef = $state<HTMLButtonElement>(null!);
	let searchRef = $state<HTMLInputElement>(null!);
	let contentRef = $state<HTMLDivElement>(null!);
	let search = $state('');
	let advanceOnClose = false;

	function onSearchKeydown(event: KeyboardEvent) {
		if (
			!enterNavigation ||
			event.key !== 'Enter' ||
			event.isComposing ||
			event.keyCode === 229 ||
			event.shiftKey ||
			event.ctrlKey ||
			event.altKey ||
			event.metaKey
		)
			return;
		event.preventDefault();
		event.stopPropagation();
		if (event.repeat) return;
		if (!search.trim() && allowEmpty) {
			value = '';
			closeAndFocusTrigger();
			return;
		}
		const first = Array.from(
			contentRef.querySelectorAll<HTMLElement>('[data-slot="command-item"]')
		).find(
			(item) =>
				item.getAttribute('data-disabled') !== 'true' &&
				item.checkVisibility({ visibilityProperty: true })
		);
		first?.click();
	}

	const selectedValue = $derived(choices.find((f) => f.value === value)?.label);

	// We want to refocus the trigger button when the user selects
	// an item from the list so users can continue navigating the
	// rest of the form with the keyboard.
	function closeAndFocusTrigger() {
		if (enterNavigation) {
			advanceOnClose = true;
			open = false;
			return;
		}
		open = false;
		tick().then(() => {
			triggerRef.focus();
		});
	}
</script>

<Popover.Root
	bind:open
	onOpenChange={() => {
		// Reset before the command list mounts, not in the later autofocus callback.
		search = '';
	}}
>
	<Popover.Trigger {id} bind:ref={triggerRef}>
		{#snippet child({ props })}
			<Button
				{...props}
				variant="outline"
				class={cn('w-full justify-between', className)}
				role="combobox"
				type="button"
				data-enter-combobox={enterNavigation ? '' : undefined}
				aria-expanded={open}
			>
				<span class="truncate">{selectedValue || placeholder}</span>
				<ChevronsUpDownIcon class="size-4 shrink-0 opacity-50" />
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content
		bind:ref={contentRef}
		class={cn('w-62.5 p-0', className)}
		onOpenAutoFocus={(event) => {
			if (!enterNavigation) return;
			event.preventDefault();
			tick().then(() => searchRef?.focus());
		}}
		onCloseAutoFocus={(event) => {
			if (!advanceOnClose) return;
			event.preventDefault();
			advanceOnClose = false;
			triggerRef.focus();
			triggerRef.dispatchEvent(new CustomEvent('enter-to-next', { bubbles: true }));
		}}
	>
		<Command.Root
			filter={(label, query) => (label.toLowerCase().includes(query.toLowerCase()) ? 1 : 0)}
			onStateChange={(state) => {
				onStateChange?.(state);
				commandState = state;
			}}
		>
			<Command.Input
				bind:ref={searchRef}
				bind:value={search}
				oninput={(event) => {
					oninput?.(event);
				}}
				onkeydown={(event) => {
					onkeydown?.(event);
					onSearchKeydown(event);
				}}
				placeholder="Search options..."
			/>
			<Command.List>
				<Command.Empty>{emptyText}</Command.Empty>
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
