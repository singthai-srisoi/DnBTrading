import { form, query, command } from '$app/server';
import { and, asc, eq, ilike, or } from 'drizzle-orm';
import * as v from 'valibot';

import { db } from '$lib/server/db';
import { vehiclesVehicle } from '$lib/server/schema';
import {
	getTableColumnKeys,
	requireAuthenticatedUser,
	createPaginationQuerySchema,
	paginate
} from '$lib/helper';

const { columns: vehicleColumns, keys: vehicleOrderColumns } = getTableColumnKeys(vehiclesVehicle);
type VehicleColumn = keyof typeof vehicleColumns;

const vehicleQuerySchema = createPaginationQuerySchema(vehicleOrderColumns);

/**
 * List all person for select/dropdown options.
 */
export const listVehicleOptions = query(async () => {
	requireAuthenticatedUser();

	return db.select().from(vehiclesVehicle).orderBy(asc(vehiclesVehicle.regNo));
});

/**
 * Get paginated persons.
 */
export const getVehicles = query(
	vehicleQuerySchema,
	async ({ page, limit, orderBy, orderDir, search }) => {
		requireAuthenticatedUser();

		const conditions = search
			? or(ilike(vehiclesVehicle.regNo, `%${search}%`), ilike(vehiclesVehicle.model, `%${search}%`))
			: undefined;

		return await paginate(db, {
			table: vehiclesVehicle,
			page,
			limit,
			orderBy,
			orderDir,
			where: conditions,
			defaultSortColumn: 'regNo'
		});
	}
);

// const branchInsertSchema = createInsertSchema(branches);
//
/**
export const personPerson = pgTable('person_person', {
	id: bigint({ mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
	code: varchar({ length: 10 }).notNull(),
	name: varchar({ length: 100 }).notNull(),
	phone: varchar({ length: 20 }),
	ic: varchar({ length: 100 }),
	type: varchar({ length: 10 }).notNull()
 });
 */

const vehicleInsertFormSchema = v.object({
	regNo: v.pipe(v.string(), v.minLength(1)),
	model: v.pipe(v.string(), v.minLength(1))
});

export const insertVehicle = form(vehicleInsertFormSchema, async (vehicle) => {
	requireAuthenticatedUser();
	let [res] = await db.insert(vehiclesVehicle).values(vehicle).returning();
	return res;
});

const vehicleUpdateFormSchema = v.object({
	id: v.pipe(v.number(), v.integer(), v.minValue(1)),
	regNo: v.pipe(v.string(), v.minLength(1)),
	model: v.pipe(v.string(), v.minLength(1))
});

export const updateVehicle = form(vehicleUpdateFormSchema, async ({ id, regNo, model }) => {
	requireAuthenticatedUser();

	let [res] = await db
		.update(vehiclesVehicle)
		.set({
			regNo,
			model
		})
		.where(eq(vehiclesVehicle.id, id))
		.returning();

	return res;
});

const deleteSchema = v.pipe(v.number(), v.integer(), v.minValue(1));

export const deleteVehicle = command(deleteSchema, async (id) => {
	requireAuthenticatedUser();

	let [res] = await db.delete(vehiclesVehicle).where(eq(vehiclesVehicle.id, id)).returning();

	return res;
});
