import type { INestApplication } from '@nestjs/common'
import type { OpenAPIObject } from '@nestjs/swagger'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

export interface SwaggerConfig {
  /** API title shown in Swagger UI */
  title: string
  /** API description shown in Swagger UI */
  description: string
  /**
   * Semantic version for the OpenAPI spec info.version field.
   * Does NOT change runtime routes — documentation versioning only.
   * @default '1.0.0'
   */
  version: string
  /** URL path where Swagger UI is served. @default 'api/docs' */
  path?: string
  /**
   * API version string added as x-api-version extension on all schemas.
   * Separate from spec info.version — used for future runtime versioning prep.
   * @default same as version
   */
  apiVersion?: string
}

/**
 * Shared DocumentBuilder factory for all NestJS APIs.
 *
 * Sets up:
 * - BearerAuth (Authorization: Bearer <token>)
 * - CookieAuth (sessionId cookie)
 * - x-api-version extension on the document
 *
 * Use @ApiAuth() on controllers/endpoints to document which auth scheme applies.
 *
 * @example
 * // In main.ts
 * const document = buildSwaggerDocument(app, {
 *   title: 'Admin API',
 *   description: 'E-commerce admin API',
 *   version: '1.0.0',
 *   path: 'docs',
 * });
 */
export function buildSwaggerDocument(app: INestApplication, config: SwaggerConfig): OpenAPIObject {
  const apiVersion = config.apiVersion ?? config.version

  const swaggerConfig = new DocumentBuilder()
    .setTitle(config.title)
    .setDescription(config.description)
    .setVersion(config.version)
    .addBearerAuth()
    .addCookieAuth('sessionId')
    .build()

  const document = SwaggerModule.createDocument(app, swaggerConfig)

  // Attach x-api-version extension for future runtime versioning prep (Unit 8)
  ;(document as unknown as Record<string, unknown>)['x-api-version'] = apiVersion

  const path = config.path ?? 'api/docs'
  SwaggerModule.setup(path, app, document)

  return document
}
