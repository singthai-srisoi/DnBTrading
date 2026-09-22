CREATE TABLE "account" (
	"id" text PRIMARY KEY,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL UNIQUE,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"email" text NOT NULL UNIQUE,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
-- ALTER TABLE "auth_group_permissions" DROP CONSTRAINT "auth_group_permissio_permission_id_84c5c92e_fk_auth_perm";--> statement-breakpoint
-- ALTER TABLE "auth_group_permissions" DROP CONSTRAINT "auth_group_permissions_group_id_b120cbf9_fk_auth_group_id";--> statement-breakpoint
-- ALTER TABLE "auth_permission" DROP CONSTRAINT "auth_permission_content_type_id_2f476e4b_fk_django_co";--> statement-breakpoint
-- ALTER TABLE "auth_user_groups" DROP CONSTRAINT "auth_user_groups_group_id_97559544_fk_auth_group_id";--> statement-breakpoint
-- ALTER TABLE "auth_user_groups" DROP CONSTRAINT "auth_user_groups_user_id_6a12ed8b_fk_auth_user_id";--> statement-breakpoint
-- ALTER TABLE "auth_user_user_permissions" DROP CONSTRAINT "auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm";--> statement-breakpoint
-- ALTER TABLE "auth_user_user_permissions" DROP CONSTRAINT "auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id";--> statement-breakpoint
-- ALTER TABLE "django_admin_log" DROP CONSTRAINT "django_admin_log_content_type_id_c4bce8eb_fk_django_co";--> statement-breakpoint
-- ALTER TABLE "django_admin_log" DROP CONSTRAINT "django_admin_log_user_id_c564eba6_fk_auth_user_id";--> statement-breakpoint
-- ALTER TABLE "inventories_inventory" DROP CONSTRAINT "inventories_inventor_product_id_8199cb3d_fk_products_";--> statement-breakpoint
-- ALTER TABLE "inventories_inventory" DROP CONSTRAINT "inventories_inventor_vehicle_id_8686ba5c_fk_vehicles_";--> statement-breakpoint
-- ALTER TABLE "inventories_inventory" DROP CONSTRAINT "inventories_inventory_customer_id_6e232f4f_fk_person_person_id";--> statement-breakpoint
-- ALTER TABLE "inventories_inventory" DROP CONSTRAINT "inventories_inventory_driver_id_440b3e60_fk_person_person_id";--> statement-breakpoint
-- ALTER TABLE "inventories_inventory" DROP CONSTRAINT "inventories_inventory_supplier_id_c1910ce3_fk_person_person_id";--> statement-breakpoint
-- ALTER TABLE "products_product" DROP CONSTRAINT "products_product_type_id_027d8fc4_fk_products_producttype_code";--> statement-breakpoint
-- ALTER TABLE "token_blacklist_blacklistedtoken" DROP CONSTRAINT "token_blacklist_blacklistedtoken_token_id_3cc7fe56_fk";--> statement-breakpoint
-- ALTER TABLE "token_blacklist_outstandingtoken" DROP CONSTRAINT "token_blacklist_outs_user_id_83bc629a_fk_auth_user";--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" ("user_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" ("identifier");--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
-- ALTER TABLE "auth_group_permissions" ADD CONSTRAINT "auth_group_permissions_group_id_auth_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "auth_group"("id");--> statement-breakpoint
-- ALTER TABLE "auth_group_permissions" ADD CONSTRAINT "auth_group_permissions_permission_id_auth_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "auth_permission"("id");--> statement-breakpoint
-- ALTER TABLE "auth_permission" ADD CONSTRAINT "auth_permission_content_type_id_django_content_type_id_fkey" FOREIGN KEY ("content_type_id") REFERENCES "django_content_type"("id");--> statement-breakpoint
-- ALTER TABLE "auth_user_groups" ADD CONSTRAINT "auth_user_groups_user_id_auth_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth_user"("id");--> statement-breakpoint
-- ALTER TABLE "auth_user_groups" ADD CONSTRAINT "auth_user_groups_group_id_auth_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "auth_group"("id");--> statement-breakpoint
-- ALTER TABLE "auth_user_user_permissions" ADD CONSTRAINT "auth_user_user_permissions_user_id_auth_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth_user"("id");--> statement-breakpoint
-- ALTER TABLE "auth_user_user_permissions" ADD CONSTRAINT "auth_user_user_permissions_6LmkqaYNaHFW_fkey" FOREIGN KEY ("permission_id") REFERENCES "auth_permission"("id");--> statement-breakpoint
-- ALTER TABLE "django_admin_log" ADD CONSTRAINT "django_admin_log_content_type_id_django_content_type_id_fkey" FOREIGN KEY ("content_type_id") REFERENCES "django_content_type"("id");--> statement-breakpoint
-- ALTER TABLE "django_admin_log" ADD CONSTRAINT "django_admin_log_user_id_auth_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth_user"("id");--> statement-breakpoint
-- ALTER TABLE "inventories_inventory" ADD CONSTRAINT "inventories_inventory_customer_id_person_person_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "person_person"("id");--> statement-breakpoint
-- ALTER TABLE "inventories_inventory" ADD CONSTRAINT "inventories_inventory_driver_id_person_person_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "person_person"("id");--> statement-breakpoint
-- ALTER TABLE "inventories_inventory" ADD CONSTRAINT "inventories_inventory_product_id_products_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products_product"("id");--> statement-breakpoint
-- ALTER TABLE "inventories_inventory" ADD CONSTRAINT "inventories_inventory_supplier_id_person_person_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "person_person"("id");--> statement-breakpoint
-- ALTER TABLE "inventories_inventory" ADD CONSTRAINT "inventories_inventory_vehicle_id_vehicles_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles_vehicle"("id");--> statement-breakpoint
-- ALTER TABLE "products_product" ADD CONSTRAINT "products_product_type_id_products_producttype_code_fkey" FOREIGN KEY ("type_id") REFERENCES "products_producttype"("code");--> statement-breakpoint
-- ALTER TABLE "token_blacklist_blacklistedtoken" ADD CONSTRAINT "token_blacklist_blacklistedtoken_Mbi2IzEAtvBj_fkey" FOREIGN KEY ("token_id") REFERENCES "token_blacklist_outstandingtoken"("id");--> statement-breakpoint
-- ALTER TABLE "token_blacklist_outstandingtoken" ADD CONSTRAINT "token_blacklist_outstandingtoken_user_id_auth_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth_user"("id");