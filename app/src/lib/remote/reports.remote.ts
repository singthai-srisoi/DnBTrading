import { query } from '$app/server';
import { and, asc, eq, gte, isNull, lte, notInArray, or, sql } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import * as v from 'valibot';
import { db } from '$lib/server/db';
import { requireAuthenticatedUser } from '$lib/helper';
import {
	inventoriesInventory as inventory,
	personPerson,
	productsProduct,
	vehiclesVehicle
} from '$lib/server/schema';
import { reportGroups } from '$lib/reports';
import { aggregateReport } from '$lib/server/aggregateReport';

const ids = v.array(v.pipe(v.number(), v.integer(), v.minValue(1)));
const filtersSchema = v.pipe(
	v.object({
		startDate: v.pipe(v.string(), v.isoDate()),
		endDate: v.pipe(v.string(), v.isoDate()),
		groupBy: v.picklist(['', ...reportGroups]),
		unit: v.picklist(['', 'kg', 'ton']),
		excluded: v.object({ product: ids, customer: ids, supplier: ids, driver: ids, vehicle: ids })
	}),
	v.check((filters) => filters.startDate <= filters.endDate, 'Invalid date range.')
);

export const getReportOptions = query(async () => {
	requireAuthenticatedUser();
	const [people, products, vehicles] = await Promise.all([
		db.select().from(personPerson).orderBy(asc(personPerson.code)),
		db.select().from(productsProduct).orderBy(asc(productsProduct.code)),
		db.select().from(vehiclesVehicle).orderBy(asc(vehiclesVehicle.regNo))
	]);
	const personOptions = (type: string) =>
		people
			.filter((p) => p.type === type)
			.map((p) => ({ value: p.id, label: `${p.code} - ${p.name}` }));
	return {
		product: products.map((p) => ({ value: p.id, label: `${p.code} - ${p.name}` })),
		vehicle: vehicles.map((p) => ({ value: p.id, label: `${p.regNo} - ${p.model}` })),
		customer: personOptions('customer'),
		supplier: personOptions('supplier'),
		driver: personOptions('driver')
	};
});

export const getReport = query(filtersSchema, async (filters) => {
	requireAuthenticatedUser();
	const driver = alias(personPerson, 'report_driver');
	const customer = alias(personPerson, 'report_customer');
	const supplier = alias(personPerson, 'report_supplier');
	const groupIds = {
		product: inventory.productId,
		customer: inventory.customerId,
		supplier: inventory.supplierId,
		driver: inventory.driverId,
		vehicle: inventory.vehicleId
	};
	const conditions = [gte(inventory.date, filters.startDate), lte(inventory.date, filters.endDate)];
	for (const group of reportGroups) {
		if (filters.excluded[group].length)
			conditions.push(
				or(isNull(groupIds[group]), notInArray(groupIds[group], filters.excluded[group]))!
			);
	}
	const factor = sql`case when ${inventory.unit} = 'ton' and ${filters.unit} = 'kg' then 1000::numeric
		when ${inventory.unit} = 'kg' and ${filters.unit} = 'ton' then 0.001::numeric else 1::numeric end`;
	const weightIn = sql`${inventory.weightIn}::numeric * (${factor})`;
	const weightOut = sql`${inventory.weightOut}::numeric * (${factor})`;
	const factoryNett = sql`(${weightIn}) - (${weightOut})`;
	const deduction = sql`coalesce(${inventory.deduction}::numeric, 0) * (${factor})`;
	const bucket = sql`coalesce(${inventory.bucket}::numeric, 0)`;
	const nett = sql`(${factoryNett}) - (${deduction})`;
	const displayUnit = filters.unit
		? sql<string>`${filters.unit}::text`
		: sql<string>`${inventory.unit}`;
	const groupId = filters.groupBy ? sql`${groupIds[filters.groupBy]}` : sql`null::bigint`;
	const base = db.$with('report_details').as(
		db
			.select({
				id: inventory.id,
				groupId: groupId.as('group_id'),
				date: inventory.date,
				vehicle:
					sql<string>`concat_ws(' - ', ${vehiclesVehicle.regNo}, ${vehiclesVehicle.model})`.as(
						'vehicle'
					),
				driver: sql<string>`concat_ws(' - ', ${driver.code}, ${driver.name})`.as('driver'),
				customer: sql<string>`concat_ws(' - ', ${customer.code}, ${customer.name})`.as('customer'),
				supplier: sql<string>`concat_ws(' - ', ${supplier.code}, ${supplier.name})`.as('supplier'),
				product: sql<string>`concat_ws(' - ', ${productsProduct.code}, ${productsProduct.name})`.as(
					'product'
				),
				customerTicketNo: inventory.customerTicketNo,
				supplierQty: inventory.supplierQty,
				ticketNo: inventory.ticketNo,
				do: inventory.do,
				remark: inventory.remark,
				unit: displayUnit.as('display_unit'),
				weightIn: sql<string>`(${weightIn})::text`.as('converted_weight_in'),
				weightOut: sql<string>`(${weightOut})::text`.as('converted_weight_out'),
				factoryNett: sql<string>`(${factoryNett})::text`.as('calculated_factory_nett'),
				deduction: sql<string>`(${deduction})::text`.as('converted_deduction'),
				bucket: sql<string>`(${bucket})::text`.as('bucket_count'),
				nett: sql<string>`(${nett})::text`.as('calculated_nett')
			})
			.from(inventory)
			.leftJoin(driver, eq(inventory.driverId, driver.id))
			.leftJoin(customer, eq(inventory.customerId, customer.id))
			.leftJoin(supplier, eq(inventory.supplierId, supplier.id))
			.leftJoin(productsProduct, eq(inventory.productId, productsProduct.id))
			.leftJoin(vehiclesVehicle, eq(inventory.vehicleId, vehiclesVehicle.id))
			.where(and(...conditions))
	);
	const details = await db
		.with(base)
		.select({
			id: base.id,
			groupId: base.groupId,
			date: base.date,
			vehicle: base.vehicle,
			driver: base.driver,
			customer: base.customer,
			supplier: base.supplier,
			product: base.product,
			customerTicketNo: base.customerTicketNo,
			supplierQty: base.supplierQty,
			ticketNo: base.ticketNo,
			do: base.do,
			remark: base.remark,
			unit: base.unit,
			weightIn: base.weightIn,
			weightOut: base.weightOut,
			factoryNett: base.factoryNett,
			bucket: base.bucket,
			deduction: base.deduction,
			nett: base.nett
		})
		.from(base)
		.orderBy(
			...(filters.groupBy ? [base[filters.groupBy], base.groupId, base.unit, base.id] : [base.id])
		);
	const rows = aggregateReport(details, filters.groupBy);
	return { rows, count: details.length, filters };
});
