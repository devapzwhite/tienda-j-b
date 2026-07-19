-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID,
    "entity_type" VARCHAR(50) NOT NULL,
    "entity_id" UUID NOT NULL,
    "action" VARCHAR(50) NOT NULL,
    "old_values" JSONB,
    "new_values" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "brands" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(120) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "brands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cart_items" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "cart_id" UUID NOT NULL,
    "presentation_id" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "variant_id" UUID,

    CONSTRAINT "cart_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "customer_id" UUID,
    "user_id" UUID,
    "status" VARCHAR(20) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "carts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(120) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "colors" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "code" VARCHAR(30),
    "name" VARCHAR(80) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "colors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_addresses" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "customer_id" UUID NOT NULL,
    "label" VARCHAR(80),
    "department" VARCHAR(120),
    "city" VARCHAR(120),
    "district" VARCHAR(120),
    "address_line" TEXT NOT NULL,
    "reference" TEXT,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "customer_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customers" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "full_name" VARCHAR(150) NOT NULL,
    "phone" VARCHAR(30),
    "email" VARCHAR(150),
    "document_number" VARCHAR(30),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_movements" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "stock_unit_id" UUID NOT NULL,
    "location_id" UUID NOT NULL,
    "movement_type" VARCHAR(30) NOT NULL,
    "quantity_units" INTEGER NOT NULL,
    "reference_type" VARCHAR(30),
    "reference_id" UUID,
    "notes" TEXT,
    "created_by" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventory_movements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_stock" (
    "stock_unit_id" UUID NOT NULL,
    "location_id" UUID NOT NULL,
    "quantity_units" INTEGER NOT NULL DEFAULT 0,
    "reserved_units" INTEGER NOT NULL DEFAULT 0,
    "min_stock" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventory_stock_pkey" PRIMARY KEY ("stock_unit_id","location_id")
);

-- CreateTable
CREATE TABLE "locations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "code" VARCHAR(30) NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "type" VARCHAR(20) NOT NULL,
    "address" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_item_stock_breakdown" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "order_item_id" UUID NOT NULL,
    "stock_unit_id" UUID NOT NULL,
    "quantity_units" INTEGER NOT NULL,

    CONSTRAINT "order_item_stock_breakdown_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "order_id" UUID NOT NULL,
    "presentation_id" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_price" DECIMAL(12,2) NOT NULL,
    "line_total" DECIMAL(12,2) NOT NULL,
    "variant_id" UUID,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_status_history" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "order_id" UUID NOT NULL,
    "old_status" VARCHAR(20),
    "new_status" VARCHAR(20) NOT NULL,
    "changed_by" UUID,
    "notes" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_status_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "order_number" VARCHAR(30) NOT NULL,
    "cart_id" UUID,
    "customer_id" UUID,
    "source_location_id" UUID NOT NULL,
    "delivery_type" VARCHAR(30) NOT NULL,
    "status" VARCHAR(20) NOT NULL,
    "customer_address_id" UUID,
    "subtotal" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "shipping_cost" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(12,2) NOT NULL,
    "notes" TEXT,
    "created_by" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "shipped_at" TIMESTAMPTZ(6),
    "received_at" TIMESTAMPTZ(6),

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "sale_id" UUID NOT NULL,
    "payment_method" VARCHAR(30) NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "reference" TEXT,
    "paid_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "received_by" UUID,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "code" VARCHAR(100) NOT NULL,
    "name" VARCHAR(150) NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "presentation_conversions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "presentation_id" UUID NOT NULL,
    "stock_unit_id" UUID NOT NULL,
    "units_per_presentation" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "presentation_conversions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_presentation_variants" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "presentation_id" UUID NOT NULL,
    "variant_id" UUID NOT NULL,
    "barcode" VARCHAR(60) NOT NULL,
    "sale_price" DECIMAL(12,2),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_presentation_variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_presentations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "product_id" UUID NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "barcode" VARCHAR(60) NOT NULL,
    "sale_price" DECIMAL(12,2) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_presentations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_stock_units" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "product_id" UUID NOT NULL,
    "variant_id" UUID,
    "unit_code" VARCHAR(30) NOT NULL,
    "unit_name" VARCHAR(80) NOT NULL,
    "is_base" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_stock_units_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_variants" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "product_id" UUID NOT NULL,
    "color_id" UUID NOT NULL,
    "internal_code" VARCHAR(60),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "category_id" UUID,
    "brand_id" UUID,
    "name" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "role_id" UUID NOT NULL,
    "permission_id" UUID NOT NULL,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("role_id","permission_id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sale_item_stock_breakdown" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "sale_item_id" UUID NOT NULL,
    "stock_unit_id" UUID NOT NULL,
    "quantity_units" INTEGER NOT NULL,

    CONSTRAINT "sale_item_stock_breakdown_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sale_items" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "sale_id" UUID NOT NULL,
    "presentation_id" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_price" DECIMAL(12,2) NOT NULL,
    "line_total" DECIMAL(12,2) NOT NULL,
    "variant_id" UUID,

    CONSTRAINT "sale_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "sale_number" VARCHAR(30) NOT NULL,
    "cart_id" UUID,
    "customer_id" UUID,
    "location_id" UUID NOT NULL,
    "seller_user_id" UUID,
    "sale_type" VARCHAR(20) NOT NULL,
    "subtotal" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "discount_total" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(12,2) NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_transfer_items" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "transfer_id" UUID NOT NULL,
    "stock_unit_id" UUID NOT NULL,
    "quantity_units" INTEGER NOT NULL,

    CONSTRAINT "stock_transfer_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_transfers" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "from_location_id" UUID NOT NULL,
    "to_location_id" UUID NOT NULL,
    "status" VARCHAR(20) NOT NULL,
    "notes" TEXT,
    "created_by" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "received_at" TIMESTAMPTZ(6),

    CONSTRAINT "stock_transfers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "user_id" UUID NOT NULL,
    "role_id" UUID NOT NULL,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("user_id","role_id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "full_name" VARCHAR(150) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "password_hash" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_sessions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID,
    "refresh_token" TEXT NOT NULL,
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_audit_logs_entity" ON "audit_logs"("entity_type", "entity_id");

-- CreateIndex
CREATE UNIQUE INDEX "brands_name_key" ON "brands"("name");

-- CreateIndex
CREATE INDEX "idx_cart_items_cart_id" ON "cart_items"("cart_id");

-- CreateIndex
CREATE UNIQUE INDEX "cart_items_cart_id_presentation_id_key" ON "cart_items"("cart_id", "presentation_id");

-- CreateIndex
CREATE INDEX "idx_carts_customer_id" ON "carts"("customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "colors_code_key" ON "colors"("code");

-- CreateIndex
CREATE UNIQUE INDEX "colors_name_key" ON "colors"("name");

-- CreateIndex
CREATE INDEX "idx_customer_addresses_customer_id" ON "customer_addresses"("customer_id");

-- CreateIndex
CREATE INDEX "idx_inventory_movements_location_id" ON "inventory_movements"("location_id");

-- CreateIndex
CREATE INDEX "idx_inventory_movements_reference" ON "inventory_movements"("reference_type", "reference_id");

-- CreateIndex
CREATE INDEX "idx_inventory_movements_stock_unit_id" ON "inventory_movements"("stock_unit_id");

-- CreateIndex
CREATE INDEX "idx_inventory_stock_location_id" ON "inventory_stock"("location_id");

-- CreateIndex
CREATE UNIQUE INDEX "locations_code_key" ON "locations"("code");

-- CreateIndex
CREATE INDEX "idx_order_item_stock_breakdown_order_item_id" ON "order_item_stock_breakdown"("order_item_id");

-- CreateIndex
CREATE INDEX "idx_order_items_order_id" ON "order_items"("order_id");

-- CreateIndex
CREATE INDEX "idx_order_status_history_order_id" ON "order_status_history"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "orders_order_number_key" ON "orders"("order_number");

-- CreateIndex
CREATE INDEX "idx_orders_created_at" ON "orders"("created_at");

-- CreateIndex
CREATE INDEX "idx_orders_customer_id" ON "orders"("customer_id");

-- CreateIndex
CREATE INDEX "idx_orders_source_location_id" ON "orders"("source_location_id");

-- CreateIndex
CREATE INDEX "idx_orders_status" ON "orders"("status");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_code_key" ON "permissions"("code");

-- CreateIndex
CREATE INDEX "idx_presentation_conversions_presentation_id" ON "presentation_conversions"("presentation_id");

-- CreateIndex
CREATE INDEX "idx_presentation_conversions_stock_unit_id" ON "presentation_conversions"("stock_unit_id");

-- CreateIndex
CREATE UNIQUE INDEX "presentation_conversions_presentation_id_stock_unit_id_key" ON "presentation_conversions"("presentation_id", "stock_unit_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_presentation_variants_barcode_key" ON "product_presentation_variants"("barcode");

-- CreateIndex
CREATE INDEX "idx_product_presentation_variants_presentation_id" ON "product_presentation_variants"("presentation_id");

-- CreateIndex
CREATE INDEX "idx_product_presentation_variants_variant_id" ON "product_presentation_variants"("variant_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_presentation_variants_presentation_id_variant_id_key" ON "product_presentation_variants"("presentation_id", "variant_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_presentations_barcode_key" ON "product_presentations"("barcode");

-- CreateIndex
CREATE INDEX "idx_product_presentations_barcode" ON "product_presentations"("barcode");

-- CreateIndex
CREATE INDEX "idx_product_presentations_product_id" ON "product_presentations"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_presentations_product_id_name_key" ON "product_presentations"("product_id", "name");

-- CreateIndex
CREATE INDEX "idx_product_stock_units_product_id" ON "product_stock_units"("product_id");

-- CreateIndex
CREATE INDEX "idx_product_stock_units_variant_id" ON "product_stock_units"("variant_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_stock_units_product_id_variant_id_unit_code_key" ON "product_stock_units"("product_id", "variant_id", "unit_code");

-- CreateIndex
CREATE INDEX "idx_product_variants_color_id" ON "product_variants"("color_id");

-- CreateIndex
CREATE INDEX "idx_product_variants_product_id" ON "product_variants"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_variants_product_id_color_id_key" ON "product_variants"("product_id", "color_id");

-- CreateIndex
CREATE UNIQUE INDEX "products_name_key" ON "products"("name");

-- CreateIndex
CREATE INDEX "idx_products_brand_id" ON "products"("brand_id");

-- CreateIndex
CREATE INDEX "idx_products_category_id" ON "products"("category_id");

-- CreateIndex
CREATE UNIQUE INDEX "roles_code_key" ON "roles"("code");

-- CreateIndex
CREATE INDEX "idx_sale_item_stock_breakdown_sale_item_id" ON "sale_item_stock_breakdown"("sale_item_id");

-- CreateIndex
CREATE INDEX "idx_sale_items_sale_id" ON "sale_items"("sale_id");

-- CreateIndex
CREATE UNIQUE INDEX "sales_sale_number_key" ON "sales"("sale_number");

-- CreateIndex
CREATE INDEX "idx_sales_created_at" ON "sales"("created_at");

-- CreateIndex
CREATE INDEX "idx_sales_customer_id" ON "sales"("customer_id");

-- CreateIndex
CREATE INDEX "idx_sales_location_id" ON "sales"("location_id");

-- CreateIndex
CREATE INDEX "idx_stock_transfer_items_transfer_id" ON "stock_transfer_items"("transfer_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_sessions_refresh_token_key" ON "user_sessions"("refresh_token");

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "carts"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_presentation_id_fkey" FOREIGN KEY ("presentation_id") REFERENCES "product_presentations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "product_variants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "carts" ADD CONSTRAINT "carts_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "carts" ADD CONSTRAINT "carts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "customer_addresses" ADD CONSTRAINT "customer_addresses_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "inventory_movements" ADD CONSTRAINT "inventory_movements_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "inventory_movements" ADD CONSTRAINT "inventory_movements_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "inventory_movements" ADD CONSTRAINT "inventory_movements_stock_unit_id_fkey" FOREIGN KEY ("stock_unit_id") REFERENCES "product_stock_units"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "inventory_stock" ADD CONSTRAINT "inventory_stock_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "inventory_stock" ADD CONSTRAINT "inventory_stock_stock_unit_id_fkey" FOREIGN KEY ("stock_unit_id") REFERENCES "product_stock_units"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_item_stock_breakdown" ADD CONSTRAINT "order_item_stock_breakdown_order_item_id_fkey" FOREIGN KEY ("order_item_id") REFERENCES "order_items"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_item_stock_breakdown" ADD CONSTRAINT "order_item_stock_breakdown_stock_unit_id_fkey" FOREIGN KEY ("stock_unit_id") REFERENCES "product_stock_units"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_presentation_id_fkey" FOREIGN KEY ("presentation_id") REFERENCES "product_presentations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "product_variants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_status_history" ADD CONSTRAINT "order_status_history_changed_by_fkey" FOREIGN KEY ("changed_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_status_history" ADD CONSTRAINT "order_status_history_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "carts"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_address_id_fkey" FOREIGN KEY ("customer_address_id") REFERENCES "customer_addresses"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_source_location_id_fkey" FOREIGN KEY ("source_location_id") REFERENCES "locations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_received_by_fkey" FOREIGN KEY ("received_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_sale_id_fkey" FOREIGN KEY ("sale_id") REFERENCES "sales"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "presentation_conversions" ADD CONSTRAINT "presentation_conversions_presentation_id_fkey" FOREIGN KEY ("presentation_id") REFERENCES "product_presentations"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "presentation_conversions" ADD CONSTRAINT "presentation_conversions_stock_unit_id_fkey" FOREIGN KEY ("stock_unit_id") REFERENCES "product_stock_units"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_presentation_variants" ADD CONSTRAINT "product_presentation_variants_presentation_id_fkey" FOREIGN KEY ("presentation_id") REFERENCES "product_presentations"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_presentation_variants" ADD CONSTRAINT "product_presentation_variants_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "product_variants"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_presentations" ADD CONSTRAINT "product_presentations_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_stock_units" ADD CONSTRAINT "product_stock_units_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_stock_units" ADD CONSTRAINT "product_stock_units_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "product_variants"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_color_id_fkey" FOREIGN KEY ("color_id") REFERENCES "colors"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sale_item_stock_breakdown" ADD CONSTRAINT "sale_item_stock_breakdown_sale_item_id_fkey" FOREIGN KEY ("sale_item_id") REFERENCES "sale_items"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sale_item_stock_breakdown" ADD CONSTRAINT "sale_item_stock_breakdown_stock_unit_id_fkey" FOREIGN KEY ("stock_unit_id") REFERENCES "product_stock_units"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sale_items" ADD CONSTRAINT "sale_items_presentation_id_fkey" FOREIGN KEY ("presentation_id") REFERENCES "product_presentations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sale_items" ADD CONSTRAINT "sale_items_sale_id_fkey" FOREIGN KEY ("sale_id") REFERENCES "sales"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sale_items" ADD CONSTRAINT "sale_items_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "product_variants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sales" ADD CONSTRAINT "sales_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "carts"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sales" ADD CONSTRAINT "sales_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sales" ADD CONSTRAINT "sales_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sales" ADD CONSTRAINT "sales_seller_user_id_fkey" FOREIGN KEY ("seller_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "stock_transfer_items" ADD CONSTRAINT "stock_transfer_items_stock_unit_id_fkey" FOREIGN KEY ("stock_unit_id") REFERENCES "product_stock_units"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "stock_transfer_items" ADD CONSTRAINT "stock_transfer_items_transfer_id_fkey" FOREIGN KEY ("transfer_id") REFERENCES "stock_transfers"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "stock_transfers" ADD CONSTRAINT "stock_transfers_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "stock_transfers" ADD CONSTRAINT "stock_transfers_from_location_id_fkey" FOREIGN KEY ("from_location_id") REFERENCES "locations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "stock_transfers" ADD CONSTRAINT "stock_transfers_to_location_id_fkey" FOREIGN KEY ("to_location_id") REFERENCES "locations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

