import { relations } from 'drizzle-orm/relations';
import {
	authPermission,
	authUserUserPermissions,
	authUser,
	productsProducttype,
	productsProduct,
	authGroup,
	authUserGroups,
	djangoContentType,
	djangoAdminLog,
	tokenBlacklistOutstandingtoken,
	tokenBlacklistBlacklistedtoken,
	authGroupPermissions,
	inventoriesInventory,
	vehiclesVehicle,
	personPerson
} from './main.schema';

export const authUserUserPermissionsRelations = relations(authUserUserPermissions, ({ one }) => ({
	authPermission: one(authPermission, {
		fields: [authUserUserPermissions.permissionId],
		references: [authPermission.id]
	}),
	authUser: one(authUser, {
		fields: [authUserUserPermissions.userId],
		references: [authUser.id]
	})
}));

export const authPermissionRelations = relations(authPermission, ({ one, many }) => ({
	authUserUserPermissions: many(authUserUserPermissions),
	djangoContentType: one(djangoContentType, {
		fields: [authPermission.contentTypeId],
		references: [djangoContentType.id]
	}),
	authGroupPermissions: many(authGroupPermissions)
}));

export const authUserRelations = relations(authUser, ({ many }) => ({
	authUserUserPermissions: many(authUserUserPermissions),
	authUserGroups: many(authUserGroups),
	djangoAdminLogs: many(djangoAdminLog),
	tokenBlacklistOutstandingtokens: many(tokenBlacklistOutstandingtoken)
}));

export const productsProductRelations = relations(productsProduct, ({ one, many }) => ({
	productsProducttype: one(productsProducttype, {
		fields: [productsProduct.typeId],
		references: [productsProducttype.code]
	}),
	inventoriesInventories: many(inventoriesInventory)
}));

export const productsProducttypeRelations = relations(productsProducttype, ({ many }) => ({
	productsProducts: many(productsProduct)
}));

export const authUserGroupsRelations = relations(authUserGroups, ({ one }) => ({
	authGroup: one(authGroup, {
		fields: [authUserGroups.groupId],
		references: [authGroup.id]
	}),
	authUser: one(authUser, {
		fields: [authUserGroups.userId],
		references: [authUser.id]
	})
}));

export const authGroupRelations = relations(authGroup, ({ many }) => ({
	authUserGroups: many(authUserGroups),
	authGroupPermissions: many(authGroupPermissions)
}));

export const djangoAdminLogRelations = relations(djangoAdminLog, ({ one }) => ({
	djangoContentType: one(djangoContentType, {
		fields: [djangoAdminLog.contentTypeId],
		references: [djangoContentType.id]
	}),
	authUser: one(authUser, {
		fields: [djangoAdminLog.userId],
		references: [authUser.id]
	})
}));

export const djangoContentTypeRelations = relations(djangoContentType, ({ many }) => ({
	djangoAdminLogs: many(djangoAdminLog),
	authPermissions: many(authPermission)
}));

export const tokenBlacklistOutstandingtokenRelations = relations(
	tokenBlacklistOutstandingtoken,
	({ one, many }) => ({
		authUser: one(authUser, {
			fields: [tokenBlacklistOutstandingtoken.userId],
			references: [authUser.id]
		}),
		tokenBlacklistBlacklistedtokens: many(tokenBlacklistBlacklistedtoken)
	})
);

export const tokenBlacklistBlacklistedtokenRelations = relations(
	tokenBlacklistBlacklistedtoken,
	({ one }) => ({
		tokenBlacklistOutstandingtoken: one(tokenBlacklistOutstandingtoken, {
			fields: [tokenBlacklistBlacklistedtoken.tokenId],
			references: [tokenBlacklistOutstandingtoken.id]
		})
	})
);

export const authGroupPermissionsRelations = relations(authGroupPermissions, ({ one }) => ({
	authPermission: one(authPermission, {
		fields: [authGroupPermissions.permissionId],
		references: [authPermission.id]
	}),
	authGroup: one(authGroup, {
		fields: [authGroupPermissions.groupId],
		references: [authGroup.id]
	})
}));

export const inventoriesInventoryRelations = relations(inventoriesInventory, ({ one }) => ({
	productsProduct: one(productsProduct, {
		fields: [inventoriesInventory.productId],
		references: [productsProduct.id]
	}),
	vehiclesVehicle: one(vehiclesVehicle, {
		fields: [inventoriesInventory.vehicleId],
		references: [vehiclesVehicle.id]
	}),
	personPerson_customerId: one(personPerson, {
		fields: [inventoriesInventory.customerId],
		references: [personPerson.id],
		relationName: 'inventoriesInventory_customerId_personPerson_id'
	}),
	personPerson_driverId: one(personPerson, {
		fields: [inventoriesInventory.driverId],
		references: [personPerson.id],
		relationName: 'inventoriesInventory_driverId_personPerson_id'
	}),
	personPerson_supplierId: one(personPerson, {
		fields: [inventoriesInventory.supplierId],
		references: [personPerson.id],
		relationName: 'inventoriesInventory_supplierId_personPerson_id'
	})
}));

export const vehiclesVehicleRelations = relations(vehiclesVehicle, ({ many }) => ({
	inventoriesInventories: many(inventoriesInventory)
}));

export const personPersonRelations = relations(personPerson, ({ many }) => ({
	inventoriesInventories_customerId: many(inventoriesInventory, {
		relationName: 'inventoriesInventory_customerId_personPerson_id'
	}),
	inventoriesInventories_driverId: many(inventoriesInventory, {
		relationName: 'inventoriesInventory_driverId_personPerson_id'
	}),
	inventoriesInventories_supplierId: many(inventoriesInventory, {
		relationName: 'inventoriesInventory_supplierId_personPerson_id'
	})
}));
