<script lang="ts">
	import { today, getLocalTimeZone } from '@internationalized/date';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { RangeCalendar } from '$lib/components/ui/range-calendar/index.js';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import ComboBox from '$lib/components/ComboBox.svelte';
	import { getReport, getReportOptions } from '$lib/remote/reports.remote';
	import {
		reportGroups,
		reportColumns,
		numericColumns,
		reportCsv,
		type ReportFilters,
		type ReportGroup,
		type ReportRow
	} from '$lib/reports';
	import { formatNum } from '$lib/helper/formatter';

	const currentDate = today(getLocalTimeZone());
	let dateRange = $state({ start: currentDate.set({ day: 1 }), end: currentDate });
	let dateOpen = $state(false);
	let groupBy = $state<ReportFilters['groupBy']>('');
	let unit = $state<ReportFilters['unit']>('');
	let excluded = $state<ReportFilters['excluded']>({
		product: [],
		customer: [],
		supplier: [],
		driver: [],
		vehicle: []
	});
	let search = $state<Record<ReportGroup, string>>({
		product: '',
		customer: '',
		supplier: '',
		driver: '',
		vehicle: ''
	});
	let applied = $state<ReportFilters | null>(null);
	const options = getReportOptions();
	let result = $derived(applied ? getReport(applied) : null);
	const invalidRange = $derived(
		!dateRange.start || !dateRange.end || dateRange.start.compare(dateRange.end) > 0
	);
	const titleCase = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);
	const groupChoices = [
		{ value: '', label: 'No grouping' },
		...reportGroups.map((value) => ({ value, label: titleCase(value) }))
	];
	const unitChoices = [
		{ value: '', label: 'Original units' },
		{ value: 'kg', label: 'Kilogram' },
		{ value: 'ton', label: 'Ton' }
	];
	let reportTable = $state<HTMLTableElement | null>(null);

	function generate() {
		if (invalidRange) return;
		applied = {
			groupBy,
			unit,
			startDate: dateRange.start.toString(),
			endDate: dateRange.end.toString(),
			excluded: Object.fromEntries(
				reportGroups.map((group) => [group, [...excluded[group]]])
			) as ReportFilters['excluded']
		};
	}
	function toggle(group: ReportGroup, id: number, checked: boolean) {
		excluded[group] = checked
			? excluded[group].filter((value) => value !== id)
			: [...new Set([...excluded[group], id])];
	}
	function download(rows: ReportRow[]) {
		const url = URL.createObjectURL(
			new Blob([reportCsv(rows, formatNum)], { type: 'text/csv;charset=utf-8;' })
		);
		const link = document.createElement('a');
		link.href = url;
		link.download = `inventory-report-${applied?.startDate}-${applied?.endDate}.csv`;
		link.click();
		setTimeout(() => URL.revokeObjectURL(url), 1000);
	}
	function printReport(filters: ReportFilters) {
		if (!reportTable) return;
		const frame = document.createElement('iframe');
		frame.style.cssText = 'position:fixed;width:0;height:0;border:0';
		frame.title = 'Print inventory report';
		document.body.append(frame);
		const doc = frame.contentDocument!;
		const style = doc.createElement('style');
		style.textContent =
			'@page { size: A3 landscape; margin: 10mm; } body { font: 9px sans-serif; color: black; } table { width: 100%; border-collapse: collapse; } th, td { border: 1px solid #ccc; padding: 4px; text-align: left; } thead { display: table-header-group; } tr { break-inside: avoid; } [data-summary=true] { font-weight: bold; background: #eee; }';
		doc.head.append(style);
		doc.title = 'Inventory report';
		const heading = doc.createElement('h1');
		heading.textContent = 'Inventory report';
		const description = doc.createElement('p');
		description.textContent = `${filters.startDate} to ${filters.endDate} | Group: ${filters.groupBy || 'None'} | Unit: ${filters.unit.toUpperCase() || 'Original units'}`;
		doc.body.append(heading, description, reportTable.cloneNode(true));
		frame.contentWindow!.addEventListener('afterprint', () => frame.remove(), { once: true });
		frame.contentWindow!.focus();
		frame.contentWindow!.print();
	}
</script>

<svelte:head><title>Inventory Reports</title></svelte:head>

<div class="min-w-0 space-y-6">
	<div>
		<h1 class="text-2xl font-semibold">Inventory Reports</h1>
		<p class="mt-1 text-sm text-muted-foreground">
			Filter inventory records, compare group totals, and export your report.
		</p>
	</div>
	<Card.Root class="rounded-md"
		><Card.Content class="space-y-5">
			<div class="grid gap-4 md:grid-cols-3">
				<div class="space-y-2">
					<label for="report-group" class="text-sm font-medium">Group by</label><ComboBox
						id="report-group"
						choices={groupChoices}
						bind:value={groupBy}
					/>
				</div>
				<div class="space-y-2">
					<label for="report-unit" class="text-sm font-medium">Display unit</label><ComboBox
						id="report-unit"
						choices={unitChoices}
						bind:value={unit}
					/>
				</div>
				<div class="space-y-2">
					<label for="report-range" class="text-sm font-medium">Date range</label>
					<Popover.Root bind:open={dateOpen}
						><Popover.Trigger id="report-range">
							{#snippet child({ props })}<Button
									{...props}
									variant="outline"
									class="w-full justify-between font-normal"
									>{dateRange.start?.toString() ?? 'Start date'} – {dateRange.end?.toString() ??
										'End date'}</Button
								>{/snippet}
						</Popover.Trigger><Popover.Content class="w-auto p-0" align="end"
							><RangeCalendar
								bind:value={dateRange}
								captionLayout="dropdown"
								onValueChange={(value) => {
									if (value.start && value.end) dateOpen = false;
								}}
							/></Popover.Content
						></Popover.Root
					>
				</div>
			</div>
			<p class="text-sm text-muted-foreground">
				Uncheck options to exclude them. Mixed-unit grand totals are converted to kg; bucket and
				supplier quantity are not converted.
			</p>
			{#await options}<p role="status">Loading filter options…</p>
			{:then choices}
				<div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
					{#each reportGroups as group}
						<div class="space-y-3 rounded-md border p-3">
							<h2 class="font-medium">{titleCase(group)}</h2>
							<Input
								aria-label={`Search ${group}`}
								placeholder="Search…"
								bind:value={search[group]}
							/>
							<div class="flex items-center gap-2">
								<Checkbox
									id={`all-${group}`}
									checked={excluded[group].length === 0}
									indeterminate={excluded[group].length > 0 &&
										excluded[group].length < choices[group].length}
									onCheckedChange={(checked) => {
										excluded[group] = checked ? [] : choices[group].map((option) => option.value);
									}}
								/><label for={`all-${group}`} class="text-sm">Select all</label>
							</div>
							<div class="max-h-48 space-y-3 overflow-y-auto p-1">
								{#each choices[group].filter((option) => option.label
										.toLowerCase()
										.includes(search[group].toLowerCase())) as option (option.value)}
									<div class="flex items-start gap-2">
										<Checkbox
											id={`${group}-${option.value}`}
											checked={!excluded[group].includes(option.value)}
											onCheckedChange={(checked) => toggle(group, option.value, checked)}
										/><label for={`${group}-${option.value}`} class="text-sm leading-4"
											>{option.label}</label
										>
									</div>
								{:else}<p class="text-sm text-muted-foreground">No matching options.</p>{/each}
							</div>
						</div>
					{/each}
				</div>
			{:catch}<p role="alert">
					Unable to load filter options. <Button
						variant="outline"
						onclick={() => options.refresh().catch(() => {})}>Retry</Button
					>
				</p>{/await}
			{#if invalidRange}<p role="alert" class="text-sm text-destructive">
					Select a complete, valid date range.
				</p>{/if}
			<Button onclick={generate} disabled={invalidRange}>Generate report</Button>
		</Card.Content></Card.Root
	>
	{#if result}
		{#await result}<p role="status">Generating report…</p>
		{:then report}
			<Card.Root class="min-w-0 rounded-md"
				><Card.Content class="min-w-0 space-y-4">
					<div class="flex flex-wrap items-center justify-between gap-3">
						<p class="text-sm text-muted-foreground">
							{report.count} records · {report.filters.startDate} to {report.filters.endDate} · {report
								.filters.groupBy || 'No grouping'} · {report.filters.unit.toUpperCase() ||
								'Original units'}
						</p>
						<div class="flex gap-2">
							<Button
								variant="outline"
								disabled={!report.rows.length}
								onclick={() => download(report.rows)}>Export CSV</Button
							><Button
								variant="outline"
								disabled={!report.rows.length}
								onclick={() => printReport(report.filters)}>Print / Save PDF</Button
							>
						</div>
					</div>
					{#if report.rows.length}
						<Table.Root bind:ref={reportTable}
							><Table.Header
								><Table.Row
									>{#each reportColumns as [key, label]}<Table.Head
											class={numericColumns.has(key) ? 'text-right' : ''}>{label}</Table.Head
										>{/each}</Table.Row
								></Table.Header
							>
							<Table.Body
								>{#each report.rows as row}<Table.Row
										data-summary={row.kind !== 'detail'}
										class={row.kind === 'total'
											? 'bg-primary/10 font-bold'
											: row.kind === 'subtotal'
												? 'bg-muted font-semibold'
												: ''}
									>
										{#each reportColumns as [key]}<Table.Cell
												class={numericColumns.has(key) ? 'text-right tabular-nums' : ''}
												>{key === 'date' && row.kind !== 'detail'
													? row.label
													: row[key] == null
														? ''
														: numericColumns.has(key)
															? formatNum(row[key])
															: row[key]}</Table.Cell
											>{/each}
									</Table.Row>{/each}</Table.Body
							>
						</Table.Root>
					{:else}<p class="py-8 text-center text-muted-foreground">
							No inventory records match these filters.
						</p>{/if}
				</Card.Content></Card.Root
			>
		{:catch}<div role="alert" class="space-y-3 rounded-md border p-6">
				<p>Unable to generate the report. Please try again.</p>
				<Button variant="outline" onclick={() => result?.refresh().catch(() => {})}>Retry</Button>
			</div>{/await}
	{:else}<p class="text-sm text-muted-foreground">
			Choose filters and generate a report to see records and totals.
		</p>{/if}
</div>
