import { query } from '$app/server';
import { and, eq, gte, lte, sql } from 'drizzle-orm';
import * as v from 'valibot';
import { requireAuthenticatedUser } from '$lib/helper';
import { db } from '$lib/server/db';
import {
	inventoriesInventory as inventory,
	personPerson,
	productsProduct,
	vehiclesVehicle
} from '$lib/server/schema';

const filters = v.pipe(
	v.object({
		groupBy: v.picklist(['product', 'driver', 'supplier', 'customer', 'vehicle']),
		unit: v.picklist(['kg', 'ton']),
		startDate: v.pipe(v.string(), v.isoDate()),
		endDate: v.pipe(v.string(), v.isoDate())
	}),
	v.check((value) => value.startDate <= value.endDate, 'Invalid date range.')
);

export const getHomeOverview = query(filters, async ({ groupBy, unit, startDate, endDate }) => {
	requireAuthenticatedUser();
	const groupId = {
		product: inventory.productId,
		driver: inventory.driverId,
		supplier: inventory.supplierId,
		customer: inventory.customerId,
		vehicle: inventory.vehicleId
	}[groupBy];
	const personId =
		groupBy === 'driver'
			? inventory.driverId
			: groupBy === 'supplier'
				? inventory.supplierId
				: inventory.customerId;
	const label =
		groupBy === 'product'
			? sql<string>`concat_ws(' - ', ${productsProduct.code}, ${productsProduct.name})`
			: groupBy === 'vehicle'
				? sql<string>`concat_ws(' - ', ${vehiclesVehicle.regNo}, ${vehiclesVehicle.model})`
				: sql<string>`concat_ws(' - ', ${personPerson.code}, ${personPerson.name})`;
	// Convert weights per record before summing; bucket is not converted.
	const factor = sql`case when ${inventory.unit} = 'ton' and ${unit} = 'kg' then 1000::numeric
		when ${inventory.unit} = 'kg' and ${unit} = 'ton' then 0.001::numeric else 1::numeric end`;
	const factoryNett = sql`(${inventory.weightIn}::numeric - ${inventory.weightOut}::numeric) * (${factor})`;
	const deduction = sql`coalesce(${inventory.deduction}::numeric, 0) * (${factor})`;
	const groups = await db
		.select({
			id: groupId,
			label,
			recordCount: sql<number>`count(*)`.mapWith(Number),
			factoryNett: sql<string>`sum(${factoryNett})::text`,
			bucket: sql<string>`sum(coalesce(${inventory.bucket}::numeric, 0))::text`,
			deduction: sql<string>`sum(${deduction})::text`,
			nett: sql<string>`(sum(${factoryNett}) - sum(${deduction}))::text`
		})
		.from(inventory)
		.leftJoin(personPerson, eq(personId, personPerson.id))
		.leftJoin(productsProduct, eq(inventory.productId, productsProduct.id))
		.leftJoin(vehiclesVehicle, eq(inventory.vehicleId, vehiclesVehicle.id))
		.where(and(gte(inventory.date, startDate), lte(inventory.date, endDate)))
		.groupBy(groupId, label)
		.orderBy(label, groupId);
	return { groups, unit, count: groups.reduce((total, group) => total + group.recordCount, 0) };
});
