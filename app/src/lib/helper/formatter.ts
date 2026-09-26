import Decimal from 'decimal.js';

export function formatNum(val: string | number | null | undefined, decimals = 3): string {
	if (val === null || val === undefined || val === '') return '0.000';
	try {
		return new Decimal(val).toFixed(decimals);
	} catch {
		return '0.000';
	}
}

export function formatCurrency(val: string | number | null | undefined): string {
	if (val === null || val === undefined || val === '') return '0.00';
	try {
		return new Decimal(val).toFixed(2);
	} catch {
		return '0.00';
	}
}