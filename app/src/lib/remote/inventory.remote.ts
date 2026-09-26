import { form, query, command } from '$app/server';
import { and, asc, eq, ilike, or, gte, lte, getColumns } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import * as v from 'valibot';

import { db } from '$lib/server/db';
import {
	inventoriesInventory,
	personPerson,
	productsProduct,
	vehiclesVehicle
} from '$lib/server/schema';
import {
	getTableColumnKeys,
	requireAuthenticatedUser,
	createPaginationQuerySchema,
	paginate,
	paginateEnhanced
} from '$lib/helper';

const { columns: inventoryColumns, keys: inventoryOrderColumns } =
	getTableColumnKeys(inventoriesInventory);
type InventoryColumn = keyof typeof inventoryColumns;

const inventoryQuerySchema_ = createPaginationQuerySchema(inventoryOrderColumns);
const unit = v.picklist(['kg', 'ton']);

const inventoryQuerySchema = v.object({
	...inventoryQuerySchema_.entries,
	startDate: v.optional(v.pipe(v.string(), v.isoDate())),
	endDate: v.optional(v.pipe(v.string(), v.isoDate()))
});

const driver = alias(personPerson, 'driver');
const customer = alias(personPerson, 'customer');
const supplier = alias(personPerson, 'supplier');

/**
 * Get paginated persons.
 */
export const getInventories = query(
	inventoryQuerySchema,
	async ({ page, limit, orderBy, orderDir, search, startDate, endDate }) => {
		requireAuthenticatedUser();
		let conditions = [];
		if (startDate) {
			conditions.push(gte(inventoriesInventory.date, startDate));
		}
		if (endDate) {
			conditions.push(lte(inventoriesInventory.date, endDate));
		}
		if (search) {
			conditions.push(
				or(
					ilike(inventoriesInventory.customerTicketNo, `%${search}%`),
					ilike(inventoriesInventory.ticketNo, `%${search}%`),
					ilike(inventoriesInventory.do, `%${search}%`),
					ilike(inventoriesInventory.remark, `%${search}%`)
				)
			);
		}

		// return await paginate(db, {
		// 	table: inventoriesInventory,
		// 	page,
		// 	limit,
		// 	orderBy,
		// 	orderDir,
		// 	where: conditions.length > 0 ? and(...conditions) : undefined,
		// 	defaultSortColumn: 'date'
		// });
		//
		let res = await paginateEnhanced(
			db,
			() =>
				db
					.select({
						...getColumns(inventoriesInventory),
						driverName: driver.name,
						driverCode: driver.code,
						customerName: customer.name,
						customerCode: customer.code,
						supplierName: supplier.name,
						supplierCode: supplier.code,
						productName: productsProduct.name,
						productCode: productsProduct.code,
						vehicleRegNo: vehiclesVehicle.regNo
					})
					.from(inventoriesInventory)
					.leftJoin(driver, eq(inventoriesInventory.driverId, driver.id))
					.leftJoin(customer, eq(inventoriesInventory.customerId, customer.id))
					.leftJoin(supplier, eq(inventoriesInventory.supplierId, supplier.id))
					.leftJoin(productsProduct, eq(inventoriesInventory.productId, productsProduct.id))
					.leftJoin(vehiclesVehicle, eq(inventoriesInventory.vehicleId, vehiclesVehicle.id))
					.where(conditions.length > 0 ? and(...conditions) : undefined)
					.$dynamic(),
			{
				table: inventoriesInventory,
				page,
				limit,
				orderBy,
				orderDir,
				defaultSortColumn: 'id'
			}
		);

		return res;
	}
);

// const branchInsertSchema = createInsertSchema(branches);
//
/**
export const inventoriesInventory = pgTable(
	'inventories_inventory',
	{
		id: bigint({ mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
		date: date().notNull(),
		customerTicketNo: varchar('customer_ticket_no', { length: 100 }),
		supplierQty: doublePrecision('supplier_qty').notNull(),
		ticketNo: varchar('ticket_no', { length: 100 }).notNull(),
		do: varchar({ length: 100 }).notNull(),
		weightIn: doublePrecision('weight_in').notNull(),
		weightOut: doublePrecision('weight_out').notNull(),
		factoryNett: doublePrecision('factory_nett'),
		deduction: doublePrecision(),
		bucket: doublePrecision(),
		remark: varchar({ length: 255 }),
		customerId: bigint('customer_id', { mode: 'number' }).references(() => personPerson.id),
		driverId: bigint('driver_id', { mode: 'number' }).references(() => personPerson.id),
		productId: bigint('product_id', { mode: 'number' }).references(() => productsProduct.id),
		supplierId: bigint('supplier_id', { mode: 'number' }).references(() => personPerson.id),
		vehicleId: bigint('vehicle_id', { mode: 'number' }).references(() => vehiclesVehicle.id),
		nett: doublePrecision(),
		unit: varchar({ length: 10 }).notNull()
	},
 */

const inventoryInsertFormSchema = v.object({
	date: v.pipe(v.string(), v.isoDate()),
	customerTicketNo: v.optional(v.pipe(v.string(), v.minLength(1))),
	supplierQty: v.pipe(v.number()),
	ticketNo: v.pipe(v.string(), v.minLength(1)),
	do: v.pipe(v.string(), v.minLength(1)),
	weightIn: v.pipe(v.number()),
	weightOut: v.pipe(v.number()),
	factoryNett: v.optional(v.pipe(v.number())),
	deduction: v.optional(v.pipe(v.number())),
	bucket: v.optional(v.pipe(v.number())),
	remark: v.optional(v.pipe(v.string())),
	customerId: v.optional(v.pipe(v.number(), v.integer(), v.minValue(1))),
	driverId: v.optional(v.pipe(v.number(), v.integer(), v.minValue(1))),
	productId: v.optional(v.pipe(v.number(), v.integer(), v.minValue(1))),
	supplierId: v.optional(v.pipe(v.number(), v.integer(), v.minValue(1))),
	vehicleId: v.optional(v.pipe(v.number(), v.integer(), v.minValue(1))),
	nett: v.optional(v.pipe(v.number())),
	unit: v.pipe(v.string(), v.minLength(1))
});

export const insertInventory = form(inventoryInsertFormSchema, async (inventory) => {
	requireAuthenticatedUser();
	let [res] = await db.insert(inventoriesInventory).values(inventory).returning();
	return res;
});

const inventoryUpdateFormSchema = v.object({
	id: v.pipe(v.number(), v.integer(), v.minValue(1)),
	date: v.pipe(v.string(), v.isoDate()),
	customerTicketNo: v.optional(v.pipe(v.string(), v.minLength(1))),
	supplierQty: v.pipe(v.number()),
	ticketNo: v.pipe(v.string(), v.minLength(1)),
	do: v.pipe(v.string(), v.minLength(1)),
	weightIn: v.pipe(v.number()),
	weightOut: v.pipe(v.number()),
	factoryNett: v.optional(v.pipe(v.number())),
	deduction: v.optional(v.pipe(v.number())),
	bucket: v.optional(v.pipe(v.number())),
	remark: v.optional(v.pipe(v.string())),
	customerId: v.optional(v.pipe(v.number(), v.integer(), v.minValue(1))),
	driverId: v.optional(v.pipe(v.number(), v.integer(), v.minValue(1))),
	productId: v.optional(v.pipe(v.number(), v.integer(), v.minValue(1))),
	supplierId: v.optional(v.pipe(v.number(), v.integer(), v.minValue(1))),
	vehicleId: v.optional(v.pipe(v.number(), v.integer(), v.minValue(1))),
	nett: v.optional(v.pipe(v.number())),
	unit: v.pipe(v.string(), v.minLength(1))
});

export const updateInventory = form(
	inventoryUpdateFormSchema,
	async ({
		id,
		date,
		customerTicketNo,
		supplierQty,
		ticketNo,
		do: do_,
		weightIn,
		weightOut,
		factoryNett,
		deduction,
		bucket,
		remark,
		customerId,
		driverId,
		productId,
		supplierId,
		vehicleId,
		nett,
		unit
	}) => {
		requireAuthenticatedUser();

		let [res] = await db
			.update(inventoriesInventory)
			.set({
				date,
				customerTicketNo,
				supplierQty,
				ticketNo,
				do: do_,
				weightIn,
				weightOut,
				factoryNett,
				deduction,
				bucket,
				remark,
				customerId,
				driverId,
				productId,
				supplierId,
				vehicleId,
				nett,
				unit
			})
			.where(eq(inventoriesInventory.id, id))
			.returning();

		return res;
	}
);

const deleteSchema = v.pipe(v.number(), v.integer(), v.minValue(1));

export const deleteInventory = command(deleteSchema, async (id) => {
	requireAuthenticatedUser();

	let [res] = await db
		.delete(inventoriesInventory)
		.where(eq(inventoriesInventory.id, id))
		.returning();

	return res;
});
