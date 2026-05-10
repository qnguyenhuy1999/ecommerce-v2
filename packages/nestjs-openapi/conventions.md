# OpenAPI Governance Standards

Single source of truth for all OpenAPI/Swagger conventions across the ecommerce-v2 monorepo.

---

## DTO Classification Rules

### Shared DTOs — `packages/contracts/src/**/dto/`

- **MUST NOT** import from `@nestjs/swagger`
- Use only: `class-validator`, `class-transformer`, enums, utility types
- Reusable by frontend, SDK generators, internal services, future GraphQL/gRPC
- ESLint rule `no-restricted-imports` enforces this boundary (error-level)

```ts
// ✅ Correct — packages/contracts/src/auth/dto/login.dto.ts
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;
}
```

### App-local DTOs — `apps/api-*/src/**/dto/`

- MAY use `@ApiProperty` / `@ApiPropertyOptional` from `@nestjs/swagger`
- Add explicit decorators ONLY when the CLI plugin cannot infer metadata
- Plugin infers: simple types, enums via `@IsEnum()`, nested DTOs via `@ValidateNested()` + `@Type()`
- Manual decorators required for: generics, unions, intersections, circular refs, hidden fields, nested arrays of complex types

### Response DTOs — `packages/nestjs-openapi/src/dtos/`

- NestJS-aware (this package depends on `@nestjs/swagger`)
- Contain `@ApiProperty` decorators with full OpenAPI metadata
- Act as schema wrappers that compose DTOs from `packages/contracts`

---

## DTO Naming Conventions

| Category | Pattern | Example |
|----------|---------|---------|
| Request DTO (create) | `Create{Entity}RequestDto` | `CreateProductRequestDto` |
| Request DTO (update) | `Update{Entity}RequestDto` | `UpdateProductRequestDto` |
| Request DTO (query) | `{Entity}QueryDto` | `ProductQueryDto` |
| Response DTO (single) | `{Entity}ResponseDto` | `ProductResponseDto` |
| Response DTO (list item) | `{Entity}ListItemDto` | `ProductListItemDto` |
| Enum | `{Name}Enum` or `{Name}Status` | `ProductStatusEnum`, `OrderStatus` |
| Pagination meta | `PaginationMetaDto` (shared) | — |
| Error response | `ErrorResponseDto` (shared) | — |
| Wrapper responses | `ApiResponseDto<T>`, `PaginatedResponseDto<T>` | — |

Rules:
- All DTOs end with `Dto` suffix
- Request/Response direction is explicit in the name
- List responses use `ListItemDto` when fields differ from the full response
- No anonymous inline schemas — every schema has a registered name via `@ApiExtraModels()`

---

## Swagger Tagging Conventions

Format: `{App}/{Domain}` — prevents Swagger UI chaos as APIs grow.

| App | Tag Examples |
|-----|-------------|
| Admin | `Admin/Auth`, `Admin/Products`, `Admin/Orders`, `Admin/Users`, `Admin/Sellers`, `Admin/Reviews`, `Admin/Promotions`, `Admin/Banners`, `Admin/Notifications` |
| Seller | `Seller/Auth`, `Seller/Products`, `Seller/Orders`, `Seller/Coupons`, `Seller/Shipping`, `Seller/FlashSales`, `Seller/Chat`, `Seller/Ads`, `Seller/Warehouse` |
| Storefront | `Storefront/Auth`, `Storefront/Products`, `Storefront/Cart`, `Storefront/Checkout`, `Storefront/Account` |

Rules:
- Every controller class gets exactly ONE `@ApiTags()` at the class level
- Sub-resources use slashes: `Admin/Products/{productId}/Reviews`
- No app uses generic tags like `CRUD`, `Misc`, `Default`
- Use constants from `packages/nestjs-openapi/src/constants/swagger-tags.ts`

---

## Response Envelope Standard

Every API response follows:

```json
{
  "success": true,
  "data": { ... },
  "meta": { ... },
  "error": null
}
```

Error case:
```json
{
  "success": false,
  "data": null,
  "meta": {},
  "error": { "code": "NOT_FOUND", "message": "Resource not found", "details": {} }
}
```

### Reusable Decorators

| Decorator | Wraps | OpenAPI Output |
|-----------|-------|---------------|
| `@ApiOkResponseData(Dto)` | `ApiResponseDto<Dto>` | 200 with `{ success, data: Dto, meta, error }` |
| `@ApiCreatedResponseData(Dto)` | `ApiResponseDto<Dto>` | 201 with same envelope |
| `@ApiPaginatedResponse(Dto)` | `PaginatedResponseDto<Dto>` | 200 with `{ data: { items: Dto[] }, meta: { pagination: {...} }, error: null }` |
| `@ApiErrorResponses()` | `ErrorResponseDto` | 400, 401, 403, 404, 500 error schemas |
| `@ApiAuth()` | cookie + bearer | Combines auth scheme documentation |

---

## Pagination Standard

**Request shape** (`PaginationQueryDto` from `@ecom/contracts`):
- `page` — 1-indexed, default 1
- `limit` — max 100, default 20
- `sortBy` — optional field name
- `sortOrder` — `'asc' | 'desc'`, default `'asc'`

**Response shape:**
```json
{
  "success": true,
  "data": { "items": [...] },
  "meta": {
    "pagination": { "page": 1, "limit": 20, "total": 100, "totalPages": 5 }
  },
  "error": null
}
```

Rules:
- `data` — business payload only (`{ items: T[] }` for lists)
- `meta` — metadata only (`{ pagination: { page, limit, total, totalPages } }`)
- `error` — errors only (`null` on success)

---

## Error Code Taxonomy

Stable API contracts. Do NOT rename or remove existing codes.

Format: `DOMAIN_REASON` — uppercase, underscore-separated, domain-prefixed.

Defined in `packages/nestjs-openapi/src/constants/error-codes.ts`.

| Domain | Error Codes |
|--------|------------|
| Auth | `AUTH_INVALID_CREDENTIALS`, `AUTH_TOKEN_EXPIRED`, `AUTH_FORBIDDEN`, `AUTH_EMAIL_NOT_VERIFIED` |
| Product | `PRODUCT_NOT_FOUND`, `PRODUCT_OUT_OF_STOCK`, `PRODUCT_SKU_DUPLICATE` |
| Order | `ORDER_NOT_FOUND`, `ORDER_WRONG_STATUS`, `ORDER_PAYMENT_FAILED`, `ORDER_REFUND_EXCEEDED` |
| User | `USER_NOT_FOUND`, `USER_EMAIL_DUPLICATE`, `USER_INSUFFICIENT_PERMISSIONS` |
| Validation | `VALIDATION_ERROR`, `VALIDATION_REQUIRED_FIELD`, `VALIDATION_INVALID_FORMAT` |
| System | `SYSTEM_INTERNAL_ERROR`, `SYSTEM_RATE_LIMITED`, `SYSTEM_MAINTENANCE` |

---

## Serialization Standards

- **`ClassSerializerInterceptor`** — applied globally in each app's `main.ts`
- **`@Exclude()`** — default on all password, token, secret, and internal fields
- **`@Expose()`** — explicit opt-in for fields that appear in API responses
- **BigInt** — serialize as string. OpenAPI: `type: 'string', pattern: '^[0-9]+$'`
- **Decimal/money** — serialize as string or integer cents. No floating-point
- **Dates** — ISO 8601 strings. `@Type(() => Date)` + `@IsDate()` at DTO layer
- **Enums** — serialize as string values, not indices
- **Nullable vs optional** — `@ApiProperty({ nullable: true })` for nullable, `@ApiPropertyOptional()` for optional

---

## Generic Schema Composition

Generic wrappers (`ApiResponseDto<T>`, `PaginatedResponseDto<T>`) do NOT render correctly via plugin inference alone. Use helpers from `packages/nestjs-openapi/src/helpers/swagger-generic.helper.ts`:

```ts
import { buildApiResponseSchema, buildPaginatedResponseSchema } from '@ecom/nestjs-openapi';

// Single item response
@ApiExtraModels(ApiResponseDto, UserDto)
@ApiOkResponse({ schema: buildApiResponseSchema(UserDto) })

// Paginated list response
@ApiExtraModels(PaginatedResponseDto, PaginationMetaDto, ProductDto)
@ApiOkResponse({ schema: buildPaginatedResponseSchema(ProductDto) })
```

The `@ApiOkResponseData()` and `@ApiPaginatedResponse()` decorators handle `@ApiExtraModels` internally — prefer those over manual composition.

---

## Circular Reference Handling

Use `type: () => DtoClass` for circular/forward references:

```ts
@ApiProperty({ type: () => CategoryDto, isArray: true })
@ValidateNested({ each: true })
@Type(() => CategoryDto)
children?: CategoryDto[];
```

See `packages/nestjs-openapi/src/helpers/circular.helper.ts` for utility functions.

---

## Plugin Inference Caveats

The `@nestjs/swagger` CLI plugin auto-infers `@ApiProperty` from class-validator decorators. This works for simple cases but FAILS for:

| Scenario | Plugin handles? | Action |
|----------|----------------|--------|
| Simple types (string, number, boolean) | ✅ Yes | No manual decorator needed |
| Enums via `@IsEnum()` | ✅ Yes | Plugin reads enum values |
| Nested DTOs via `@ValidateNested()` + `@Type()` | ✅ Yes | Plugin follows type reference |
| **Generics** (`ApiResponseDto<T>`) | ❌ No | Use `getSchemaPath` + `allOf` manually |
| **Unions** (`string \| number`) | ❌ No | Add `@ApiProperty({ oneOf: [...] })` |
| **Circular references** | ❌ No | Use `type: () => DtoClass` |
| **Nested arrays of complex types** | ❌ No | Use `@ApiProperty({ type: [DtoClass] })` |
| **Hidden/internal fields** | N/A | Use `@ApiHideProperty()` |

---

## API Versioning (Documentation-First)

Current approach: documentation versioning only — `info.version` in the OpenAPI spec.

`buildSwaggerDocument()` accepts `version: '1.0.0'` which sets `info.version` and adds `x-api-version` extension.

Runtime `/v1` prefix is a future concern — do NOT add it until breaking changes require it.
