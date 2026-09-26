import {
	asc,
	count,
	desc,
	// getTableColumns,
	getColumns,
	type InferSelectModel,
	type SQL,
	type Table
} from 'drizzle-orm';
import * as v from 'valibot';
import type { PgTable, PgAsyncDatabase, PgSelect } from 'drizzle-orm/pg-core';

// type PgDatabase = typeof db
/**
 * Generic pagination query schema.
 *
 * `columns` defines which columns are allowed to be used
 * for ordering from the client.
 */
export function createPaginationQuerySchema<const Columns extends string[]>(columns: Columns) {
	const columnEnum = Object.fromEntries(columns.map((column) => [column, column])) as {
		[K in Columns[number]]: K;
	};

	return v.object({
		page: v.pipe(v.number(), v.integer(), v.minValue(1)),
		limit: v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(100)),
		// orderBy: v.optional(v.enum(columnEnum)),
		orderBy: v.optional(v.picklist(columns)),
		orderDir: v.optional(
			v.enum({
				asc: 'asc',
				desc: 'desc'
			})
		),
		search: v.optional(v.string())
	});
}

export interface PaginationQuery<Columns extends string[]> {
	page: number;
	limit: number;
	orderBy?: Columns[number];
	orderDir?: 'asc' | 'desc';
	search?: string;
}

/**
 * Generic pagination response.
 */
export function createPaginationResponse<Items, OrderBy extends string>(
	items: Items[],
	page: number,
	limit: number,
	total: number,
	orderBy?: OrderBy,
	orderDir?: 'asc' | 'desc'
) {
	return {
		items,
		page,
		limit,
		total,
		maxPage: Math.ceil(total / limit),
		orderBy,
		orderDir
	};
}

export function getTableColumnKeys<T extends Table>(table: T) {
	const columns = getColumns(table);
	const keys = Object.keys(columns) as [
		keyof typeof columns & string,
		...(keyof typeof columns & string)[]
	];

	return {
		columns,
		keys
	};
}

// Example usage:
// 1. One-line call to derive runtime helpers
// const { columns: branchColumns, keys: branchOrderColumns } = getTableColumnKeys(branches)

// 2. Type helper (if needed elsewhere in your file)
// type BranchColumn = keyof typeof branchColumns

// 3. Create a pagination query schema for branches
// const branchQuerySchema = createPaginationQuerySchema(branchOrderColumns);

// #region Paginate Functions
export interface PaginateOptions<T extends PgTable> {
	table: T;
	page: number;
	limit: number;
	orderBy?: string;
	orderDir?: 'asc' | 'desc';
	where?: SQL;
	defaultSortColumn?: keyof T['_']['columns'] & string;
}

export interface PaginateResult<T extends PgTable> {
	items: InferSelectModel<T>[];
	page: number;
	limit: number;
	total: number;
	maxPage: number;
	orderBy?: keyof T['_']['columns'] & string;
	orderDir?: 'asc' | 'desc';
}

export async function paginate<T extends PgTable>(
	db: PgAsyncDatabase<any, any>,
	{ table, page, limit, orderBy, orderDir = 'asc', where, defaultSortColumn }: PaginateOptions<T>
): Promise<PaginateResult<T>> {
	const offset = (page - 1) * limit;
	const columns = getColumns(table);

	const [{ total }] = await db
		.select({ total: count() })
		// @ts-ignore
		.from(table)
		.where(where);

	const query = db
		.select()
		// @ts-ignore
		.from(table)
		.where(where);

	const sortKey = orderBy && orderBy in columns ? orderBy : defaultSortColumn;

	if (sortKey && sortKey in columns) {
		const column = columns[sortKey as keyof typeof columns];

		query.orderBy(orderDir === 'desc' ? desc(column) : asc(column));
	}

	const items = await query.limit(limit).offset(offset);

	return {
		items,
		page,
		limit,
		total,
		maxPage: Math.ceil(total / limit),
		orderBy: sortKey,
		orderDir
	};
}

// #endregion Paginate Functions

// #region Paginate Enhanced Functions
export async function paginateEnhanced<T extends PgTable, TQuery extends PgSelect>(
	db: PgAsyncDatabase<any, any>,
	buildQuery: () => TQuery,
	{ table, page, limit, orderBy, orderDir = 'asc', defaultSortColumn }: PaginateOptions<T>
): Promise<PaginateResult<T>> {
	const offset = (page - 1) * limit;
	const columns = getColumns(table);

	// Data query — caller's joins/where/select are already baked in
	let dataQuery = buildQuery();
	const sortKey = orderBy && orderBy in columns ? orderBy : defaultSortColumn;

	if (sortKey && sortKey in columns) {
		const column = columns[sortKey as keyof typeof columns];

		dataQuery.orderBy(orderDir === 'desc' ? desc(column) : asc(column));
	}
	const items = await dataQuery.limit(limit).offset(offset);

	// Count query — rebuild the same joins/where, wrap as subquery, count the outer
	const sub = buildQuery().as('paginate_sq');
	// @ts-ignore
	const [{ total }] = await db.select({ total: count() }).from(sub);

	return {
		// @ts-ignore
		items,
		page,
		limit,
		total,
		maxPage: Math.max(1, Math.ceil(total / limit))
	};
}

// #endregion Paginate Enhanced Functions

export interface PaginationState<K extends string = string> {
	page: number;
	limit: number;
	orderBy: K | undefined;
	orderDir: 'asc' | 'desc' | undefined;
	search: string | undefined;
	[k: string]: any;
}

// 2. State Creator Helper
export function createPaginationState<K extends string, Extra extends Record<string, unknown> = Record<never, never>>(
	defaults?: Partial<PaginationState<K>>,
	extra?: Extra
): PaginationState<K> & Extra {
	return {
		page: defaults?.page ?? 1,
		limit: defaults?.limit ?? 10,
		orderBy: defaults?.orderBy ?? undefined,
		orderDir: defaults?.orderDir ?? undefined,
		search: defaults?.search ?? undefined,
		...extra
	} as PaginationState<K> & Extra;
}

// 3. Query Formatter Helper
export function getPaginationQueryObject<K extends string>(state: PaginationState<K>) {
	return {
		page: state.page,
		limit: state.limit,
		orderBy: state.orderBy,
		orderDir: state.orderDir,
		search: state.search
	};
}
