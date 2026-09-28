import { DataFrame } from 'danfojs';
import type { ReportFilters, ReportRow } from '../reports';

type Detail = Omit<ReportRow, 'kind'> & { id: number; groupId: unknown; unit: string };
const metrics = ['factoryNett', 'bucket', 'deduction', 'nett'] as const;

export function aggregateReport(details: Detail[], groupBy: ReportFilters['groupBy']): ReportRow[] {
	if (!details.length) return [];
	const data = details.map((row) => ({
		group: JSON.stringify([row.groupId, row.unit]),
		unit: row.unit,
		...Object.fromEntries(metrics.map((key) => [key, Number(row[key] ?? 0)]))
	}));
	const frame = new DataFrame(data);
	function sums(key: 'group' | 'unit') {
		const grouped = frame
			.groupby([key])
			.col([...metrics])
			.sum();
		return new Map(
			(grouped.values as (string | number)[][]).map((values) => [
				String(values[0]),
				Object.fromEntries(metrics.map((metric, index) => [metric, String(values[index + 1])]))
			])
		);
	}
	const totalUnit = details.every((row) => row.unit === details[0].unit) ? details[0].unit : 'kg';
	const total = Object.fromEntries(
		metrics.map((metric) => [
			metric,
			String(
				details.reduce((sum, row) => {
					const factor = metric !== 'bucket' && row.unit === 'ton' && totalUnit === 'kg' ? 1000 : 1;
					return sum + Number(row[metric] ?? 0) * factor;
				}, 0)
			)
		])
	);
	const subtotals = groupBy ? sums('group') : new Map();
	const rows: ReportRow[] = [];
	const groups = new Map<string, Detail[]>();
	for (const detail of details) {
		const key = groupBy ? JSON.stringify([detail.groupId, detail.unit]) : '';
		const group = groups.get(key) ?? [];
		group.push(detail);
		groups.set(key, group);
	}
	for (const [key, records] of groups) {
		for (const { id, groupId, ...detail } of records) rows.push({ ...detail, kind: 'detail' });
		if (groupBy)
			rows.push({
				...subtotals.get(key),
				kind: 'subtotal',
				unit: records[0].unit,
				label: `${records[0][groupBy] || `Unassigned ${groupBy}`} subtotal`
			});
	}
	// Sum original detail records only, never the inserted subtotal rows.
	rows.push({ ...total, kind: 'total', unit: totalUnit, label: 'Grand total' });
	return rows;
}
