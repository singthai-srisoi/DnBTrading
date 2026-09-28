import { test } from 'node:test';
import assert from 'node:assert/strict';
import { aggregateReport } from './aggregateReport.ts';

const records = [
	{
		id: 1,
		groupId: 1,
		driver: 'A',
		unit: 'ton',
		factoryNett: '10',
		deduction: '1',
		nett: '9',
		bucket: '100'
	},
	{
		id: 2,
		groupId: 1,
		driver: 'A',
		unit: 'ton',
		factoryNett: '20',
		deduction: '2',
		nett: '18',
		bucket: '200'
	},
	{
		id: 3,
		groupId: 2,
		driver: 'B',
		unit: 'ton',
		factoryNett: '40',
		deduction: '4',
		nett: '36',
		bucket: '400'
	}
];
test('grand total sums all details exactly once across multiple groups', () => {
	const rows = aggregateReport(records, 'driver');
	assert.deepEqual(
		rows.filter((row) => row.kind === 'subtotal').map((row) => row.nett),
		['27', '36']
	);
	assert.deepEqual(rows.at(-1), {
		kind: 'total',
		label: 'Grand total',
		unit: 'ton',
		factoryNett: '70',
		deduction: '7',
		nett: '63',
		bucket: '700'
	});
});
test('ungrouped report includes a grand total and no subtotals', () => {
	const rows = aggregateReport(records, '');
	assert.equal(rows.length, 4);
	assert.equal(rows.at(-1).nett, '63');
	assert.ok(!rows.some((row) => row.kind === 'subtotal'));
});
test('mixed units produce one grand total in kg while retaining unit subtotals', () => {
	const rows = aggregateReport([...records, { ...records[0], id: 4, unit: 'kg' }], 'driver');
	assert.deepEqual(
		rows.filter((row) => row.kind === 'total').map((row) => [row.unit, row.nett]),
		[['kg', '63009']]
	);
	assert.equal(rows.at(-1).factoryNett, '70010');
	assert.equal(rows.at(-1).deduction, '7001');
	assert.equal(rows.at(-1).bucket, '800');
	assert.equal(rows.filter((row) => row.kind === 'subtotal').length, 3);
	const ungrouped = aggregateReport([...records, { ...records[0], id: 4, unit: 'kg' }], '');
	assert.equal(ungrouped.filter((row) => row.kind === 'total').length, 1);
	assert.deepEqual(ungrouped.at(-1), rows.at(-1));
});
test('empty reports have no totals', () => {
	assert.deepEqual(aggregateReport([], 'driver'), []);
});
