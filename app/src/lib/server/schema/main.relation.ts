import { defineRelations } from 'drizzle-orm';
import * as schema from './main.schema';

export const relations = defineRelations(schema, (r) => ({
	authPermission: {
		authGroups: r.many.authGroup({
			from: r.authPermission.id.through(r.authGroupPermissions.permissionId),
			to: r.authGroup.id.through(r.authGroupPermissions.groupId)
		}),
		djangoContentType: r.one.djangoContentType({
			from: r.authPermission.contentTypeId,
			to: r.djangoContentType.id
		}),
		authUsers: r.many.authUser({
			from: r.authPermission.id.through(r.authUserUserPermissions.permissionId),
			to: r.authUser.id.through(r.authUserUserPermissions.userId)
		})
	},
	authGroup: {
		authPermissions: r.many.authPermission(),
		authUsers: r.many.authUser({
			from: r.authGroup.id.through(r.authUserGroups.groupId),
			to: r.authUser.id.through(r.authUserGroups.userId)
		})
	},
	djangoContentType: {
		authPermissions: r.many.authPermission(),
		authUsers: r.many.authUser({
			from: r.djangoContentType.id.through(r.djangoAdminLog.contentTypeId),
			to: r.authUser.id.through(r.djangoAdminLog.userId)
		})
	},
	authUser: {
		authGroups: r.many.authGroup(),
		authPermissions: r.many.authPermission(),
		djangoContentTypes: r.many.djangoContentType(),
		tokenBlacklistOutstandingtokens: r.many.tokenBlacklistOutstandingtoken()
	},
	inventoriesInventory: {
		productsProduct: r.one.productsProduct({
			from: r.inventoriesInventory.productId,
			to: r.productsProduct.id
		}),
		vehiclesVehicle: r.one.vehiclesVehicle({
			from: r.inventoriesInventory.vehicleId,
			to: r.vehiclesVehicle.id
		}),
		personPersonCustomerId: r.one.personPerson({
			from: r.inventoriesInventory.customerId,
			to: r.personPerson.id,
			alias: 'inventoriesInventory_customerId_personPerson_id'
		}),
		personPersonDriverId: r.one.personPerson({
			from: r.inventoriesInventory.driverId,
			to: r.personPerson.id,
			alias: 'inventoriesInventory_driverId_personPerson_id'
		}),
		personPersonSupplierId: r.one.personPerson({
			from: r.inventoriesInventory.supplierId,
			to: r.personPerson.id,
			alias: 'inventoriesInventory_supplierId_personPerson_id'
		})
	},
	productsProduct: {
		inventoriesInventories: r.many.inventoriesInventory(),
		productsProducttype: r.one.productsProducttype({
			from: r.productsProduct.typeId,
			to: r.productsProducttype.code
		})
	},
	vehiclesVehicle: {
		inventoriesInventories: r.many.inventoriesInventory()
	},
	personPerson: {
		inventoriesInventoriesCustomerId: r.many.inventoriesInventory({
			alias: 'inventoriesInventory_customerId_personPerson_id'
		}),
		inventoriesInventoriesDriverId: r.many.inventoriesInventory({
			alias: 'inventoriesInventory_driverId_personPerson_id'
		}),
		inventoriesInventoriesSupplierId: r.many.inventoriesInventory({
			alias: 'inventoriesInventory_supplierId_personPerson_id'
		})
	},
	productsProducttype: {
		productsProducts: r.many.productsProduct()
	},
	tokenBlacklistBlacklistedtoken: {
		tokenBlacklistOutstandingtoken: r.one.tokenBlacklistOutstandingtoken({
			from: r.tokenBlacklistBlacklistedtoken.tokenId,
			to: r.tokenBlacklistOutstandingtoken.id
		})
	},
	tokenBlacklistOutstandingtoken: {
		tokenBlacklistBlacklistedtokens: r.many.tokenBlacklistBlacklistedtoken(),
		authUser: r.one.authUser({
			from: r.tokenBlacklistOutstandingtoken.userId,
			to: r.authUser.id
		})
	}
}));
