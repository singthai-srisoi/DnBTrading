import { form, query, command } from '$app/server';
import { and, asc, eq, ilike, or } from 'drizzle-orm';
import * as v from 'valibot';

import { db } from '$lib/server/db';
import { djangoAdminLog, productsProducttype } from '$lib/server/schema';
import {
	getTableColumnKeys,
	requireAuthenticatedUser,
	createPaginationQuerySchema,
	paginate
} from '$lib/helper';

const { columns: productColumns, keys: productOrderColumns } = getTableColumnKeys(productsProducttype);
type ProductColumn = keyof typeof productColumns;

const productQuerySchema = createPaginationQuerySchema(productOrderColumns);

/**
 * List all person for select/dropdown options.
 */
export const listProductTypeOptions = query(async () => {
	requireAuthenticatedUser();

	return db.select().from(productsProducttype).orderBy(asc(productsProducttype.name));
});

/**
 * Get paginated persons.
 */
export const getProductTypes = query(
	productQuerySchema,
	async ({ page, limit, orderBy, orderDir, search }) => {
		requireAuthenticatedUser();

		const conditions = search
			? or(ilike(productsProducttype.name, `%${search}%`), ilike(productsProducttype.code, `%${search}%`))
			: undefined;

		return await paginate(db, {
			table: productsProducttype,
			page,
			limit,
			orderBy,
			orderDir,
			where: conditions,
			defaultSortColumn: 'name'
		});
	}
);

// const branchInsertSchema = createInsertSchema(branches);
//
/**
export const productsProducttype = pgTable(
	'products_product',
	{
		id: bigint({ mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
		code: varchar({ length: 10 }).notNull(),
		name: varchar({ length: 100 }).notNull(),
		price: integer().notNull(),
		typeId: varchar('type_id', { length: 10 }).references(() => productsProducttypetype.code)
	},
 */

const productInsertFormSchema = v.object({
	code: v.pipe(v.string(), v.minLength(1)),
	name: v.pipe(v.string(), v.minLength(1)),
});

export const insertProductType = form(productInsertFormSchema, async (product) => {
	requireAuthenticatedUser();
	let [res] = await db.insert(productsProducttype).values(product).returning();
	return res;
});

const productTypeUpdateFormSchema = v.object({
	code: v.pipe(v.string(), v.minLength(1)),
	name: v.pipe(v.string(), v.minLength(1)),
});

export const updateProductType = form(
	productTypeUpdateFormSchema,
	async ({ code, name }) => {
		requireAuthenticatedUser();

		// let [res] = await db
		// 	.update(productsProducttype)
		// 	.set({
		// 		code,
		// 		name,
		// 	})
		// 	.where(eq(productsProducttype.id, id))
		// 	.returning();
		// 
		// delete and create again
		await db.delete(productsProducttype).where(eq(productsProducttype.code, code)).returning();
    let [res] = await db.insert(productsProducttype).values({ code, name }).returning();

		return res;
	}
);

const deleteSchema = v.pipe(v.string(), v.minLength(1));

export const deleteProductType = command(deleteSchema, async (code) => {
	requireAuthenticatedUser();

	let [res] = await db.delete(productsProducttype).where(eq(productsProducttype.code, code)).returning();

	return res;
});
