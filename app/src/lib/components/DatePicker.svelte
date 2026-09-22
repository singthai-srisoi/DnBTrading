<script lang="ts">
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import { getLocalTimeZone, today, type CalendarDate } from '@internationalized/date';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import Calendar from '$lib/components/ui/calendar/calendar.svelte';
	import { Button } from '$lib/components/ui/button/index.js';

	interface Props {
		// open?: boolean;
		class?: string;
		value?: CalendarDate;
		onchange?: (value: CalendarDate | undefined) => void;
	}
	let {
		// open = $bindable(false),
		class: class_ = "",
		value = $bindable<CalendarDate | undefined>(),
		onchange
	}: Props = $props();
	let open = $state(false);
	const id = $props.id();
</script>

<div class="flex flex-col gap-3 {class_}">
	<Popover.Root bind:open>
		<Popover.Trigger id="{id}-date">
			{#snippet child({ props })}
				<Button {...props} variant="outline" class=" justify-between font-normal">
					{value ? value.toDate(getLocalTimeZone()).toLocaleDateString() : 'Select date'}
					<ChevronDownIcon />
				</Button>
			{/snippet}
		</Popover.Trigger>
		<Popover.Content class="w-auto overflow-hidden p-0" align="start">
			<Calendar
				type="single"
				bind:value
				captionLayout="dropdown"
				onValueChange={() => {
					open = false;
					onchange?.(value);
				}}
				maxValue={today(getLocalTimeZone())}
			/>
		</Popover.Content>
	</Popover.Root>
</div>
