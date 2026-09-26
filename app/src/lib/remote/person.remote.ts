import { form, query, command } from '$app/server';
import { and, asc, eq, ilike, or } from 'drizzle-orm';
import * as v from 'valibot';

import { db } from '$lib/server/db';
import { personPerson } from '$lib/server/schema';
import {
	getTableColumnKeys,
	requireAuthenticatedUser,
	createPaginationQuerySchema,
	paginate
} from '$lib/helper';

const { columns: personColumns, keys: personOrderColumns } = getTableColumnKeys(personPerson);
type PersonColumn = keyof typeof personColumns;

const personType = v.picklist(['customer', 'driver', 'supplier']);
const personQuerySchema = () => {
	const columnEnum = Object.fromEntries(personOrderColumns.map((column) => [column, column]));

	return v.object({
		page: v.pipe(v.number(), v.integer(), v.minValue(1)),
		limit: v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(100)),
		// orderBy: v.optional(v.enum(columnEnum)),
		orderBy: v.optional(v.picklist(personOrderColumns)),
		orderDir: v.optional(
			v.enum({
				asc: 'asc',
				desc: 'desc'
			})
		),
		search: v.optional(v.string()),
		type: personType
	});
};
// for other to generate query schema using helper, personPerson need extra field
// createPaginationQuerySchema(personOrderColumns);

/**
 * List all person for select/dropdown options.
 */
const personOptionsQuery = v.object({
	type: v.pipe(personType, v.minLength(1))
});
export const listPersonOptions = query(personOptionsQuery, async ({ type }) => {
	requireAuthenticatedUser();

	return db
		.select()
		.from(personPerson)
		.where(eq(personPerson.type, type))
		.orderBy(asc(personPerson.code));
});

/**
 * Get paginated persons.
 */
export const getPerson = query(
	personQuerySchema(),
	async ({ page, limit, orderBy, orderDir, search, type }) => {
		requireAuthenticatedUser();

		const conditions = search
			? or(ilike(personPerson.name, `%${search}%`), ilike(personPerson.code, `%${search}%`))
			: undefined;

		return await paginate(db, {
			table: personPerson,
			page,
			limit,
			orderBy,
			orderDir,
			where: and(eq(personPerson.type, type), conditions),
			defaultSortColumn: 'name'
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

const personInsertFormSchema = v.object({
	name: v.pipe(v.string(), v.minLength(1)),
	code: v.pipe(v.string(), v.minLength(1)),
	phone: v.pipe(v.string()),
	ic: v.pipe(v.string()),
	type: v.pipe(personType, v.minLength(1))
});

export const insertPerson = form(personInsertFormSchema, async (person) => {
	requireAuthenticatedUser();
	let [res] = await db.insert(personPerson).values(person).returning();
	return res;
});

const personUpdateFormSchema = v.object({
	id: v.pipe(v.number(), v.integer(), v.minValue(1)),
	name: v.pipe(v.string(), v.minLength(1)),
	code: v.pipe(v.string(), v.minLength(1)),
	phone: v.pipe(v.string()),
	ic: v.pipe(v.string()),
	type: v.pipe(personType, v.minLength(1))
});

export const updatePerson = form(
	personUpdateFormSchema,
	async ({ id, name, code, phone, ic, type }) => {
		requireAuthenticatedUser();

		let [res] = await db
			.update(personPerson)
			.set({
				name,
				code,
				phone,
				ic
			})
			.where(eq(personPerson.id, id))
			.returning();

		return res;
	}
);

const deleteSchema = v.pipe(v.number(), v.integer(), v.minValue(1));

export const deletePerson = command(deleteSchema, async (id) => {
	requireAuthenticatedUser();

	let [res] = await db.delete(personPerson).where(eq(personPerson.id, id)).returning();

	return res;
});
