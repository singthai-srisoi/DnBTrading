<script lang="ts">
	import { getLocalTimeZone, today } from '@internationalized/date';
	import { getHomeOverview } from '$lib/remote/home.remote';
	import { formatNum } from '$lib/helper/formatter';
	import * as Card from '$lib/components/ui/card/index.js';
	import ComboBox from '$lib/components/ComboBox.svelte';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { RangeCalendar } from '$lib/components/ui/range-calendar/index.js';
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import { Button } from '$lib/components/ui/button';
	const currentDate = today(getLocalTimeZone());
	const groupOptions = ['product', 'driver', 'supplier', 'customer', 'vehicle'] as const;
	let groupBy = $state<(typeof groupOptions)[number]>('driver');
	let unit = $state<'kg' | 'ton'>('ton');
	const groupChoices = groupOptions.map((value) => ({
		value,
		label: value.charAt(0).toUpperCase() + value.slice(1)
	}));
	const unitChoices = [
		{ value: 'ton', label: 'Ton' },
		{ value: 'kg', label: 'Kilogram' }
	];
	let dateRangeOpen = $state(false);
	let dateRange = $state({ start: currentDate.set({ day: 1 }), end: currentDate });
	let startDate = $derived(dateRange.start?.toString() ?? '');
	let endDate = $derived(dateRange.end?.toString() ?? '');
	let filters = $state({
		groupBy: 'driver' as (typeof groupOptions)[number],
		unit: 'ton' as 'kg' | 'ton',
		startDate: currentDate.set({ day: 1 }).toString(),
		endDate: currentDate.toString()
	});
	let overview = $derived(getHomeOverview(filters));
	const invalidRange = $derived(!startDate || !endDate || startDate > endDate);
</script>

<svelte:head><title>Inventory Overview</title></svelte:head>

<div class="space-y-6">
	<div>
		<h1 class="text-2xl font-semibold">Inventory Overview</h1>
		<p class="mt-1 text-sm text-muted-foreground">Grouped totals for your selected date range.</p>
	</div>
	<Card.Root class="rounded-md"
		><Card.Content>
			<form
				class="grid gap-4 sm:grid-cols-2 lg:grid-cols-5"
				onsubmit={(event) => {
					event.preventDefault();
					if (!invalidRange) filters = { groupBy, unit, startDate, endDate };
				}}
			>
				<div class="space-y-2">
					<label for="overview-group" class="text-sm font-medium">Group by</label>
					<ComboBox
						id="overview-group"
						choices={groupChoices}
						bind:value={groupBy}
						allowEmpty={false}
						placeholder="Select grouping"
					/>
				</div>
				<div class="space-y-2">
					<label for="overview-unit" class="text-sm font-medium">Display unit</label>
					<ComboBox
						id="overview-unit"
						choices={unitChoices}
						bind:value={unit}
						allowEmpty={false}
						placeholder="Select unit"
					/>
				</div>
				<div class="space-y-2 lg:col-span-2">
					<label for="overview-range" class="text-sm font-medium">Date range</label>
					<Popover.Root bind:open={dateRangeOpen}>
						<Popover.Trigger id="overview-range">
							{#snippet child({ props })}
								<Button
									{...props}
									type="button"
									variant="outline"
									class="w-full justify-between font-normal"
								>
									{dateRange.start?.toDate(getLocalTimeZone()).toLocaleDateString() ?? 'Start date'} –
									{dateRange.end?.toDate(getLocalTimeZone()).toLocaleDateString() ?? 'End date'}
									<ChevronDownIcon />
								</Button>
							{/snippet}
						</Popover.Trigger>
						<Popover.Content class="w-auto overflow-hidden p-0" align="start">
							<RangeCalendar
								bind:value={dateRange}
								captionLayout="dropdown"
								class="rounded-md border"
								onValueChange={(range) => {
									if (range.start && range.end) dateRangeOpen = false;
								}}
							/>
						</Popover.Content>
					</Popover.Root>
				</div>
				<Button type="submit" class="self-end" disabled={invalidRange}>Apply filters</Button>
				{#if invalidRange}<p
						role="alert"
						class="text-sm text-destructive sm:col-span-2 lg:col-span-5"
					>
						Select a valid date range with the start date on or before the end date.
					</p>{/if}
			</form>
		</Card.Content></Card.Root
	>
	{#await overview}
		<p role="status" class="text-muted-foreground">Loading overview…</p>
	{:then result}
		<p class="text-sm text-muted-foreground">
			{result.count} records · Grouped by {filters.groupBy} · {filters.startDate} to {filters.endDate}
			· {result.unit.toUpperCase()}
		</p>
		{#if result.groups.length === 0}
			<p class="rounded-md border p-8 text-center text-muted-foreground">
				No inventory records found for this date range.
			</p>
		{:else}
			<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
				{#each result.groups as group (group.id)}
					<Card.Root class="min-w-0 gap-4 rounded-md">
						<Card.Header
							><h2 class="text-lg font-semibold break-words">
								{group.label || `Unassigned ${filters.groupBy}`}
							</h2>
							<p class="text-sm text-muted-foreground">
								Unit: {result.unit.toUpperCase()}
							</p></Card.Header
						>
						<Card.Content
							><dl class="space-y-3 border-t pt-4">
								{#each [['Total Factory Nett', group.factoryNett], ['Total Bucket', group.bucket], ['Total Deduction', group.deduction]] as [label, value]}
									<div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
										<dt class="text-sm text-muted-foreground">{label}</dt>
										<dd class="font-medium tabular-nums">{formatNum(value)}</dd>
									</div>
								{/each}
								<div class="flex flex-wrap items-baseline justify-between gap-2 border-t pt-3">
									<dt class="font-semibold">Total Nett</dt>
									<dd class="text-xl font-semibold tabular-nums">{formatNum(group.nett)}</dd>
								</div>
							</dl></Card.Content
						>
					</Card.Root>
				{/each}
			</div>
		{/if}
	{:catch}
		<div role="alert" class="space-y-3 rounded-md border p-6">
			<p>Unable to load the overview. Please try again.</p>
			<Button
				variant="outline"
				onclick={() => {
					overview.refresh().catch(() => {});
				}}>Retry</Button
			>
		</div>
	{/await}
</div>
