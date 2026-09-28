import { test } from 'node:test';
import assert from 'node:assert/strict';
import { reportCsv } from './reports.ts';

const format = (value) => Number(value).toFixed(3);

test('CSV quotes user text, preserves newlines, and blocks spreadsheet formulas', () => {
	const csv = reportCsv(
		[{ kind: 'detail', ticketNo: '=1+1', remark: 'A, "B"\nC', nett: '-2.5', unit: 'kg' }],
		format
	);
	assert.ok(csv.startsWith('\uFEFF'));
	assert.ok(csv.includes('"\'=1+1"'));
	assert.ok(csv.includes('"A, ""B""\nC"'));
	assert.ok(csv.includes(',-2.500,'));
});

test('CSV includes subtotal labels and keeps absent detail cells blank', () => {
	const csv = reportCsv(
		[
			{
				kind: 'subtotal',
				label: 'Driver subtotal',
				factoryNett: '12.3456',
				bucket: '0',
				nett: '12',
				unit: 'ton'
			}
		],
		format
	);
	const row = csv.split('\r\n')[1];
	assert.ok(row.startsWith('"Driver subtotal","",""'));
	assert.ok(row.includes('12.346'));
	assert.ok(row.includes('0.000'));
	assert.ok(row.endsWith('"ton"'));
});
