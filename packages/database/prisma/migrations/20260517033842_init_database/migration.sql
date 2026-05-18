-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'BANNED');

-- CreateEnum
CREATE TYPE "ShopStatus" AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED', 'CLOSED');

-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'PACKING', 'SHIPPED', 'DELIVERED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "InventoryTransactionType" AS ENUM ('STOCK_IN', 'STOCK_OUT', 'RESERVATION', 'RESERVATION_RELEASE', 'ADJUSTMENT');

-- CreateEnum
CREATE TYPE "ShipmentStatus" AS ENUM ('PENDING', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'FAILED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('NEW_ORDER', 'ORDER_CANCELLED', 'LOW_STOCK', 'PRODUCT_REJECTED', 'SYSTEM');

-- CreateEnum
CREATE TYPE "CouponType" AS ENUM ('PERCENTAGE', 'FIXED_AMOUNT');

-- CreateEnum
CREATE TYPE "CouponScope" AS ENUM ('ALL_PRODUCTS', 'SPECIFIC_PRODUCTS', 'SPECIFIC_CATEGORIES');

-- CreateEnum
CREATE TYPE "CouponStatus" AS ENUM ('DRAFT', 'ACTIVE', 'PAUSED', 'EXPIRED', 'DEPLETED');

-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'HIDDEN');

-- CreateEnum
CREATE TYPE "ReturnStatus" AS ENUM ('REQUESTED', 'REVIEWING', 'APPROVED', 'REJECTED', 'RETURN_SHIPPING', 'RECEIVED', 'REFUNDED', 'CLOSED');

-- CreateEnum
CREATE TYPE "ReturnReason" AS ENUM ('DEFECTIVE', 'WRONG_ITEM', 'NOT_AS_DESCRIBED', 'CHANGED_MIND', 'DAMAGED_IN_SHIPPING', 'OTHER');

-- CreateEnum
CREATE TYPE "RefundMethod" AS ENUM ('ORIGINAL_PAYMENT', 'STORE_CREDIT', 'BANK_TRANSFER');

-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('PENDING_REVIEW', 'APPROVED', 'REJECTED', 'REVISION_REQUESTED');

-- CreateEnum
CREATE TYPE "BulkJobStatus" AS ENUM ('QUEUED', 'PROCESSING', 'COMPLETED', 'FAILED', 'PARTIALLY_COMPLETED');

-- CreateEnum
CREATE TYPE "BulkJobType" AS ENUM ('PRODUCT_IMPORT', 'PRODUCT_EXPORT', 'INVENTORY_UPDATE', 'PRICE_UPDATE');

-- CreateEnum
CREATE TYPE "ChatMessageType" AS ENUM ('TEXT', 'IMAGE', 'PRODUCT', 'SYSTEM');

-- CreateEnum
CREATE TYPE "InventoryTransferStatus" AS ENUM ('PENDING', 'IN_TRANSIT', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "FlashSaleStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'ACTIVE', 'ENDED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "FlashSaleSlotStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'ACTIVE', 'SOLD_OUT', 'ENDED');

-- CreateEnum
CREATE TYPE "AdCampaignStatus" AS ENUM ('DRAFT', 'ACTIVE', 'PAUSED', 'ENDED', 'DEPLETED');

-- CreateEnum
CREATE TYPE "AdType" AS ENUM ('SPONSORED_PRODUCT', 'SEARCH_AD', 'RECOMMENDATION_AD', 'BANNER');

-- CreateEnum
CREATE TYPE "AffiliateStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "CommissionPayoutStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'PAST_DUE', 'CANCELLED', 'EXPIRED', 'TRIALING');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('DRAFT', 'OPEN', 'PAID', 'VOID', 'UNCOLLECTIBLE');

-- CreateEnum
CREATE TYPE "LivestreamStatus" AS ENUM ('SCHEDULED', 'LIVE', 'ENDED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "AiTaskStatus" AS ENUM ('QUEUED', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "AiTaskType" AS ENUM ('DESCRIPTION', 'TITLE', 'KEYWORDS', 'IMAGE_TAG', 'CATEGORY_SUGGEST', 'SEO', 'TRANSLATION', 'SALES_INSIGHT');

-- CreateEnum
CREATE TYPE "LoyaltyTransactionType" AS ENUM ('EARN', 'SPEND', 'EXPIRE', 'ADJUST', 'REFUND');

-- CreateEnum
CREATE TYPE "WalletTransactionType" AS ENUM ('SALE_CREDIT', 'PLATFORM_FEE', 'WITHDRAWAL', 'REFUND_DEBIT', 'ADJUSTMENT', 'COMMISSION_PAYOUT', 'DEPOSIT');

-- CreateEnum
CREATE TYPE "WalletTransactionStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REVERSED');

-- CreateEnum
CREATE TYPE "WithdrawalStatus" AS ENUM ('PENDING', 'APPROVED', 'PROCESSING', 'COMPLETED', 'REJECTED', 'FAILED');

-- CreateEnum
CREATE TYPE "AutomationTrigger" AS ENUM ('ORDER_CREATED', 'ORDER_CANCELLED', 'LOW_STOCK', 'MESSAGE_RECEIVED', 'REVIEW_RECEIVED', 'SCHEDULE', 'PRICE_CHANGE', 'PRODUCT_PUBLISHED');

-- CreateEnum
CREATE TYPE "AutomationAction" AS ENUM ('SEND_MESSAGE', 'UPDATE_PRICE', 'UPDATE_STOCK', 'CANCEL_ORDER', 'SEND_NOTIFICATION', 'APPLY_COUPON', 'TAG_ORDER');

-- CreateEnum
CREATE TYPE "AutomationStatus" AS ENUM ('ACTIVE', 'PAUSED', 'DRAFT');

-- CreateEnum
CREATE TYPE "ExperimentStatus" AS ENUM ('DRAFT', 'RUNNING', 'PAUSED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "ReferralStatus" AS ENUM ('PENDING', 'CONVERTED', 'REWARDED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "PlatformEventStatus" AS ENUM ('PENDING', 'DELIVERED', 'FAILED', 'REPLAYED');

-- CreateEnum
CREATE TYPE "AdminStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "AdminRoleType" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'SUPPORT', 'VIEWER');

-- CreateEnum
CREATE TYPE "AdminPermission" AS ENUM ('ADMIN_MANAGE', 'ROLE_MANAGE', 'SELLER_VIEW', 'SELLER_APPROVE', 'SELLER_SUSPEND', 'PRODUCT_VIEW', 'PRODUCT_MODERATE', 'ORDER_VIEW', 'ORDER_MANAGE', 'REFUND_VIEW', 'REFUND_MANAGE', 'USER_VIEW', 'USER_MANAGE', 'MARKETING_MANAGE', 'BANNER_MANAGE', 'NOTIFICATION_MANAGE', 'REVIEW_MODERATE', 'CATEGORY_MANAGE', 'AUDIT_VIEW', 'SETTINGS_MANAGE', 'DASHBOARD_VIEW');

-- CreateEnum
CREATE TYPE "SellerStatus" AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED', 'BANNED', 'REJECTED');

-- CreateEnum
CREATE TYPE "SellerVerificationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'RESUBMITTED');

-- CreateEnum
CREATE TYPE "AuditActionType" AS ENUM ('ADMIN_LOGIN', 'ADMIN_LOGOUT', 'ADMIN_CREATED', 'ADMIN_UPDATED', 'ROLE_ASSIGNED', 'ROLE_REMOVED', 'SELLER_APPROVED', 'SELLER_REJECTED', 'SELLER_SUSPENDED', 'PRODUCT_MODERATED', 'PRODUCT_APPROVED', 'PRODUCT_REJECTED', 'PRODUCT_HIDDEN', 'PRODUCT_UNHIDDEN', 'PRODUCT_BANNED', 'PRODUCT_BULK_APPROVED', 'PRODUCT_BULK_REJECTED', 'PRODUCT_REPORT_RESOLVED', 'PRODUCT_REPORT_DISMISSED', 'CATEGORY_CREATED', 'CATEGORY_UPDATED', 'CATEGORY_DELETED', 'CATEGORY_REORDERED', 'ORDER_FORCE_CANCELLED', 'ORDER_FORCE_COMPLETED', 'REFUND_APPROVED', 'REFUND_REJECTED', 'USER_SUSPENDED', 'USER_BANNED', 'USER_ACTIVATED', 'VOUCHER_CREATED', 'VOUCHER_UPDATED', 'BANNER_CREATED', 'BANNER_UPDATED', 'BANNER_PUBLISHED', 'BANNER_UNPUBLISHED', 'REVIEW_HIDDEN', 'REVIEW_APPROVED', 'REVIEW_REJECTED', 'NOTIFICATION_CREATED', 'NOTIFICATION_SENT', 'NOTIFICATION_TEMPLATE_CREATED', 'SETTINGS_CHANGED');

-- CreateEnum
CREATE TYPE "ProductReportReason" AS ENUM ('COUNTERFEIT', 'INAPPROPRIATE', 'WRONG_CATEGORY', 'MISLEADING', 'PROHIBITED', 'IP_VIOLATION', 'OTHER');

-- CreateEnum
CREATE TYPE "ProductReportStatus" AS ENUM ('OPEN', 'REVIEWING', 'RESOLVED', 'DISMISSED');

-- CreateEnum
CREATE TYPE "BannerPosition" AS ENUM ('HERO', 'HOMEPAGE_TOP', 'HOMEPAGE_MIDDLE', 'CAMPAIGN', 'ANNOUNCEMENT');

-- CreateEnum
CREATE TYPE "BannerStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'ACTIVE', 'EXPIRED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "NotificationChannel" AS ENUM ('IN_APP', 'EMAIL', 'PUSH');

-- CreateEnum
CREATE TYPE "AdminNotificationStatus" AS ENUM ('DRAFT', 'SENT', 'FAILED');

-- CreateEnum
CREATE TYPE "PlatformVoucherType" AS ENUM ('PERCENTAGE', 'FIXED_AMOUNT', 'FREE_SHIPPING');

-- CreateEnum
CREATE TYPE "PlatformVoucherStatus" AS ENUM ('DRAFT', 'ACTIVE', 'PAUSED', 'EXPIRED', 'DEPLETED');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "phone" TEXT,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "user_id" UUID NOT NULL,
    "role_id" UUID NOT NULL,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("user_id","role_id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "user_agent" TEXT,
    "ip_address" TEXT,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password_reset_tokens" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_verify_tokens" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_verify_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seller_profiles" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "seller_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shops" (
    "id" UUID NOT NULL,
    "seller_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "logo" TEXT,
    "banner" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "status" "ShopStatus" NOT NULL DEFAULT 'PENDING',
    "address_line1" TEXT,
    "address_line2" TEXT,
    "city" TEXT,
    "state" TEXT,
    "postal_code" TEXT,
    "country" TEXT DEFAULT 'VN',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shops_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "parent_id" UUID,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT,
    "icon" TEXT,
    "banner" TEXT,
    "meta_title" TEXT,
    "meta_desc" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" UUID NOT NULL,
    "shop_id" UUID NOT NULL,
    "category_id" UUID,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "status" "ProductStatus" NOT NULL DEFAULT 'DRAFT',
    "base_price" DECIMAL(12,2),
    "base_sku" TEXT,
    "base_stock" INTEGER NOT NULL DEFAULT 0,
    "reserved_stock" INTEGER NOT NULL DEFAULT 0,
    "has_variants" BOOLEAN NOT NULL DEFAULT false,
    "weight" DECIMAL(10,3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_variant_option_groups" (
    "id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "product_variant_option_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_variant_options" (
    "id" UUID NOT NULL,
    "group_id" UUID NOT NULL,
    "value" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "product_variant_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_variants" (
    "id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "sku" TEXT,
    "price" DECIMAL(12,2) NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "reserved_stock" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_variant_option_values" (
    "variant_id" UUID NOT NULL,
    "option_id" UUID NOT NULL,

    CONSTRAINT "product_variant_option_values_pkey" PRIMARY KEY ("variant_id","option_id")
);

-- CreateTable
CREATE TABLE "product_images" (
    "id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_cover" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" UUID NOT NULL,
    "buyer_id" UUID NOT NULL,
    "total_amount" DECIMAL(12,2) NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "shipping_name" TEXT,
    "shipping_phone" TEXT,
    "shipping_address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seller_orders" (
    "id" UUID NOT NULL,
    "order_id" UUID NOT NULL,
    "shop_id" UUID NOT NULL,
    "subtotal" DECIMAL(12,2) NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "seller_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seller_order_items" (
    "id" UUID NOT NULL,
    "seller_order_id" UUID NOT NULL,
    "variant_id" UUID NOT NULL,
    "product_name" TEXT NOT NULL,
    "variant_label" TEXT,
    "quantity" INTEGER NOT NULL,
    "unit_price" DECIMAL(12,2) NOT NULL,
    "total_price" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "seller_order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_audit_logs" (
    "id" UUID NOT NULL,
    "seller_order_id" UUID NOT NULL,
    "from_status" TEXT NOT NULL,
    "to_status" TEXT NOT NULL,
    "note" TEXT,
    "performed_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_transactions" (
    "id" UUID NOT NULL,
    "variant_id" UUID NOT NULL,
    "type" "InventoryTransactionType" NOT NULL,
    "quantity" INTEGER NOT NULL,
    "reference" TEXT,
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventory_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shipping_providers" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "logo_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shipping_providers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seller_shipping_methods" (
    "id" UUID NOT NULL,
    "shop_id" UUID NOT NULL,
    "provider_id" UUID NOT NULL,
    "is_enabled" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "seller_shipping_methods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shipments" (
    "id" UUID NOT NULL,
    "seller_order_id" UUID NOT NULL,
    "provider_id" UUID NOT NULL,
    "tracking_number" TEXT,
    "status" "ShipmentStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shipments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" UUID NOT NULL,
    "shop_id" UUID NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL,
    "user_id" UUID,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entity_id" UUID,
    "old_data" JSONB,
    "new_data" JSONB,
    "ip_address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coupons" (
    "id" UUID NOT NULL,
    "shop_id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "CouponType" NOT NULL,
    "scope" "CouponScope" NOT NULL DEFAULT 'ALL_PRODUCTS',
    "status" "CouponStatus" NOT NULL DEFAULT 'DRAFT',
    "discount_value" DECIMAL(12,2) NOT NULL,
    "max_discount_amount" DECIMAL(12,2),
    "min_order_amount" DECIMAL(12,2),
    "usage_limit" INTEGER,
    "usage_limit_per_user" INTEGER,
    "used_count" INTEGER NOT NULL DEFAULT 0,
    "auto_apply" BOOLEAN NOT NULL DEFAULT false,
    "starts_at" TIMESTAMP(3) NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "coupons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coupon_products" (
    "coupon_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,

    CONSTRAINT "coupon_products_pkey" PRIMARY KEY ("coupon_id","product_id")
);

-- CreateTable
CREATE TABLE "coupon_categories" (
    "coupon_id" UUID NOT NULL,
    "category_id" UUID NOT NULL,

    CONSTRAINT "coupon_categories_pkey" PRIMARY KEY ("coupon_id","category_id")
);

-- CreateTable
CREATE TABLE "coupon_usages" (
    "id" UUID NOT NULL,
    "coupon_id" UUID NOT NULL,
    "buyer_id" UUID NOT NULL,
    "order_id" UUID,
    "discount" DECIMAL(12,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "coupon_usages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "buyer_id" UUID NOT NULL,
    "order_id" UUID,
    "rating" INTEGER NOT NULL,
    "title" TEXT,
    "comment" TEXT,
    "status" "ReviewStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review_images" (
    "id" UUID NOT NULL,
    "review_id" UUID NOT NULL,
    "url" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "review_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review_replies" (
    "id" UUID NOT NULL,
    "review_id" UUID NOT NULL,
    "shop_id" UUID NOT NULL,
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "review_replies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review_reports" (
    "id" UUID NOT NULL,
    "review_id" UUID NOT NULL,
    "shop_id" UUID NOT NULL,
    "reason" TEXT NOT NULL,
    "details" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "review_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversations" (
    "id" UUID NOT NULL,
    "shop_id" UUID NOT NULL,
    "buyer_id" UUID NOT NULL,
    "product_id" UUID,
    "last_message_at" TIMESTAMP(3),
    "last_message_text" TEXT,
    "seller_unread" INTEGER NOT NULL DEFAULT 0,
    "buyer_unread" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_messages" (
    "id" UUID NOT NULL,
    "conversation_id" UUID NOT NULL,
    "sender_id" UUID NOT NULL,
    "type" "ChatMessageType" NOT NULL DEFAULT 'TEXT',
    "content" TEXT NOT NULL,
    "metadata" JSONB,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "return_requests" (
    "id" UUID NOT NULL,
    "seller_order_id" UUID NOT NULL,
    "buyer_id" UUID NOT NULL,
    "shop_id" UUID NOT NULL,
    "status" "ReturnStatus" NOT NULL DEFAULT 'REQUESTED',
    "reason" "ReturnReason" NOT NULL,
    "description" TEXT,
    "refund_amount" DECIMAL(12,2) NOT NULL,
    "refund_method" "RefundMethod",
    "tracking_number" TEXT,
    "resolved_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "return_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "return_items" (
    "id" UUID NOT NULL,
    "return_request_id" UUID NOT NULL,
    "seller_order_item_id" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "return_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "return_evidence" (
    "id" UUID NOT NULL,
    "return_request_id" UUID NOT NULL,
    "uploaded_by" UUID NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "return_evidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "return_timeline" (
    "id" UUID NOT NULL,
    "return_request_id" UUID NOT NULL,
    "from_status" TEXT NOT NULL,
    "to_status" TEXT NOT NULL,
    "note" TEXT,
    "performed_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "return_timeline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_approvals" (
    "id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "shop_id" UUID NOT NULL,
    "status" "ApprovalStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewed_at" TIMESTAMP(3),
    "reviewed_by" UUID,
    "rejection_reason" TEXT,
    "revision_note" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_approvals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_approval_history" (
    "id" UUID NOT NULL,
    "approval_id" UUID NOT NULL,
    "from_status" TEXT NOT NULL,
    "to_status" TEXT NOT NULL,
    "note" TEXT,
    "performed_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_approval_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "warehouses" (
    "id" UUID NOT NULL,
    "shop_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "address" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "warehouses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "warehouse_stocks" (
    "id" UUID NOT NULL,
    "warehouse_id" UUID NOT NULL,
    "variant_id" UUID NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "reserved" INTEGER NOT NULL DEFAULT 0,
    "safety_stock" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "warehouse_stocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_transfers" (
    "id" UUID NOT NULL,
    "shop_id" UUID NOT NULL,
    "from_warehouse_id" UUID NOT NULL,
    "to_warehouse_id" UUID NOT NULL,
    "status" "InventoryTransferStatus" NOT NULL DEFAULT 'PENDING',
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventory_transfers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_transfer_items" (
    "id" UUID NOT NULL,
    "transfer_id" UUID NOT NULL,
    "variant_id" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "inventory_transfer_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seller_metric_snapshots" (
    "id" UUID NOT NULL,
    "shop_id" UUID NOT NULL,
    "date" DATE NOT NULL,
    "total_orders" INTEGER NOT NULL DEFAULT 0,
    "cancelled_orders" INTEGER NOT NULL DEFAULT 0,
    "late_shipments" INTEGER NOT NULL DEFAULT 0,
    "total_refunds" INTEGER NOT NULL DEFAULT 0,
    "messages_received" INTEGER NOT NULL DEFAULT 0,
    "messages_responded" INTEGER NOT NULL DEFAULT 0,
    "avg_response_minutes" DOUBLE PRECISION,
    "cancellation_rate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "late_shipment_rate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "response_rate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "refund_rate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "seller_score" DOUBLE PRECISION NOT NULL DEFAULT 100,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "seller_metric_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bulk_jobs" (
    "id" UUID NOT NULL,
    "shop_id" UUID NOT NULL,
    "type" "BulkJobType" NOT NULL,
    "status" "BulkJobStatus" NOT NULL DEFAULT 'QUEUED',
    "file_name" TEXT NOT NULL,
    "file_url" TEXT,
    "result_url" TEXT,
    "total_rows" INTEGER NOT NULL DEFAULT 0,
    "processed_rows" INTEGER NOT NULL DEFAULT 0,
    "success_rows" INTEGER NOT NULL DEFAULT 0,
    "error_rows" INTEGER NOT NULL DEFAULT 0,
    "errors" JSONB,
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bulk_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saved_filters" (
    "id" UUID NOT NULL,
    "shop_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "filters" JSONB NOT NULL,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "saved_filters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flash_sale_campaigns" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "FlashSaleStatus" NOT NULL DEFAULT 'DRAFT',
    "starts_at" TIMESTAMP(3) NOT NULL,
    "ends_at" TIMESTAMP(3) NOT NULL,
    "max_slots_per_seller" INTEGER NOT NULL DEFAULT 5,
    "is_visible" BOOLEAN NOT NULL DEFAULT false,
    "created_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "flash_sale_campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flash_sale_slots" (
    "id" UUID NOT NULL,
    "campaign_id" UUID NOT NULL,
    "shop_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "variant_id" UUID,
    "status" "FlashSaleSlotStatus" NOT NULL DEFAULT 'PENDING',
    "original_price" DECIMAL(12,2) NOT NULL,
    "sale_price" DECIMAL(12,2) NOT NULL,
    "total_stock" INTEGER NOT NULL,
    "sold_count" INTEGER NOT NULL DEFAULT 0,
    "purchase_limit" INTEGER NOT NULL DEFAULT 1,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "flash_sale_slots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flash_sale_purchases" (
    "id" UUID NOT NULL,
    "slot_id" UUID NOT NULL,
    "buyer_id" UUID NOT NULL,
    "order_id" UUID,
    "quantity" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "flash_sale_purchases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ad_campaigns" (
    "id" UUID NOT NULL,
    "shop_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "type" "AdType" NOT NULL DEFAULT 'SPONSORED_PRODUCT',
    "status" "AdCampaignStatus" NOT NULL DEFAULT 'DRAFT',
    "daily_budget" DECIMAL(12,2) NOT NULL,
    "total_budget" DECIMAL(12,2),
    "spent_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "bid_amount" DECIMAL(12,4) NOT NULL,
    "starts_at" TIMESTAMP(3) NOT NULL,
    "ends_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ad_campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ad_groups" (
    "id" UUID NOT NULL,
    "campaign_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ad_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ads" (
    "id" UUID NOT NULL,
    "ad_group_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "impressions" INTEGER NOT NULL DEFAULT 0,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "conversions" INTEGER NOT NULL DEFAULT 0,
    "spent" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ad_keywords" (
    "id" UUID NOT NULL,
    "ad_group_id" UUID NOT NULL,
    "keyword" TEXT NOT NULL,
    "bid_amount" DECIMAL(12,4),
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ad_keywords_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ad_impressions" (
    "id" UUID NOT NULL,
    "ad_id" UUID NOT NULL,
    "buyer_id" UUID,
    "placement" TEXT NOT NULL,
    "cost" DECIMAL(12,4) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ad_impressions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ad_clicks" (
    "id" UUID NOT NULL,
    "ad_id" UUID NOT NULL,
    "buyer_id" UUID,
    "cost" DECIMAL(12,4) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ad_clicks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "affiliate_partners" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "status" "AffiliateStatus" NOT NULL DEFAULT 'PENDING',
    "display_name" TEXT NOT NULL,
    "bio" TEXT,
    "website" TEXT,
    "social_links" JSONB,
    "commission_rate" DECIMAL(5,2) NOT NULL DEFAULT 5,
    "total_earnings" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "pending_balance" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "affiliate_partners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "affiliate_links" (
    "id" UUID NOT NULL,
    "partner_id" UUID NOT NULL,
    "product_id" UUID,
    "shop_id" UUID,
    "code" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "conversions" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "affiliate_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "affiliate_clicks" (
    "id" UUID NOT NULL,
    "link_id" UUID NOT NULL,
    "visitor_id" TEXT,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "referer" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "affiliate_clicks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "affiliate_conversions" (
    "id" UUID NOT NULL,
    "link_id" UUID NOT NULL,
    "order_id" UUID NOT NULL,
    "buyer_id" UUID NOT NULL,
    "order_amount" DECIMAL(12,2) NOT NULL,
    "commission_rate" DECIMAL(5,2) NOT NULL,
    "commission_amount" DECIMAL(12,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "affiliate_conversions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commission_payouts" (
    "id" UUID NOT NULL,
    "partner_id" UUID NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "status" "CommissionPayoutStatus" NOT NULL DEFAULT 'PENDING',
    "payment_method" TEXT,
    "payment_ref" TEXT,
    "note" TEXT,
    "processed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "commission_payouts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscription_plans" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "monthly_price" DECIMAL(12,2) NOT NULL,
    "yearly_price" DECIMAL(12,2),
    "product_limit" INTEGER,
    "order_limit" INTEGER,
    "storage_limit" INTEGER,
    "staff_limit" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscription_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plan_entitlements" (
    "id" UUID NOT NULL,
    "plan_id" UUID NOT NULL,
    "feature" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "plan_entitlements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seller_subscriptions" (
    "id" UUID NOT NULL,
    "shop_id" UUID NOT NULL,
    "plan_id" UUID NOT NULL,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "billing_cycle" TEXT NOT NULL DEFAULT 'monthly',
    "current_period_start" TIMESTAMP(3) NOT NULL,
    "current_period_end" TIMESTAMP(3) NOT NULL,
    "stripe_subscription_id" TEXT,
    "stripe_customer_id" TEXT,
    "cancelled_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "seller_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscription_invoices" (
    "id" UUID NOT NULL,
    "subscription_id" UUID NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "status" "InvoiceStatus" NOT NULL DEFAULT 'DRAFT',
    "period_start" TIMESTAMP(3) NOT NULL,
    "period_end" TIMESTAMP(3) NOT NULL,
    "stripe_invoice_id" TEXT,
    "paid_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscription_invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "livestream_sessions" (
    "id" UUID NOT NULL,
    "shop_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "LivestreamStatus" NOT NULL DEFAULT 'SCHEDULED',
    "thumbnail_url" TEXT,
    "stream_url" TEXT,
    "stream_key" TEXT,
    "replay_url" TEXT,
    "scheduled_at" TIMESTAMP(3) NOT NULL,
    "started_at" TIMESTAMP(3),
    "ended_at" TIMESTAMP(3),
    "viewer_count" INTEGER NOT NULL DEFAULT 0,
    "peak_viewers" INTEGER NOT NULL DEFAULT 0,
    "total_reactions" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "livestream_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "livestream_products" (
    "id" UUID NOT NULL,
    "session_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "is_pinned" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "special_price" DECIMAL(12,2),
    "pinned_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "livestream_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "livestream_chats" (
    "id" UUID NOT NULL,
    "session_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "message" TEXT NOT NULL,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "livestream_chats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_tasks" (
    "id" UUID NOT NULL,
    "shop_id" UUID NOT NULL,
    "type" "AiTaskType" NOT NULL,
    "status" "AiTaskStatus" NOT NULL DEFAULT 'QUEUED',
    "input_data" JSONB NOT NULL,
    "output_data" JSONB,
    "error" TEXT,
    "product_id" UUID,
    "template_id" UUID,
    "provider" TEXT,
    "model" TEXT,
    "tokens_used" INTEGER,
    "cost_usd" DECIMAL(10,6),
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_prompt_templates" (
    "id" UUID NOT NULL,
    "type" "AiTaskType" NOT NULL,
    "name" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "prompt" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_prompt_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_usage_logs" (
    "id" UUID NOT NULL,
    "shop_id" UUID NOT NULL,
    "month" TEXT NOT NULL,
    "tasks_used" INTEGER NOT NULL DEFAULT 0,
    "tokens_used" INTEGER NOT NULL DEFAULT 0,
    "total_cost_usd" DECIMAL(10,4) NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_usage_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_events" (
    "id" UUID NOT NULL,
    "user_id" UUID,
    "session_id" TEXT,
    "event" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" UUID NOT NULL,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_scores" (
    "id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "score_type" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "metadata" JSONB,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_relations" (
    "id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "related_product_id" UUID NOT NULL,
    "relation_type" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_relations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loyalty_tiers" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "min_points" INTEGER NOT NULL,
    "multiplier" DECIMAL(5,2) NOT NULL DEFAULT 1,
    "benefits" JSONB,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "loyalty_tiers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loyalty_accounts" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "tier_id" UUID,
    "total_points" INTEGER NOT NULL DEFAULT 0,
    "available_points" INTEGER NOT NULL DEFAULT 0,
    "lifetime_points" INTEGER NOT NULL DEFAULT 0,
    "last_check_in" TIMESTAMP(3),
    "streak" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "loyalty_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loyalty_transactions" (
    "id" UUID NOT NULL,
    "account_id" UUID NOT NULL,
    "type" "LoyaltyTransactionType" NOT NULL,
    "points" INTEGER NOT NULL,
    "balance" INTEGER NOT NULL,
    "description" TEXT,
    "reference" TEXT,
    "reference_id" UUID,
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "loyalty_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loyalty_missions" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "event_type" TEXT NOT NULL,
    "target_count" INTEGER NOT NULL DEFAULT 1,
    "reward_points" INTEGER NOT NULL,
    "is_repeatable" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "starts_at" TIMESTAMP(3),
    "ends_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "loyalty_missions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loyalty_mission_progress" (
    "id" UUID NOT NULL,
    "account_id" UUID NOT NULL,
    "mission_id" UUID NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "loyalty_mission_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loyalty_rewards" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "points_cost" INTEGER NOT NULL,
    "reward_type" TEXT NOT NULL,
    "reward_value" JSONB NOT NULL,
    "stock" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "loyalty_rewards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loyalty_redemptions" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "reward_id" UUID NOT NULL,
    "points_spent" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "loyalty_redemptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wallets" (
    "id" UUID NOT NULL,
    "owner_id" UUID NOT NULL,
    "owner_type" TEXT NOT NULL,
    "balance" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "pending_balance" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "total_earned" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "total_withdrawn" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wallets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wallet_transactions" (
    "id" UUID NOT NULL,
    "wallet_id" UUID NOT NULL,
    "type" "WalletTransactionType" NOT NULL,
    "status" "WalletTransactionStatus" NOT NULL DEFAULT 'PENDING',
    "amount" DECIMAL(12,2) NOT NULL,
    "balance_after" DECIMAL(12,2) NOT NULL,
    "description" TEXT,
    "reference" TEXT,
    "reference_id" UUID,
    "idempotency_key" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wallet_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wallet_withdrawals" (
    "id" UUID NOT NULL,
    "wallet_id" UUID NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "status" "WithdrawalStatus" NOT NULL DEFAULT 'PENDING',
    "bank_name" TEXT,
    "account_number" TEXT,
    "account_holder" TEXT,
    "payment_ref" TEXT,
    "note" TEXT,
    "approved_by" UUID,
    "approved_at" TIMESTAMP(3),
    "processed_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wallet_withdrawals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "settlement_batches" (
    "id" UUID NOT NULL,
    "period_start" TIMESTAMP(3) NOT NULL,
    "period_end" TIMESTAMP(3) NOT NULL,
    "total_orders" INTEGER NOT NULL DEFAULT 0,
    "total_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "total_fees" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "total_payout" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "processed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "settlement_batches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "settlement_items" (
    "id" UUID NOT NULL,
    "batch_id" UUID NOT NULL,
    "shop_id" UUID NOT NULL,
    "seller_order_id" UUID NOT NULL,
    "order_amount" DECIMAL(12,2) NOT NULL,
    "platform_fee" DECIMAL(12,2) NOT NULL,
    "payout_amount" DECIMAL(12,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "settlement_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "search_synonyms" (
    "id" UUID NOT NULL,
    "term" TEXT NOT NULL,
    "synonyms" TEXT[],
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "search_synonyms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "search_boost_rules" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "boost" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "search_boost_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "search_analytics" (
    "id" UUID NOT NULL,
    "query" TEXT NOT NULL,
    "user_id" UUID,
    "result_count" INTEGER NOT NULL,
    "clicked_product_id" UUID,
    "click_position" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "search_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "automation_rules" (
    "id" UUID NOT NULL,
    "shop_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "status" "AutomationStatus" NOT NULL DEFAULT 'DRAFT',
    "trigger" "AutomationTrigger" NOT NULL,
    "conditions" JSONB,
    "actions" JSONB NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "max_executions" INTEGER,
    "execution_count" INTEGER NOT NULL DEFAULT 0,
    "last_executed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "automation_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "automation_executions" (
    "id" UUID NOT NULL,
    "rule_id" UUID NOT NULL,
    "success" BOOLEAN NOT NULL,
    "error" TEXT,
    "trigger_data" JSONB,
    "action_results" JSONB,
    "executed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "automation_executions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "regions" (
    "id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "default_currency_id" UUID,
    "default_locale" TEXT NOT NULL DEFAULT 'en',
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "shipping_zones" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "regions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "currencies" (
    "id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "exchange_rate" DECIMAL(18,8) NOT NULL DEFAULT 1,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "currencies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "translations" (
    "id" UUID NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" UUID NOT NULL,
    "locale" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "regional_pricings" (
    "id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "region_id" UUID NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "currency_code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "regional_pricings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tax_rates" (
    "id" UUID NOT NULL,
    "region_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "rate" DECIMAL(5,4) NOT NULL,
    "category" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tax_rates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_events" (
    "id" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "status" "PlatformEventStatus" NOT NULL DEFAULT 'PENDING',
    "payload" JSONB NOT NULL,
    "metadata" JSONB,
    "entity_type" TEXT,
    "entity_id" UUID,
    "processed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "platform_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_subscriptions" (
    "id" UUID NOT NULL,
    "event_type" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "secret" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_delivered_at" TIMESTAMP(3),
    "failure_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "referrals" (
    "id" UUID NOT NULL,
    "referrer_id" UUID NOT NULL,
    "referee_id" UUID,
    "code" TEXT NOT NULL,
    "status" "ReferralStatus" NOT NULL DEFAULT 'PENDING',
    "reward_amount" DECIMAL(12,2),
    "reward_type" TEXT,
    "converted_at" TIMESTAMP(3),
    "rewarded_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "referrals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feature_flags" (
    "id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "is_enabled" BOOLEAN NOT NULL DEFAULT false,
    "target_rules" JSONB,
    "rollout_percentage" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feature_flags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "experiments" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "ExperimentStatus" NOT NULL DEFAULT 'DRAFT',
    "target_audience" JSONB,
    "traffic_percent" INTEGER NOT NULL DEFAULT 100,
    "starts_at" TIMESTAMP(3),
    "ends_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "experiments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "experiment_variants" (
    "id" UUID NOT NULL,
    "experiment_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "weight" INTEGER NOT NULL DEFAULT 50,
    "config" JSONB,
    "impressions" INTEGER NOT NULL DEFAULT 0,
    "conversions" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "experiment_variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "growth_campaigns" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "config" JSONB NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "starts_at" TIMESTAMP(3),
    "ends_at" TIMESTAMP(3),
    "impressions" INTEGER NOT NULL DEFAULT 0,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "conversions" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "growth_campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_segments" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "rules" JSONB NOT NULL,
    "user_count" INTEGER NOT NULL DEFAULT 0,
    "last_computed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_segments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admins" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "avatar" TEXT,
    "status" "AdminStatus" NOT NULL DEFAULT 'ACTIVE',
    "last_login_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_roles" (
    "id" UUID NOT NULL,
    "name" "AdminRoleType" NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_role_assignments" (
    "admin_id" UUID NOT NULL,
    "admin_role_id" UUID NOT NULL,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_role_assignments_pkey" PRIMARY KEY ("admin_id","admin_role_id")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "admin_role_id" UUID NOT NULL,
    "permission" "AdminPermission" NOT NULL,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("admin_role_id","permission")
);

-- CreateTable
CREATE TABLE "admin_sessions" (
    "id" UUID NOT NULL,
    "admin_id" UUID NOT NULL,
    "user_agent" TEXT,
    "ip_address" TEXT,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sellers" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "shop_name" TEXT NOT NULL,
    "shop_description" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "status" "SellerStatus" NOT NULL DEFAULT 'PENDING',
    "approved_at" TIMESTAMP(3),
    "approved_by" UUID,
    "suspended_at" TIMESTAMP(3),
    "suspended_by" UUID,
    "suspend_reason" TEXT,
    "rejected_at" TIMESTAMP(3),
    "rejected_by" UUID,
    "reject_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "sellers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seller_verifications" (
    "id" UUID NOT NULL,
    "seller_id" UUID NOT NULL,
    "document_type" TEXT NOT NULL,
    "document_url" TEXT NOT NULL,
    "status" "SellerVerificationStatus" NOT NULL DEFAULT 'PENDING',
    "admin_note" TEXT,
    "reviewed_by" UUID,
    "reviewed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "seller_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_audit_logs" (
    "id" UUID NOT NULL,
    "admin_id" UUID,
    "action" "AuditActionType" NOT NULL,
    "entity_type" TEXT,
    "entity_id" UUID,
    "metadata" JSONB,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_reports" (
    "id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "reporter_id" UUID NOT NULL,
    "reason" "ProductReportReason" NOT NULL,
    "status" "ProductReportStatus" NOT NULL DEFAULT 'OPEN',
    "details" TEXT,
    "admin_note" TEXT,
    "resolved_by" UUID,
    "resolved_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attribute_groups" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attribute_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attribute_values" (
    "id" UUID NOT NULL,
    "group_id" UUID NOT NULL,
    "value" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "attribute_values_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category_attributes" (
    "category_id" UUID NOT NULL,
    "group_id" UUID NOT NULL,
    "is_required" BOOLEAN NOT NULL DEFAULT false,
    "is_filterable" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "category_attributes_pkey" PRIMARY KEY ("category_id","group_id")
);

-- CreateTable
CREATE TABLE "banners" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "position" "BannerPosition" NOT NULL,
    "status" "BannerStatus" NOT NULL DEFAULT 'DRAFT',
    "image_url" TEXT NOT NULL,
    "mobile_image_url" TEXT,
    "link_url" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "starts_at" TIMESTAMP(3),
    "ends_at" TIMESTAMP(3),
    "created_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "banners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_templates" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "channel" "NotificationChannel" NOT NULL DEFAULT 'IN_APP',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_notifications" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "channel" "NotificationChannel" NOT NULL DEFAULT 'IN_APP',
    "status" "AdminNotificationStatus" NOT NULL DEFAULT 'DRAFT',
    "target_all" BOOLEAN NOT NULL DEFAULT false,
    "sent_at" TIMESTAMP(3),
    "sent_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_vouchers" (
    "id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "PlatformVoucherType" NOT NULL,
    "status" "PlatformVoucherStatus" NOT NULL DEFAULT 'DRAFT',
    "discount_value" DECIMAL(12,2) NOT NULL,
    "max_discount_amount" DECIMAL(12,2),
    "min_order_amount" DECIMAL(12,2),
    "usage_limit" INTEGER,
    "usage_limit_per_user" INTEGER,
    "used_count" INTEGER NOT NULL DEFAULT 0,
    "starts_at" TIMESTAMP(3) NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "platform_vouchers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE INDEX "sessions_user_id_idx" ON "sessions"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "password_reset_tokens_token_key" ON "password_reset_tokens"("token");

-- CreateIndex
CREATE INDEX "password_reset_tokens_token_idx" ON "password_reset_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "email_verify_tokens_token_key" ON "email_verify_tokens"("token");

-- CreateIndex
CREATE INDEX "email_verify_tokens_token_idx" ON "email_verify_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "seller_profiles_user_id_key" ON "seller_profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "shops_seller_id_key" ON "shops"("seller_id");

-- CreateIndex
CREATE UNIQUE INDEX "shops_slug_key" ON "shops"("slug");

-- CreateIndex
CREATE INDEX "shops_seller_id_idx" ON "shops"("seller_id");

-- CreateIndex
CREATE INDEX "shops_status_idx" ON "shops"("status");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE INDEX "categories_parent_id_idx" ON "categories"("parent_id");

-- CreateIndex
CREATE INDEX "products_shop_id_status_idx" ON "products"("shop_id", "status");

-- CreateIndex
CREATE INDEX "products_category_id_idx" ON "products"("category_id");

-- CreateIndex
CREATE INDEX "products_deleted_at_idx" ON "products"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "products_shop_id_slug_key" ON "products"("shop_id", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "product_variant_option_groups_product_id_name_key" ON "product_variant_option_groups"("product_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "product_variant_options_group_id_value_key" ON "product_variant_options"("group_id", "value");

-- CreateIndex
CREATE INDEX "product_variants_product_id_idx" ON "product_variants"("product_id");

-- CreateIndex
CREATE INDEX "product_images_product_id_idx" ON "product_images"("product_id");

-- CreateIndex
CREATE INDEX "orders_buyer_id_idx" ON "orders"("buyer_id");

-- CreateIndex
CREATE INDEX "orders_status_idx" ON "orders"("status");

-- CreateIndex
CREATE INDEX "seller_orders_shop_id_status_idx" ON "seller_orders"("shop_id", "status");

-- CreateIndex
CREATE INDEX "seller_orders_order_id_idx" ON "seller_orders"("order_id");

-- CreateIndex
CREATE INDEX "seller_order_items_seller_order_id_idx" ON "seller_order_items"("seller_order_id");

-- CreateIndex
CREATE INDEX "order_audit_logs_seller_order_id_idx" ON "order_audit_logs"("seller_order_id");

-- CreateIndex
CREATE INDEX "inventory_transactions_variant_id_idx" ON "inventory_transactions"("variant_id");

-- CreateIndex
CREATE INDEX "inventory_transactions_created_at_idx" ON "inventory_transactions"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "shipping_providers_name_key" ON "shipping_providers"("name");

-- CreateIndex
CREATE UNIQUE INDEX "shipping_providers_code_key" ON "shipping_providers"("code");

-- CreateIndex
CREATE UNIQUE INDEX "seller_shipping_methods_shop_id_provider_id_key" ON "seller_shipping_methods"("shop_id", "provider_id");

-- CreateIndex
CREATE UNIQUE INDEX "shipments_seller_order_id_key" ON "shipments"("seller_order_id");

-- CreateIndex
CREATE INDEX "shipments_tracking_number_idx" ON "shipments"("tracking_number");

-- CreateIndex
CREATE INDEX "notifications_shop_id_is_read_idx" ON "notifications"("shop_id", "is_read");

-- CreateIndex
CREATE INDEX "notifications_created_at_idx" ON "notifications"("created_at");

-- CreateIndex
CREATE INDEX "audit_logs_user_id_idx" ON "audit_logs"("user_id");

-- CreateIndex
CREATE INDEX "audit_logs_entity_entity_id_idx" ON "audit_logs"("entity", "entity_id");

-- CreateIndex
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs"("created_at");

-- CreateIndex
CREATE INDEX "coupons_shop_id_status_idx" ON "coupons"("shop_id", "status");

-- CreateIndex
CREATE INDEX "coupons_starts_at_expires_at_idx" ON "coupons"("starts_at", "expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "coupons_shop_id_code_key" ON "coupons"("shop_id", "code");

-- CreateIndex
CREATE INDEX "coupon_usages_coupon_id_idx" ON "coupon_usages"("coupon_id");

-- CreateIndex
CREATE INDEX "coupon_usages_buyer_id_idx" ON "coupon_usages"("buyer_id");

-- CreateIndex
CREATE INDEX "reviews_product_id_status_idx" ON "reviews"("product_id", "status");

-- CreateIndex
CREATE INDEX "reviews_buyer_id_idx" ON "reviews"("buyer_id");

-- CreateIndex
CREATE INDEX "reviews_rating_idx" ON "reviews"("rating");

-- CreateIndex
CREATE INDEX "reviews_created_at_idx" ON "reviews"("created_at");

-- CreateIndex
CREATE INDEX "review_images_review_id_idx" ON "review_images"("review_id");

-- CreateIndex
CREATE INDEX "review_replies_review_id_idx" ON "review_replies"("review_id");

-- CreateIndex
CREATE INDEX "review_reports_review_id_idx" ON "review_reports"("review_id");

-- CreateIndex
CREATE INDEX "conversations_shop_id_last_message_at_idx" ON "conversations"("shop_id", "last_message_at");

-- CreateIndex
CREATE INDEX "conversations_buyer_id_idx" ON "conversations"("buyer_id");

-- CreateIndex
CREATE UNIQUE INDEX "conversations_shop_id_buyer_id_key" ON "conversations"("shop_id", "buyer_id");

-- CreateIndex
CREATE INDEX "chat_messages_conversation_id_created_at_idx" ON "chat_messages"("conversation_id", "created_at");

-- CreateIndex
CREATE INDEX "chat_messages_sender_id_idx" ON "chat_messages"("sender_id");

-- CreateIndex
CREATE INDEX "return_requests_shop_id_status_idx" ON "return_requests"("shop_id", "status");

-- CreateIndex
CREATE INDEX "return_requests_seller_order_id_idx" ON "return_requests"("seller_order_id");

-- CreateIndex
CREATE INDEX "return_requests_buyer_id_idx" ON "return_requests"("buyer_id");

-- CreateIndex
CREATE INDEX "return_requests_created_at_idx" ON "return_requests"("created_at");

-- CreateIndex
CREATE INDEX "return_items_return_request_id_idx" ON "return_items"("return_request_id");

-- CreateIndex
CREATE INDEX "return_evidence_return_request_id_idx" ON "return_evidence"("return_request_id");

-- CreateIndex
CREATE INDEX "return_timeline_return_request_id_idx" ON "return_timeline"("return_request_id");

-- CreateIndex
CREATE INDEX "product_approvals_product_id_idx" ON "product_approvals"("product_id");

-- CreateIndex
CREATE INDEX "product_approvals_shop_id_status_idx" ON "product_approvals"("shop_id", "status");

-- CreateIndex
CREATE INDEX "product_approvals_status_idx" ON "product_approvals"("status");

-- CreateIndex
CREATE INDEX "product_approval_history_approval_id_idx" ON "product_approval_history"("approval_id");

-- CreateIndex
CREATE INDEX "warehouses_shop_id_idx" ON "warehouses"("shop_id");

-- CreateIndex
CREATE UNIQUE INDEX "warehouses_shop_id_code_key" ON "warehouses"("shop_id", "code");

-- CreateIndex
CREATE INDEX "warehouse_stocks_variant_id_idx" ON "warehouse_stocks"("variant_id");

-- CreateIndex
CREATE UNIQUE INDEX "warehouse_stocks_warehouse_id_variant_id_key" ON "warehouse_stocks"("warehouse_id", "variant_id");

-- CreateIndex
CREATE INDEX "inventory_transfers_shop_id_idx" ON "inventory_transfers"("shop_id");

-- CreateIndex
CREATE INDEX "inventory_transfers_status_idx" ON "inventory_transfers"("status");

-- CreateIndex
CREATE INDEX "inventory_transfer_items_transfer_id_idx" ON "inventory_transfer_items"("transfer_id");

-- CreateIndex
CREATE INDEX "seller_metric_snapshots_shop_id_date_idx" ON "seller_metric_snapshots"("shop_id", "date");

-- CreateIndex
CREATE UNIQUE INDEX "seller_metric_snapshots_shop_id_date_key" ON "seller_metric_snapshots"("shop_id", "date");

-- CreateIndex
CREATE INDEX "bulk_jobs_shop_id_type_idx" ON "bulk_jobs"("shop_id", "type");

-- CreateIndex
CREATE INDEX "bulk_jobs_status_idx" ON "bulk_jobs"("status");

-- CreateIndex
CREATE INDEX "bulk_jobs_created_at_idx" ON "bulk_jobs"("created_at");

-- CreateIndex
CREATE INDEX "saved_filters_shop_id_entity_idx" ON "saved_filters"("shop_id", "entity");

-- CreateIndex
CREATE INDEX "flash_sale_campaigns_status_starts_at_idx" ON "flash_sale_campaigns"("status", "starts_at");

-- CreateIndex
CREATE INDEX "flash_sale_campaigns_starts_at_ends_at_idx" ON "flash_sale_campaigns"("starts_at", "ends_at");

-- CreateIndex
CREATE INDEX "flash_sale_slots_campaign_id_status_idx" ON "flash_sale_slots"("campaign_id", "status");

-- CreateIndex
CREATE INDEX "flash_sale_slots_shop_id_idx" ON "flash_sale_slots"("shop_id");

-- CreateIndex
CREATE INDEX "flash_sale_slots_product_id_idx" ON "flash_sale_slots"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "flash_sale_slots_campaign_id_product_id_variant_id_key" ON "flash_sale_slots"("campaign_id", "product_id", "variant_id");

-- CreateIndex
CREATE INDEX "flash_sale_purchases_slot_id_idx" ON "flash_sale_purchases"("slot_id");

-- CreateIndex
CREATE INDEX "flash_sale_purchases_buyer_id_slot_id_idx" ON "flash_sale_purchases"("buyer_id", "slot_id");

-- CreateIndex
CREATE INDEX "ad_campaigns_shop_id_status_idx" ON "ad_campaigns"("shop_id", "status");

-- CreateIndex
CREATE INDEX "ad_campaigns_status_starts_at_idx" ON "ad_campaigns"("status", "starts_at");

-- CreateIndex
CREATE INDEX "ad_groups_campaign_id_idx" ON "ad_groups"("campaign_id");

-- CreateIndex
CREATE INDEX "ads_ad_group_id_idx" ON "ads"("ad_group_id");

-- CreateIndex
CREATE INDEX "ads_product_id_idx" ON "ads"("product_id");

-- CreateIndex
CREATE INDEX "ad_keywords_keyword_idx" ON "ad_keywords"("keyword");

-- CreateIndex
CREATE UNIQUE INDEX "ad_keywords_ad_group_id_keyword_key" ON "ad_keywords"("ad_group_id", "keyword");

-- CreateIndex
CREATE INDEX "ad_impressions_ad_id_created_at_idx" ON "ad_impressions"("ad_id", "created_at");

-- CreateIndex
CREATE INDEX "ad_impressions_created_at_idx" ON "ad_impressions"("created_at");

-- CreateIndex
CREATE INDEX "ad_clicks_ad_id_created_at_idx" ON "ad_clicks"("ad_id", "created_at");

-- CreateIndex
CREATE INDEX "ad_clicks_created_at_idx" ON "ad_clicks"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "affiliate_partners_user_id_key" ON "affiliate_partners"("user_id");

-- CreateIndex
CREATE INDEX "affiliate_partners_status_idx" ON "affiliate_partners"("status");

-- CreateIndex
CREATE UNIQUE INDEX "affiliate_links_code_key" ON "affiliate_links"("code");

-- CreateIndex
CREATE INDEX "affiliate_links_partner_id_idx" ON "affiliate_links"("partner_id");

-- CreateIndex
CREATE INDEX "affiliate_links_code_idx" ON "affiliate_links"("code");

-- CreateIndex
CREATE INDEX "affiliate_clicks_link_id_created_at_idx" ON "affiliate_clicks"("link_id", "created_at");

-- CreateIndex
CREATE INDEX "affiliate_clicks_created_at_idx" ON "affiliate_clicks"("created_at");

-- CreateIndex
CREATE INDEX "affiliate_conversions_link_id_idx" ON "affiliate_conversions"("link_id");

-- CreateIndex
CREATE INDEX "affiliate_conversions_order_id_idx" ON "affiliate_conversions"("order_id");

-- CreateIndex
CREATE INDEX "affiliate_conversions_created_at_idx" ON "affiliate_conversions"("created_at");

-- CreateIndex
CREATE INDEX "commission_payouts_partner_id_status_idx" ON "commission_payouts"("partner_id", "status");

-- CreateIndex
CREATE INDEX "commission_payouts_status_idx" ON "commission_payouts"("status");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_plans_name_key" ON "subscription_plans"("name");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_plans_slug_key" ON "subscription_plans"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "plan_entitlements_plan_id_feature_key" ON "plan_entitlements"("plan_id", "feature");

-- CreateIndex
CREATE UNIQUE INDEX "seller_subscriptions_stripe_subscription_id_key" ON "seller_subscriptions"("stripe_subscription_id");

-- CreateIndex
CREATE INDEX "seller_subscriptions_status_idx" ON "seller_subscriptions"("status");

-- CreateIndex
CREATE INDEX "seller_subscriptions_current_period_end_idx" ON "seller_subscriptions"("current_period_end");

-- CreateIndex
CREATE UNIQUE INDEX "seller_subscriptions_shop_id_key" ON "seller_subscriptions"("shop_id");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_invoices_stripe_invoice_id_key" ON "subscription_invoices"("stripe_invoice_id");

-- CreateIndex
CREATE INDEX "subscription_invoices_subscription_id_idx" ON "subscription_invoices"("subscription_id");

-- CreateIndex
CREATE INDEX "subscription_invoices_status_idx" ON "subscription_invoices"("status");

-- CreateIndex
CREATE INDEX "livestream_sessions_shop_id_status_idx" ON "livestream_sessions"("shop_id", "status");

-- CreateIndex
CREATE INDEX "livestream_sessions_status_scheduled_at_idx" ON "livestream_sessions"("status", "scheduled_at");

-- CreateIndex
CREATE INDEX "livestream_products_session_id_idx" ON "livestream_products"("session_id");

-- CreateIndex
CREATE UNIQUE INDEX "livestream_products_session_id_product_id_key" ON "livestream_products"("session_id", "product_id");

-- CreateIndex
CREATE INDEX "livestream_chats_session_id_created_at_idx" ON "livestream_chats"("session_id", "created_at");

-- CreateIndex
CREATE INDEX "ai_tasks_shop_id_type_idx" ON "ai_tasks"("shop_id", "type");

-- CreateIndex
CREATE INDEX "ai_tasks_status_idx" ON "ai_tasks"("status");

-- CreateIndex
CREATE INDEX "ai_tasks_product_id_idx" ON "ai_tasks"("product_id");

-- CreateIndex
CREATE INDEX "ai_tasks_created_at_idx" ON "ai_tasks"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "ai_prompt_templates_type_version_key" ON "ai_prompt_templates"("type", "version");

-- CreateIndex
CREATE UNIQUE INDEX "ai_usage_logs_shop_id_month_key" ON "ai_usage_logs"("shop_id", "month");

-- CreateIndex
CREATE INDEX "user_events_user_id_event_idx" ON "user_events"("user_id", "event");

-- CreateIndex
CREATE INDEX "user_events_entity_type_entity_id_idx" ON "user_events"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "user_events_event_created_at_idx" ON "user_events"("event", "created_at");

-- CreateIndex
CREATE INDEX "user_events_created_at_idx" ON "user_events"("created_at");

-- CreateIndex
CREATE INDEX "product_scores_score_type_score_idx" ON "product_scores"("score_type", "score");

-- CreateIndex
CREATE UNIQUE INDEX "product_scores_product_id_score_type_key" ON "product_scores"("product_id", "score_type");

-- CreateIndex
CREATE INDEX "product_relations_product_id_relation_type_idx" ON "product_relations"("product_id", "relation_type");

-- CreateIndex
CREATE UNIQUE INDEX "product_relations_product_id_related_product_id_relation_ty_key" ON "product_relations"("product_id", "related_product_id", "relation_type");

-- CreateIndex
CREATE UNIQUE INDEX "loyalty_tiers_name_key" ON "loyalty_tiers"("name");

-- CreateIndex
CREATE UNIQUE INDEX "loyalty_accounts_user_id_key" ON "loyalty_accounts"("user_id");

-- CreateIndex
CREATE INDEX "loyalty_accounts_tier_id_idx" ON "loyalty_accounts"("tier_id");

-- CreateIndex
CREATE INDEX "loyalty_transactions_account_id_created_at_idx" ON "loyalty_transactions"("account_id", "created_at");

-- CreateIndex
CREATE INDEX "loyalty_transactions_type_idx" ON "loyalty_transactions"("type");

-- CreateIndex
CREATE INDEX "loyalty_transactions_expires_at_idx" ON "loyalty_transactions"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "loyalty_mission_progress_account_id_mission_id_key" ON "loyalty_mission_progress"("account_id", "mission_id");

-- CreateIndex
CREATE INDEX "loyalty_redemptions_user_id_idx" ON "loyalty_redemptions"("user_id");

-- CreateIndex
CREATE INDEX "loyalty_redemptions_reward_id_idx" ON "loyalty_redemptions"("reward_id");

-- CreateIndex
CREATE UNIQUE INDEX "wallets_owner_id_owner_type_key" ON "wallets"("owner_id", "owner_type");

-- CreateIndex
CREATE UNIQUE INDEX "wallet_transactions_idempotency_key_key" ON "wallet_transactions"("idempotency_key");

-- CreateIndex
CREATE INDEX "wallet_transactions_wallet_id_created_at_idx" ON "wallet_transactions"("wallet_id", "created_at");

-- CreateIndex
CREATE INDEX "wallet_transactions_type_idx" ON "wallet_transactions"("type");

-- CreateIndex
CREATE INDEX "wallet_transactions_reference_reference_id_idx" ON "wallet_transactions"("reference", "reference_id");

-- CreateIndex
CREATE INDEX "wallet_withdrawals_wallet_id_status_idx" ON "wallet_withdrawals"("wallet_id", "status");

-- CreateIndex
CREATE INDEX "wallet_withdrawals_status_idx" ON "wallet_withdrawals"("status");

-- CreateIndex
CREATE INDEX "settlement_batches_period_start_period_end_idx" ON "settlement_batches"("period_start", "period_end");

-- CreateIndex
CREATE INDEX "settlement_items_batch_id_idx" ON "settlement_items"("batch_id");

-- CreateIndex
CREATE INDEX "settlement_items_shop_id_idx" ON "settlement_items"("shop_id");

-- CreateIndex
CREATE UNIQUE INDEX "search_synonyms_term_key" ON "search_synonyms"("term");

-- CreateIndex
CREATE INDEX "search_analytics_query_idx" ON "search_analytics"("query");

-- CreateIndex
CREATE INDEX "search_analytics_created_at_idx" ON "search_analytics"("created_at");

-- CreateIndex
CREATE INDEX "automation_rules_shop_id_status_idx" ON "automation_rules"("shop_id", "status");

-- CreateIndex
CREATE INDEX "automation_rules_trigger_status_idx" ON "automation_rules"("trigger", "status");

-- CreateIndex
CREATE INDEX "automation_executions_rule_id_executed_at_idx" ON "automation_executions"("rule_id", "executed_at");

-- CreateIndex
CREATE INDEX "automation_executions_executed_at_idx" ON "automation_executions"("executed_at");

-- CreateIndex
CREATE UNIQUE INDEX "regions_code_key" ON "regions"("code");

-- CreateIndex
CREATE UNIQUE INDEX "currencies_code_key" ON "currencies"("code");

-- CreateIndex
CREATE INDEX "translations_entity_type_entity_id_idx" ON "translations"("entity_type", "entity_id");

-- CreateIndex
CREATE UNIQUE INDEX "translations_entity_type_entity_id_locale_field_key" ON "translations"("entity_type", "entity_id", "locale", "field");

-- CreateIndex
CREATE UNIQUE INDEX "regional_pricings_product_id_region_id_key" ON "regional_pricings"("product_id", "region_id");

-- CreateIndex
CREATE INDEX "tax_rates_region_id_idx" ON "tax_rates"("region_id");

-- CreateIndex
CREATE INDEX "platform_events_type_created_at_idx" ON "platform_events"("type", "created_at");

-- CreateIndex
CREATE INDEX "platform_events_entity_type_entity_id_idx" ON "platform_events"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "platform_events_status_idx" ON "platform_events"("status");

-- CreateIndex
CREATE INDEX "platform_events_created_at_idx" ON "platform_events"("created_at");

-- CreateIndex
CREATE INDEX "event_subscriptions_event_type_is_active_idx" ON "event_subscriptions"("event_type", "is_active");

-- CreateIndex
CREATE UNIQUE INDEX "referrals_code_key" ON "referrals"("code");

-- CreateIndex
CREATE INDEX "referrals_referrer_id_idx" ON "referrals"("referrer_id");

-- CreateIndex
CREATE INDEX "referrals_code_idx" ON "referrals"("code");

-- CreateIndex
CREATE INDEX "referrals_status_idx" ON "referrals"("status");

-- CreateIndex
CREATE UNIQUE INDEX "feature_flags_key_key" ON "feature_flags"("key");

-- CreateIndex
CREATE INDEX "experiment_variants_experiment_id_idx" ON "experiment_variants"("experiment_id");

-- CreateIndex
CREATE INDEX "growth_campaigns_type_is_active_idx" ON "growth_campaigns"("type", "is_active");

-- CreateIndex
CREATE UNIQUE INDEX "admins_email_key" ON "admins"("email");

-- CreateIndex
CREATE INDEX "admins_email_idx" ON "admins"("email");

-- CreateIndex
CREATE UNIQUE INDEX "admin_roles_name_key" ON "admin_roles"("name");

-- CreateIndex
CREATE INDEX "admin_sessions_admin_id_idx" ON "admin_sessions"("admin_id");

-- CreateIndex
CREATE INDEX "sellers_user_id_idx" ON "sellers"("user_id");

-- CreateIndex
CREATE INDEX "sellers_status_idx" ON "sellers"("status");

-- CreateIndex
CREATE INDEX "seller_verifications_seller_id_idx" ON "seller_verifications"("seller_id");

-- CreateIndex
CREATE INDEX "seller_verifications_status_idx" ON "seller_verifications"("status");

-- CreateIndex
CREATE INDEX "admin_audit_logs_admin_id_idx" ON "admin_audit_logs"("admin_id");

-- CreateIndex
CREATE INDEX "admin_audit_logs_action_idx" ON "admin_audit_logs"("action");

-- CreateIndex
CREATE INDEX "admin_audit_logs_entity_type_entity_id_idx" ON "admin_audit_logs"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "admin_audit_logs_created_at_idx" ON "admin_audit_logs"("created_at");

-- CreateIndex
CREATE INDEX "product_reports_product_id_idx" ON "product_reports"("product_id");

-- CreateIndex
CREATE INDEX "product_reports_status_idx" ON "product_reports"("status");

-- CreateIndex
CREATE INDEX "product_reports_created_at_idx" ON "product_reports"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "attribute_groups_name_key" ON "attribute_groups"("name");

-- CreateIndex
CREATE UNIQUE INDEX "attribute_values_group_id_value_key" ON "attribute_values"("group_id", "value");

-- CreateIndex
CREATE INDEX "banners_position_status_idx" ON "banners"("position", "status");

-- CreateIndex
CREATE INDEX "banners_starts_at_ends_at_idx" ON "banners"("starts_at", "ends_at");

-- CreateIndex
CREATE UNIQUE INDEX "notification_templates_name_key" ON "notification_templates"("name");

-- CreateIndex
CREATE INDEX "admin_notifications_status_idx" ON "admin_notifications"("status");

-- CreateIndex
CREATE INDEX "admin_notifications_created_at_idx" ON "admin_notifications"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "platform_vouchers_code_key" ON "platform_vouchers"("code");

-- CreateIndex
CREATE INDEX "platform_vouchers_status_idx" ON "platform_vouchers"("status");

-- CreateIndex
CREATE INDEX "platform_vouchers_starts_at_expires_at_idx" ON "platform_vouchers"("starts_at", "expires_at");

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_verify_tokens" ADD CONSTRAINT "email_verify_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seller_profiles" ADD CONSTRAINT "seller_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shops" ADD CONSTRAINT "shops_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "seller_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variant_option_groups" ADD CONSTRAINT "product_variant_option_groups_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variant_options" ADD CONSTRAINT "product_variant_options_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "product_variant_option_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variant_option_values" ADD CONSTRAINT "product_variant_option_values_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "product_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variant_option_values" ADD CONSTRAINT "product_variant_option_values_option_id_fkey" FOREIGN KEY ("option_id") REFERENCES "product_variant_options"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seller_orders" ADD CONSTRAINT "seller_orders_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seller_orders" ADD CONSTRAINT "seller_orders_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seller_order_items" ADD CONSTRAINT "seller_order_items_seller_order_id_fkey" FOREIGN KEY ("seller_order_id") REFERENCES "seller_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seller_order_items" ADD CONSTRAINT "seller_order_items_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "product_variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_audit_logs" ADD CONSTRAINT "order_audit_logs_seller_order_id_fkey" FOREIGN KEY ("seller_order_id") REFERENCES "seller_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_transactions" ADD CONSTRAINT "inventory_transactions_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "product_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seller_shipping_methods" ADD CONSTRAINT "seller_shipping_methods_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seller_shipping_methods" ADD CONSTRAINT "seller_shipping_methods_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "shipping_providers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_seller_order_id_fkey" FOREIGN KEY ("seller_order_id") REFERENCES "seller_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "shipping_providers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coupons" ADD CONSTRAINT "coupons_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coupon_products" ADD CONSTRAINT "coupon_products_coupon_id_fkey" FOREIGN KEY ("coupon_id") REFERENCES "coupons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coupon_categories" ADD CONSTRAINT "coupon_categories_coupon_id_fkey" FOREIGN KEY ("coupon_id") REFERENCES "coupons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coupon_usages" ADD CONSTRAINT "coupon_usages_coupon_id_fkey" FOREIGN KEY ("coupon_id") REFERENCES "coupons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_images" ADD CONSTRAINT "review_images_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_replies" ADD CONSTRAINT "review_replies_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_reports" ADD CONSTRAINT "review_reports_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "return_items" ADD CONSTRAINT "return_items_return_request_id_fkey" FOREIGN KEY ("return_request_id") REFERENCES "return_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "return_evidence" ADD CONSTRAINT "return_evidence_return_request_id_fkey" FOREIGN KEY ("return_request_id") REFERENCES "return_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "return_timeline" ADD CONSTRAINT "return_timeline_return_request_id_fkey" FOREIGN KEY ("return_request_id") REFERENCES "return_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_approval_history" ADD CONSTRAINT "product_approval_history_approval_id_fkey" FOREIGN KEY ("approval_id") REFERENCES "product_approvals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouses" ADD CONSTRAINT "warehouses_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouse_stocks" ADD CONSTRAINT "warehouse_stocks_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_transfers" ADD CONSTRAINT "inventory_transfers_from_warehouse_id_fkey" FOREIGN KEY ("from_warehouse_id") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_transfers" ADD CONSTRAINT "inventory_transfers_to_warehouse_id_fkey" FOREIGN KEY ("to_warehouse_id") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_transfer_items" ADD CONSTRAINT "inventory_transfer_items_transfer_id_fkey" FOREIGN KEY ("transfer_id") REFERENCES "inventory_transfers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flash_sale_slots" ADD CONSTRAINT "flash_sale_slots_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "flash_sale_campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ad_groups" ADD CONSTRAINT "ad_groups_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "ad_campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ads" ADD CONSTRAINT "ads_ad_group_id_fkey" FOREIGN KEY ("ad_group_id") REFERENCES "ad_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ad_keywords" ADD CONSTRAINT "ad_keywords_ad_group_id_fkey" FOREIGN KEY ("ad_group_id") REFERENCES "ad_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ad_impressions" ADD CONSTRAINT "ad_impressions_ad_id_fkey" FOREIGN KEY ("ad_id") REFERENCES "ads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ad_clicks" ADD CONSTRAINT "ad_clicks_ad_id_fkey" FOREIGN KEY ("ad_id") REFERENCES "ads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "affiliate_links" ADD CONSTRAINT "affiliate_links_partner_id_fkey" FOREIGN KEY ("partner_id") REFERENCES "affiliate_partners"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "affiliate_clicks" ADD CONSTRAINT "affiliate_clicks_link_id_fkey" FOREIGN KEY ("link_id") REFERENCES "affiliate_links"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "affiliate_conversions" ADD CONSTRAINT "affiliate_conversions_link_id_fkey" FOREIGN KEY ("link_id") REFERENCES "affiliate_links"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commission_payouts" ADD CONSTRAINT "commission_payouts_partner_id_fkey" FOREIGN KEY ("partner_id") REFERENCES "affiliate_partners"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plan_entitlements" ADD CONSTRAINT "plan_entitlements_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "subscription_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seller_subscriptions" ADD CONSTRAINT "seller_subscriptions_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "subscription_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription_invoices" ADD CONSTRAINT "subscription_invoices_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "seller_subscriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "livestream_products" ADD CONSTRAINT "livestream_products_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "livestream_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "livestream_chats" ADD CONSTRAINT "livestream_chats_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "livestream_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_tasks" ADD CONSTRAINT "ai_tasks_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "ai_prompt_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loyalty_accounts" ADD CONSTRAINT "loyalty_accounts_tier_id_fkey" FOREIGN KEY ("tier_id") REFERENCES "loyalty_tiers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loyalty_transactions" ADD CONSTRAINT "loyalty_transactions_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "loyalty_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loyalty_mission_progress" ADD CONSTRAINT "loyalty_mission_progress_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "loyalty_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loyalty_mission_progress" ADD CONSTRAINT "loyalty_mission_progress_mission_id_fkey" FOREIGN KEY ("mission_id") REFERENCES "loyalty_missions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loyalty_redemptions" ADD CONSTRAINT "loyalty_redemptions_reward_id_fkey" FOREIGN KEY ("reward_id") REFERENCES "loyalty_rewards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallet_transactions" ADD CONSTRAINT "wallet_transactions_wallet_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "wallets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallet_withdrawals" ADD CONSTRAINT "wallet_withdrawals_wallet_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "wallets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "settlement_items" ADD CONSTRAINT "settlement_items_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "settlement_batches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "automation_executions" ADD CONSTRAINT "automation_executions_rule_id_fkey" FOREIGN KEY ("rule_id") REFERENCES "automation_rules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "regional_pricings" ADD CONSTRAINT "regional_pricings_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "regions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tax_rates" ADD CONSTRAINT "tax_rates_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "regions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experiment_variants" ADD CONSTRAINT "experiment_variants_experiment_id_fkey" FOREIGN KEY ("experiment_id") REFERENCES "experiments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_role_assignments" ADD CONSTRAINT "admin_role_assignments_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "admins"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_role_assignments" ADD CONSTRAINT "admin_role_assignments_admin_role_id_fkey" FOREIGN KEY ("admin_role_id") REFERENCES "admin_roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_admin_role_id_fkey" FOREIGN KEY ("admin_role_id") REFERENCES "admin_roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_sessions" ADD CONSTRAINT "admin_sessions_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "admins"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sellers" ADD CONSTRAINT "sellers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seller_verifications" ADD CONSTRAINT "seller_verifications_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "sellers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_audit_logs" ADD CONSTRAINT "admin_audit_logs_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attribute_values" ADD CONSTRAINT "attribute_values_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "attribute_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_attributes" ADD CONSTRAINT "category_attributes_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
