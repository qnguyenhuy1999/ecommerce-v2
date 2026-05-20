/*
  Warnings:

  - You are about to drop the column `actions` on the `automation_rules` table. All the data in the column will be lost.
  - You are about to drop the column `is_read` on the `chat_messages` table. All the data in the column will be lost.
  - You are about to drop the column `shop_description` on the `sellers` table. All the data in the column will be lost.
  - You are about to drop the column `shop_name` on the `sellers` table. All the data in the column will be lost.
  - You are about to drop the `roles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_roles` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[shop_id,buyer_id,product_id]` on the table `conversations` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[product_id,variant_id,region_id]` on the table `regional_pricings` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[seller_profile_id]` on the table `sellers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[shop_id]` on the table `sellers` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `reward_type` on the `loyalty_rewards` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `relation_type` on the `product_relations` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `score_type` on the `product_scores` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `event` on the `user_events` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `entity_type` on the `user_events` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `owner_type` on the `wallets` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "UserEventType" AS ENUM ('VIEW', 'CLICK', 'ADD_TO_CART', 'PURCHASE', 'SEARCH', 'WISHLIST', 'SHARE', 'REVIEW');

-- CreateEnum
CREATE TYPE "UserEventEntityType" AS ENUM ('PRODUCT', 'SHOP', 'CATEGORY', 'SEARCH_RESULT', 'AD');

-- CreateEnum
CREATE TYPE "ProductScoreType" AS ENUM ('POPULARITY', 'RELEVANCE', 'QUALITY', 'TRENDING', 'CONVERSION_RATE');

-- CreateEnum
CREATE TYPE "ProductRelationType" AS ENUM ('FREQUENTLY_BOUGHT_TOGETHER', 'SIMILAR', 'UPSELL', 'CROSS_SELL', 'ACCESSORY');

-- CreateEnum
CREATE TYPE "LoyaltyRewardType" AS ENUM ('COUPON', 'POINTS_MULTIPLIER', 'FREE_SHIPPING', 'CASHBACK', 'PHYSICAL_GIFT');

-- CreateEnum
CREATE TYPE "WalletOwnerType" AS ENUM ('SHOP', 'AFFILIATE', 'PLATFORM');

-- DropForeignKey
ALTER TABLE "user_roles" DROP CONSTRAINT "user_roles_role_id_fkey";

-- DropForeignKey
ALTER TABLE "user_roles" DROP CONSTRAINT "user_roles_user_id_fkey";

-- DropIndex
DROP INDEX "conversations_shop_id_buyer_id_key";

-- DropIndex
DROP INDEX "regional_pricings_product_id_region_id_key";

-- DropIndex
DROP INDEX "shipments_seller_order_id_key";

-- AlterTable
ALTER TABLE "admins" ADD COLUMN     "email_verified" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "ai_usage_logs" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "automation_rules" DROP COLUMN "actions",
ADD COLUMN     "actions_legacy" JSONB;

-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "depth" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "path" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "chat_messages" DROP COLUMN "is_read",
ADD COLUMN     "is_read_by_buyer" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_read_by_seller" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "experiments" ADD COLUMN     "feature_flag_id" UUID;

-- AlterTable
ALTER TABLE "loyalty_rewards" DROP COLUMN "reward_type",
ADD COLUMN     "reward_type" "LoyaltyRewardType" NOT NULL;

-- AlterTable
ALTER TABLE "product_images" ADD COLUMN     "variant_id" UUID;

-- AlterTable
ALTER TABLE "product_relations" DROP COLUMN "relation_type",
ADD COLUMN     "relation_type" "ProductRelationType" NOT NULL;

-- AlterTable
ALTER TABLE "product_scores" DROP COLUMN "score_type",
ADD COLUMN     "score_type" "ProductScoreType" NOT NULL;

-- AlterTable
ALTER TABLE "regional_pricings" ADD COLUMN     "variant_id" UUID;

-- AlterTable
ALTER TABLE "return_items" ADD COLUMN     "variant_id" UUID;

-- AlterTable
ALTER TABLE "sellers" DROP COLUMN "shop_description",
DROP COLUMN "shop_name",
ADD COLUMN     "seller_profile_id" UUID,
ADD COLUMN     "shop_id" UUID;

-- AlterTable
ALTER TABLE "shipments" ADD COLUMN     "is_primary" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "user_events" DROP COLUMN "event",
ADD COLUMN     "event" "UserEventType" NOT NULL,
DROP COLUMN "entity_type",
ADD COLUMN     "entity_type" "UserEventEntityType" NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "is_staff" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "wallets" DROP COLUMN "owner_type",
ADD COLUMN     "owner_type" "WalletOwnerType" NOT NULL;

-- DropTable
DROP TABLE "roles";

-- DropTable
DROP TABLE "user_roles";

-- CreateTable
CREATE TABLE "automation_rule_actions" (
    "id" UUID NOT NULL,
    "rule_id" UUID NOT NULL,
    "action" "AutomationAction" NOT NULL,
    "params" JSONB,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "automation_rule_actions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_password_reset_tokens" (
    "id" UUID NOT NULL,
    "admin_id" UUID NOT NULL,
    "token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_password_reset_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "automation_rule_actions_rule_id_idx" ON "automation_rule_actions"("rule_id");

-- CreateIndex
CREATE UNIQUE INDEX "admin_password_reset_tokens_token_key" ON "admin_password_reset_tokens"("token");

-- CreateIndex
CREATE INDEX "admin_password_reset_tokens_token_idx" ON "admin_password_reset_tokens"("token");

-- CreateIndex
CREATE INDEX "ad_campaigns_shop_id_idx" ON "ad_campaigns"("shop_id");

-- CreateIndex
CREATE INDEX "ad_clicks_buyer_id_idx" ON "ad_clicks"("buyer_id");

-- CreateIndex
CREATE INDEX "ad_impressions_buyer_id_idx" ON "ad_impressions"("buyer_id");

-- CreateIndex
CREATE INDEX "affiliate_conversions_buyer_id_idx" ON "affiliate_conversions"("buyer_id");

-- CreateIndex
CREATE INDEX "ai_prompt_templates_type_is_active_idx" ON "ai_prompt_templates"("type", "is_active");

-- CreateIndex
CREATE INDEX "ai_tasks_shop_id_idx" ON "ai_tasks"("shop_id");

-- CreateIndex
CREATE INDEX "ai_usage_logs_shop_id_idx" ON "ai_usage_logs"("shop_id");

-- CreateIndex
CREATE INDEX "bulk_jobs_shop_id_idx" ON "bulk_jobs"("shop_id");

-- CreateIndex
CREATE INDEX "categories_path_idx" ON "categories"("path");

-- CreateIndex
CREATE UNIQUE INDEX "conversations_shop_id_buyer_id_product_id_key" ON "conversations"("shop_id", "buyer_id", "product_id");

-- CreateIndex
CREATE INDEX "coupons_status_expires_at_idx" ON "coupons"("status", "expires_at");

-- CreateIndex
CREATE INDEX "email_verify_tokens_user_id_used_at_idx" ON "email_verify_tokens"("user_id", "used_at");

-- CreateIndex
CREATE INDEX "experiments_feature_flag_id_idx" ON "experiments"("feature_flag_id");

-- CreateIndex
CREATE INDEX "livestream_sessions_shop_id_idx" ON "livestream_sessions"("shop_id");

-- CreateIndex
CREATE INDEX "loyalty_transactions_reference_id_idx" ON "loyalty_transactions"("reference_id");

-- CreateIndex
CREATE INDEX "password_reset_tokens_user_id_used_at_idx" ON "password_reset_tokens"("user_id", "used_at");

-- CreateIndex
CREATE INDEX "product_images_variant_id_idx" ON "product_images"("variant_id");

-- CreateIndex
CREATE INDEX "product_relations_product_id_relation_type_idx" ON "product_relations"("product_id", "relation_type");

-- CreateIndex
CREATE UNIQUE INDEX "product_relations_product_id_related_product_id_relation_ty_key" ON "product_relations"("product_id", "related_product_id", "relation_type");

-- CreateIndex
CREATE INDEX "product_scores_score_type_score_idx" ON "product_scores"("score_type", "score");

-- CreateIndex
CREATE UNIQUE INDEX "product_scores_product_id_score_type_key" ON "product_scores"("product_id", "score_type");

-- CreateIndex
CREATE INDEX "products_category_id_status_idx" ON "products"("category_id", "status");

-- CreateIndex
CREATE INDEX "regional_pricings_variant_id_idx" ON "regional_pricings"("variant_id");

-- CreateIndex
CREATE UNIQUE INDEX "regional_pricings_product_id_variant_id_region_id_key" ON "regional_pricings"("product_id", "variant_id", "region_id");

-- CreateIndex
CREATE INDEX "reviews_order_id_idx" ON "reviews"("order_id");

-- CreateIndex
CREATE INDEX "saved_filters_shop_id_idx" ON "saved_filters"("shop_id");

-- CreateIndex
CREATE INDEX "search_analytics_clicked_product_id_idx" ON "search_analytics"("clicked_product_id");

-- CreateIndex
CREATE INDEX "seller_metric_snapshots_shop_id_idx" ON "seller_metric_snapshots"("shop_id");

-- CreateIndex
CREATE INDEX "seller_order_items_variant_id_idx" ON "seller_order_items"("variant_id");

-- CreateIndex
CREATE UNIQUE INDEX "sellers_seller_profile_id_key" ON "sellers"("seller_profile_id");

-- CreateIndex
CREATE UNIQUE INDEX "sellers_shop_id_key" ON "sellers"("shop_id");

-- CreateIndex
CREATE INDEX "shipments_seller_order_id_idx" ON "shipments"("seller_order_id");

-- CreateIndex
CREATE INDEX "user_events_user_id_event_idx" ON "user_events"("user_id", "event");

-- CreateIndex
CREATE INDEX "user_events_entity_type_entity_id_idx" ON "user_events"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "user_events_event_created_at_idx" ON "user_events"("event", "created_at");

-- CreateIndex
CREATE INDEX "wallet_transactions_wallet_id_type_status_idx" ON "wallet_transactions"("wallet_id", "type", "status");

-- CreateIndex
CREATE INDEX "wallet_withdrawals_approved_by_idx" ON "wallet_withdrawals"("approved_by");

-- CreateIndex
CREATE UNIQUE INDEX "wallets_owner_id_owner_type_key" ON "wallets"("owner_id", "owner_type");

-- AddForeignKey
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "product_variants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_audit_logs" ADD CONSTRAINT "order_audit_logs_performed_by_fkey" FOREIGN KEY ("performed_by") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coupon_products" ADD CONSTRAINT "coupon_products_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coupon_categories" ADD CONSTRAINT "coupon_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coupon_usages" ADD CONSTRAINT "coupon_usages_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coupon_usages" ADD CONSTRAINT "coupon_usages_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_replies" ADD CONSTRAINT "review_replies_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_reports" ADD CONSTRAINT "review_reports_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shops"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "return_requests" ADD CONSTRAINT "return_requests_seller_order_id_fkey" FOREIGN KEY ("seller_order_id") REFERENCES "seller_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "return_requests" ADD CONSTRAINT "return_requests_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "return_requests" ADD CONSTRAINT "return_requests_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shops"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "return_items" ADD CONSTRAINT "return_items_seller_order_item_id_fkey" FOREIGN KEY ("seller_order_item_id") REFERENCES "seller_order_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "return_items" ADD CONSTRAINT "return_items_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "product_variants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "return_evidence" ADD CONSTRAINT "return_evidence_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "admins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "return_timeline" ADD CONSTRAINT "return_timeline_performed_by_fkey" FOREIGN KEY ("performed_by") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_approvals" ADD CONSTRAINT "product_approvals_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_approvals" ADD CONSTRAINT "product_approvals_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_approvals" ADD CONSTRAINT "product_approvals_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_approval_history" ADD CONSTRAINT "product_approval_history_performed_by_fkey" FOREIGN KEY ("performed_by") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouse_stocks" ADD CONSTRAINT "warehouse_stocks_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "product_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_transfer_items" ADD CONSTRAINT "inventory_transfer_items_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "product_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seller_metric_snapshots" ADD CONSTRAINT "seller_metric_snapshots_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bulk_jobs" ADD CONSTRAINT "bulk_jobs_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_filters" ADD CONSTRAINT "saved_filters_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flash_sale_campaigns" ADD CONSTRAINT "flash_sale_campaigns_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flash_sale_slots" ADD CONSTRAINT "flash_sale_slots_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flash_sale_slots" ADD CONSTRAINT "flash_sale_slots_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "product_variants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flash_sale_purchases" ADD CONSTRAINT "flash_sale_purchases_slot_id_fkey" FOREIGN KEY ("slot_id") REFERENCES "flash_sale_slots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flash_sale_purchases" ADD CONSTRAINT "flash_sale_purchases_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flash_sale_purchases" ADD CONSTRAINT "flash_sale_purchases_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ad_campaigns" ADD CONSTRAINT "ad_campaigns_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ads" ADD CONSTRAINT "ads_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ad_impressions" ADD CONSTRAINT "ad_impressions_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ad_clicks" ADD CONSTRAINT "ad_clicks_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "affiliate_links" ADD CONSTRAINT "affiliate_links_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "affiliate_links" ADD CONSTRAINT "affiliate_links_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shops"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "affiliate_conversions" ADD CONSTRAINT "affiliate_conversions_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seller_subscriptions" ADD CONSTRAINT "seller_subscriptions_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "livestream_sessions" ADD CONSTRAINT "livestream_sessions_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "livestream_products" ADD CONSTRAINT "livestream_products_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_tasks" ADD CONSTRAINT "ai_tasks_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_tasks" ADD CONSTRAINT "ai_tasks_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_usage_logs" ADD CONSTRAINT "ai_usage_logs_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loyalty_accounts" ADD CONSTRAINT "loyalty_accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loyalty_redemptions" ADD CONSTRAINT "loyalty_redemptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallet_withdrawals" ADD CONSTRAINT "wallet_withdrawals_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "settlement_items" ADD CONSTRAINT "settlement_items_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shops"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "settlement_items" ADD CONSTRAINT "settlement_items_seller_order_id_fkey" FOREIGN KEY ("seller_order_id") REFERENCES "seller_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "automation_rule_actions" ADD CONSTRAINT "automation_rule_actions_rule_id_fkey" FOREIGN KEY ("rule_id") REFERENCES "automation_rules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "regional_pricings" ADD CONSTRAINT "regional_pricings_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "regional_pricings" ADD CONSTRAINT "regional_pricings_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "product_variants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experiments" ADD CONSTRAINT "experiments_feature_flag_id_fkey" FOREIGN KEY ("feature_flag_id") REFERENCES "feature_flags"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_password_reset_tokens" ADD CONSTRAINT "admin_password_reset_tokens_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "admins"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sellers" ADD CONSTRAINT "sellers_seller_profile_id_fkey" FOREIGN KEY ("seller_profile_id") REFERENCES "seller_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sellers" ADD CONSTRAINT "sellers_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shops"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sellers" ADD CONSTRAINT "sellers_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sellers" ADD CONSTRAINT "sellers_suspended_by_fkey" FOREIGN KEY ("suspended_by") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sellers" ADD CONSTRAINT "sellers_rejected_by_fkey" FOREIGN KEY ("rejected_by") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "banners" ADD CONSTRAINT "banners_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_notifications" ADD CONSTRAINT "admin_notifications_sent_by_fkey" FOREIGN KEY ("sent_by") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "platform_vouchers" ADD CONSTRAINT "platform_vouchers_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;
