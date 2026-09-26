import {
	pgTable,
	integer,
	bigint,
	varchar,
	timestamp,
	date,
	text,
	boolean,
	doublePrecision,
	smallint,
	index,
	foreignKey,
	primaryKey,
	unique,
	check
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// #region Django Auth
export const authGroup = pgTable(
	'auth_group',
	{
		id: integer().primaryKey().generatedByDefaultAsIdentity(),
		name: varchar({ length: 150 }).notNull()
	},
	(table) => [
		index('auth_group_name_a6ea08ec_like').using(
			'btree',
			table.name.asc().nullsLast().op('varchar_pattern_ops')
		),
		unique('auth_group_name_key').on(table.name)
	]
);

export const authGroupPermissions = pgTable(
	'auth_group_permissions',
	{
		id: bigint({ mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
		groupId: integer('group_id')
			.notNull()
			.references(() => authGroup.id),
		permissionId: integer('permission_id')
			.notNull()
			.references(() => authPermission.id)
	},
	(table) => [
		index('auth_group_permissions_group_id_b120cbf9').using(
			'btree',
			table.groupId.asc().nullsLast()
		),
		index('auth_group_permissions_permission_id_84c5c92e').using(
			'btree',
			table.permissionId.asc().nullsLast()
		),
		unique('auth_group_permissions_group_id_permission_id_0cd325b0_uniq').on(
			table.groupId,
			table.permissionId
		)
	]
);

export const authPermission = pgTable(
	'auth_permission',
	{
		id: integer().primaryKey().generatedByDefaultAsIdentity(),
		name: varchar({ length: 255 }).notNull(),
		contentTypeId: integer('content_type_id')
			.notNull()
			.references(() => djangoContentType.id),
		codename: varchar({ length: 100 }).notNull()
	},
	(table) => [
		index('auth_permission_content_type_id_2f476e4b').using(
			'btree',
			table.contentTypeId.asc().nullsLast()
		),
		unique('auth_permission_content_type_id_codename_01ab375a_uniq').on(
			table.contentTypeId,
			table.codename
		)
	]
);

export const authUser = pgTable(
	'auth_user',
	{
		id: integer().primaryKey().generatedByDefaultAsIdentity(),
		password: varchar({ length: 128 }).notNull(),
		lastLogin: timestamp('last_login', { withTimezone: true }),
		isSuperuser: boolean('is_superuser').notNull(),
		username: varchar({ length: 150 }).notNull(),
		firstName: varchar('first_name', { length: 150 }).notNull(),
		lastName: varchar('last_name', { length: 150 }).notNull(),
		email: varchar({ length: 254 }).notNull(),
		isStaff: boolean('is_staff').notNull(),
		isActive: boolean('is_active').notNull(),
		dateJoined: timestamp('date_joined', { withTimezone: true }).notNull()
	},
	(table) => [
		index('auth_user_username_6821ab7c_like').using(
			'btree',
			table.username.asc().nullsLast().op('varchar_pattern_ops')
		),
		unique('auth_user_username_key').on(table.username)
	]
);

export const authUserGroups = pgTable(
	'auth_user_groups',
	{
		id: bigint({ mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
		userId: integer('user_id')
			.notNull()
			.references(() => authUser.id),
		groupId: integer('group_id')
			.notNull()
			.references(() => authGroup.id)
	},
	(table) => [
		index('auth_user_groups_group_id_97559544').using('btree', table.groupId.asc().nullsLast()),
		index('auth_user_groups_user_id_6a12ed8b').using('btree', table.userId.asc().nullsLast()),
		unique('auth_user_groups_user_id_group_id_94350c0c_uniq').on(table.userId, table.groupId)
	]
);

export const authUserUserPermissions = pgTable(
	'auth_user_user_permissions',
	{
		id: bigint({ mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
		userId: integer('user_id')
			.notNull()
			.references(() => authUser.id),
		permissionId: integer('permission_id')
			.notNull()
			.references(() => authPermission.id)
	},
	(table) => [
		index('auth_user_user_permissions_permission_id_1fbb5f2c').using(
			'btree',
			table.permissionId.asc().nullsLast()
		),
		index('auth_user_user_permissions_user_id_a95ead1b').using(
			'btree',
			table.userId.asc().nullsLast()
		),
		unique('auth_user_user_permissions_user_id_permission_id_14a6b632_uniq').on(
			table.userId,
			table.permissionId
		)
	]
);

export const djangoAdminLog = pgTable(
	'django_admin_log',
	{
		id: integer().primaryKey().generatedByDefaultAsIdentity(),
		actionTime: timestamp('action_time', { withTimezone: true }).notNull(),
		objectId: text('object_id'),
		objectRepr: varchar('object_repr', { length: 200 }).notNull(),
		actionFlag: smallint('action_flag').notNull(),
		changeMessage: text('change_message').notNull(),
		contentTypeId: integer('content_type_id').references(() => djangoContentType.id),
		userId: integer('user_id')
			.notNull()
			.references(() => authUser.id)
	},
	(table) => [
		index('django_admin_log_content_type_id_c4bce8eb').using(
			'btree',
			table.contentTypeId.asc().nullsLast()
		),
		index('django_admin_log_user_id_c564eba6').using('btree', table.userId.asc().nullsLast()),
		check('django_admin_log_action_flag_check', sql`(action_flag >= 0)`)
	]
);

export const djangoContentType = pgTable(
	'django_content_type',
	{
		id: integer().primaryKey().generatedByDefaultAsIdentity(),
		appLabel: varchar('app_label', { length: 100 }).notNull(),
		model: varchar({ length: 100 }).notNull()
	},
	(table) => [
		unique('django_content_type_app_label_model_76bd3d3b_uniq').on(table.appLabel, table.model)
	]
);

export const djangoMigrations = pgTable('django_migrations', {
	id: bigint({ mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
	app: varchar({ length: 255 }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	applied: timestamp({ withTimezone: true }).notNull()
});

export const djangoSession = pgTable(
	'django_session',
	{
		sessionKey: varchar('session_key', { length: 40 }).primaryKey(),
		sessionData: text('session_data').notNull(),
		expireDate: timestamp('expire_date', { withTimezone: true }).notNull()
	},
	(table) => [
		index('django_session_expire_date_a5c62663').using('btree', table.expireDate.asc().nullsLast()),
		index('django_session_session_key_c0390e0f_like').using(
			'btree',
			table.sessionKey.asc().nullsLast().op('varchar_pattern_ops')
		)
	]
);

// #endregion

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
	(table) => [
		index('inventories_inventory_customer_id_6e232f4f').using(
			'btree',
			table.customerId.asc().nullsLast()
		),
		index('inventories_inventory_driver_id_440b3e60').using(
			'btree',
			table.driverId.asc().nullsLast()
		),
		index('inventories_inventory_product_id_8199cb3d').using(
			'btree',
			table.productId.asc().nullsLast()
		),
		index('inventories_inventory_supplier_id_c1910ce3').using(
			'btree',
			table.supplierId.asc().nullsLast()
		),
		index('inventories_inventory_ticket_no_4343be3a_like').using(
			'btree',
			table.ticketNo.asc().nullsLast().op('varchar_pattern_ops')
		),
		index('inventories_inventory_vehicle_id_8686ba5c').using(
			'btree',
			table.vehicleId.asc().nullsLast()
		),
		unique('inventories_inventory_ticket_no_4343be3a_uniq').on(table.ticketNo)
	]
);

export const inventoriesLastselectedunit = pgTable('inventories_lastselectedunit', {
	id: bigint({ mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
	unit: varchar({ length: 10 }).notNull()
});

export const personPerson = pgTable('person_person', {
	id: bigint({ mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
	code: varchar({ length: 10 }).notNull(),
	name: varchar({ length: 100 }).notNull(),
	phone: varchar({ length: 20 }),
	ic: varchar({ length: 100 }),
	type: varchar({ length: 10 }).notNull()
});

export const productsProduct = pgTable(
	'products_product',
	{
		id: bigint({ mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
		code: varchar({ length: 10 }).notNull(),
		name: varchar({ length: 100 }).notNull(),
		price: integer().notNull(),
		typeId: varchar('type_id', { length: 10 }).references(() => productsProducttype.code)
	},
	(table) => [
		index('products_product_type_id_027d8fc4').using('btree', table.typeId.asc().nullsLast()),
		index('products_product_type_id_027d8fc4_like').using(
			'btree',
			table.typeId.asc().nullsLast().op('varchar_pattern_ops')
		)
	]
);

export const productsProducttype = pgTable(
	'products_producttype',
	{
		code: varchar({ length: 10 }).primaryKey(),
		name: varchar({ length: 100 }).notNull()
	},
	(table) => [
		index('products_producttype_code_f1627f17_like').using(
			'btree',
			table.code.asc().nullsLast().op('varchar_pattern_ops')
		)
	]
);

export const tokenBlacklistBlacklistedtoken = pgTable(
	'token_blacklist_blacklistedtoken',
	{
		id: bigint({ mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
		blacklistedAt: timestamp('blacklisted_at', { withTimezone: true }).notNull(),
		tokenId: bigint('token_id', { mode: 'number' })
			.notNull()
			.references(() => tokenBlacklistOutstandingtoken.id)
	},
	(table) => [unique('token_blacklist_blacklistedtoken_token_id_key').on(table.tokenId)]
);

export const tokenBlacklistOutstandingtoken = pgTable(
	'token_blacklist_outstandingtoken',
	{
		id: bigint({ mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
		token: text().notNull(),
		createdAt: timestamp('created_at', { withTimezone: true }),
		expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
		userId: integer('user_id').references(() => authUser.id),
		jti: varchar({ length: 255 }).notNull()
	},
	(table) => [
		index('token_blacklist_outstandingtoken_jti_hex_d9bdf6f7_like').using(
			'btree',
			table.jti.asc().nullsLast().op('varchar_pattern_ops')
		),
		index('token_blacklist_outstandingtoken_user_id_83bc629a').using(
			'btree',
			table.userId.asc().nullsLast()
		),
		unique('token_blacklist_outstandingtoken_jti_hex_d9bdf6f7_uniq').on(table.jti)
	]
);

export const vehiclesVehicle = pgTable('vehicles_vehicle', {
	id: bigint({ mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
	regNo: varchar('reg_no', { length: 10 }).notNull(),
	model: varchar({ length: 100 }).notNull()
});
