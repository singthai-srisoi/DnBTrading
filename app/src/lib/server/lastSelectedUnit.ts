import { asc, eq, sql } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { inventoriesLastselectedunit } from '$lib/server/schema';

type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

// The existing table represents one shared preference and has no unique singleton key.
export async function lastSelectedUnit(tx: Transaction, savedUnit?: 'kg' | 'ton') {
	await tx.execute(sql`LOCK TABLE ${inventoriesLastselectedunit} IN EXCLUSIVE MODE`);
	const [existing] = await tx
		.select()
		.from(inventoriesLastselectedunit)
		.orderBy(asc(inventoriesLastselectedunit.id))
		.limit(1);
	const unit = savedUnit ?? (existing?.unit === 'ton' ? 'ton' : 'kg');
	if (!existing) {
		await tx.insert(inventoriesLastselectedunit).values({ unit });
	} else if (existing.unit !== unit) {
		await tx
			.update(inventoriesLastselectedunit)
			.set({ unit })
			.where(eq(inventoriesLastselectedunit.id, existing.id));
	}
	return unit;
}
