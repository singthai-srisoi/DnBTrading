import { form, query, command } from '$app/server';
import { and, asc, eq, ilike, or } from 'drizzle-orm';
import * as v from 'valibot';

import { db } from '$lib/server/db';
import { productsProduct } from '$lib/server/schema';
import {
	getTableColumnKeys,
	requireAuthenticatedUser,
	createPaginationQuerySchema,
	paginate
} from '$lib/helper';

const { columns: productColumns, keys: productOrderColumns } = getTableColumnKeys(productsProduct);
type ProductColumn = keyof typeof productColumns;

const productQuerySchema = createPaginationQuerySchema(productOrderColumns);

/**
 * List all person for select/dropdown options.
 */
export const listProductOptions = query(async () => {
	requireAuthenticatedUser();

	return db.select().from(productsProduct).orderBy(asc(productsProduct.name));
});

/**
 * Get paginated persons.
 */
export const getProducts = query(
	productQuerySchema,
	async ({ page, limit, orderBy, orderDir, search }) => {
		requireAuthenticatedUser();

		const conditions = search
			? or(ilike(productsProduct.name, `%${search}%`), ilike(productsProduct.code, `%${search}%`))
			: undefined;

		return await paginate(db, {
			table: productsProduct,
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
export const productsProduct = pgTable(
	'products_product',
	{
		id: bigint({ mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
		code: varchar({ length: 10 }).notNull(),
		name: varchar({ length: 100 }).notNull(),
		price: integer().notNull(),
		typeId: varchar('type_id', { length: 10 }).references(() => productsProducttype.code)
	},
 */

const productInsertFormSchema = v.object({
	code: v.pipe(v.string(), v.minLength(1)),
	name: v.pipe(v.string(), v.minLength(1)),
	price: v.pipe(v.number(), v.minValue(0)),
	typeId: v.optional(v.pipe(v.string(), v.transform((value) => value || null)))
});

export const insertProduct = form(productInsertFormSchema, async (product) => {
	requireAuthenticatedUser();
	let [res] = await db.insert(productsProduct).values(product).returning();
	return res;
});

const productUpdateFormSchema = v.object({
	id: v.pipe(v.number(), v.integer(), v.minValue(1)),
	code: v.pipe(v.string(), v.minLength(1)),
	name: v.pipe(v.string(), v.minLength(1)),
	price: v.pipe(v.number(), v.minValue(0)),
	typeId: v.optional(v.pipe(v.string(), v.transform((value) => value || null)))
});

export const updateProduct = form(
	productUpdateFormSchema,
	async ({ id, code, name, price, typeId }) => {
		requireAuthenticatedUser();

		let [res] = await db
			.update(productsProduct)
			.set({
				code,
				name,
				price,
				typeId
			})
			.where(eq(productsProduct.id, id))
			.returning();

		return res;
	}
);

const deleteSchema = v.pipe(v.number(), v.integer(), v.minValue(1));

export const deleteProduct = command(deleteSchema, async (id) => {
	requireAuthenticatedUser();

	let [res] = await db.delete(productsProduct).where(eq(productsProduct.id, id)).returning();

	return res;
});
