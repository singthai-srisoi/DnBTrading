import { pgTable, index, foreignKey, unique, bigint, integer, varchar, timestamp, text, boolean, check, smallint, date, doublePrecision } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const authUserUserPermissions = pgTable("auth_user_user_permissions", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "auth_user_user_permissions_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	userId: integer("user_id").notNull(),
	permissionId: integer("permission_id").notNull(),
}, (table) => [
	index("auth_user_user_permissions_permission_id_1fbb5f2c").using("btree", table.permissionId.asc().nullsLast().op("int4_ops")),
	index("auth_user_user_permissions_user_id_a95ead1b").using("btree", table.userId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.permissionId],
			foreignColumns: [authPermission.id],
			name: "auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [authUser.id],
			name: "auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id"
		}),
	unique("auth_user_user_permissions_user_id_permission_id_14a6b632_uniq").on(table.userId, table.permissionId),
]);

export const productsProduct = pgTable("products_product", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "products_product_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	code: varchar({ length: 10 }).notNull(),
	name: varchar({ length: 100 }).notNull(),
	price: integer().notNull(),
	typeId: varchar("type_id", { length: 10 }),
}, (table) => [
	index("products_product_type_id_027d8fc4").using("btree", table.typeId.asc().nullsLast().op("text_ops")),
	index("products_product_type_id_027d8fc4_like").using("btree", table.typeId.asc().nullsLast().op("varchar_pattern_ops")),
	foreignKey({
			columns: [table.typeId],
			foreignColumns: [productsProducttype.code],
			name: "products_product_type_id_027d8fc4_fk_products_producttype_code"
		}),
]);

export const djangoMigrations = pgTable("django_migrations", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "django_migrations_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	app: varchar({ length: 255 }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	applied: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
});

export const djangoSession = pgTable("django_session", {
	sessionKey: varchar("session_key", { length: 40 }).primaryKey().notNull(),
	sessionData: text("session_data").notNull(),
	expireDate: timestamp("expire_date", { withTimezone: true, mode: 'string' }).notNull(),
}, (table) => [
	index("django_session_expire_date_a5c62663").using("btree", table.expireDate.asc().nullsLast().op("timestamptz_ops")),
	index("django_session_session_key_c0390e0f_like").using("btree", table.sessionKey.asc().nullsLast().op("varchar_pattern_ops")),
]);

export const personPerson = pgTable("person_person", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "person_person_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	code: varchar({ length: 10 }).notNull(),
	name: varchar({ length: 100 }).notNull(),
	phone: varchar({ length: 20 }),
	ic: varchar({ length: 100 }),
	type: varchar({ length: 10 }).notNull(),
});

export const authGroup = pgTable("auth_group", {
	id: integer().primaryKey().generatedByDefaultAsIdentity({ name: "auth_group_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	name: varchar({ length: 150 }).notNull(),
}, (table) => [
	index("auth_group_name_a6ea08ec_like").using("btree", table.name.asc().nullsLast().op("varchar_pattern_ops")),
	unique("auth_group_name_key").on(table.name),
]);

export const djangoContentType = pgTable("django_content_type", {
	id: integer().primaryKey().generatedByDefaultAsIdentity({ name: "django_content_type_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	appLabel: varchar("app_label", { length: 100 }).notNull(),
	model: varchar({ length: 100 }).notNull(),
}, (table) => [
	unique("django_content_type_app_label_model_76bd3d3b_uniq").on(table.appLabel, table.model),
]);

export const authUserGroups = pgTable("auth_user_groups", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "auth_user_groups_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	userId: integer("user_id").notNull(),
	groupId: integer("group_id").notNull(),
}, (table) => [
	index("auth_user_groups_group_id_97559544").using("btree", table.groupId.asc().nullsLast().op("int4_ops")),
	index("auth_user_groups_user_id_6a12ed8b").using("btree", table.userId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.groupId],
			foreignColumns: [authGroup.id],
			name: "auth_user_groups_group_id_97559544_fk_auth_group_id"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [authUser.id],
			name: "auth_user_groups_user_id_6a12ed8b_fk_auth_user_id"
		}),
	unique("auth_user_groups_user_id_group_id_94350c0c_uniq").on(table.userId, table.groupId),
]);

export const authUser = pgTable("auth_user", {
	id: integer().primaryKey().generatedByDefaultAsIdentity({ name: "auth_user_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	password: varchar({ length: 128 }).notNull(),
	lastLogin: timestamp("last_login", { withTimezone: true, mode: 'string' }),
	isSuperuser: boolean("is_superuser").notNull(),
	username: varchar({ length: 150 }).notNull(),
	firstName: varchar("first_name", { length: 150 }).notNull(),
	lastName: varchar("last_name", { length: 150 }).notNull(),
	email: varchar({ length: 254 }).notNull(),
	isStaff: boolean("is_staff").notNull(),
	isActive: boolean("is_active").notNull(),
	dateJoined: timestamp("date_joined", { withTimezone: true, mode: 'string' }).notNull(),
}, (table) => [
	index("auth_user_username_6821ab7c_like").using("btree", table.username.asc().nullsLast().op("varchar_pattern_ops")),
	unique("auth_user_username_key").on(table.username),
]);

export const djangoAdminLog = pgTable("django_admin_log", {
	id: integer().primaryKey().generatedByDefaultAsIdentity({ name: "django_admin_log_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	actionTime: timestamp("action_time", { withTimezone: true, mode: 'string' }).notNull(),
	objectId: text("object_id"),
	objectRepr: varchar("object_repr", { length: 200 }).notNull(),
	actionFlag: smallint("action_flag").notNull(),
	changeMessage: text("change_message").notNull(),
	contentTypeId: integer("content_type_id"),
	userId: integer("user_id").notNull(),
}, (table) => [
	index("django_admin_log_content_type_id_c4bce8eb").using("btree", table.contentTypeId.asc().nullsLast().op("int4_ops")),
	index("django_admin_log_user_id_c564eba6").using("btree", table.userId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.contentTypeId],
			foreignColumns: [djangoContentType.id],
			name: "django_admin_log_content_type_id_c4bce8eb_fk_django_co"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [authUser.id],
			name: "django_admin_log_user_id_c564eba6_fk_auth_user_id"
		}),
	check("django_admin_log_action_flag_check", sql`action_flag >= 0`),
]);

export const productsProducttype = pgTable("products_producttype", {
	code: varchar({ length: 10 }).primaryKey().notNull(),
	name: varchar({ length: 100 }).notNull(),
}, (table) => [
	index("products_producttype_code_f1627f17_like").using("btree", table.code.asc().nullsLast().op("varchar_pattern_ops")),
]);

export const tokenBlacklistOutstandingtoken = pgTable("token_blacklist_outstandingtoken", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "token_blacklist_outstandingtoken_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	token: text().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
	expiresAt: timestamp("expires_at", { withTimezone: true, mode: 'string' }).notNull(),
	userId: integer("user_id"),
	jti: varchar({ length: 255 }).notNull(),
}, (table) => [
	index("token_blacklist_outstandingtoken_jti_hex_d9bdf6f7_like").using("btree", table.jti.asc().nullsLast().op("varchar_pattern_ops")),
	index("token_blacklist_outstandingtoken_user_id_83bc629a").using("btree", table.userId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [authUser.id],
			name: "token_blacklist_outs_user_id_83bc629a_fk_auth_user"
		}),
	unique("token_blacklist_outstandingtoken_jti_hex_d9bdf6f7_uniq").on(table.jti),
]);

export const tokenBlacklistBlacklistedtoken = pgTable("token_blacklist_blacklistedtoken", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "token_blacklist_blacklistedtoken_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	blacklistedAt: timestamp("blacklisted_at", { withTimezone: true, mode: 'string' }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	tokenId: bigint("token_id", { mode: "number" }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.tokenId],
			foreignColumns: [tokenBlacklistOutstandingtoken.id],
			name: "token_blacklist_blacklistedtoken_token_id_3cc7fe56_fk"
		}),
	unique("token_blacklist_blacklistedtoken_token_id_key").on(table.tokenId),
]);

export const authPermission = pgTable("auth_permission", {
	id: integer().primaryKey().generatedByDefaultAsIdentity({ name: "auth_permission_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	name: varchar({ length: 255 }).notNull(),
	contentTypeId: integer("content_type_id").notNull(),
	codename: varchar({ length: 100 }).notNull(),
}, (table) => [
	index("auth_permission_content_type_id_2f476e4b").using("btree", table.contentTypeId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.contentTypeId],
			foreignColumns: [djangoContentType.id],
			name: "auth_permission_content_type_id_2f476e4b_fk_django_co"
		}),
	unique("auth_permission_content_type_id_codename_01ab375a_uniq").on(table.contentTypeId, table.codename),
]);

export const authGroupPermissions = pgTable("auth_group_permissions", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "auth_group_permissions_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	groupId: integer("group_id").notNull(),
	permissionId: integer("permission_id").notNull(),
}, (table) => [
	index("auth_group_permissions_group_id_b120cbf9").using("btree", table.groupId.asc().nullsLast().op("int4_ops")),
	index("auth_group_permissions_permission_id_84c5c92e").using("btree", table.permissionId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.permissionId],
			foreignColumns: [authPermission.id],
			name: "auth_group_permissio_permission_id_84c5c92e_fk_auth_perm"
		}),
	foreignKey({
			columns: [table.groupId],
			foreignColumns: [authGroup.id],
			name: "auth_group_permissions_group_id_b120cbf9_fk_auth_group_id"
		}),
	unique("auth_group_permissions_group_id_permission_id_0cd325b0_uniq").on(table.groupId, table.permissionId),
]);

export const vehiclesVehicle = pgTable("vehicles_vehicle", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "vehicles_vehicle_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	regNo: varchar("reg_no", { length: 10 }).notNull(),
	model: varchar({ length: 100 }).notNull(),
});

export const inventoriesInventory = pgTable("inventories_inventory", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "inventories_inventory_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	date: date().notNull(),
	customerTicketNo: varchar("customer_ticket_no", { length: 100 }),
	supplierQty: doublePrecision("supplier_qty").notNull(),
	ticketNo: varchar("ticket_no", { length: 100 }).notNull(),
	do: varchar({ length: 100 }).notNull(),
	weightIn: doublePrecision("weight_in").notNull(),
	weightOut: doublePrecision("weight_out").notNull(),
	factoryNett: doublePrecision("factory_nett"),
	deduction: doublePrecision(),
	bucket: doublePrecision(),
	remark: varchar({ length: 255 }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	customerId: bigint("customer_id", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	driverId: bigint("driver_id", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	productId: bigint("product_id", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	supplierId: bigint("supplier_id", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	vehicleId: bigint("vehicle_id", { mode: "number" }),
	nett: doublePrecision(),
	unit: varchar({ length: 10 }).notNull(),
}, (table) => [
	index("inventories_inventory_customer_id_6e232f4f").using("btree", table.customerId.asc().nullsLast().op("int8_ops")),
	index("inventories_inventory_driver_id_440b3e60").using("btree", table.driverId.asc().nullsLast().op("int8_ops")),
	index("inventories_inventory_product_id_8199cb3d").using("btree", table.productId.asc().nullsLast().op("int8_ops")),
	index("inventories_inventory_supplier_id_c1910ce3").using("btree", table.supplierId.asc().nullsLast().op("int8_ops")),
	index("inventories_inventory_ticket_no_4343be3a_like").using("btree", table.ticketNo.asc().nullsLast().op("varchar_pattern_ops")),
	index("inventories_inventory_vehicle_id_8686ba5c").using("btree", table.vehicleId.asc().nullsLast().op("int8_ops")),
	foreignKey({
			columns: [table.productId],
			foreignColumns: [productsProduct.id],
			name: "inventories_inventor_product_id_8199cb3d_fk_products_"
		}),
	foreignKey({
			columns: [table.vehicleId],
			foreignColumns: [vehiclesVehicle.id],
			name: "inventories_inventor_vehicle_id_8686ba5c_fk_vehicles_"
		}),
	foreignKey({
			columns: [table.customerId],
			foreignColumns: [personPerson.id],
			name: "inventories_inventory_customer_id_6e232f4f_fk_person_person_id"
		}),
	foreignKey({
			columns: [table.driverId],
			foreignColumns: [personPerson.id],
			name: "inventories_inventory_driver_id_440b3e60_fk_person_person_id"
		}),
	foreignKey({
			columns: [table.supplierId],
			foreignColumns: [personPerson.id],
			name: "inventories_inventory_supplier_id_c1910ce3_fk_person_person_id"
		}),
	unique("inventories_inventory_ticket_no_4343be3a_uniq").on(table.ticketNo),
]);

export const inventoriesLastselectedunit = pgTable("inventories_lastselectedunit", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "inventories_lastselectedunit_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	unit: varchar({ length: 10 }).notNull(),
});
